import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = process.env.VERIFY_URL || "http://127.0.0.1:3456/";
const WIDTHS = [320, 375, 414, 768, 1024, 1440];
const OUT = path.join(__dirname, "verify-phones-out");
const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function measure(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientW = doc.clientWidth;
    const vw = window.innerWidth;
    const heroImg = document.querySelector(".hero-phones-image");
    const img = document.querySelector(".hero-phones-image img");
    const ticker = document.querySelector("[data-ticker], .ticker-marquee, .institutional-ticker");
    const floatEl = document.querySelector(".hero-phones-image__float");

    function box(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: Math.round(r.left * 100) / 100,
        right: Math.round(r.right * 100) / 100,
        top: Math.round(r.top * 100) / 100,
        bottom: Math.round(r.bottom * 100) / 100,
        width: Math.round(r.width * 100) / 100,
        height: Math.round(r.height * 100) / 100,
      };
    }

    const imgBox = box(img);
    const heroBox = box(heroImg);
    const clipped =
      imgBox && (imgBox.left < -2 || imgBox.right > vw + 2);

    const cs = img ? getComputedStyle(img) : null;
    const floatCs = floatEl ? getComputedStyle(floatEl) : null;
    const wrapCs = heroImg ? getComputedStyle(heroImg) : null;

    return {
      vw,
      scrollW,
      clientW,
      hasHorizontalScrollbar: scrollW > clientW + 1,
      clipped,
      imgBox,
      heroBox,
      naturalW: img?.naturalWidth || null,
      naturalH: img?.naturalHeight || null,
      objectFit: cs?.objectFit || null,
      aspectApprox:
        imgBox && imgBox.height > 0
          ? Math.round((imgBox.width / imgBox.height) * 1000) / 1000
          : null,
      nativeAspect: 1295 / 1214,
      floatAnimation: floatCs?.animationName || null,
      wrapOpacity: wrapCs?.opacity || null,
      tickerPresent: Boolean(
        document.querySelector(".ticker-marquee") ||
          document.querySelector("[class*='ticker']")
      ),
      oldCssPhonesGone: !document.querySelector(".hero-phones__phone"),
    };
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
  });

  const report = [];

  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
    });
    await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForSelector(".hero-phones-image img", { timeout: 15000 });
    await page.waitForTimeout(1200);

    // force visible state for measurement (IO may already have fired)
    await page.evaluate(() => {
      document.querySelector(".hero-phones-image")?.classList.add("is-visible");
    });
    await page.waitForTimeout(900);

    const m = await measure(page);
    const shot = path.join(OUT, `hero-img-${width}.png`);
    await page.locator("section").first().screenshot({ path: shot });
    report.push({ width, ...m, screenshot: shot });
    await page.close();
  }

  const pageRm = await browser.newPage({
    viewport: { width: 375, height: 900 },
    reducedMotion: "reduce",
  });
  await pageRm.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await pageRm.waitForSelector(".hero-phones-image img", { timeout: 15000 });
  await pageRm.waitForTimeout(800);
  const rm = await pageRm.evaluate(() => {
    const wrap = document.querySelector(".hero-phones-image");
    const floatEl = document.querySelector(".hero-phones-image__float");
    const w = wrap ? getComputedStyle(wrap) : null;
    const f = floatEl ? getComputedStyle(floatEl) : null;
    return {
      ok: true,
      wrapTransition: w?.transitionProperty,
      wrapOpacity: w?.opacity,
      floatAnimation: f?.animationName,
      floatDuration: f?.animationDuration,
    };
  });
  report.push({ width: "375-reduced-motion", ...rm });
  await pageRm.screenshot({
    path: path.join(OUT, "hero-img-375-reduced-motion.png"),
  });
  await pageRm.close();

  await browser.close();
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

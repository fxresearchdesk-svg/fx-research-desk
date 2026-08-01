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
    const phones = document.querySelector(".hero-phones");
    const stage = document.querySelector(".hero-phones__stage");
    const front = document.querySelector(".hero-phones__phone--front");
    const back = document.querySelector(".hero-phones__phone--back");
    const notch = document.querySelector(
      ".hero-phones__phone--front .hero-phones__notch"
    );
    const screen = document.querySelector(
      ".hero-phones__phone--front .hero-phones__screen"
    );
    const priceEl = document.querySelector("[data-live-price]");
    const charts = document.querySelectorAll("[data-chart]");
    const spark = document.querySelector(
      ".hero-phones__phone--front .hero-phones__spark"
    );
    const vw = window.innerWidth;

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

    const frontBox = box(front);
    const backBox = box(back);
    const notchBox = box(notch);
    const screenBox = box(screen);
    const clipped =
      (frontBox && (frontBox.left < -1 || frontBox.right > vw + 1)) ||
      (backBox && (backBox.left < -1 || backBox.right > vw + 1));

    const style = front ? getComputedStyle(front) : null;
    const inner = front
      ? front.querySelector(".hero-phones__phone-inner")
      : null;
    const innerBox = box(inner);

    let island = null;
    if (notchBox && innerBox && innerBox.width > 0 && innerBox.height > 0) {
      island = {
        widthPct: Math.round((notchBox.width / innerBox.width) * 1000) / 10,
        heightPct: Math.round((notchBox.height / innerBox.height) * 1000) / 10,
      };
    }

    let bezel = null;
    if (frontBox && screenBox) {
      bezel = {
        leftPx: Math.round((screenBox.left - frontBox.left) * 100) / 100,
        topPx: Math.round((screenBox.top - frontBox.top) * 100) / 100,
        bezelCss: style ? style.paddingTop : null,
        frameRadius: style ? style.borderRadius : null,
        screenRadius: screen ? getComputedStyle(screen).borderRadius : null,
      };
    }

    return {
      vw,
      scrollW,
      clientW,
      hasHorizontalScrollbar: scrollW > clientW + 1,
      clipped,
      frontBox,
      backBox,
      stageBox: box(stage),
      phonesBox: box(phones),
      livePrice: priceEl ? priceEl.textContent.trim() : null,
      pw: phones
        ? getComputedStyle(phones).getPropertyValue("--pw").trim()
        : null,
      animation: style ? style.animationName : null,
      island,
      bezel,
      frameBg: style ? style.backgroundImage.slice(0, 120) : null,
      hasChart: charts.length > 0,
      chartCount: charts.length,
      chartBox: box(charts[0] || null),
      sparkBox: box(spark),
      chartOverflowsScreen: (() => {
        const pairs = [
          [
            ".hero-phones__phone--front .hero-phones__screen",
            ".hero-phones__phone--front [data-chart]",
          ],
          [
            ".hero-phones__phone--back .hero-phones__screen",
            ".hero-phones__phone--back [data-chart]",
          ],
        ];
        return pairs.some(([screenSel, chartSel]) => {
          const screenEl = document.querySelector(screenSel);
          const chartEl = document.querySelector(chartSel);
          if (!screenEl || !chartEl) return false;
          const c = chartEl.getBoundingClientRect();
          const s = screenEl.getBoundingClientRect();
          return (
            c.left < s.left - 2 ||
            c.right > s.right + 2 ||
            c.top < s.top - 2 ||
            c.bottom > s.bottom + 2
          );
        });
      })(),
      frameSample: (() => {
        const bg = style ? style.backgroundImage : "";
        return /rgb\(\s*237\s*,\s*235\s*,\s*227\s*\)|#edebe3/i.test(bg)
          ? "light-silver"
          : bg.slice(0, 80);
      })(),
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
    await page.waitForTimeout(2500);
    try {
      await page.waitForFunction(
        () => {
          const el = document.querySelector("[data-live-price]");
          return el && el.textContent && el.textContent.trim() !== "—";
        },
        { timeout: 8000 }
      );
    } catch {
      /* price may still be loading */
    }

    const m = await measure(page);
    const shot = path.join(OUT, `phones-${width}.png`);
    await page.locator(".hero-phones").screenshot({ path: shot });
    report.push({ width, ...m, screenshot: shot });
    await page.close();
  }

  const pageRm = await browser.newPage({
    viewport: { width: 375, height: 900 },
    reducedMotion: "reduce",
  });
  await pageRm.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await pageRm.waitForTimeout(1000);
  const rm = await pageRm.evaluate(() => {
    const front = document.querySelector(".hero-phones__phone--front");
    if (!front) return { ok: false };
    const s = getComputedStyle(front);
    return {
      ok: true,
      animationName: s.animationName,
      animationDuration: s.animationDuration,
    };
  });
  report.push({ width: "375-reduced-motion", ...rm });
  await pageRm.close();

  await browser.close();
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

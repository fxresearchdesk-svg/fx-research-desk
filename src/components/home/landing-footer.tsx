import Link from "next/link";
import {
  contactEmail,
  navLinks,
  telegramHandle,
  telegramUrl,
} from "@/lib/site-config";

export function LandingFooter() {
  return (
    <footer className="bg-[#0E0F13] pb-[30px] pt-[60px] text-[#9A9488]">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-3.5 flex items-center gap-3.5">
              <span
                className="flex h-[42px] w-[42px] items-center justify-center bg-[#0E0F13] font-landing-serif text-[19px] font-bold italic text-[#E8C173] ring-1 ring-[#C6A15B]/30"
                aria-hidden
              >
                Fx
              </span>
              <span className="text-[14px] font-extrabold tracking-[0.22em] text-white">
                FX RESEARCH DESK
              </span>
            </div>
            <p className="mt-3.5 max-w-[320px] text-[13.5px] leading-[1.6]">
              Institutional-grade forex signals and market intelligence for serious
              traders.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.16em] text-white">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="landing-focus text-[13.5px] transition-colors hover:text-[#E8C173]"
                  >
                    {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.16em] text-white">
              CONTACT
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="landing-focus text-[13.5px] transition-colors hover:text-[#E8C173]"
                >
                  Telegram — {telegramHandle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="landing-focus text-[13.5px] transition-colors hover:text-[#E8C173]"
                >
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#23252E] pt-6 text-xs">
          <p>© 2026 FX Research Desk</p>
          <p>Research · Analyse · Execute</p>
        </div>

        <p className="mt-3.5 max-w-[900px] text-[11px] leading-[1.6] text-[#5F5B4F]">
          Trading foreign exchange carries a high level of risk and may not be suitable
          for all investors. Past performance is not indicative of future results.
          Signals and analysis are provided for informational purposes only and do not
          constitute financial advice.
        </p>
      </div>
    </footer>
  );
}

import {
  contactEmail,
  telegramHandle,
  telegramUrl,
} from "@/lib/site-config";

export function LandingUtilityBar() {
  return (
    <div className="bg-[#0E0F13] text-[12.5px] font-semibold tracking-[0.12em] text-[#B9B4A4]">
      <div className="mx-auto flex h-[38px] max-w-[1240px] items-center justify-between gap-4 px-6 lg:px-10">
        <p className="hidden truncate uppercase sm:block">
          Institutional-Grade FX Research &amp; Signals
        </p>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-[22px] gap-y-1">
          <a
            href={`mailto:${contactEmail}`}
            className="landing-focus transition-colors hover:text-[#E8C173]"
          >
            <span className="font-bold text-[#E8C173]">✉</span> {contactEmail}
          </a>
          <span className="hidden text-[#3E4048] sm:inline" aria-hidden>
            |
          </span>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-focus transition-colors hover:text-[#E8C173]"
          >
            <span className="font-bold text-[#E8C173]">Telegram</span>{" "}
            {telegramHandle}
          </a>
          <span className="hidden text-[#3E4048] md:inline" aria-hidden>
            |
          </span>
          <span className="hidden md:inline">Desk Response &lt;15 Min</span>
        </div>
      </div>
    </div>
  );
}

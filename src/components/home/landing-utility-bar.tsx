import {
  contactEmail,
  telegramHandle,
  telegramUrl,
} from "@/lib/site-config";

/** Trust / contact strip — sits above the footer, not top chrome. */
export function LandingUtilityBar() {
  return (
    <div className="border-y border-[#E7E3D8] bg-[#F1EEE5] text-[12.5px] font-semibold tracking-[0.1em] text-[#4A463C]">
      <div className="mx-auto flex min-h-[42px] max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2.5 lg:px-10">
        <p className="hidden uppercase tracking-[0.14em] sm:block">
          Institutional-Grade FX Research &amp; Signals
        </p>
        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-1 sm:ml-auto">
          <a
            href={`mailto:${contactEmail}`}
            className="landing-focus transition-colors hover:text-[#C6A15B]"
          >
            <span className="font-bold text-[#C6A15B]">✉</span> {contactEmail}
          </a>
          <span className="hidden text-[#E7E3D8] sm:inline" aria-hidden>
            |
          </span>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-focus transition-colors hover:text-[#C6A15B]"
          >
            <span className="font-bold text-[#C6A15B]">Telegram</span>{" "}
            {telegramHandle}
          </a>
          <span className="hidden text-[#E7E3D8] md:inline" aria-hidden>
            |
          </span>
          <span className="font-bold text-[#0E0F13]">Instant Response</span>
        </div>
      </div>
    </div>
  );
}

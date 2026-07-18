import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

type EducationLayoutProps = {
  title: string;
  subtitle: string;
  date: string;
  children: React.ReactNode;
};

export function EducationLayout({
  title,
  subtitle,
  date,
  children,
}: EducationLayoutProps) {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-14 lg:px-10">
        <Link
          href="/education"
          className="landing-focus mb-10 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A9488] transition-colors hover:text-[#C6A15B]"
        >
          ← Back to Education
        </Link>

        <header className="mb-10 border-b border-[#E7E3D8] pb-10">
          <h1 className="font-landing-serif mb-4 text-[40px] font-bold leading-[1.2] text-[#0E0F13]">
            {title}
          </h1>
          <p className="mb-4 text-base text-[#4A463C]">{subtitle}</p>
          <p className="text-[11px] tracking-[0.15em] text-[#9A9488]">{date}</p>
        </header>

        <div className="space-y-10 text-[15px] leading-relaxed text-[#4A463C] [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-landing-serif [&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:text-[#0E0F13] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </SiteShell>
  );
}

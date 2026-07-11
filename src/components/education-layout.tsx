import Link from "next/link";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

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
    <main className="min-h-screen bg-[#030303] text-[#E8E6E3]">
      <InstitutionalTicker />
      <SiteNavbar />
      <article className="max-w-3xl mx-auto px-6 pt-[104px] pb-24">
        <Link
          href="/#education"
          className="text-[11px] uppercase tracking-[0.2em] text-[#8A8A8A] hover:text-[#B8956A] transition-colors mb-10 inline-block"
        >
          ← Back to Education
        </Link>

        <header className="border-b border-[#2A2A2A] pb-10 mb-10">
          <h1 className="font-serif-display text-[40px] text-[#E8E6E3] leading-[1.2] mb-4">
            {title}
          </h1>
          <p className="text-base text-[#8A8A8A] mb-4">{subtitle}</p>
          <p className="text-[11px] text-[#8A8A8A] tracking-[0.15em]">{date}</p>
        </header>

        <div className="space-y-10 text-[15px] text-[#8A8A8A] leading-relaxed [&_h2]:font-serif-display [&_h2]:text-[28px] [&_h2]:text-[#E8E6E3] [&_h2]:mb-4 [&_h2]:mt-12 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}

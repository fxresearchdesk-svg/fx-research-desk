import { InstitutionalTicker } from "@/components/institutional-ticker";
import { LandingFooter } from "@/components/home/landing-footer";
import { LandingHeader } from "@/components/home/landing-header";
import { LandingUtilityBar } from "@/components/home/landing-utility-bar";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF9F6] text-[#0E0F13]">
      <InstitutionalTicker />
      <div className="pt-9">
        <LandingHeader />
        {children}
        <LandingUtilityBar />
        <LandingFooter />
      </div>
    </main>
  );
}

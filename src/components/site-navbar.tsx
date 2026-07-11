"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, telegramUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type SiteNavbarProps = {
  activeSection?: string;
};

function isNavLinkActive(href: string, pathname: string, activeSection?: string) {
  if (href === "/charts") return pathname === "/charts";
  if (href === "/pricing") return pathname === "/pricing";
  const sectionId = href.replace("/#", "").replace("#", "");
  return pathname === "/" && activeSection === sectionId;
}

function handleNavClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  onNavigate?: () => void
) {
  if (!href.startsWith("/#")) return;

  const sectionId = href.replace("/#", "");
  if (pathname === "/") {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.history.pushState(null, "", href);
    onNavigate?.();
  }
}

export function SiteNavbar({ activeSection }: SiteNavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo.png.jpeg");

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-10 left-0 right-0 z-50 h-16 border-b border-[#E5E5E5] bg-[#F5F5F0]">
        <nav className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src={logoSrc}
              alt="FX Research Desk"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              onError={() =>
                setLogoSrc((prev) =>
                  prev === "/logo.png.jpeg"
                    ? "/logo.png"
                    : prev === "/logo.png"
                      ? "/logo.svg"
                      : "/logo.svg"
                )
              }
              priority
              unoptimized
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = isNavLinkActive(link.href, pathname, activeSection);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, pathname)}
                  className={cn(
                    "relative pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-200",
                    active
                      ? "text-[#1A1A1A] underline decoration-[#1A1A1A] underline-offset-4"
                      : "text-[#1A1A1A] hover:text-[#B8956A]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block bg-[#1A1A1A] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-[#333333] whitespace-nowrap"
            >
              CLIENT ACCESS
            </a>
            <button
              type="button"
              className="lg:hidden text-xs font-medium uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#B8956A] px-2 py-1 transition-colors duration-200"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-[#1A1A1A]/40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-[80] w-72 bg-[#F5F5F0] border-l border-[#E5E5E5] p-8 pt-28 lg:hidden fade-in">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const active = isNavLinkActive(link.href, pathname, activeSection);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) =>
                      handleNavClick(e, link.href, pathname, () => setMenuOpen(false))
                    }
                    className={cn(
                      "text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-200",
                      active
                        ? "text-[#1A1A1A] underline underline-offset-4 w-fit"
                        : "text-[#1A1A1A] hover:text-[#B8956A]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A1A1A] px-6 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-[#333333] transition-colors duration-200 whitespace-nowrap"
              >
                CLIENT ACCESS
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}

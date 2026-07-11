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
      <header className="fixed top-10 left-0 right-0 z-50 h-16 border-b border-[#1F1F1F] bg-[#030303]">
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
                    "relative pb-1 text-[11px] uppercase tracking-[0.25em] transition-colors duration-200",
                    active
                      ? "text-[#B8956A] border-b border-[#B8956A]"
                      : "text-[#6B6B6B] hover:text-[#B8956A]"
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
              className="hidden sm:inline-block border border-[#1F1F1F] px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-[#B8956A] transition-colors duration-200 hover:bg-[#B8956A] hover:text-[#030303] whitespace-nowrap"
            >
              CLIENT ACCESS
            </a>
            <button
              type="button"
              className="lg:hidden text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] hover:text-[#B8956A] px-2 py-1 transition-colors duration-200"
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
            className="fixed inset-0 z-[70] bg-[#030303]/95 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-[80] w-72 bg-[#0C0C0C] border-l border-[#1F1F1F] p-8 pt-28 lg:hidden fade-in">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) =>
                    handleNavClick(e, link.href, pathname, () => setMenuOpen(false))
                  }
                  className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] hover:text-[#B8956A] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#1F1F1F] px-5 py-2.5 text-center text-[11px] uppercase tracking-[0.2em] text-[#B8956A] hover:bg-[#B8956A] hover:text-[#030303] transition-colors duration-200 whitespace-nowrap"
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

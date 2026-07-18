"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, telegramUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-9 z-50 border-b border-[#E7E3D8] bg-white">
        <nav className="mx-auto flex h-[78px] max-w-[1240px] items-center justify-between gap-4 px-6 lg:px-10">
          <Link href="/" className="landing-focus flex shrink-0 items-center gap-3.5">
            <span
              className="flex h-[42px] w-[42px] items-center justify-center bg-[#0E0F13] font-landing-serif text-[19px] font-bold italic text-[#E8C173]"
              aria-hidden
            >
              Fx
            </span>
            <span className="text-[14px] font-extrabold tracking-[0.22em] text-[#0E0F13]">
              FX RESEARCH DESK
            </span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href === "/education" &&
                  pathname.startsWith("/education/"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "landing-focus text-[12.5px] font-bold tracking-[0.14em] transition-colors",
                    active
                      ? "text-[#C6A15B]"
                      : "text-[#4A463C] hover:text-[#C6A15B]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-focus hidden bg-[#0E0F13] px-[22px] py-3 text-[12px] font-bold tracking-[0.12em] text-white transition-colors hover:bg-[#1c1e26] sm:inline-block"
            >
              CLIENT ACCESS
            </a>
            <button
              type="button"
              className="landing-focus px-2 py-1 text-[12px] font-bold tracking-[0.14em] text-[#4A463C] hover:text-[#C6A15B] lg:hidden"
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
            className="fixed inset-0 z-[70] bg-[#0E0F13]/40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-[80] w-72 border-l border-[#E7E3D8] bg-white p-8 pt-24 lg:hidden">
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="landing-focus text-[12.5px] font-bold tracking-[0.14em] text-[#4A463C] hover:text-[#C6A15B]"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="landing-focus mt-2 bg-[#0E0F13] px-5 py-3 text-center text-[12px] font-bold tracking-[0.12em] text-white"
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

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, telegramUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type SiteNavbarProps = {
  activeSection?: string;
};

function isNavLinkActive(href: string, pathname: string, activeSection?: string) {
  if (href === "/charts") return pathname === "/charts";
  const sectionId = href.replace("/#", "").replace("#", "");
  return pathname === "/" && activeSection === sectionId;
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
      <header className="fixed top-14 left-0 right-0 z-50 h-20 border-b-2 border-[#D4AF37]/30 bg-[#0A0A0A] shadow-[0_1px_20px_rgba(212,175,55,0.15)]">
        <nav className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 transition-shadow hover:shadow-[0_0_24px_rgba(212,175,55,0.25)]"
          >
            <Image
              src={logoSrc}
              alt="FX Research Desk"
              width={280}
              height={56}
              className="h-10 sm:h-14 w-auto object-contain"
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
            <span className="hidden sm:block text-base font-bold text-white tracking-[0.3em] uppercase whitespace-nowrap">
              FX RESEARCH DESK
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = isNavLinkActive(link.href, pathname, activeSection);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative pb-2 text-sm font-semibold uppercase tracking-[0.15em] transition-colors duration-300",
                    active ? "text-white" : "text-[#D4AF37] hover:text-white"
                  )}
                >
                  {active && (
                    <span className="absolute -top-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#D4AF37]" />
                  )}
                  {link.label}
                  {active ? (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                  ) : (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block rounded-sm bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/20 transition-colors duration-300 hover:bg-[#E5C158] whitespace-nowrap"
            >
              CLIENT ACCESS
            </a>
            <button
              type="button"
              className="lg:hidden text-sm font-semibold uppercase tracking-[0.15em] text-[#D4AF37] hover:text-white px-2 py-1 transition-colors duration-300"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="fixed inset-0 z-[70] bg-[#050505]/90 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-72 bg-[#0A0A0A] border-l border-[#1A1A1A] p-8 pt-36 lg:hidden"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-semibold uppercase tracking-[0.15em] text-[#D4AF37] hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm bg-[#D4AF37] px-6 py-3 text-center text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/20 transition-colors duration-300 hover:bg-[#E5C158] whitespace-nowrap"
                >
                  CLIENT ACCESS
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

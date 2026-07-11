"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navLinks, telegramUrl } from "@/lib/site-config";

export function SiteFooter() {
  const [logoSrc, setLogoSrc] = useState("/logo.png.jpeg");

  return (
    <footer className="border-t border-[#333333] bg-[#1A1A1A] px-6 py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        <div>
          <Image
            src={logoSrc}
            alt="FX Research Desk"
            width={140}
            height={36}
            className="mb-4 h-9 w-auto object-contain brightness-110"
            onError={() =>
              setLogoSrc((prev) =>
                prev === "/logo.png.jpeg"
                  ? "/logo.png"
                  : prev === "/logo.png"
                    ? "/logo.svg"
                    : "/logo.svg"
              )
            }
            unoptimized
          />
          <p className="max-w-xs text-[11px] leading-relaxed text-[#9CA3AF]">
            Institutional-grade forex signals and market intelligence for serious traders.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#B8956A]">
            Navigation
          </p>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.15em] text-[#E5E7EB] transition-colors duration-200 hover:text-[#B8956A]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#B8956A]">
            Contact
          </p>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 block text-[11px] uppercase tracking-[0.15em] text-[#E5E7EB] transition-colors duration-200 hover:text-[#B8956A]"
          >
            Telegram Channel
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 block text-[11px] text-[#9CA3AF] transition-colors duration-200 hover:text-[#B8956A]"
          >
            @fxresearchdesk
          </a>
          <p className="text-[10px] tracking-[0.15em] text-[#6B7280]">
            © 2026 FX Research Desk
          </p>
        </div>
      </div>
    </footer>
  );
}

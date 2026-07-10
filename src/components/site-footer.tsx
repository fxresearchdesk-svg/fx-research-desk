"use client";

import { useState } from "react";
import Image from "next/image";
import { navLinks } from "@/lib/site-config";

export function SiteFooter() {
  const [logoSrc, setLogoSrc] = useState("/logo.png.jpeg");

  return (
    <footer className="bg-[#050505] border-t border-[#1A1A1A] py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Image
            src={logoSrc}
            alt="FX Research Desk"
            width={200}
            height={64}
            className="h-16 w-auto max-w-[200px] object-contain"
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
        </div>
        <p className="label-caps text-[#A0A0A0] mb-2">FX RESEARCH DESK</p>
        <p className="label-caps text-[#D4AF37]/60 mb-10">Research. Analyze. Execute.</p>

        <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-4 mb-12 px-4">
          {[
            ...navLinks,
            { href: "/#faq", label: "INQUIRIES" },
            { href: "#", label: "TERMS" },
            { href: "#", label: "PRIVACY" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="label-caps text-[#A0A0A0] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-[11px] text-[#333333] tracking-wide">
          © 2026 FX Research Desk. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

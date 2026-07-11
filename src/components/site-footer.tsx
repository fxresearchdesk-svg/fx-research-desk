"use client";

import { useState } from "react";
import Image from "next/image";
import { navLinks } from "@/lib/site-config";

export function SiteFooter() {
  const [logoSrc, setLogoSrc] = useState("/logo.png.jpeg");

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#333333] py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Image
            src={logoSrc}
            alt="FX Research Desk"
            width={160}
            height={40}
            className="h-10 w-auto object-contain brightness-110"
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

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 px-4">
          {[
            ...navLinks,
            { href: "/#faq", label: "INQUIRIES" },
            { href: "#", label: "TERMS" },
            { href: "#", label: "PRIVACY" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.3em] text-[#B8956A] hover:text-[#C9A87C] transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-[10px] text-[#9A9A9A] tracking-[0.2em]">
          © 2026 FX Research Desk. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./hero-phones-image.css";

export function HeroPhonesImage() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={cn(
        "hero-phones-image",
        visible && "is-visible",
        reduceMotion && "reduce-motion"
      )}
    >
      <div className="hero-phones-image__float">
        <Image
          src="/hero/phones-mockup.png"
          alt="Illustrative FX Research Desk signal phones"
          width={1295}
          height={1214}
          priority
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 48vw"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

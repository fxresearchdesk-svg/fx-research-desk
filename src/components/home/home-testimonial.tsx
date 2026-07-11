type HomeTestimonialProps = {
  quote?: string;
  name?: string;
  location?: string;
  memberSince?: string;
};

export function HomeTestimonial({
  quote = "The precision of these signals transformed my trading. This is not retail — this is institutional execution.",
  name = "Ahmed K.",
  location = "Dubai",
  memberSince = "2024",
}: HomeTestimonialProps) {
  return (
    <section id="insights" className="scroll-mt-[100px] bg-[#F9FAFB] px-4 py-16 lg:px-6">
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <span
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 font-serif-display text-[120px] leading-none text-[#B8956A]/20 select-none"
          aria-hidden
        >
          &ldquo;
        </span>

        <blockquote className="relative font-serif-display text-2xl leading-relaxed text-[#1A1A1A] md:text-3xl">
          {quote}
        </blockquote>

        <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-[#4A4A4A]">
          {name}, {location}
        </p>
        <p className="mt-1 text-[11px] text-[#9CA3AF]">Member since {memberSince}</p>
      </div>
    </section>
  );
}

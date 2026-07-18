type LandingTestimonialProps = {
  quote?: string;
  name?: string;
  location?: string;
  memberSince?: string;
};

export function LandingTestimonial({
  quote = "The precision of these signals transformed my trading. This is not retail — this is institutional execution.",
  name = "Ahmed K.",
  location = "Dubai",
  memberSince = "2024",
}: LandingTestimonialProps) {
  return (
    <section className="bg-[#F1EEE5] py-24">
      <div className="mx-auto max-w-[760px] px-6 text-center lg:px-10">
        <blockquote className="font-landing-serif mb-5 text-[26px] italic leading-[1.5] text-[#0E0F13]">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <cite className="text-[13.5px] font-bold not-italic text-[#4A463C]">
          {name}
          {location ? `, ${location}` : ""} — Member since {memberSince}
        </cite>
      </div>
    </section>
  );
}

const STEPS = [
  {
    num: "01 / SUBSCRIBE",
    title: "Choose a plan",
    description:
      "Select the membership that fits your trading style and get instant access to our secure Telegram channel.",
  },
  {
    num: "02 / RECEIVE",
    title: "Get the signal",
    description:
      "Daily trade alerts with entry, stop-loss, and take-profit levels — delivered in real time, every one chart-annotated.",
  },
  {
    num: "03 / EXECUTE",
    title: "Manage the trade",
    description:
      "Apply institutional-grade setups with clear risk parameters on your own broker. We tell you exactly when to close.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="bg-[#FAF9F6] py-24">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <header className="mx-auto mb-14 max-w-[600px] text-center">
          <p className="mb-3 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            PROCESS
          </p>
          <h2 className="font-landing-serif text-[36px] font-bold text-[#0E0F13]">
            How It Works
          </h2>
          <p className="mt-3 text-[15.5px] font-medium text-[#4A463C]">
            From signup to execution in three steps.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.num} className="border-t-2 border-[#0E0F13] pt-[22px]">
              <p className="font-data mb-3.5 text-[13px] font-bold text-[#C6A15B]">
                {step.num}
              </p>
              <h3 className="font-landing-serif mb-2.5 text-[21px] font-bold text-[#0E0F13]">
                {step.title}
              </h3>
              <p className="text-[14.5px] font-medium leading-[1.55] text-[#4A463C]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

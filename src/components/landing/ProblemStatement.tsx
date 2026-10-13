import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Eye, CloudSun, Layers, AlertCircle, CheckCircle } from "lucide-react";

export function ProblemStatement() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Track scroll progress through the 300vh scrolling section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Slide track horizontally using percentages of its own width.
  // Translating from 0% to -66% brings Slide 3 to the starting position of Slide 1.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

  const slides = [
    {
      num: "01",
      icon: Eye,
      title: "Subjective Assessment",
      problem:
        "Traditional skincare relies on mirror observation, selfie photos, and subjective personal judgment. This guesswork leads to incorrect product selections, recurring irritation, acne, barrier damage, and an inability to track real progress.",
      solution:
        "Objective, clinical-grade skin analysis. DearSkin maps 128 distinct facial markers to read hydration, pigment, and texture in under three seconds with in-clinic precision, removing guesswork entirely.",
    },
    {
      num: "02",
      icon: CloudSun,
      title: "Environmental Bias",
      problem:
        "Static skincare routines ignore dynamic local climate factors. Humidity, temperature, UV index, and pollution haze significantly impact skin health. In high humidity (>80%) or extreme UV, static routines can cause sweating, acne, and dryness.",
      solution:
        "Context-aware routine adaptation. DearSkin tracks live local weather, UV index, and sleep metrics, dynamically recomposing your daily steps before you wake to shield your skin from the active environment.",
    },
    {
      num: "03",
      icon: Layers,
      title: "Ingredient Conflicts",
      problem:
        "Skincare trackers act like simple static lists. They fail to check for active ingredient conflicts, expiry dates, or Period After Opening (PAO). Users frequently layer incompatible actives, causing barrier failure and irritation.",
      solution:
        "Active formulation intelligence. An intelligent backend checks ingredients for conflicts, tracks expiration windows, and automatically pauses active products (like retinols) during travel or high UV days.",
    },
  ];

  return (
    <section ref={sectionRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-background">
        {/* Decorative background blur shapes */}
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-amber-500/[0.03] dark:bg-amber-500/[0.015] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-[var(--gold)]/[0.04] dark:bg-[var(--gold)]/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between z-10">
          {/* Static Left Info Column */}
          <div className="w-full lg:w-[30%] flex flex-col gap-5 lg:gap-6 justify-center flex-shrink-0">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              00 · The Skincare Gap
            </div>

            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-foreground font-medium">
              Skincare is broken.
              <br />
              We <em className="text-gradient not-italic">rebuilt it</em>.
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-sans">
              Three critical gaps stand between your current routine and real progress. Slide to see
              how DearSkin resolves them.
            </p>
          </div>

          {/* Sliding Cards Track */}
          <div className="w-full lg:w-[70%] overflow-visible">
            <motion.div
              style={{ x }}
              className="flex gap-6 md:gap-10 pl-[5vw] lg:pl-[2vw] pr-[20vw] py-4 w-fit select-none"
            >
              {slides.map((s) => (
                <div
                  key={s.num}
                  className="glass-strong rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between w-[85vw] sm:w-[480px] md:w-[500px] h-[480px] md:h-[500px] flex-shrink-0 relative overflow-hidden group hover:-translate-y-1 transition duration-500"
                >
                  {/* Subtle inner decorative glow on hover */}
                  <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-[var(--gold)]/10 dark:bg-[var(--gold)]/5 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />

                  {/* Header Row */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center border border-border/80">
                        <s.icon className="w-5.5 h-5.5 text-amber-500" />
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-tight font-medium">
                        {s.title}
                      </h3>
                    </div>
                    <span className="font-display text-6xl text-amber-500/25 dark:text-amber-500/15 font-light leading-none">
                      {s.num}
                    </span>
                  </div>

                  {/* Body Content Stack */}
                  <div className="flex flex-col gap-6 mt-6 md:mt-8">
                    {/* Problem Section */}
                    <div className="flex gap-3.5 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-rose-500/10 dark:bg-rose-950/20 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-rose-500 font-bold leading-none">
                          The Problem
                        </span>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-sans">
                          {s.problem}
                        </p>
                      </div>
                    </div>

                    {/* Divider Line */}
                    <div className="h-[1px] w-full bg-border/40" />

                    {/* Solution Section */}
                    <div className="flex gap-3.5 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-950/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold leading-none">
                          DearSkin Solution
                        </span>
                        <p className="text-xs md:text-sm text-foreground/90 leading-relaxed font-medium font-sans">
                          {s.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

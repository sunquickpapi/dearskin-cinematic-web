import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { Eye, CloudSun, Layers, Sun } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import cloudImg from "@/assets/cloud.png";
import questionImg from "@/assets/question.png";
import bottlesImg from "@/assets/bottles.png";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Spring-smooth the raw progress to align perfectly with the loader's scroll physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.0005,
  });

  // Parallax, zoom shifts and left-push for the background image
  // Zooms and shifts left continuously throughout the scroll (0.0 to 1.0)
  const scaleImage = useTransform(smoothProgress, [0, 1.0], [1.05, 1.25]);
  const xImage = useTransform(smoothProgress, [0, 1.0], ["0%", "-10%"]);
  // Smoothly fade out the background image as we scroll towards the Analysis section
  const opacityImage = useTransform(smoothProgress, [0.85, 0.98], [1, 0]);

  // Scroll animations for the text group (sliding left and fading out)
  // Static state: 0.0 to 0.28 (while loader is unpinning and scrolling up, revealing Hero)
  // Transition: 0.28 to 0.42 (after loader is gone, slides left and fades out)
  // Hidden state: 0.42 to 1.0
  const xTextGroup = useTransform(
    smoothProgress,
    [0, 0.28, 0.42, 1.0],
    ["0vw", "0vw", "-120vw", "-120vw"],
  );
  const yTextGroup = useTransform(smoothProgress, [0, 0.28, 0.42, 1.0], ["0%", "0%", "-8%", "-8%"]);
  const opacityTextGroup = useTransform(smoothProgress, [0, 0.28, 0.4, 1.0], [1, 1, 0, 0]);

  // Card scroll animations: simultaneous fade-in and slide-in from their respective sides.
  // Invisible state: 0.0 to 0.28 (while loader is unpinning and scrolling up)
  // Transition: 0.28 to 0.42 (simultaneous fade-in & slide-in matching text group slide-out 1:1)
  // Hold state: 0.42 to 0.88 (cards remain fully visible and readable for 80vh of scrolling)
  // Exit window: 0.88 to 0.94 (cards slide and fade away as the section unpins at 0.94)
  const opacityCard1 = useTransform(smoothProgress, [0, 0.28, 0.42, 0.88, 0.94], [0, 0, 1, 1, 0]);
  const xCard1 = useTransform(smoothProgress, [0, 0.28, 0.42, 0.88, 0.94], [-60, -60, 0, 0, -100]);

  const opacityCard2 = useTransform(smoothProgress, [0, 0.28, 0.42, 0.88, 0.94], [0, 0, 1, 1, 0]);
  const xCard2 = useTransform(smoothProgress, [0, 0.28, 0.42, 0.88, 0.94], [60, 60, 0, 0, 100]);

  const opacityCard3 = useTransform(smoothProgress, [0, 0.28, 0.42, 0.88, 0.94], [0, 0, 1, 1, 0]);
  const xCard3 = useTransform(smoothProgress, [0, 0.28, 0.42, 0.88, 0.94], [60, 60, 0, 0, 100]);

  // Delayed entrance for the cloud graphic: starts only after all cards are fully visible (at progress 0.42)
  const opacityCloud = useTransform(smoothProgress, [0, 0.42, 0.52, 0.88, 0.94], [0, 0, 1, 1, 0]);
  const xCloud = useTransform(smoothProgress, [0, 0.42, 0.52, 0.88, 0.94], [60, 60, 0, 0, 100]);

  // Delayed entrance for the question mark graphic: starts after the cloud is fully visible (at progress 0.52)
  const opacityQuestion = useTransform(
    smoothProgress,
    [0, 0.52, 0.62, 0.88, 0.94],
    [0, 0, 1, 1, 0],
  );
  const xQuestion = useTransform(
    smoothProgress,
    [0, 0.52, 0.62, 0.88, 0.94],
    [-60, -60, 0, 0, -100],
  );

  // Delayed entrance for the bottles graphic: starts after the question mark is fully visible (at progress 0.62)
  const opacityBottles = useTransform(smoothProgress, [0, 0.62, 0.72, 0.88, 0.94], [0, 0, 1, 1, 0]);
  const xBottles = useTransform(smoothProgress, [0, 0.62, 0.72, 0.88, 0.94], [60, 60, 0, 0, 100]);

  return (
    <section ref={sectionRef} className="relative h-[350vh] w-full -mt-[100vh] z-10">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Background Image Layer with Zoom & Left Shift */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <motion.img
            src={heroBg}
            alt="DearSkin Hero Background"
            style={{
              scale: scaleImage,
              x: xImage,
              opacity: opacityImage,
            }}
            className="w-full h-full object-cover object-[30%_center] lg:object-[32%_center] origin-center"
          />
          {/* Smooth bottom gradient overlay to blend into the cream background of the Analysis page */}
          <div
            className="absolute inset-x-0 bottom-0 h-[30vh] pointer-events-none z-10"
            style={{
              background: "linear-gradient(to top, var(--background) 0%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:items-stretch w-full max-w-7xl z-10 lg:h-[75vh] lg:min-h-[600px]">
          {/* COLUMN 1: LEFT SIDE (Text Group & Card 1) */}
          <div className="lg:col-span-4 flex flex-col justify-between lg:h-full min-h-[450px] lg:min-h-0 lg:py-6">
            {/* Initial Text Group (DearSkin logo, H1, description) that slides & fades left */}
            <motion.div
              style={{
                x: xTextGroup,
                y: yTextGroup,
                opacity: opacityTextGroup,
              }}
              className="flex flex-col gap-6 md:gap-8 mt-12 lg:mt-24 lg:-ml-24"
            >
              {/* Header / Logo Row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center shadow-sm">
                  <Sun className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <span className="font-display text-xl tracking-tight font-medium text-foreground">
                  DearSkin
                </span>
              </div>

              {/* Typography Group */}
              <div>
                <motion.h1
                  className="font-display text-5xl leading-[1.02] md:text-[4rem] text-foreground tracking-tight"
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
                >
                  {["Your skin,", "understood."].map((line, i) => (
                    <span key={i} className="block overflow-hidden py-1.5 -my-1.5">
                      <motion.span
                        variants={{
                          hidden: { opacity: 0, y: "115%", skewY: 3 },
                          show: { opacity: 1, y: 0, skewY: 0 },
                        }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        className="block origin-left"
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 text-sm text-muted-foreground leading-relaxed md:text-base font-sans max-w-sm"
                >
                  Track your progress. Personalize your routine. Glow with confidence.
                </motion.p>
              </div>
            </motion.div>

            {/* Card 1 & Question Mark Graphic Wrapper */}
            <div className="relative mt-8 lg:mt-0 lg:-ml-16 lg:-translate-y-40">
              {/* Floating Question Mark Graphic */}
              <motion.div
                style={{
                  x: xQuestion,
                  opacity: opacityQuestion,
                }}
                className="absolute -top-32 -left-2 w-36 h-36 lg:-top-48 lg:-left-4 lg:w-56 lg:h-56 pointer-events-none z-20"
              >
                <div className="w-full h-full float" style={{ animationDelay: "-2s" }}>
                  <img
                    src={questionImg}
                    alt="Question Droplet Graphic"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
                  />
                </div>
              </motion.div>

              {/* Card 1: Visual Guesswork */}
              <motion.div
                style={{ x: xCard1, opacity: opacityCard1 }}
                className="glass-strong rounded-[2rem] p-7 md:p-8 flex flex-col justify-between min-h-[175px] relative z-10 w-full"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-border/80 shadow-sm">
                      <Eye className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <h4 className="font-display text-xl text-foreground font-semibold">
                      Visual Guesswork
                    </h4>
                  </div>
                  <span className="font-display text-xs text-[var(--gold)]/40 font-bold uppercase tracking-widest pt-1.5">
                    01
                  </span>
                </div>
                <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-foreground/80 font-sans">
                  Guessing from the mirror leads to the wrong products and skin irritation. Our{" "}
                  <span className="text-foreground font-semibold">3-second scan</span> maps 128
                  markers for accurate, unbiased results.
                </p>
              </motion.div>
            </div>
          </div>

          {/* COLUMN 2: CENTER SPACING (Kept empty to frame the background portrait face) */}
          <div className="lg:col-span-4 h-48 lg:h-full pointer-events-none" />

          {/* COLUMN 3: RIGHT COLUMN (Card 2 & Card 3) */}
          <div className="lg:col-span-4 flex flex-col justify-between lg:h-full min-h-[380px] lg:min-h-0 gap-6 lg:gap-0 lg:py-6">
            {/* Card 2: Static Routines & Floating Cloud Graphic Group */}
            <div className="relative">
              {/* Card 2: Static Routines */}
              <motion.div
                style={{ x: xCard2, opacity: opacityCard2 }}
                className="glass-strong rounded-[2rem] p-7 md:p-8 flex flex-col justify-between min-h-[175px] relative z-10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-border/80 shadow-sm">
                      <CloudSun className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <h4 className="font-display text-xl text-foreground font-semibold">
                      Static Routines
                    </h4>
                  </div>
                  <span className="font-display text-xs text-[var(--gold)]/40 font-bold uppercase tracking-widest pt-1.5">
                    02
                  </span>
                </div>
                <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-foreground/80 font-sans">
                  Your routine can't keep up as the weather and seasons change.{" "}
                  <span className="text-foreground font-medium">Climate Sync</span> adjusts your
                  daily steps based on local UV and humidity.
                </p>
              </motion.div>

              {/* Floating Cloud Graphic */}
              <motion.div
                style={{
                  x: xCloud,
                  opacity: opacityCloud,
                }}
                className="absolute -right-12 -bottom-12 w-44 h-44 lg:-right-24 lg:-bottom-36 lg:w-72 lg:h-72 pointer-events-none z-20"
              >
                <div className="w-full h-full float">
                  <img
                    src={cloudImg}
                    alt="Cloud Graphic"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
                  />
                </div>
              </motion.div>
            </div>

            {/* Card 3: Blind Layering & Skincare Bottles Graphic Wrapper */}
            <div className="relative">
              {/* Floating Skincare Bottles Graphic */}
              <motion.div
                style={{
                  x: xBottles,
                  opacity: opacityBottles,
                }}
                className="absolute -top-30 -right-1 w-40 h-40 lg:-top-45 lg:-right-2 lg:w-64 lg:h-64 pointer-events-none z-20"
              >
                <div className="w-full h-full float" style={{ animationDelay: "-4s" }}>
                  <img
                    src={bottlesImg}
                    alt="Skincare Bottles Graphic"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
                  />
                </div>
              </motion.div>

              {/* Card 3: Blind Layering */}
              <motion.div
                style={{ x: xCard3, opacity: opacityCard3 }}
                className="glass-strong rounded-[2rem] p-7 md:p-8 flex flex-col justify-between min-h-[175px] relative z-10 w-full"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-border/80 shadow-sm">
                      <Layers className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <h4 className="font-display text-xl text-foreground font-semibold">
                      Blind Layering
                    </h4>
                  </div>
                  <span className="font-display text-xs text-[var(--gold)]/40 font-bold uppercase tracking-widest pt-1.5">
                    03
                  </span>
                </div>
                <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-foreground/80 font-sans">
                  Mixing the wrong ingredients together can damage your skin barrier.{" "}
                  <span className="text-foreground font-semibold">Formulation Guard</span>{" "}
                  checks if your products work safely together.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

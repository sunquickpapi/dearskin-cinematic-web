import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const appleEase = [0.16, 1, 0.3, 1] as const;

export function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  // Raw scroll progress through the 250vh outer wrapper (0 = loader top, 1 = loader bottom)
  const { scrollYProgress } = useScroll({
    target: loaderRef,
    offset: ["start start", "end start"],
  });

  // Spring-smooth the raw progress so the text animates with physics-based easing
  // instead of a mechanical linear response to each scroll tick.
  // stiffness=60 + damping=20 = fluid, buttery feel without overshoot.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.0005,
  });

  // Slide from center outward — using overflow:hidden quadrant containers as hard clip walls
  // Dear starts 55vw to the right (past center, hidden), slides LEFT to rest position (0)
  const dearX = useTransform(smoothProgress, [0, 0.45], ["55vw", "0vw"]);
  // Skin starts 55vw to the left (past center, hidden), slides RIGHT to rest position (0)
  const skinX = useTransform(smoothProgress, [0, 0.45], ["-55vw", "0vw"]);

  // Fade out text and logo details mid-scroll, leaving only the center line
  const textOpacity = useTransform(smoothProgress, [0.45, 0.7], [1, 0]);
  const logoDetailsOpacity = useTransform(smoothProgress, [0.45, 0.7], [1, 0]);

  // Transition gradient overlay — kicks in after text animation is fully done (0.55)
  // Bridges loader cream → hero sandy beige, fully opaque by the time hero begins (1.0)
  const overlayOpacity = useTransform(smoothProgress, [0.55, 1.0], [0, 1]);

  // Center line scroll-driven mask clip-paths (masks lines as we exit the loader, from 0.70 to 0.98)
  // This keeps the initial page-load entrance drawing animation exactly as it was before,
  // while allowing the exit scrolling to collapse the upper line upwards and the lower line downwards.
  const entryClipHeight = useTransform(smoothProgress, [0.7, 0.98], [1100, 0]);
  const exitClipY = useTransform(smoothProgress, [0.7, 0.98], [240, 1260]);

  return (
    // Outer wrapper: 250vh gives 150vh of scroll room before the hero appears
    <div ref={loaderRef} className="relative w-full h-[250vh] z-20">
      {/* Sticky inner: stays pinned to viewport top for the full 250vh scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-tr from-[#FFFDF9] via-[#FAF6EE] to-[#F3EDE0] text-[#231709]">
        {/*
          Text containers rendered FIRST = painted at the bottom layer.
          SVG rendered LAST = painted on top. DOM order guarantees logo always sits above text.
        */}

        {/* "Dear" — top-left quadrant, clipped hard at center line */}
        <div className="absolute left-0 right-[50%] top-0 bottom-[50%] overflow-hidden pointer-events-none">
          <motion.div
            style={{ x: dearX, opacity: textOpacity }}
            className="absolute right-[2.5vw] bottom-0 text-[#231709] select-none text-right font-display leading-none tracking-tighter text-[19vw] lg:text-[20vw] font-bold"
          >
            Dear
          </motion.div>
        </div>

        {/* "Skin" — bottom-right quadrant, clipped hard at center line */}
        <div className="absolute left-[50%] right-0 top-[50%] bottom-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ x: skinX, opacity: textOpacity }}
            className="absolute left-[2.5vw] top-0 text-[#231709] select-none text-left font-display leading-none tracking-tighter text-[19vw] lg:text-[20vw] font-bold"
          >
            Skin
          </motion.div>
        </div>

        {/* SVG Logo + vertical lines — rendered LAST, always paints above the text */}
        <div className="relative flex flex-col items-center w-full max-w-md h-96 justify-center pointer-events-none select-none">
          {/* Atmospheric background glow */}
          <div className="absolute w-72 h-72 bg-[oklch(0.82_0.06_80/0.05)] blur-[100px] rounded-full" />

          {/* Logo: scale-in then gentle float */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
            transition={{
              scale: { duration: 1.5, ease: appleEase },
              opacity: { duration: 0.8, ease: "easeOut" },
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
            className="relative flex flex-col items-center"
          >
            <svg
              viewBox="0 0 300 300"
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 text-[#231709]/85"
              fill="none"
              stroke="currentColor"
              strokeWidth="5.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
              style={{ overflow: "visible" }}
            >
              <defs>
                <clipPath id="entry-clip">
                  <motion.rect x="145" y="-1000" width="10" height={entryClipHeight} />
                </clipPath>
                <clipPath id="exit-clip">
                  <motion.rect x="145" y={exitClipY} width="10" height="1100" />
                </clipPath>
              </defs>

              {/* ENTRY LINE — draws top-of-screen → top of circle */}
              <motion.path
                d="M 150 -950 L 150 58"
                initial={{ strokeDasharray: 1008, strokeDashoffset: 1008 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.0, ease: appleEase, delay: 0 }}
                clipPath="url(#entry-clip)"
              />

              {/* Wrap circle fill and logo details to fade out mid-scroll */}
              <motion.g style={{ opacity: logoDetailsOpacity }}>
                {/* Opaque background fill — blocks text from showing through the circle interior */}
                <circle cx="150" cy="150" r="91" fill="#FFFDF9" stroke="none" />

                {/* LOGO GROUP */}
                <g style={{ filter: "drop-shadow(0px 6px 20px oklch(0.23 0.015 45 / 0.12))" }}>
                  {/* Outer Circle - Left Half */}
                  <motion.path
                    d="M 150 58 A 92 92 0 0 0 150 242"
                    initial={{ strokeDasharray: 300, strokeDashoffset: 300, opacity: 0 }}
                    animate={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 2.0 }}
                  />
                  {/* Outer Circle - Right Half */}
                  <motion.path
                    d="M 150 58 A 92 92 0 0 1 150 242"
                    initial={{ strokeDasharray: 300, strokeDashoffset: 300, opacity: 0 }}
                    animate={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 2.0 }}
                  />
                  {/* Droplet (Left) */}
                  <motion.path
                    d="M 132 90 C 112 115, 90 148, 90 175 A 40 40 0 0 0 130 215 C 152 215, 162 195, 154 165"
                    initial={{ strokeDasharray: 400, strokeDashoffset: 400, opacity: 0 }}
                    animate={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 1.0, ease: appleEase, delay: 2.2 }}
                  />
                  {/* Cream Swirl (Right top) */}
                  <motion.path
                    d="M 125 165 C 125 152, 142 145, 165 145 C 180 145, 185 130, 190 122 C 195 115, 202 120, 204 130 C 207 142, 202 155, 205 165"
                    initial={{ strokeDasharray: 300, strokeDashoffset: 300, opacity: 0 }}
                    animate={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: appleEase, delay: 2.4 }}
                  />
                  {/* Jar Bowl Body (Right bottom) */}
                  <motion.path
                    d="M 115 165 L 205 165 C 215 165, 215 185, 210 198 C 202 210, 180 212, 150 212 C 120 212, 115 195, 115 165 Z"
                    initial={{ strokeDasharray: 400, strokeDashoffset: 400, opacity: 0 }}
                    animate={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 1.0, ease: appleEase, delay: 2.3 }}
                  />
                  {/* Inner Overlap Curve */}
                  <motion.path
                    d="M 122 170 C 122 195, 138 212, 160 212"
                    initial={{ strokeDasharray: 150, strokeDashoffset: 150, opacity: 0 }}
                    animate={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 1.1, ease: appleEase, delay: 2.5 }}
                  />
                </g>
              </motion.g>

              {/* EXIT LINE — draws bottom of circle → bottom of screen */}
              <motion.path
                d="M 150 242 L 150 1250"
                initial={{ strokeDasharray: 1008, strokeDashoffset: 1008 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.0, ease: appleEase, delay: 3.2 }}
                clipPath="url(#exit-clip)"
              />
            </svg>
          </motion.div>
        </div>

        {/*
          Transition gradient overlay — rendered last so it sits above everything.
          Fades in after text animation completes, bridging loader cream → hero sandy beige.
          At full opacity the screen matches the hero background so the cut is invisible.
        */}
        <motion.div
          style={{
            opacity: overlayOpacity,
            background:
              "linear-gradient(to bottom, #F3EDE0 0%, #EAD9C5 30%, #DFCBB3 60%, #D4C0AA 100%)",
          }}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
    </div>
  );
}

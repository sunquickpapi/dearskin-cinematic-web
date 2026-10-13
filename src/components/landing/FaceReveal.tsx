import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import heroBg from "@/assets/hero-bg.png";

// ─────────────────────────────────────────────────────────────────────────────
// FACE SVG PATHS  —  viewBox: 0 0 1440 900
//
// The center vertical line from the Loader arrives at x=720 (50% of 1440).
// It drops straight down then curves to the face crown at x=792 (≈55%),
// aligning with the hero-bg.png person under  object-position: 30% center.
//
// Face bounds:  left≈604  right≈978  top≈120  bottom≈586
// Face center:  x=792  y=353
// ─────────────────────────────────────────────────────────────────────────────

/** Head silhouette + center-line entry (one continuous path) */
const HEAD =
  "M 720 0 L 720 120" +
  " C 720 90 792 78 792 120" +
  " C 838 95 902 116 940 168" +
  " C 978 222 988 296 978 374" +
  " C 968 446 940 508 904 544" +
  " C 880 562 852 576 828 580" +
  " C 817 583 804 585 792 586" +
  " C 780 585 767 583 756 580" +
  " C 732 576 702 562 678 544" +
  " C 642 508 614 446 604 374" +
  " C 594 296 604 222 642 168" +
  " C 680 116 746 95 792 120";

/** Right ear */
const EAR_R = "M 978 335 C 1002 358 1002 402 978 422";
/** Left ear */
const EAR_L = "M 606 335 C 582 358 582 402 606 422";

/** Right eyebrow */
const BROW_R = "M 862 266 C 882 254 908 252 930 260";
/** Right eye */
const EYE_R = "M 862 295 C 875 280 912 278 934 288 C 916 308 876 308 862 295";

/** Left eyebrow */
const BROW_L = "M 656 266 C 678 252 704 254 724 260";
/** Left eye */
const EYE_L = "M 654 295 C 668 278 706 278 724 288 C 708 308 668 308 654 295";

/** Nose bridge + tip */
const NOSE = "M 790 310 L 780 364 L 775 382 C 783 389 801 389 809 382 L 804 364";

/** Upper lip */
const LIPS_TOP = "M 750 445 C 764 432 790 428 808 430 C 824 428 846 432 856 442";
/** Lower lip */
const LIPS_BOT = "M 750 445 C 764 460 788 467 808 465 C 826 467 846 460 856 442";

/** Left neck line */
const NECK_L = "M 756 580 L 738 668";
/** Right neck line */
const NECK_R = "M 828 580 L 848 668";

export function FaceReveal() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const prog = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.0005,
  });

  const headLen = useTransform(prog, [0.0, 0.45], [0, 1]);
  const earRLen = useTransform(prog, [0.28, 0.46], [0, 1]);
  const earLLen = useTransform(prog, [0.28, 0.46], [0, 1]);
  const browRLen = useTransform(prog, [0.32, 0.5], [0, 1]);
  const eyeRLen = useTransform(prog, [0.36, 0.52], [0, 1]);
  const browLLen = useTransform(prog, [0.32, 0.5], [0, 1]);
  const eyeLLen = useTransform(prog, [0.36, 0.52], [0, 1]);
  const noseLen = useTransform(prog, [0.42, 0.58], [0, 1]);
  const lipsTopLen = useTransform(prog, [0.5, 0.64], [0, 1]);
  const lipsBotLen = useTransform(prog, [0.52, 0.66], [0, 1]);
  const neckLLen = useTransform(prog, [0.46, 0.6], [0, 1]);
  const neckRLen = useTransform(prog, [0.46, 0.6], [0, 1]);

  const faceOpacity = useTransform(prog, [0.68, 0.86], [1, 0]);
  const heroOpacity = useTransform(prog, [0.7, 1.0], [0, 1]);

  return (
    <div ref={ref} className="relative w-full h-[300vh]">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden z-10"
        style={{
          background:
            "linear-gradient(to bottom, #F3EDE0 0%, #EAD9C5 30%, #DFCBB3 60%, #D4C0AA 100%)",
        }}
      >
        <motion.svg
          style={{ opacity: faceOpacity }}
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="#231709"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path d={HEAD} style={{ pathLength: headLen }} />
          <motion.path d={EAR_R} style={{ pathLength: earRLen }} />
          <motion.path d={EAR_L} style={{ pathLength: earLLen }} />
          <motion.path d={BROW_R} style={{ pathLength: browRLen }} />
          <motion.path d={BROW_L} style={{ pathLength: browLLen }} />
          <motion.path d={EYE_R} style={{ pathLength: eyeRLen }} />
          <motion.path d={EYE_L} style={{ pathLength: eyeLLen }} />
          <motion.path d={NOSE} style={{ pathLength: noseLen }} />
          <motion.path d={LIPS_TOP} style={{ pathLength: lipsTopLen }} />
          <motion.path d={LIPS_BOT} style={{ pathLength: lipsBotLen }} />
          <motion.path d={NECK_L} style={{ pathLength: neckLLen }} />
          <motion.path d={NECK_R} style={{ pathLength: neckRLen }} />
        </motion.svg>

        <motion.img
          src={heroBg}
          alt="DearSkin hero"
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 w-full h-full object-cover object-[30%_center] lg:object-[32%_center] pointer-events-none"
        />
      </div>
    </div>
  );
}

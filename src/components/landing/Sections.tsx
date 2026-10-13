import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Camera,
  Droplets,
  Sun,
  Wind,
  Quote,
  Activity,
  Cpu,
  Eye,
  Sliders,
  Flame,
  ShieldAlert,
  Layers,
  Cloud,
  Bell,
  Info,
  Sparkles,
  Thermometer,
  Clock,
  ShoppingBag,
  Home as HomeIcon,
  BarChart2,
  User,
  Check,
  ChevronRight,
  Dna,
  Trash2,
  Columns,
} from "lucide-react";
import scan from "@/assets/scan.png";
import heroFace from "@/assets/hero-face.jpg";
import droplet from "@/assets/droplet.png";
import { TiltCard } from "@/components/landing/TiltCard";
import { ScrollRevealText } from "@/components/landing/ScrollRevealText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ritual3DPhone } from "./Ritual3DPhone";
import { Science3DPhone } from "./Science3DPhone";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease } },
};

function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      className="mx-auto max-w-2xl text-center"
    >
      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4"
      >
        <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
        {eyebrow}
      </motion.div>
      <div className="overflow-hidden py-1">
        <motion.h2
          variants={{
            hidden: { y: "115%", skewY: 3, opacity: 0 },
            show: {
              y: 0,
              skewY: 0,
              opacity: 1,
              transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="font-display text-4xl md:text-6xl leading-[1.05] origin-left"
        >
          {title}
        </motion.h2>
      </div>
      {sub && (
        <motion.p variants={fadeUp} className="mt-5 text-muted-foreground md:text-lg">
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}

/* 2. Analysis — dripping background helper */
/* 2. Analysis — microscopic lipid bubbles background helper with elastic individual scattering physics */
interface DrippingLiquidBackgroundProps {
  scrollYProgress: any;
}

function DrippingLiquidBackground({ scrollYProgress }: DrippingLiquidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterRefs = [
    useRef<SVGSVGElement>(null),
    useRef<SVGSVGElement>(null),
    useRef<SVGSVGElement>(null),
    useRef<SVGSVGElement>(null),
    useRef<SVGSVGElement>(null),
    useRef<SVGSVGElement>(null),
  ];

  const [vh, setVh] = useState(900);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVh(window.innerHeight);
      const handleResize = () => setVh(window.innerHeight);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Exit scroll transitions: bubbles sink/float downwards at staggered speeds as page scrolls down
  // To keep their screen positions on the Ritual page identical to the Analysis page,
  // they must translate down by exactly 100vh (vh) as the container scrolls up.
  const y1 = useTransform(scrollYProgress, [0.55, 0.95], [0, vh]);
  const y2 = useTransform(scrollYProgress, [0.5, 0.95], [0, vh]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.95], [0, vh]);
  const y4 = useTransform(scrollYProgress, [0.45, 0.95], [0, vh]);
  const y5 = useTransform(scrollYProgress, [0.52, 0.95], [0, vh]);
  const y6 = useTransform(scrollYProgress, [0.58, 0.95], [0, vh]);

  // Cute horizontal sways as they float to the next section
  const x1 = useTransform(scrollYProgress, [0.55, 0.7, 0.85, 0.95], [0, 50, -40, 0]);
  const x2 = useTransform(scrollYProgress, [0.5, 0.65, 0.8, 0.95], [0, -45, 35, 0]);
  const x3 = useTransform(scrollYProgress, [0.6, 0.75, 0.88, 0.95], [0, 40, -30, 0]);
  const x4 = useTransform(scrollYProgress, [0.45, 0.62, 0.78, 0.95], [0, -55, 40, 0]);
  const x5 = useTransform(scrollYProgress, [0.52, 0.68, 0.82, 0.95], [0, 45, -35, 0]);
  const x6 = useTransform(scrollYProgress, [0.58, 0.72, 0.86, 0.95], [0, -40, 30, 0]);

  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scan all SVGs for individual bubble nodes to apply physics to each bubble separately
    const bubbleNodes: {
      el: SVGGElement;
      svg: SVGSVGElement;
      cx: number;
      cy: number;
      x: number; // offset x in SVG viewbox units
      y: number; // offset y in SVG viewbox units
      vx: number;
      vy: number;
      driftSpeed: number;
      driftRadius: number;
      angle: number;
    }[] = [];

    clusterRefs.forEach((ref) => {
      const svg = ref.current;
      if (!svg) return;
      const elements = svg.querySelectorAll<SVGGElement>(".bubble-node");
      elements.forEach((el) => {
        const cx = Number(el.dataset.cx) || 100;
        const cy = Number(el.dataset.cy) || 100;

        // Ensure bubbles scale from their individual centers
        el.style.transformOrigin = "center";
        el.style.transformBox = "fill-box";

        bubbleNodes.push({
          el,
          svg,
          cx,
          cy,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          // Subtle individual brownian fluid drift parameters
          driftSpeed: 0.0008 + Math.random() * 0.001,
          driftRadius: 2.5 + Math.random() * 2.5, // 2.5 to 5 viewBox units
          angle: Math.random() * Math.PI * 2,
        });
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let animationId: number;

    const tick = () => {
      const containerRect = container.getBoundingClientRect();
      if (containerRect.width === 0) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      const mouse = mouseRef.current;
      const progress = scrollYProgress.get();

      // Wiggle factor peaks in the middle of transition and smoothly decays to 0 at the end
      let wiggleFactor = 0;
      if (progress > 0.45 && progress < 0.95) {
        const t = (progress - 0.45) / 0.5;
        wiggleFactor = Math.sin(t * Math.PI);
      }

      // Active factor remains 1 to keep hover scattering physics and organic drift fully active on the Ritual page
      const activeFactor = 1;

      // Scroll compensation: keeps bubbles stationary on the Ritual page (during the 1.8 * viewportHeight GSAP pin duration)
      // and lets them scroll away when we exit Ritual into Science (past card 04).
      const scrolledUp = containerRect.top < 0 ? -containerRect.top : 0;
      const viewportHeight = window.innerHeight;
      const ritualScroll = Math.max(0, scrolledUp - viewportHeight);
      const compensation = Math.min(1.8 * viewportHeight, ritualScroll);

      bubbleNodes.forEach((node) => {
        const svgRect = node.svg.getBoundingClientRect();
        if (svgRect.width === 0) return;

        // ViewBox scale ratio (converting container pixels to SVG viewBox units)
        // Since viewBox of all SVGs is 400x400 (-100 to 300)
        const scaleRatio = 400 / svgRect.width;
        const compensationSvg = compensation * scaleRatio;

        // Apply background slow organic drift (scaled by activeFactor)
        node.angle += node.driftSpeed * activeFactor;
        const driftX = Math.cos(node.angle) * node.driftRadius * activeFactor;
        const driftY = Math.sin(node.angle) * node.driftRadius * activeFactor;

        // Home coordinate inside SVG viewBox including organic drift
        const targetBaseX = node.cx + driftX;
        const targetBaseY = node.cy + driftY;

        // Current coordinates of this bubble in SVG viewBox units
        const currentPosX = node.cx + node.x;
        const currentPosY = node.cy + node.y;

        // Add a cute high-frequency jelly wobble and squish/stretch scale as they transition to the next page
        const time = performance.now() * 0.005;
        const wiggleX = Math.sin(time + node.angle * 2) * 8 * wiggleFactor;
        const wiggleY = Math.cos(time * 1.3 + node.angle * 2) * 8 * wiggleFactor;
        const scaleWobble = 1 + Math.sin(time * 2.2 + node.angle) * 0.12 * wiggleFactor;

        // Spring force pulling bubble back to its home coordinate in the cluster (scaled by activeFactor)
        const springK = 0.045; // stiffness elasticity
        const fxSpring = (targetBaseX - currentPosX) * springK;
        const fySpring = (targetBaseY - currentPosY) * springK;

        // Mouse magnetic repulsion (pushing bubbles away from cursor individually)
        let fxRepulsion = 0;
        let fyRepulsion = 0;

        if (mouse.active && activeFactor > 0) {
          // Convert current bubble coordinates from SVG viewBox to screen viewport pixels, including wiggle and vertical scroll compensation
          const currentPixelX =
            svgRect.left + ((currentPosX + 100 + wiggleX) / 400) * svgRect.width;
          const currentPixelY =
            svgRect.top + ((currentPosY + 100 + wiggleY) / 400) * svgRect.height + compensation;

          // Distance in container pixels
          const dxPixels = currentPixelX - mouse.x;
          const dyPixels = currentPixelY - mouse.y;
          const distPixels = Math.sqrt(dxPixels * dxPixels + dyPixels * dyPixels);

          const repulsionRadius = 180; // repulsion trigger radius in pixels
          const repulsionStrength = 28; // force coefficient

          if (distPixels < repulsionRadius && distPixels > 0) {
            // Push force increases exponentially as the mouse cursor gets closer
            const forcePixels = (1 - distPixels / repulsionRadius) * repulsionStrength;
            const fxRepPixels = (dxPixels / distPixels) * forcePixels;
            const fyRepPixels = (dyPixels / distPixels) * forcePixels;

            // Convert push force back to SVG viewBox units
            fxRepulsion = fxRepPixels * scaleRatio;
            fyRepulsion = fyRepPixels * scaleRatio;
          }
        }

        // Total force acceleration (scaled by activeFactor)
        const ax = (fxSpring + fxRepulsion) * activeFactor;
        const ay = (fySpring + fyRepulsion) * activeFactor;

        // Friction damping (scaled by activeFactor)
        const friction = 0.86;
        node.vx = (node.vx + ax) * friction * activeFactor;
        node.vy = (node.vy + ay) * friction * activeFactor;

        // Update offset coordinates (scaled by activeFactor so it settles to 0)
        node.x = (node.x + node.vx) * activeFactor;
        node.y = (node.y + node.vy) * activeFactor;

        // Limit maximum scatter offset in SVG units to prevent bubbles separating too far
        const maxOffset = 70; // max viewbox units it can drift from center
        const offsetDist = Math.sqrt(node.x * node.x + node.y * node.y);
        if (offsetDist > maxOffset) {
          node.x = (node.x / offsetDist) * maxOffset;
          node.y = (node.y / offsetDist) * maxOffset;
        }

        // Apply transforms directly to the DOM for hardware-accelerated 60/120fps performance
        node.el.style.transform = `translate3d(${node.x + wiggleX}px, ${node.y + wiggleY + compensationSvg}px, 0) scale(${scaleWobble})`;
      });

      animationId = requestAnimationFrame(tick);
    };

    // Brief timeout buffer to let DOM layout complete initial render paints
    const delayTimer = setTimeout(() => {
      tick();
    }, 150);

    return () => {
      clearTimeout(delayTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-visible">
      {/* Cluster 1: Complex Large Suspensoid (Top-Left) */}
      <div className="absolute left-[4%] top-[10%] w-[26rem] h-[26rem] md:w-[36rem] md:h-[36rem] -translate-x-1/4 -translate-y-1/4 pointer-events-none">
        <motion.svg
          ref={clusterRefs[0]}
          viewBox="-100 -100 400 400"
          style={{ y: y1, x: x1 }}
          className="w-full h-full text-foreground/15 dark:text-white/10 filter blur-[0.4px] bubble-cluster-1 overflow-visible"
        >
          <defs>
            <radialGradient id="bubble-grad-1" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" stopOpacity="0.4" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0.05" />
              <stop offset="90%" stopColor="currentColor" stopOpacity="0.05" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          {/* Bubble 1: Main Center */}
          <g className="bubble-node" data-cx="100" data-cy="100">
            <circle
              cx="100"
              cy="100"
              r="50"
              fill="url(#bubble-grad-1)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 68.82,82.00 A 36.00,36.00 0 0,1 93.75,64.55"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              className="opacity-70"
            />
            <circle cx="83.29" cy="80.08" r="2" fill="white" className="opacity-80" />
          </g>
          {/* Bubble 2: Top Attached Bubble */}
          <g className="bubble-node" data-cx="95" data-cy="46">
            <circle
              cx="95"
              cy="46"
              r="22"
              fill="url(#bubble-grad-1)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 81.28,38.08 A 15.84,15.84 0 0,1 92.25,30.40"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              className="opacity-60"
            />
          </g>
          {/* Bubble 3: Bottom Right Attached Bubble */}
          <g className="bubble-node" data-cx="138" data-cy="128">
            <circle
              cx="138"
              cy="128"
              r="32"
              fill="url(#bubble-grad-1)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 118.05,116.48 A 23.04,23.04 0 0,1 134.00,105.31"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              className="opacity-60"
            />
          </g>
          {/* Bubble 4: Small Left Attached Bubble */}
          <g className="bubble-node" data-cx="56" data-cy="108">
            <circle
              cx="56"
              cy="108"
              r="18"
              fill="url(#bubble-grad-1)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path
              d="M 44.78,101.52 A 12.96,12.96 0 0,1 53.75,95.24"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              className="opacity-50"
            />
          </g>
          {/* Bubble 5: Micro Satellite Right */}
          <g className="bubble-node" data-cx="145" data-cy="75">
            <circle
              cx="145"
              cy="75"
              r="8"
              fill="url(#bubble-grad-1)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
          {/* Bubble 6: Micro Satellite Bottom Left */}
          <g className="bubble-node" data-cx="78" data-cy="138">
            <circle
              cx="78"
              cy="138"
              r="6"
              fill="url(#bubble-grad-1)"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </g>
        </motion.svg>
      </div>

      {/* Cluster 2: Double Membrane Suspensoid (Right-Middle) */}
      <div className="absolute right-[4%] top-[32%] w-[22rem] h-[22rem] md:w-[30rem] md:h-[30rem] translate-x-1/4 -translate-y-1/4 pointer-events-none">
        <motion.svg
          ref={clusterRefs[1]}
          viewBox="-100 -100 400 400"
          style={{ y: y2, x: x2 }}
          className="w-full h-full text-foreground/15 dark:text-white/10 filter blur-[0.4px] bubble-cluster-2 overflow-visible"
        >
          <defs>
            <radialGradient id="bubble-grad-2" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" stopOpacity="0.4" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0.05" />
              <stop offset="90%" stopColor="currentColor" stopOpacity="0.05" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          {/* Bubble A */}
          <g className="bubble-node" data-cx="85" data-cy="100">
            <circle
              cx="85"
              cy="100"
              r="42"
              fill="url(#bubble-grad-2)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 58.81,84.88 A 30.24,30.24 0 0,1 79.75,70.22"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              className="opacity-70"
            />
            <circle cx="70.96" cy="83.27" r="1.8" fill="white" className="opacity-80" />
          </g>
          {/* Bubble B */}
          <g className="bubble-node" data-cx="130" data-cy="110">
            <circle
              cx="130"
              cy="110"
              r="30"
              fill="url(#bubble-grad-2)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 111.29,99.20 A 21.60,21.60 0 0,1 126.25,88.73"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              className="opacity-60"
            />
          </g>
          {/* Satellites */}
          <g className="bubble-node" data-cx="152" data-cy="85">
            <circle
              cx="152"
              cy="85"
              r="7"
              fill="url(#bubble-grad-2)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
          <g className="bubble-node" data-cx="108" data-cy="65">
            <circle
              cx="108"
              cy="65"
              r="9"
              fill="url(#bubble-grad-2)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
        </motion.svg>
      </div>

      {/* Cluster 3: Small Suspended Micelles (Left-Bottom) */}
      <div className="absolute left-[8%] bottom-[8%] w-[18rem] h-[18rem] md:w-[24rem] md:h-[24rem] -translate-x-1/4 translate-y-1/4 pointer-events-none">
        <motion.svg
          ref={clusterRefs[2]}
          viewBox="-100 -100 400 400"
          style={{ y: y3, x: x3 }}
          className="w-full h-full text-foreground/15 dark:text-white/10 filter blur-[0.3px] bubble-cluster-3 overflow-visible"
        >
          <defs>
            <radialGradient id="bubble-grad-3" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" stopOpacity="0.4" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0.05" />
              <stop offset="90%" stopColor="currentColor" stopOpacity="0.05" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          <g className="bubble-node" data-cx="100" data-cy="100">
            <circle
              cx="100"
              cy="100"
              r="35"
              fill="url(#bubble-grad-3)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 78.18,87.40 A 25.20,25.20 0 0,1 95.62,75.18"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              className="opacity-70"
            />
          </g>
          <g className="bubble-node" data-cx="128" data-cy="82">
            <circle
              cx="128"
              cy="82"
              r="18"
              fill="url(#bubble-grad-3)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
          <g className="bubble-node" data-cx="82" data-cy="72">
            <circle
              cx="82"
              cy="72"
              r="8"
              fill="url(#bubble-grad-3)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
        </motion.svg>
      </div>

      {/* Cluster 4: Meniscus Chain (Right-Top) */}
      <div className="absolute right-[15%] top-[10%] w-[16rem] h-[16rem] md:w-[22rem] md:h-[22rem] translate-x-1/4 -translate-y-1/4 pointer-events-none">
        <motion.svg
          ref={clusterRefs[3]}
          viewBox="-100 -100 400 400"
          style={{ y: y4, x: x4 }}
          className="w-full h-full text-foreground/15 dark:text-white/10 filter blur-[0.3px] bubble-cluster-4 overflow-visible"
        >
          <defs>
            <radialGradient id="bubble-grad-4" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" stopOpacity="0.3" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.02)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <g className="bubble-node" data-cx="50" data-cy="80">
            <circle
              cx="50"
              cy="80"
              r="15"
              fill="url(#bubble-grad-4)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
          <g className="bubble-node" data-cx="76" data-cy="85">
            <circle
              cx="76"
              cy="85"
              r="12"
              fill="url(#bubble-grad-4)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
          <g className="bubble-node" data-cx="98" data-cy="92">
            <circle
              cx="98"
              cy="92"
              r="10"
              fill="url(#bubble-grad-4)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
          <g className="bubble-node" data-cx="116" data-cy="100">
            <circle
              cx="116"
              cy="100"
              r="8"
              fill="url(#bubble-grad-4)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
        </motion.svg>
      </div>

      {/* Cluster 5: Triple Membrane Suspensoid (Left-Middle) */}
      <div className="absolute left-[1%] top-[48%] w-[18rem] h-[18rem] md:w-[24rem] md:h-[24rem] -translate-x-1/4 -translate-y-1/4 pointer-events-none">
        <motion.svg
          ref={clusterRefs[4]}
          viewBox="-100 -100 400 400"
          style={{ y: y5, x: x5 }}
          className="w-full h-full text-foreground/15 dark:text-white/10 filter blur-[0.35px] bubble-cluster-5 overflow-visible"
        >
          <defs>
            <radialGradient id="bubble-grad-5" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" stopOpacity="0.4" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0.05" />
              <stop offset="90%" stopColor="currentColor" stopOpacity="0.05" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          {/* Bubble 1: Main */}
          <g className="bubble-node" data-cx="100" data-cy="100">
            <circle
              cx="100"
              cy="100"
              r="28"
              fill="url(#bubble-grad-5)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 82.54,89.92 A 20.16,20.16 0 0,1 96.50,80.15"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              className="opacity-65"
            />
          </g>
          {/* Bubble 2: Bottom-Left Attached */}
          <g className="bubble-node" data-cx="75" data-cy="125">
            <circle
              cx="75"
              cy="125"
              r="18"
              fill="url(#bubble-grad-5)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 63.78,118.52 A 12.96,12.96 0 0,1 72.75,112.24"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              className="opacity-55"
            />
          </g>
          {/* Bubble 3: Top-Right Attached */}
          <g className="bubble-node" data-cx="122" data-cy="85">
            <circle
              cx="122"
              cy="85"
              r="16"
              fill="url(#bubble-grad-5)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 112.02,79.24 A 11.52,11.52 0 0,1 120.00,73.66"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              className="opacity-55"
            />
          </g>
          {/* Satellites */}
          <g className="bubble-node" data-cx="60" data-cy="80">
            <circle
              cx="60"
              cy="80"
              r="6"
              fill="url(#bubble-grad-5)"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </g>
          <g className="bubble-node" data-cx="140" data-cy="115">
            <circle
              cx="140"
              cy="115"
              r="8"
              fill="url(#bubble-grad-5)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
        </motion.svg>
      </div>

      {/* Cluster 6: Double Micelle with Chain (Right-Bottom) */}
      <div className="absolute right-[8%] bottom-[8%] w-[20rem] h-[20rem] md:w-[28rem] md:h-[28rem] translate-x-1/4 translate-y-1/4 pointer-events-none">
        <motion.svg
          ref={clusterRefs[5]}
          viewBox="-100 -100 400 400"
          style={{ y: y6, x: x6 }}
          className="w-full h-full text-foreground/15 dark:text-white/10 filter blur-[0.4px] bubble-cluster-6 overflow-visible"
        >
          <defs>
            <radialGradient id="bubble-grad-6" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" stopOpacity="0.4" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0.05" />
              <stop offset="90%" stopColor="currentColor" stopOpacity="0.05" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          {/* Bubble 1: Large Main */}
          <g className="bubble-node" data-cx="100" data-cy="100">
            <circle
              cx="100"
              cy="100"
              r="38"
              fill="url(#bubble-grad-6)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 76.31,86.32 A 27.36,27.36 0 0,1 95.25,73.06"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              className="opacity-70"
            />
            <circle cx="87.30" cy="84.86" r="1.5" fill="white" className="opacity-80" />
          </g>
          {/* Bubble 2: Top-Right Attached */}
          <g className="bubble-node" data-cx="136" data-cy="80">
            <circle
              cx="136"
              cy="80"
              r="22"
              fill="url(#bubble-grad-6)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 122.28,72.08 A 15.84,15.84 0 0,1 133.25,64.40"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              className="opacity-60"
            />
          </g>
          {/* Bubble 3: Bottom-Left Attached */}
          <g className="bubble-node" data-cx="68" data-cy="120">
            <circle
              cx="68"
              cy="120"
              r="14"
              fill="url(#bubble-grad-6)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path
              d="M 59.27,114.96 A 10.08,10.08 0 0,1 66.25,110.07"
              stroke="white"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
              className="opacity-50"
            />
          </g>
          {/* Satellites */}
          <g className="bubble-node" data-cx="120" data-cy="132">
            <circle
              cx="120"
              cy="132"
              r="7"
              fill="url(#bubble-grad-6)"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
          <g className="bubble-node" data-cx="80" data-cy="70">
            <circle
              cx="80"
              cy="70"
              r="5"
              fill="url(#bubble-grad-6)"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </g>
        </motion.svg>
      </div>
    </div>
  );
}

/* 2. Analysis — parallax scan */
export function Analysis() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    setIsDesktop(media.matches);
    const listener = () => setIsDesktop(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04]);

  // Smoothly fade in the Ritual radial gradient at the end of the scroll (when about to enter Ritual page)
  const bgOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);

  const [activeIndex, setActiveIndex] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isDesktop) {
      // Pinned range is [0.25, 0.75] for h-[300vh] + sticky h-screen
      const start = 0.25;
      const end = 0.75;
      const pauseThreshold = 0.6; // All expanded at 0.60, creating a pause until 0.75

      if (latest < start) {
        setActiveIndex(-1);
      } else if (latest >= pauseThreshold) {
        setActiveIndex(3);
      } else {
        const pct = (latest - start) / (pauseThreshold - start);
        const index = Math.max(0, Math.min(3, Math.floor(pct * 4)));
        setActiveIndex(index);
      }
    } else {
      // Mobile range when section is in active view area
      const start = 0.25;
      const pauseThreshold = 0.65;

      if (latest < start) {
        setActiveIndex(-1);
      } else if (latest >= pauseThreshold) {
        setActiveIndex(3);
      } else {
        const pct = (latest - start) / (pauseThreshold - start);
        const index = Math.max(0, Math.min(3, Math.floor(pct * 4)));
        setActiveIndex(index);
      }
    }
  });

  const markers = [
    {
      icon: Droplets,
      label: "Hydration Mapping",
      desc: '"Analyzes deep moisture levels beneath the skin\'s surface."',
      whyItFits:
        "Deep hydration tracking: Measures how well your skin holds water. Catching dehydration early prevents flaking and dry patches before they even appear.",
    },
    {
      icon: Sun,
      label: "Pigment & Melanin",
      desc: '"Tracks sun damage and uneven spots before they rise to the surface."',
      whyItFits:
        "Dark spot detection: Spots sun damage and post-acne marks underneath the surface. It guides you on when to protect with SPF or repair with Vitamin C.",
    },
    {
      icon: Wind,
      label: "Surface Topology",
      desc: '"Scans skin texture, rough patches, and pore size."',
      whyItFits:
        "Texture & pore health: Maps rough patches and clogged pores. It helps you see if your exfoliators are working properly without damaging your skin.",
    },
    {
      icon: Activity,
      label: "Vascular Activity",
      desc: '"Scans for redness, inflammation, and sensitivity triggers."',
      whyItFits:
        "Sensitivity check: Detects skin flushing and redness triggers. Essential for catching skin barrier damage and calming irritation early on.",
    },
  ];

  return (
    <section id="analysis" ref={ref} className="relative h-auto md:h-[300vh] w-full z-10">
      <div className="relative md:sticky md:top-0 md:h-screen w-full flex flex-col justify-center py-20 md:py-0 px-6">
        {/* Background gradient overlay transitioning to match the Ritual page */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#fdfbf7_0%,_#f5ede0_55%,_#dbcbaf_100%)] dark:bg-[radial-gradient(circle_at_center,_#1c1a17_0%,_#151312_60%,_#0a0908_100%)] pointer-events-none"
        />
        <DrippingLiquidBackground scrollYProgress={scrollYProgress} />
        <SectionTitle
          eyebrow="01 · Analysis"
          title={
            <>
              A scan that <em className="text-gradient not-italic">sees what mirrors miss</em>.
            </>
          }
          sub="One photo. 128 markers. A full read of your skin in under three seconds."
        />
        <div className="relative mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 md:items-center w-full">
          <motion.div
            style={{
              y,
              scale,
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
              isolation: "isolate",
            }}
            className="glass-strong overflow-hidden rounded-[2rem] p-2 aspect-[4/5] w-full max-w-[420px] mx-auto md:mx-0 md:justify-self-end self-center"
          >
            <div
              style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
              className="rounded-[1.6rem] overflow-hidden w-full h-full relative"
            >
              <img
                src={scan}
                alt="Facial scan overlay"
                loading="lazy"
                width={1280}
                height={1536}
                className="w-full h-full object-cover block"
              />
            </div>
          </motion.div>

          <div className="grid gap-3.5">
            {markers.map((m, i) => {
              const isOpen = activeIndex === i;

              // Highlight the bold part of the explanation before the colon
              const colonIndex = m.whyItFits.indexOf(":");
              const boldPart = colonIndex !== -1 ? m.whyItFits.slice(0, colonIndex + 1) : "";
              const restPart = colonIndex !== -1 ? m.whyItFits.slice(colonIndex + 1) : m.whyItFits;

              return (
                <div
                  key={m.label}
                  onClick={() => setActiveIndex(i)}
                  className={`glass rounded-2xl p-5 flex gap-4 items-start hover:bg-foreground/[0.03] transition-all duration-300 cursor-pointer ${
                    isOpen
                      ? "border-[var(--gold)]/30 shadow-md bg-foreground/[0.02]"
                      : "border-transparent"
                  }`}
                >
                  <div className="rounded-xl bg-secondary p-2.5">
                    <m.icon className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-lg">{m.label}</div>
                      <span className="font-display text-xs text-[var(--gold)]/40 font-bold uppercase tracking-widest">
                        0{i + 1}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground mt-1 italic">{m.desc}</div>

                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                        marginTop: isOpen ? 12 : 0,
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 border-t border-border/40 text-sm text-foreground/80 leading-relaxed font-sans">
                        {boldPart && (
                          <strong className="text-foreground font-semibold">{boldPart}</strong>
                        )}
                        {restPart}
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 4. Ritual — step timeline */
export function Ritual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isDragScrolling, setIsDragScrolling] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const steps = [
    { n: "01", t: "Scan", d: "Take a 3-second photo and get a full 128-marker skin scan." },
    { n: "02", t: "Shelf", d: "Add your current skincare products to track what's in them." },
    { n: "03", t: "Build", d: "Create personalized AM and PM routines without ingredient conflicts." },
    { n: "04", t: "Track", d: "Follow guided timers and log your daily skin improvements." },
  ];

  const lottieUrls = [
    "https://lottie.host/e2eb70b1-4fa3-4311-8be9-e0921473fa5d/HjI2sR3Ksc.json", // molecular scan / face mapping
    "https://lottie.host/81a95e08-cf52-4752-9be1-1d0df9ee226b/f2F5n27o1o.json", // DNA helix loop
    "https://lottie.host/6cfcbcf4-54c3-42e7-9d7e-2cf09559c5d1/2fPZ7k5L1a.json", // water drop/formula building
    "https://lottie.host/dc407e32-263a-4428-984e-37599cb59fbd/pWscwIe7kH.json", // progress check/timer ticks
  ];

  const products = [
    {
      id: "p1",
      step: "Step 01",
      name: "Purifying Gel Cleanse",
      desc: "A gentle cleanser that removes excess oil without stripping your skin.",
      volume: "150ml",
      tag: "pH 5.5 Formula",
    },
    {
      id: "p2",
      step: "Step 02",
      name: "128-Marker Active Serum",
      desc: "A targeted serum formulated to match your exact skin scan results.",
      volume: "30ml",
      tag: "Custom Active",
    },
    {
      id: "p3",
      step: "Step 03",
      name: "Barrier Restore Hydrator",
      desc: "A rich moisturizer that rebuilds your skin's natural protective barrier.",
      volume: "50ml",
      tag: "Conflict-Free",
    },
    {
      id: "p4",
      step: "Step 04",
      name: "Daily Synthesis Seal SPF50",
      desc: "A lightweight SPF that shields your skin from daily sun damage.",
      volume: "50ml",
      tag: "Mineral SPF",
    },
  ];

  // Desktop ScrollTrigger setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.innerWidth >= 768) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const step = Math.min(3, Math.floor(self.progress * 4));
            setActiveStep(step);
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mobile viewport scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (window.innerWidth < 768) {
      // Map the 0-1 progress of entering/leaving the viewport to scrollProgress
      setScrollProgress(latest);
      const step = Math.min(3, Math.floor(latest * 4));
      setActiveStep(step);
    }
  });

  // Sync scroll-snap carousel with active step
  useEffect(() => {
    const carousel = productScrollRef.current;
    if (carousel && !isDragScrolling) {
      const cards = carousel.querySelectorAll(".product-card");
      const activeCard = cards[activeStep] as HTMLElement;
      if (activeCard) {
        carousel.scrollTo({
          left: activeCard.offsetLeft - carousel.offsetWidth / 2 + activeCard.offsetWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeStep, isDragScrolling]);

  // Drag to scroll product carousel
  const handleProductMouseDown = (e: React.MouseEvent) => {
    const carousel = productScrollRef.current;
    if (!carousel) return;
    setIsDragScrolling(true);
    dragStartX.current = e.pageX - carousel.offsetLeft;
    dragScrollLeft.current = carousel.scrollLeft;
  };

  const handleProductMouseMove = (e: React.MouseEvent) => {
    if (!isDragScrolling) return;
    e.preventDefault();
    const carousel = productScrollRef.current;
    if (!carousel) return;
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    carousel.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleProductMouseUpOrLeave = () => {
    setIsDragScrolling(false);
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <section
        id="ritual"
        className="w-full h-screen overflow-visible flex flex-col justify-start pt-16 md:pt-14 pb-8 px-6 bg-[radial-gradient(circle_at_center,_#fdfbf7_0%,_#f5ede0_55%,_#dbcbaf_100%)] dark:bg-[radial-gradient(circle_at_center,_#1c1a17_0%,_#151312_60%,_#0a0908_100%)] transition-colors duration-500"
      >
        {/* Top Header - lean to the top */}
        <div className="h-[12vh] flex flex-col items-center justify-start">
          <SectionTitle
            eyebrow="02 · Ritual"
            title={
              <>
                Four steps. <em className="text-gradient not-italic">Recomposed daily.</em>
              </>
            }
          />
        </div>

        {/* Middle split grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center justify-center h-[68vh] max-w-5xl mx-auto w-full px-4 overflow-visible -mt-4 relative md:-left-12">
          {/* Left Column: Interactive 3D phone — overflow-visible so rotated phone isn't clipped */}
          <div className="h-[40vh] md:h-[68vh] w-full flex items-center justify-center relative overflow-visible">
            <Ritual3DPhone scrollProgress={scrollProgress} activeStep={activeStep} />
          </div>

          {/* Right Column: Steps info */}
          <div className="relative h-auto flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease }}
                className="glass rounded-3xl p-5 md:p-6 flex flex-col justify-between h-auto relative border border-border/20 shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <div className="font-display text-4xl md:text-5xl text-gradient">
                      {steps[activeStep].n}
                    </div>
                    <div className="text-[9px] uppercase font-mono tracking-widest text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full border border-[var(--gold)]/20">
                      Active Step
                    </div>
                  </div>
                  <h3 className="mt-2 md:mt-3 text-lg md:text-xl font-semibold text-foreground leading-tight">
                    {steps[activeStep].t}
                  </h3>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {steps[activeStep].d}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

/* 5. Science — split with dynamic clinical sandbox */
function ROIVisualization({ ready }: { ready: boolean }) {
  if (!ready) return null;
  return <Science3DPhone />;
}

function FitzpatrickVisualization() {
  const [lStar, setLStar] = useState(62);
  const [bStar, setBStar] = useState(20);

  const itaValue = Math.round((Math.atan((lStar - 50) / (bStar || 1)) * 180) / Math.PI);

  let fitzType = "Type I";
  let typeLabel = "Very Light (High UV Sensitivity)";
  if (itaValue > 55) {
    fitzType = "Type I";
    typeLabel = "Very Light (High UV Sensitivity)";
  } else if (itaValue > 41) {
    fitzType = "Type II";
    typeLabel = "Light (Burns Easily)";
  } else if (itaValue > 28) {
    fitzType = "Type III";
    typeLabel = "Intermediate (Gradual Tan)";
  } else if (itaValue > 10) {
    fitzType = "Type IV";
    typeLabel = "Tan / Olive (Rarely Burns)";
  } else if (itaValue > -30) {
    fitzType = "Type V";
    typeLabel = "Brown (Strong Melanin Defense)";
  } else {
    fitzType = "Type VI";
    typeLabel = "Dark Brown / Black";
  }

  return (
    <div className="relative w-full h-full min-h-[380px] flex flex-col justify-between p-6">
      <div className="flex justify-between items-center border-b border-border/10 pb-3 font-mono text-[9px] tracking-wider text-muted-foreground">
        <div>CHROMAMETRY ENGINE</div>
        <div>CIE L*a*b* CALCULATION</div>
      </div>

      <div className="flex-1 flex flex-col justify-center my-3 space-y-3.5">
        <div className="space-y-3 font-mono text-[9px] text-muted-foreground">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Luminance (L* axis): {lStar}</span>
              <span className="text-[8px] opacity-60">0 (Black) - 100 (White)</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={lStar}
              onChange={(e) => setLStar(Number(e.target.value))}
              className="w-full accent-[var(--gold)] bg-border/20 rounded-lg appearance-none h-1 cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Yellowness (b* axis): {bStar}</span>
              <span className="text-[8px] opacity-60">-128 (Blue) - +127 (Yellow)</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={bStar}
              onChange={(e) => setBStar(Number(e.target.value))}
              className="w-full accent-[var(--gold)] bg-border/20 rounded-lg appearance-none h-1 cursor-pointer"
            />
          </div>
        </div>

        <div className="glass rounded-xl p-2.5 text-center border border-border/10">
          <div className="text-[8px] uppercase tracking-wider font-mono text-muted-foreground">
            ITA° Equation
          </div>
          <div className="font-serif italic text-xs text-foreground my-1">
            ITA° = arctan((L* - 50) / b*) &times; (180 / &pi;)
          </div>
          <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-[var(--gold)]">
            <span>Angle Result:</span>
            <span className="font-bold text-xs">{itaValue}°</span>
          </div>
        </div>

        <div className="flex justify-between items-center glass-strong rounded-xl p-3 border border-[var(--gold)]/20 shadow-sm">
          <div>
            <div className="text-[8px] font-mono tracking-widest text-muted-foreground uppercase">
              Fitzpatrick Phototype
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">{fitzType}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{typeLabel}</div>
          </div>
          <div
            className="w-7 h-7 rounded-full border border-white/20 transition-all duration-300 shadow-inner"
            style={{
              backgroundColor: `hsl(${36 + (lStar - 40) * 0.25}, ${50 + bStar * 0.6}%, ${lStar - 10}%)`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between font-mono text-[8px] text-muted-foreground border-t border-border/10 pt-3">
        <span>PHOTOTYPE INDEX: I - VI</span>
        <span>ERROR MARGIN: &plusmn;0.05</span>
      </div>
    </div>
  );
}

function TextureVisualization() {
  const [sobelActive, setSobelActive] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[380px] flex flex-col justify-between p-6">
      <div className="flex justify-between items-center border-b border-border/10 pb-3 font-mono text-[9px] tracking-wider text-muted-foreground">
        <div>GRADIENT DETECTOR</div>
        <div>SOBEL / TAMURA METRICS</div>
      </div>

      <div className="flex-1 flex flex-col justify-center my-3 space-y-3.5">
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden glass border border-border/10">
          <div
            className="absolute inset-0 opacity-80 transition-all duration-500"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(215, 206, 185, 0.15) 1px, transparent 1px),
                                radial-gradient(circle at 10% 20%, rgba(215, 206, 185, 0.1) 2px, transparent 2px),
                                radial-gradient(circle at 80% 40%, rgba(215, 206, 185, 0.12) 1.5px, transparent 1.5px),
                                radial-gradient(circle at 30% 70%, rgba(215, 206, 185, 0.08) 1.2px, transparent 1.2px)`,
              backgroundSize: "16px 16px, 24px 24px, 20px 20px, 32px 32px",
              filter: sobelActive
                ? "invert(100%) grayscale(100%) contrast(500%) brightness(1.2)"
                : "none",
              backgroundColor: sobelActive ? "#050505" : "transparent",
            }}
          />

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 180">
            <path
              d="M 40,60 Q 60,65 90,62 T 140,70"
              fill="none"
              stroke={sobelActive ? "#ffffff" : "rgba(197, 168, 128, 0.25)"}
              strokeWidth={sobelActive ? "1.5" : "0.7"}
              className="transition-all duration-300"
            />
            <path
              d="M 180,110 Q 210,105 240,112 T 290,108"
              fill="none"
              stroke={sobelActive ? "#ffffff" : "rgba(197, 168, 128, 0.25)"}
              strokeWidth={sobelActive ? "1.5" : "0.7"}
              className="transition-all duration-300"
            />
            <path
              d="M 80,120 Q 95,123 110,118"
              fill="none"
              stroke={sobelActive ? "#ffffff" : "rgba(197, 168, 128, 0.15)"}
              strokeWidth={sobelActive ? "1" : "0.5"}
              className="transition-all duration-300"
            />
            <path
              d="M 210,40 Q 225,45 240,38"
              fill="none"
              stroke={sobelActive ? "#ffffff" : "rgba(197, 168, 128, 0.15)"}
              strokeWidth={sobelActive ? "1" : "0.5"}
              className="transition-all duration-300"
            />
          </svg>

          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border/10 text-[7px] font-mono tracking-widest text-muted-foreground uppercase">
            {sobelActive ? "SOBEL EDGE SCAN" : "RAW IMAGE FEED"}
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <button
            onClick={() => setSobelActive(false)}
            className={`flex-1 rounded-lg py-1.5 text-[9px] tracking-wider uppercase font-mono transition border ${
              !sobelActive
                ? "bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30"
                : "glass text-muted-foreground border-border/10 hover:bg-foreground/5"
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setSobelActive(true)}
            className={`flex-1 rounded-lg py-1.5 text-[9px] tracking-wider uppercase font-mono transition border ${
              sobelActive
                ? "bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30"
                : "glass text-muted-foreground border-border/10 hover:bg-foreground/5"
            }`}
          >
            Sobel Filter
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 font-mono text-[8px]">
          <div className="glass rounded-lg p-2 border border-border/10">
            <div className="text-muted-foreground">TAMURA DIRECTIONALITY</div>
            <div className="font-semibold text-foreground mt-0.5">0.742 (Uniform)</div>
          </div>
          <div className="glass rounded-lg p-2 border border-border/10">
            <div className="text-muted-foreground">TAMURA ROUGHNESS</div>
            <div className="font-semibold text-foreground mt-0.5">2.14 µm (Balanced)</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between font-mono text-[8px] text-muted-foreground border-t border-border/10 pt-3">
        <span>METRIC: SURFACE DESQUAMATION</span>
        <span>STATUS: BARRIER VERIFIED</span>
      </div>
    </div>
  );
}

function BlemishVisualization() {
  const [activeZone, setActiveZone] = useState<"redness" | "hyperpigmentation">("redness");

  return (
    <div className="relative w-full h-full min-h-[380px] flex flex-col justify-between p-6">
      <div className="flex justify-between items-center border-b border-border/10 pb-3 font-mono text-[9px] tracking-wider text-muted-foreground">
        <div>COLOR CHROMATICITY</div>
        <div>DELTA E &DELTA;E* DIFFERENTIAL</div>
      </div>

      <div className="flex-1 flex flex-col justify-center my-3 space-y-3.5">
        <div className="flex justify-between gap-3">
          <button
            onClick={() => setActiveZone("redness")}
            className={`flex-1 rounded-lg py-1.5 text-[9px] tracking-wider uppercase font-mono transition border ${
              activeZone === "redness"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : "glass text-muted-foreground border-border/10 hover:bg-foreground/5"
            }`}
          >
            Redness axis (a*)
          </button>
          <button
            onClick={() => setActiveZone("hyperpigmentation")}
            className={`flex-1 rounded-lg py-1.5 text-[9px] tracking-wider uppercase font-mono transition border ${
              activeZone === "hyperpigmentation"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "glass text-muted-foreground border-border/10 hover:bg-foreground/5"
            }`}
          >
            Melanin axis (L*)
          </button>
        </div>

        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden glass border border-border/10 flex items-center justify-center">
          <svg className="w-full h-full max-h-[140px]" viewBox="0 0 320 180">
            <path
              d="M 110,90 C 110,140 160,165 160,165 C 160,165 210,140 210,90 C 210,40 160,30 160,30 C 160,30 110,40 110,90 Z"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="0.8"
              className="opacity-25"
            />
            {activeZone === "redness" && (
              <>
                <circle
                  cx="140"
                  cy="95"
                  r="16"
                  fill="rgba(239, 68, 68, 0.15)"
                  stroke="rgba(239, 68, 68, 0.3)"
                  strokeWidth="1"
                  className="animate-pulse"
                />
                <circle cx="140" cy="95" r="4" fill="rgba(239, 68, 68, 0.8)" />
                <path
                  d="M 140,95 L 90,75"
                  stroke="rgba(239, 68, 68, 0.5)"
                  strokeWidth="0.7"
                  strokeDasharray="2 2"
                />
                <text x="5" y="70" className="fill-red-400 text-[8px] font-mono font-medium">
                  VASCULAR FLUSHING
                </text>
                <text x="5" y="80" className="fill-muted-foreground text-[7px] font-mono">
                  &Delta;a* axis delta: +4.82
                </text>
              </>
            )}

            {activeZone === "hyperpigmentation" && (
              <>
                <circle
                  cx="180"
                  cy="105"
                  r="12"
                  fill="rgba(245, 158, 11, 0.15)"
                  stroke="rgba(245, 158, 11, 0.3)"
                  strokeWidth="1"
                  className="animate-pulse"
                />
                <circle cx="180" cy="105" r="3" fill="rgba(245, 158, 11, 0.8)" />
                <path
                  d="M 180,105 L 230,85"
                  stroke="rgba(245, 158, 11, 0.5)"
                  strokeWidth="0.7"
                  strokeDasharray="2 2"
                />
                <text x="235" y="80" className="fill-amber-400 text-[8px] font-mono font-medium">
                  MELANIN CLUSTER
                </text>
                <text x="235" y="90" className="fill-muted-foreground text-[7px] font-mono">
                  &Delta;L* axis delta: -6.40
                </text>
              </>
            )}
          </svg>
        </div>

        <div className="glass rounded-xl p-2.5 border border-border/10 font-mono text-[8px]">
          <div className="flex justify-between items-center border-b border-border/10 pb-1 mb-1">
            <span className="text-muted-foreground">ANALYSIS PARAMETER</span>
            <span className="text-muted-foreground">DELTA SCORE</span>
          </div>
          {activeZone === "redness" ? (
            <div className="space-y-0.5">
              <div className="flex justify-between text-foreground">
                <span>Erythema Severity Index</span>
                <span>Moderate (14.2)</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Vascular Flushing Conf.</span>
                <span>94.8%</span>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="flex justify-between text-foreground">
                <span>Post-Inflammatory Hyperpigmentation</span>
                <span>Low-Mild (8.5)</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>UV Melanogenesis Index</span>
                <span>3.2 / 10</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between font-mono text-[8px] text-muted-foreground border-t border-border/10 pt-3">
        <span>CALIBRATION: CIE 1976 &Delta;E*</span>
        <span>ZONE DEPTH: SUB-DERMAL DEPTH SCAN</span>
      </div>
    </div>
  );
}

function SynergyVisualization() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full min-h-[380px] flex flex-col justify-between p-6">
      <div className="flex justify-between items-center border-b border-border/10 pb-3 font-mono text-[9px] tracking-wider text-muted-foreground">
        <div>BIO-RULES ENGINE</div>
        <div>INGREDIENT CROSS-REFERENCE</div>
      </div>

      <div className="flex-1 flex flex-col justify-center my-3 space-y-3.5">
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden glass border border-border/10 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 320 180">
            <line
              x1="60"
              y1="40"
              x2="260"
              y2="40"
              stroke={
                hoveredNode === "vitC" || hoveredNode === "niacin"
                  ? "#ef4444"
                  : "rgba(239, 68, 68, 0.3)"
              }
              strokeWidth={hoveredNode === "vitC" || hoveredNode === "niacin" ? "2" : "1"}
              strokeDasharray="4 2"
              className={
                hoveredNode === "vitC" || hoveredNode === "niacin"
                  ? "animate-[pulse-glow_1s_infinite]"
                  : ""
              }
            />

            <line
              x1="60"
              y1="130"
              x2="260"
              y2="130"
              stroke={
                hoveredNode === "retinol" || hoveredNode === "acids"
                  ? "#f59e0b"
                  : "rgba(245, 158, 11, 0.3)"
              }
              strokeWidth={hoveredNode === "retinol" || hoveredNode === "acids" ? "2" : "1"}
              strokeDasharray="4 2"
            />

            <line
              x1="260"
              y1="40"
              x2="60"
              y2="130"
              stroke="rgba(16, 185, 129, 0.4)"
              strokeWidth="1.5"
              className="opacity-70"
            />

            <line
              x1="260"
              y1="40"
              x2="260"
              y2="130"
              stroke="rgba(197, 168, 128, 0.4)"
              strokeWidth="1"
              strokeDasharray="1 1"
            />

            <circle
              cx="60"
              cy="40"
              r="24"
              fill="#1c1a17"
              stroke={hoveredNode === "vitC" ? "#ef4444" : "var(--gold)"}
              strokeWidth="1.5"
              onMouseEnter={() => setHoveredNode("vitC")}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer transition-all duration-300 animate-pulse"
            />
            <text
              x="60"
              y="44"
              textAnchor="middle"
              className="fill-foreground text-[7px] font-mono font-medium pointer-events-none"
            >
              Vit C
            </text>

            <circle
              cx="260"
              cy="40"
              r="24"
              fill="#1c1a17"
              stroke={hoveredNode === "niacin" ? "#ef4444" : "var(--gold)"}
              strokeWidth="1.5"
              onMouseEnter={() => setHoveredNode("niacin")}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer transition-all duration-300 animate-pulse"
            />
            <text
              x="260"
              y="44"
              textAnchor="middle"
              className="fill-foreground text-[7px] font-mono font-medium pointer-events-none"
            >
              Niacin
            </text>

            <circle
              cx="60"
              cy="130"
              r="24"
              fill="#1c1a17"
              stroke={hoveredNode === "retinol" ? "#f59e0b" : "var(--gold)"}
              strokeWidth="1.5"
              onMouseEnter={() => setHoveredNode("retinol")}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer transition-all duration-300 animate-pulse"
            />
            <text
              x="60"
              y="134"
              textAnchor="middle"
              className="fill-foreground text-[7px] font-mono font-medium pointer-events-none"
            >
              Retinol
            </text>

            <circle
              cx="260"
              cy="130"
              r="24"
              fill="#1c1a17"
              stroke={hoveredNode === "acids" ? "#f59e0b" : "var(--gold)"}
              strokeWidth="1.5"
              onMouseEnter={() => setHoveredNode("acids")}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer transition-all duration-300 animate-pulse"
            />
            <text
              x="260"
              y="134"
              textAnchor="middle"
              className="fill-foreground text-[7px] font-mono font-medium pointer-events-none"
            >
              AHA/BHA
            </text>
          </svg>
        </div>

        <div className="glass rounded-xl p-2.5 border border-border/10 font-mono text-[8px] min-h-[50px]">
          {hoveredNode === "vitC" || hoveredNode === "niacin" ? (
            <div className="space-y-0.5">
              <div className="text-red-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                pH CONFLICT: VITAMIN C + NIACINAMIDE
              </div>
              <div className="text-muted-foreground mt-0.5 leading-normal">
                Vitamin C (low pH) mixed with Niacinamide cancels out both ingredients and may
                cause skin flushing. Use them at different times of day.
              </div>
            </div>
          ) : hoveredNode === "retinol" || hoveredNode === "acids" ? (
            <div className="space-y-0.5">
              <div className="text-amber-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                BARRIER STRESS: RETINOID + AHA/BHA
              </div>
              <div className="text-muted-foreground mt-0.5 leading-normal">
                Using retinoids and exfoliating acids together strips your skin's natural oils,
                weakening its barrier and causing moisture loss.
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex items-center justify-center h-8">
              Hover over chemical nodes to trace conflicts
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between font-mono text-[8px] text-muted-foreground border-t border-border/10 pt-3">
        <span>ENGINE: DEARSKIN PH-LINK v1.4</span>
        <span>RULES PARSED: 42 DIALS</span>
      </div>
    </div>
  );
}

function EnvironmentalVisualization() {
  const [humidity, setHumidity] = useState(38);
  const [uvIndex, setUvIndex] = useState(6);
  const [aqi, setAqi] = useState(72);

  return (
    <div className="relative w-full h-full min-h-[380px] flex flex-col justify-between p-6">
      <div className="flex justify-between items-center border-b border-border/10 pb-3 font-mono text-[9px] tracking-wider text-muted-foreground">
        <div>ENVIRONMENT SENSOR FEED</div>
        <div>WEATHER DATA FEED</div>
      </div>

      <div className="flex-1 flex flex-col justify-center my-3 space-y-2.5 font-mono text-[8px] text-muted-foreground">
        <div className="space-y-1">
          <div className="flex justify-between text-[9px]">
            <span>Relative Humidity: {humidity}%</span>
            <span
              className={humidity < 40 ? "text-amber-400 font-bold" : "text-emerald-500 font-bold"}
            >
              {humidity < 40 ? "DRYNESS WARNING" : "OPTIMAL BARRIER"}
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            value={humidity}
            onChange={(e) => setHumidity(Number(e.target.value))}
            className="w-full accent-[var(--gold)] bg-border/20 rounded-lg appearance-none h-1 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[9px]">
            <span>UV Index: {uvIndex}</span>
            <span
              className={uvIndex >= 3 ? "text-red-400 font-bold" : "text-emerald-500 font-bold"}
            >
              {uvIndex >= 3 ? "SPF REQUIRED" : "LOW RISK"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={uvIndex}
            onChange={(e) => setUvIndex(Number(e.target.value))}
            className="w-full accent-[var(--gold)] bg-border/20 rounded-lg appearance-none h-1 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[9px]">
            <span>Air Quality (AQI): {aqi}</span>
            <span className={aqi > 50 ? "text-amber-400 font-bold" : "text-emerald-500 font-bold"}>
              {aqi > 50 ? "PM2.5 ALARM" : "AIR PURE"}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="180"
            value={aqi}
            onChange={(e) => setAqi(Number(e.target.value))}
            className="w-full accent-[var(--gold)] bg-border/20 rounded-lg appearance-none h-1 cursor-pointer"
          />
        </div>

        <div className="glass rounded-xl p-2.5 border border-border/10 mt-1 min-h-[48px]">
          <div className="text-[7px] tracking-widest text-muted-foreground uppercase mb-0.5">
            Personalized Advice
          </div>
          <div className="text-[9px] text-foreground leading-normal font-sans">
            {humidity < 40 && "⚠️ Low humidity — switch to a richer moisturizer to lock in hydration. "}
            {uvIndex >= 3 && "☀️ UV is high — reapply SPF 50+ throughout the day. "}
            {aqi > 50 &&
              "💨 High pollution — a double-cleanse tonight is recommended."}
            {humidity >= 40 &&
              uvIndex < 3 &&
              aqi <= 50 &&
              "✅ Conditions are ideal. Keep your regular routine."}
          </div>
        </div>
      </div>

      <div className="flex justify-between font-mono text-[8px] text-muted-foreground border-t border-border/10 pt-3">
        <span>LOC: DETECTING WEATHER FEED</span>
        <span>INTERVAL: REAL-TIME SYNC</span>
      </div>
    </div>
  );
}

function ScienceSandbox({ activeId, ready }: { activeId: string; ready: boolean }) {
  switch (activeId) {
    case "roi":
      return <ROIVisualization ready={ready} />;
    case "chroma":
      return <FitzpatrickVisualization />;
    case "texture":
      return <TextureVisualization />;
    case "blemish":
      return <BlemishVisualization />;
    case "synergy":
      return <SynergyVisualization />;
    case "env":
      return <EnvironmentalVisualization />;
    default:
      return <ROIVisualization ready={ready} />;
  }
}

// ── Sub-components so hooks are never called inside .map() ────────────────────

type PillarDef = {
  id: string;
  n: string;
  t: string;
  tech: string;
  d: string;
  icon: React.ElementType;
};

// ZOOM_END: what fraction of the scroll is consumed by the cinematic zoom-in phase
const SCIENCE_ZOOM_END = 0.18;

function SciencePillarCard({
  pillar,
  index,
  total,
  scrollYProgress,
}: {
  pillar: PillarDef;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const Icon = pillar.icon;
  // Cards only appear AFTER the zoom-in phase (except Card 1 which fades in on entry)
  const available = 1 - SCIENCE_ZOOM_END;
  const step = available / total;
  const enter = index === 0 ? 0.0 : SCIENCE_ZOOM_END + index * step;
  const peak = index === 0 ? 0.15 : enter + step * 0.2;

  const isLeftPage = index === 2 || index === 4; // Card 3 and Card 5 are positioned on the left

  const baseEnter = SCIENCE_ZOOM_END + index * step;
  // Extended hold window: card stays fully readable for a longer scroll distance
  // before fading out, giving users time to actually read it.
  const collapseStart = baseEnter + step * 0.68;
  const collapseEnd = baseEnter + step * 0.82;

  // Card 01 (index=0) must fully collapse before Card 02 enters at ~0.317.
  // Readable window: 0.18 (zoom done) → 0.26 (starts fading) → 0.30 (fully gone).
  // This leaves a clean ~0.017 gap before Card 02 slides in — no overlap, clear pause.
  const opacity = useTransform(
    scrollYProgress,
    index === 0 ? [0, 0.12, 0.26, 0.30] : [enter, peak, collapseStart, collapseEnd],
    [0, 1, 1, 0],
  );
  const x = useTransform(scrollYProgress, [enter, peak], [isLeftPage ? -60 : 60, 0]);

  // Line drawing and dot scaling are fully driven by scroll progress
  const lineScaleX = useTransform(
    scrollYProgress,
    index === 0 ? [0, 0.18, 0.24, 0.26, 0.30] : [enter, peak, collapseStart, collapseEnd],
    index === 0 ? [0, 0, 1, 1, 0] : [0, 1, 1, 0],
  );
  const dotScale = useTransform(
    scrollYProgress,
    index === 0 ? [0, 0.18, 0.24, 0.26, 0.30] : [enter, peak, collapseStart, collapseEnd],
    index === 0 ? [0, 0, 1, 1, 0] : [0, 1, 1, 0],
  );

  // Fire connector animation exactly when this card scrolls into view
  const [triggered, setTriggered] = useState(false);
  useMotionValueEvent(opacity, "change", (v) => {
    if (v > 0.5 && !triggered) setTriggered(true);
    if (v < 0.1 && triggered) setTriggered(false); // reset so it re-animates on re-entry
  });

  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute top-1/2 -translate-y-1/2 w-[320px] md:w-[380px] lg:w-[420px] z-20 ${
        isLeftPage
          ? "right-[calc(50%+140px)] md:right-[calc(50%+160px)] lg:right-[calc(50%+180px)]"
          : "left-[calc(50%+140px)] md:left-[calc(50%+160px)] lg:left-[calc(50%+180px)]"
      }`}
    >
      <div className="relative glass-strong rounded-2xl border border-[var(--gold)]/30 shadow-xl bg-[var(--gold)]/[0.03] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex-shrink-0">
            <Icon className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              {pillar.n} · {pillar.tech}
            </div>
            <h3 className="text-base font-semibold text-foreground leading-snug mt-0.5">
              {pillar.t}
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{pillar.d}</p>
        {/* Line draws itself from the card leftward or rightward toward the face (100% scroll-driven) */}
        {index !== 0 && index !== 5 && (
          <motion.div
            style={{
              transformOrigin: isLeftPage ? "left center" : "right center",
              scaleX: lineScaleX,
            }}
            className={`absolute top-1/2 -translate-y-1/2 h-[3px] w-[650px] ${
              isLeftPage
                ? "bg-gradient-to-l from-transparent via-[var(--foreground)]/60 to-[var(--foreground)]/95 -right-[650px]"
                : "bg-gradient-to-r from-transparent via-[var(--foreground)]/60 to-[var(--foreground)]/95 -left-[650px]"
            }`}
          />
        )}
        {/* Endpoint dot — scale and opacity scroll-driven, box shadow pulses */}
        {index !== 0 && index !== 5 && (
          <motion.div
            animate={
              triggered
                ? {
                    boxShadow: [
                      "0 0 0px 0px rgba(35,27,23,0)",
                      "0 0 22px 10px rgba(35,27,23,0.9)",
                      "0 0 12px 5px rgba(35,27,23,0.5)",
                      "0 0 28px 12px rgba(35,27,23,1)",
                      "0 0 12px 5px rgba(35,27,23,0.5)",
                    ],
                  }
                : {
                    boxShadow: "0 0 0px 0px rgba(35,27,23,0)",
                  }
            }
            transition={{
              boxShadow: { duration: 3.0, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              scale: dotScale,
              opacity,
            }}
            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--foreground)] ${
              isLeftPage ? "-right-[660px]" : "-left-[660px]"
            }`}
          >
            {/* Ripple ring expands outward like a radar ping */}
            {triggered && (
              <motion.span
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 3.2], opacity: [0.75, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-[var(--foreground)] pointer-events-none"
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ScienceProgressDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const available = 1 - SCIENCE_ZOOM_END;
  const step = available / total;
  const enter = SCIENCE_ZOOM_END + index * step;
  const exit = Math.min(enter + step, 1);
  const opacity = useTransform(
    scrollYProgress,
    [enter, enter + 0.05, exit - 0.05, exit],
    [0.25, 1, 1, 0.25],
  );
  const scaleX = useTransform(
    scrollYProgress,
    [enter, enter + 0.05, exit - 0.05, exit],
    [0.5, 1, 1, 0.5],
  );
  return (
    <motion.div
      style={{ opacity, scaleX }}
      className="h-px w-8 bg-[var(--gold)] rounded-full origin-center"
    />
  );
}

// Helper function for linear interpolation across keyframes
function interpolate(value: number, inputRange: number[], outputRange: number[]): number {
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      const t = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
    }
  }
  return outputRange[0];
}

// ── Main Science export ───────────────────────────────────────────────────────

export function Science() {
  const pillars: PillarDef[] = [
    {
      id: "roi",
      n: "01",
      t: "Smart Face Detection & Skin Isolation",
      tech: "Precision Facial Landmark Tracking",
      d: "Normal photos contain hair, clothing, and background shadows that can throw off skin analysis. The app detects 68 key points on your face and isolates only your skin areas. By cropping out hair and ears, it analyzes only your skin pixels for accurate results.",
      icon: Eye,
    },
    {
      id: "chroma",
      n: "02",
      t: "Objective Skin Tone Classification",
      tech: "Fitzpatrick Skin Tone Analyzer",
      d: "To measure skin tone accurately without lighting bias, the app converts camera colors into a standardized color space that measures light and undertone. It then calculates your skin tone angle (ITA°) to place you into one of 6 dermatological skin types.",
      icon: Sliders,
    },
    {
      id: "texture",
      n: "03",
      t: "Skin Smoothness & Wrinkle Scanner",
      tech: "Surface Texture & Dryness Metrics",
      d: "The app scans for fine lines, wrinkles, and texture variations by analyzing changes in pixel contrast (edge detection). It measures skin roughness, contrast, and scaling to score your overall skin smoothness and pinpoint dry patches.",
      icon: Activity,
    },
    {
      id: "blemish",
      n: "04",
      t: "Redness & Dark Spot Mapping",
      tech: "Skin Discoloration Detection",
      d: "The app checks color differences across 14 facial zones to spot issues. It isolates redness (on the green-to-red color axis) to identify irritation, flushing, or rosacea, and detects dark spots or acne scars by scanning for small changes in skin brightness.",
      icon: Flame,
    },
    {
      id: "synergy",
      n: "05",
      t: "Skincare Product Synergy & Conflict Checker",
      tech: "Ingredient Compatibility Rules Engine",
      d: "Mixing the wrong ingredients can strip your skin barrier. The app scans your product ingredients against dermatological rules. It flags conflicts (like Vitamin C with Niacinamide, which weakens both) and warns you when you're layering too many drying products at once.",
      icon: ShieldAlert,
    },
    {
      id: "env",
      n: "06",
      t: "Weather & Environment Sync",
      tech: "Real-Time Climate Advice",
      d: "Your skin reacts to your environment every day. The app tracks local humidity (switching to richer creams when the air is dry), UV Index (to remind you to reapply SPF), and Air Quality (warning you to double-cleanse when pollution is high).",
      icon: Cloud,
    },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);

  // Only mount the Three.js/WebGL component when the Science section is
  // actually close to the viewport — prevents the 65MB GLB download and
  // WebGL renderer from blocking page load and freezing other sections.
  const [scienceReady, setScienceReady] = useState(false);
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScienceReady(true);
          observer.disconnect(); // fire once — never unmount once loaded
        }
      },
      { rootMargin: "300px" }, // start loading 300px before the section enters view
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const available = 1 - SCIENCE_ZOOM_END;
  const step = available / 5; // 5 remaining cards (index 1, 2, 3, 4, 5)

  const t0Start = SCIENCE_ZOOM_END; // 0.18
  const t0End = 0.3;
  const t1Start = 0.3;
  const t1End = 0.35;
  const t2Start = 0.58;
  const t2End = 0.63;

  // Ref updated every frame — drives 45° rotation + nav/title blur in one pass
  const rotYRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const scienceScrollKeyframes = [
      // Hold at 0 until card 01 is gone (0.30), then rotate into card 02 position during the gap
      0.0, 0.18, 0.30, 0.317, 0.4, 0.45, 0.54, 0.59, 0.68, 0.72, 0.81, 0.86, 1.0,
    ];
    const scienceRotYKeyframes = [
      0,
      0,
      0,             // hold: face stays unrotated while card 01 is visible
      Math.PI / 4,   // snaps to card 02 angle during the gap
      Math.PI / 4,
      -Math.PI / 4,
      -Math.PI / 4,
      Math.PI / 4,
      Math.PI / 4,
      -Math.PI / 4,
      -Math.PI / 4,
      0,
      0,
    ];
    rotYRef.current = interpolate(v, scienceScrollKeyframes, scienceRotYKeyframes);

    const navScrollKeyframes = [0.0, SCIENCE_ZOOM_END, 0.93, 0.98];
    const navProgressKeyframes = [0, 1, 1, 0];
    const tNav = interpolate(v, navScrollKeyframes, navProgressKeyframes);

    const navEl = document.getElementById("site-nav");
    if (navEl) {
      navEl.style.filter = tNav > 0 ? `blur(${tNav * 14}px)` : "";
      navEl.style.opacity = String(Math.max(0, 1 - tNav * 0.85));
    }
  });

  // Reset nav styles when Science section unmounts
  useEffect(() => {
    return () => {
      const navEl = document.getElementById("site-nav");
      if (navEl) {
        navEl.style.filter = "";
        navEl.style.opacity = "";
      }
    };
  }, []);

  // Title blur ramps up as the face zooms in and unblurs as user exits the page
  const titleBlurVal = useTransform(
    scrollYProgress,
    [0, SCIENCE_ZOOM_END * 0.65, 0.93, 0.98],
    [0, 18, 18, 0],
  );
  const titleFilter = useMotionTemplate`blur(${titleBlurVal}px)`;

  // Face stays still while card 01 is on screen, then transitions during the gap (0.30→0.317)
  const faceScale = useTransform(
    scrollYProgress,
    [0.0, 0.18, 0.30, 0.317, 0.4, 0.45, 0.54, 0.59, 0.68, 0.72, 0.81, 0.86, 1.0],
    [1.2, 1.2,  1.2,  3.5,   3.5, 3.5,  3.5,  1.2,  1.2,  1.2,  1.2,  1.2,  1.2],
  );
  // Face holds center while card 01 is readable, slides left during the gap before card 02
  const rawFaceX = useTransform(
    scrollYProgress,
    [0.0, 0.18, 0.30, 0.317, 0.4, 0.45, 0.54, 0.59, 0.68, 0.72, 0.81, 0.86, 1.0],
    [0,   0,    0,    -480,  -480, 480,  480, -480, -480,  480,  480,   0,    0],
  );
  // Smooth spring smoothing for the face's horizontal movement
  const faceX = useSpring(rawFaceX, { stiffness: 60, damping: 22, mass: 1 });
  // Face starts lower down, rises up, and returns to its entry position as user exits the page
  const faceY = useTransform(scrollYProgress, [0.0, 0.18, 0.93, 1.0], [200, 0, 0, 200]);
  // Background radial gradient overlay fades out completely as we scroll to exit the page
  const bgOpacity = useTransform(scrollYProgress, [0.0, 0.93, 0.98], [1, 1, 0]);
  // Title fades out quickly during the zoom phase and fades back in as user exits the page
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, SCIENCE_ZOOM_END * 0.55, 0.93, 0.98],
    [1, 0, 0, 1],
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, SCIENCE_ZOOM_END * 0.55, 0.93, 0.98],
    [0, -36, -36, 0],
  );

  return (
    <section
      id="science"
      ref={sectionRef}
      className="relative bg-background transition-colors duration-500"
      style={{ height: "1100vh" }}
    >
      {/* Sticky viewport — everything pins here while the outer section scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Radial Gradient Background Overlay (fades out on exit) ── */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fdfbf7_0%,_#f5ede0_55%,_#dbcbaf_100%)] dark:bg-[radial-gradient(circle_at_center,_#1c1a17_0%,_#151312_60%,_#0a0908_100%)] transition-colors duration-500 z-0 pointer-events-none"
        />
        {/* ── Title (blurs + fades out during zoom phase) ── */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, filter: titleFilter }}
          className="absolute top-0 left-0 right-0 pt-16 pb-4 px-6 text-center z-20 pointer-events-none"
        >
          <SectionTitle
            eyebrow="03 · Science"
            title={
              <>
                Clinical Rigor. <em className="text-gradient not-italic">Programmed.</em>
              </>
            }
            sub="The math, science, and logic that power DearSkin's real-time skin analysis."
          />
        </motion.div>

        {/* ── 3D Face: scroll-driven scale + x lean ── */}
        <motion.div
          style={{ scale: faceScale, x: faceX, y: faceY }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[440px] h-[530px] sm:w-[520px] sm:h-[620px] md:w-[600px] md:h-[700px] lg:w-[720px] lg:h-[840px] z-10"
        >
          {/* Float wrapper (child so scale+x don't fight animate) */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            {/* Glow orb counter-floats beneath the face */}
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4
                w-3/4 h-16 rounded-full bg-[var(--gold)] blur-3xl pointer-events-none"
            />
            <div className="w-full h-full overflow-hidden">
              {scienceReady && (
                <Science3DPhone externalRotationY={rotYRef} scrollYProgress={scrollYProgress} />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Pillar cards (all right-side, appear after zoom phase) ── */}
        {pillars.map((p, i) => (
          <SciencePillarCard
            key={p.id}
            pillar={p}
            index={i}
            total={pillars.length}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* ── Scroll progress dots ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {pillars.map((p, i) => (
            <ScienceProgressDot
              key={p.id}
              index={i}
              total={pillars.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
/* ── Journal Section — Advanced scroll-driven layout matching Science page ── */

const JOURNAL_INTRO_END = 0.15;
const JOURNAL_TOTAL = 5;

type JournalCardDef = {
  n: string;
  t: string;
  tech: string;
  d: string;
  icon: React.ElementType;
  side: "left" | "right";
};

function JournalProgressDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const available = 1 - JOURNAL_INTRO_END;
  const step = available / total;
  const enter = JOURNAL_INTRO_END + index * step;
  const exit = Math.min(enter + step, 1);
  const opacity = useTransform(
    scrollYProgress,
    [enter, enter + 0.05, exit - 0.05, exit],
    [0.25, 1, 1, 0.25],
  );
  const scaleX = useTransform(
    scrollYProgress,
    [enter, enter + 0.05, exit - 0.05, exit],
    [0.5, 1, 1, 0.5],
  );
  return (
    <motion.div
      style={{ opacity, scaleX }}
      className="h-px w-8 bg-[var(--gold)] rounded-full origin-center"
    />
  );
}

function JournalPillarCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: JournalCardDef;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const Icon = card.icon;
  const available = 1 - JOURNAL_INTRO_END;
  const step = available / total;
  const enter = JOURNAL_INTRO_END + index * step;
  const peak = enter + step * 0.22;
  const collapseStart = enter + step * 0.68;
  const collapseEnd = enter + step * 0.82;
  const isLeft = card.side === "left";

  const opacity = useTransform(
    scrollYProgress,
    [enter, peak, collapseStart, collapseEnd],
    [0, 1, 1, 0],
  );
  const x = useTransform(scrollYProgress, [enter, peak], [isLeft ? -70 : 70, 0]);

  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute top-1/2 -translate-y-1/2 w-[310px] md:w-[360px] lg:w-[400px] z-20 ${
        isLeft
          ? "right-[calc(50%+175px)] md:right-[calc(50%+195px)] lg:right-[calc(50%+210px)]"
          : "left-[calc(50%+175px)] md:left-[calc(50%+195px)] lg:left-[calc(50%+210px)]"
      }`}
    >
      <div className="relative glass-strong rounded-2xl border border-[var(--gold)]/30 shadow-xl bg-[var(--gold)]/[0.03] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex-shrink-0">
            <Icon className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              {card.n} · {card.tech}
            </div>
            <h3 className="text-base font-semibold text-foreground leading-snug mt-0.5">
              {card.t}
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{card.d}</p>
      </div>
    </motion.div>
  );
}

function JournalPhoneScreen({ activeIndex }: { activeIndex: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full flex flex-col"
      >
        {activeIndex === -1 && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-display text-[14px] font-bold tracking-tight text-foreground">
                  Skin Journal
                </h4>
                <p className="text-[8px] text-muted-foreground mt-0.5">Jun 7, 2026</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/30 overflow-hidden flex items-center justify-center">
                <img src={heroFace} alt="avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="glass rounded-2xl p-3 border border-[var(--gold)]/20 flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/15 flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--gold)] font-display font-bold text-sm">74</span>
              </div>
              <div>
                <p className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground">
                  Overall Skin Score
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-bold text-foreground">Good</span>
                  <span className="text-[8px] text-emerald-500 font-bold">↑ +22 pts</span>
                </div>
              </div>
            </div>
            <p className="text-[7px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
              Recent Entries
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { date: "Jun 7", score: 74, tag: "Morning" },
                { date: "Jun 6", score: 71, tag: "Morning" },
                { date: "Jun 5", score: 68, tag: "Evening" },
              ].map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between glass rounded-xl px-3 py-2 border border-border/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                    <span className="text-[9px] font-mono text-foreground">{entry.date}</span>
                    <span className="text-[7px] text-muted-foreground">{entry.tag}</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-500">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeIndex === 0 && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-display text-[12px] font-bold text-foreground">Before & After</h4>
              <span className="text-[8px] font-mono text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full border border-[var(--gold)]/20">
                Jan 4 → Jun 7
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden flex-shrink-0 h-[170px]">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={scan}
                  alt="before"
                  className="w-full h-full object-cover filter saturate-[1.4] sepia-[0.2] hue-rotate-[-5deg] brightness-[0.88]"
                />
                <div className="absolute top-1.5 left-2 text-[7px] font-mono font-bold text-white/80 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  BEFORE
                </div>
                <div className="absolute top-[42%] left-[45%] w-2 h-2 rounded-full bg-red-500/60 blur-[1px] animate-pulse" />
                <div className="absolute top-[55%] left-[35%] w-1.5 h-1.5 rounded-full bg-red-500/50 blur-[1px] animate-pulse" />
              </div>
              <div className="absolute inset-y-0 right-0 left-1/2 overflow-hidden border-l-2 border-white/60">
                <img
                  src={scan}
                  alt="after"
                  className="absolute inset-0 w-[261px] h-full object-cover filter contrast-[1.01]"
                  style={{ right: 0, left: "auto" }}
                />
                <div className="absolute top-1.5 right-2 text-[7px] font-mono font-bold text-white/80 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  AFTER
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center z-10">
                <span className="text-[7px] text-neutral-500 font-bold">↔</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {[
                { label: "Acne", change: "-35%" },
                { label: "Redness", change: "-7%" },
                { label: "Score", change: "+22 pts" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-2 text-center border border-border/20">
                  <div className="text-[7px] text-muted-foreground font-mono uppercase">{s.label}</div>
                  <div className="text-[10px] font-bold mt-0.5 text-emerald-500">{s.change}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeIndex === 1 && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-[12px] font-bold text-foreground">Skin Breakdown</h4>
              <span className="text-[8px] font-mono text-muted-foreground">Jun 7</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Acne", value: "28 spots", bar: 32, dot: "bg-red-400", bar_color: "bg-red-400" },
                { label: "Redness", value: "12%", bar: 12, dot: "bg-orange-400", bar_color: "bg-orange-400" },
                { label: "Texture", value: "75%", bar: 75, dot: "bg-amber-400", bar_color: "bg-amber-400" },
                { label: "Pores", value: "48%", bar: 48, dot: "bg-neutral-400", bar_color: "bg-neutral-400" },
                { label: "Dark Spots", value: "8%", bar: 8, dot: "bg-neutral-600", bar_color: "bg-neutral-600" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.dot}`} />
                  <span className="text-[8px] font-mono text-muted-foreground w-14 flex-shrink-0 uppercase leading-none">
                    {m.label}
                  </span>
                  <div className="flex-1 h-1 bg-border/30 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.bar_color}`} style={{ width: `${m.bar}%` }} />
                  </div>
                  <span className="text-[8px] font-bold text-foreground w-12 text-right flex-shrink-0">
                    {m.value}
                  </span>
                  <span className="text-[7px] text-emerald-500 flex-shrink-0">↓</span>
                </div>
              ))}
            </div>
            <div className="mt-auto glass rounded-xl p-2.5 border border-[var(--gold)]/20 flex items-center justify-between">
              <span className="text-[8px] font-mono text-muted-foreground uppercase">Overall Score</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-foreground">74</span>
                <span className="text-[8px] text-emerald-500 font-bold">↑ +22 pts</span>
              </div>
            </div>
          </div>
        )}

        {activeIndex === 2 && (
          <div className="flex flex-col h-full items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <h4 className="font-display text-[12px] font-bold text-foreground">Consistency</h4>
              <span className="text-[8px] font-mono text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full border border-[var(--gold)]/20">
                Jun 2026
              </span>
            </div>
            <div className="flex flex-col items-center mb-5">
              <span className="font-display text-[52px] leading-none text-gradient font-bold">12</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                Day Streak 🔥
              </span>
            </div>
            <div className="w-full mb-4">
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="text-center text-[6px] text-muted-foreground font-mono">
                    {d}
                  </div>
                ))}
              </div>
              {[
                [true, true, false, true, true, true, false],
                [true, true, true, true, false, true, true],
                [true, false, true, true, true, true, true],
                [true, true, true, true, false, false, false],
              ].map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                  {week.map((logged, di) => (
                    <div
                      key={di}
                      className={`w-full aspect-square rounded-full flex items-center justify-center ${
                        logged ? "bg-[var(--gold)]/80" : "bg-border/30"
                      }`}
                    >
                      {logged && <div className="w-1 h-1 rounded-full bg-white/60" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <div className="glass rounded-xl p-2 text-center border border-border/20">
                <div className="text-[7px] text-muted-foreground font-mono uppercase">Best</div>
                <div className="text-[11px] font-bold text-foreground mt-0.5">18 days</div>
              </div>
              <div className="glass rounded-xl p-2 text-center border border-border/20">
                <div className="text-[7px] text-muted-foreground font-mono uppercase">Rate</div>
                <div className="text-[11px] font-bold text-emerald-500 mt-0.5">87%</div>
              </div>
            </div>
          </div>
        )}

        {activeIndex === 3 && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-[12px] font-bold text-foreground">Perfect Shot</h4>
              <span className="text-[8px] font-mono text-muted-foreground">Guide</span>
            </div>
            <div className="border border-dashed border-[var(--gold)]/50 rounded-2xl p-3 flex flex-col items-center bg-[var(--gold)]/5 mb-3 flex-shrink-0">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-20 h-20 text-muted-foreground/45"
              >
                <path d="M 50 10 C 65 10 78 22 78 37 C 78 50 75 58 70 65 C 65 72 58 78 50 78 C 42 78 35 72 30 65 C 25 58 22 50 22 37 C 22 22 35 10 50 10 Z" />
                <path d="M 30 78 C 30 78 20 85 10 90" />
                <path d="M 70 78 C 70 78 80 85 90 90" />
                <path d="M 37 36 Q 40 34 43 36" strokeDasharray="1.5 1.5" />
                <path d="M 57 36 Q 60 34 63 36" strokeDasharray="1.5 1.5" />
                <line x1="20" y1="58" x2="80" y2="58" strokeWidth="0.8" opacity="0.6" />
              </svg>
              <span className="text-[7px] font-mono tracking-widest text-[var(--gold)] uppercase font-semibold mt-1.5 text-center">
                Center your face
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: "☀️", label: "Lighting", tip: "Natural, indirect daylight" },
                { icon: "😐", label: "Expression", tip: "Keep your face neutral" },
                { icon: "📐", label: "Angle", tip: "Camera at eye level" },
                { icon: "🧼", label: "Surface", tip: "Clean skin, no makeup" },
              ].map((t) => (
                <div key={t.label} className="flex gap-2.5 items-center">
                  <span className="text-[11px] flex-shrink-0">{t.icon}</span>
                  <span className="text-[8px] font-bold text-foreground w-16 flex-shrink-0">{t.label}:</span>
                  <span className="text-[8px] text-muted-foreground leading-tight">{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeIndex === 4 && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-display text-[12px] font-bold text-foreground">30-Day Progress</h4>
              <span className="text-[8px] text-emerald-500 font-bold">↑ +22 pts</span>
            </div>
            <div className="glass rounded-2xl p-3 border border-border/20 flex-1 flex flex-col min-h-0">
              <svg className="w-full flex-1" viewBox="0 0 240 110" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="jChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,85 C 12,83 20,80 32,76 C 44,72 48,78 60,73 C 72,68 76,71 88,65 C 100,59 104,63 116,56 C 128,49 132,53 144,46 C 156,39 160,43 172,36 C 184,29 188,33 200,26 C 212,19 220,22 240,14 L 240,110 L 0,110 Z"
                  fill="url(#jChartGrad)"
                />
                <path
                  d="M 0,85 C 12,83 20,80 32,76 C 44,72 48,78 60,73 C 72,68 76,71 88,65 C 100,59 104,63 116,56 C 128,49 132,53 144,46 C 156,39 160,43 172,36 C 184,29 188,33 200,26 C 212,19 220,22 240,14"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="85" r="3.5" fill="var(--gold)" />
                <circle cx="240" cy="14" r="3.5" fill="var(--gold)" />
                <line x1="0" y1="0" x2="0" y2="110" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                <line x1="0" y1="110" x2="240" y2="110" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                <text x="3" y="107" fontSize="7" fontFamily="monospace" className="fill-muted-foreground">Day 1</text>
                <text x="200" y="107" fontSize="7" fontFamily="monospace" className="fill-muted-foreground">Day 30</text>
                <text x="3" y="83" fontSize="7" fontFamily="monospace" className="fill-muted-foreground">52</text>
                <text x="3" y="12" fontSize="7" fontFamily="monospace" className="fill-muted-foreground">74</text>
              </svg>
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-[7px] font-mono text-muted-foreground uppercase">Skin Score</span>
                <span className="text-[7px] font-mono text-[var(--gold)]">↑ Improving</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* 6. Testimonials */
export function Testimonials() {
  const [layoutMode, setLayoutMode] = useState<"interactive" | "scroll">("interactive");

  // --- State & Refs for Interactive layout ---
  const [activeModal, setActiveModal] = useState<"camera" | "comparison" | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [compareSliderPos, setCompareSliderPos] = useState(50);

  const sliderRef = useRef<HTMLDivElement>(null);
  const compareSliderRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1 || e.pointerType === "touch") {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pct);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleComparePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1 || e.pointerType === "touch") {
      if (!compareSliderRef.current) return;
      const rect = compareSliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setCompareSliderPos(pct);
    }
  };

  const handleComparePointerDown = (e: React.PointerEvent) => {
    if (!compareSliderRef.current) return;
    const rect = compareSliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCompareSliderPos(pct);
  };

  const features = [
    {
      id: "timeline",
      n: "01",
      t: "Draggable Visual Timeline",
      d: "Compare your skin's state before and after using our standardized alignment slider. Slide to see active redness fade and textures smooth out in real-time.",
      action: () => setActiveModal(null),
      active: activeModal === null,
    },
    {
      id: "metrics",
      n: "02",
      t: "Multi-Marker Diagnosis Breakdown",
      d: "Spot-counting algorithms track 5 key dermatological indicators: Acne count, Redness percentage, Pores diameter, Texture roughness, and Dark Spot area.",
      action: () => setActiveModal("comparison"),
      active: activeModal === "comparison",
    },
    {
      id: "guide",
      n: "03",
      t: "Standardized Camera Calibration",
      d: "Our built-in silhouette guide aligns your face to ensure consistent lighting, expressions, and angles across all entries for scientific tracking.",
      action: () => setActiveModal("camera"),
      active: activeModal === "camera",
    },
  ];

  // --- Scroll-driven Timeline Layout Hooks ---
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const available = 1 - JOURNAL_INTRO_END;
  const step = available / JOURNAL_TOTAL;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (layoutMode !== "scroll") return;
    if (v < JOURNAL_INTRO_END) {
      setActiveIndex(-1);
      return;
    }
    for (let i = JOURNAL_TOTAL - 1; i >= 0; i--) {
      if (v >= JOURNAL_INTRO_END + i * step) {
        setActiveIndex(i);
        return;
      }
    }
    setActiveIndex(-1);
  });

  const titleBlurVal = useTransform(
    scrollYProgress,
    [0, JOURNAL_INTRO_END * 0.55, 0.93, 0.98],
    [0, 18, 18, 0],
  );
  const titleFilter = useMotionTemplate`blur(${titleBlurVal}px)`;
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, JOURNAL_INTRO_END * 0.55, 0.93, 0.98],
    [1, 0, 0, 1],
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, JOURNAL_INTRO_END * 0.55, 0.93, 0.98],
    [0, -36, -36, 0],
  );
  const bgOpacity = useTransform(scrollYProgress, [0.0, 0.93, 0.98], [1, 1, 0]);
  const phoneY = useTransform(scrollYProgress, [0.0, JOURNAL_INTRO_END], [80, 0]);

  const cards: JournalCardDef[] = [
    {
      n: "01",
      t: "Before & After Timeline",
      tech: "Visual Progress Comparison",
      d: "Drag the slider to compare your skin at any two points in time. Watch redness fade, texture smooth, and dark spots lift — all tracked from your first scan.",
      icon: Columns,
      side: "right",
    },
    {
      n: "02",
      t: "5-Marker Skin Breakdown",
      tech: "Diagnostic Metrics Dashboard",
      d: "Every scan scores five key indicators: acne count, redness level, pore coverage, texture smoothness, and dark spot area. Watch each number shift as your routine takes effect.",
      icon: Activity,
      side: "left",
    },
    {
      n: "03",
      t: "Daily Consistency Streak",
      tech: "Routine Adherence Tracker",
      d: "Skin results compound over time. Your streak tracks how consistently you follow your routine — the longest streaks correlate directly with the biggest visible improvements.",
      icon: Flame,
      side: "right",
    },
    {
      n: "04",
      t: "Guided Photo Alignment",
      tech: "Standardized Capture System",
      d: "A silhouette guide locks your face position, angle, and framing on every photo. Without consistent shots, progress comparisons are meaningless — this makes them scientific.",
      icon: Camera,
      side: "left",
    },
    {
      n: "05",
      t: "30-Day Progress Chart",
      tech: "Skin Score Trend Graph",
      d: "Your overall skin score plotted daily. Dips reveal when a new product disrupted your barrier. Peaks show when your routine hit its stride. The chart tells the full story.",
      icon: BarChart2,
      side: "right",
    },
  ];

  const handleLayoutToggle = (mode: "interactive" | "scroll") => {
    setLayoutMode(mode);
    setTimeout(() => {
      const el = document.getElementById("journal");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  if (layoutMode === "interactive") {
    return (
      <section id="journal" className="relative py-32 px-6 overflow-hidden bg-background">
        {/* Dynamic background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_#f5ede0_0%,_transparent_65%)] dark:bg-[radial-gradient(circle_at_center,_#1c1a17_0%,_transparent_65%)] pointer-events-none opacity-80 z-0" />

        <div className="relative mx-auto max-w-6xl z-10">
          <SectionTitle
            eyebrow="04 · Journal"
            title={
              <>
                Skin keeps <em className="text-gradient not-italic">receipts</em>.
              </>
            }
            sub="Visualize your journey, track daily visual improvements, and analyze your progress with clinical precision."
          />

          {/* Layout Mode Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="glass p-1 rounded-full flex gap-1 border border-border/20 shadow-xs relative">
              <button
                onClick={() => handleLayoutToggle("interactive")}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  layoutMode === "interactive"
                    ? "text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {layoutMode === "interactive" && (
                  <motion.div
                    layoutId="activeLayoutBg"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Interactive Demo
              </button>
              <button
                onClick={() => handleLayoutToggle("scroll")}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  layoutMode === "scroll"
                    ? "text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {layoutMode === "scroll" && (
                  <motion.div
                    layoutId="activeLayoutBg"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Scroll Timeline
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center w-full">
            {/* Left Column: Feature explanation cards */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              {features.map((f) => (
                <div
                  key={f.id}
                  onClick={f.action}
                  className={`glass rounded-[2rem] p-6 border transition-all duration-300 cursor-pointer flex gap-5 items-start ${
                    f.active
                      ? "border-[var(--gold)]/40 bg-foreground/[0.02] shadow-md animate-[pulse-glow_4s_ease-in-out_infinite]"
                      : "border-transparent hover:bg-foreground/[0.015] hover:border-border/40"
                  }`}
                >
                  <div className="rounded-2xl bg-secondary p-3 flex-shrink-0 flex items-center justify-center">
                    <span className="font-display text-sm text-[var(--gold)] font-bold tracking-widest">
                      {f.n}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground leading-tight">
                      {f.t}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-sans">
                      {f.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Phone Mockup */}
            <div className="lg:col-span-6 flex justify-center relative select-none">
              {/* Phone floating background glow */}
              <div className="absolute w-72 h-72 bg-[var(--gold)]/10 blur-[100px] rounded-full -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              {/* CSS iPhone Chassis */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[310px] h-[630px] rounded-[3.25rem] border-[10px] border-[#1c1917] bg-[#FAF6EE] dark:bg-[#11100f] shadow-glass flex flex-col overflow-hidden"
              >
                {/* Dynamic Island */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] mr-auto ml-4" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#050505] ml-auto mr-4" />
                </div>

                {/* Glass reflection shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none z-30" />

                {/* Screen container */}
                <div className="flex flex-col h-full bg-[#FAF6EE] dark:bg-[#11100f] text-[#231709] dark:text-[#f3ede0] p-4 pt-12 select-none overflow-hidden relative pb-[70px]">
                  
                  {/* ── PHONE HEADER ── */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/30 overflow-hidden flex items-center justify-center">
                        <img src={heroFace} alt="Pal avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs leading-none">Pal</span>
                        <span className="text-[8px] text-muted-foreground font-mono mt-0.5">d@gmail.com</span>
                      </div>
                    </div>
                    {/* Notification Bell */}
                    <div className="relative w-8 h-8 rounded-full bg-foreground/[0.03] border border-border/40 flex items-center justify-center shadow-xs">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-card flex items-center justify-center text-[6px] font-bold text-white">
                        1
                      </span>
                    </div>
                  </div>

                  {/* ── PAGE TITLE ── */}
                  <div className="mt-3">
                    <h4 className="font-display text-[15px] font-bold tracking-tight text-foreground">Skin Progress</h4>
                    <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                      Visualize your journey and track skin improvements
                    </p>
                  </div>

                  {/* ── CONTROLS ROW ── */}
                  <div className="mt-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {/* Comparison Button */}
                      <button
                        onClick={() => setActiveModal("comparison")}
                        className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-xs cursor-pointer ${
                          activeModal === "comparison"
                            ? "bg-[var(--gold)]/15 border-[var(--gold)]/40 text-[var(--gold)]"
                            : "bg-white dark:bg-neutral-800 border-border/30 text-muted-foreground hover:bg-foreground/[0.04]"
                        }`}
                      >
                        <Columns className="w-3.5 h-3.5" />
                      </button>
                      {/* Camera Button */}
                      <button
                        onClick={() => setActiveModal("camera")}
                        className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-xs cursor-pointer ${
                          activeModal === "camera"
                            ? "bg-[var(--gold)]/15 border-[var(--gold)]/40 text-[var(--gold)]"
                            : "bg-white dark:bg-neutral-800 border-border/30 text-muted-foreground hover:bg-foreground/[0.04]"
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Info Button */}
                    <button
                      className="w-7.5 h-7.5 rounded-xl flex items-center justify-center border border-border/30 text-muted-foreground hover:bg-foreground/[0.04] bg-white dark:bg-neutral-800 transition-all duration-300 shadow-xs cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* ── JOURNEY DETAIL HEADER ── */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-tight text-foreground/80">Your Progress Journey</span>
                      <span className="text-[7px] text-muted-foreground mt-0.5 leading-none">Showing all entries (6)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-[8px] font-bold text-foreground bg-white dark:bg-neutral-800 border border-border/30 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-xs cursor-pointer">
                        All Time
                        <ChevronRight className="w-2 h-2 rotate-90 text-muted-foreground" />
                      </div>
                      <div className="w-6 h-6 rounded-lg border border-border/30 bg-white dark:bg-neutral-800 flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-foreground/[0.04] shadow-xs">
                        <Sliders className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* ── COMPARISON SLIDER CARD ── */}
                  <div className="relative mt-3 rounded-2xl border border-border/30 overflow-hidden bg-white dark:bg-neutral-800 shadow-xs p-3 pt-6 flex items-center gap-2">
                    {/* Date overlay */}
                    <span className="absolute top-1.5 left-3 text-[7px] font-mono text-muted-foreground uppercase font-bold">
                      Jun 4, 2026 • 1:38 AM
                    </span>
                    {/* Delete button */}
                    <button className="absolute top-1.5 right-2 w-4.5 h-4.5 rounded-full bg-foreground/[0.03] border border-border/20 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>

                    {/* Face Slider */}
                    <div
                      ref={sliderRef}
                      onPointerMove={handlePointerMove}
                      onPointerDown={handlePointerDown}
                      className="relative w-[92px] h-[92px] rounded-xl overflow-hidden cursor-ew-resize select-none touch-none border border-border/20 flex-shrink-0"
                    >
                      {/* BEFORE LAYER (Bottom) */}
                      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
                        <img
                          src={scan}
                          alt="Before skin progress"
                          className="w-full h-full object-cover filter saturate-[1.3] sepia-[0.15] hue-rotate-[-8deg] opacity-90"
                        />
                        {/* Simulated Acne Spots on Before layer */}
                        <div className="absolute top-[42%] left-[45%] w-2 h-2 rounded-full bg-red-500/60 blur-[1px] animate-pulse" />
                        <div className="absolute top-[55%] left-[38%] w-1.5 h-1.5 rounded-full bg-red-500/60 blur-[1px] animate-pulse" />
                        <div className="absolute top-[48%] left-[58%] w-1.5 h-1.5 rounded-full bg-red-500/60 blur-[1px] animate-pulse" />
                        <div className="absolute top-[35%] left-[52%] w-1 h-1 rounded-full bg-red-500/60 blur-[0.5px] animate-pulse" />
                      </div>

                      {/* AFTER LAYER (Top Overlay, width dynamic) */}
                      <div
                        style={{ width: `${sliderPos}%` }}
                        className="absolute inset-y-0 left-0 h-full overflow-hidden border-r border-white/60 pointer-events-none select-none"
                      >
                        {/* Inner wrapper must have constant width equal to slider container (92px) to prevent scaling */}
                        <div className="absolute inset-y-0 left-0 w-[92px] h-full">
                          <img
                            src={scan}
                            alt="After skin progress"
                            className="w-full h-full object-cover filter contrast-[1.01]"
                          />
                        </div>
                      </div>

                      {/* Smiley and double arrow overlay */}
                      <div className="absolute bottom-1 left-1 flex items-center gap-0.5 pointer-events-none z-10">
                        <div className="w-5.5 h-5.5 rounded-md bg-white flex items-center justify-center shadow-xs">
                          <span className="text-[10px]">🙂</span>
                        </div>
                        <div className="w-5.5 h-5.5 rounded-full bg-[#3d2a1f] flex items-center justify-center shadow-xs text-white text-[8px] font-bold">
                          ↔
                        </div>
                      </div>

                      {/* Divider handle line */}
                      <div
                        style={{ left: `${sliderPos}%` }}
                        className="absolute inset-y-0 -ml-px w-0.5 bg-white pointer-events-none z-10"
                      />
                    </div>

                    {/* Caption text */}
                    <div className="flex-1 flex items-center justify-center p-1 min-w-0">
                      <span className="text-[10px] font-serif italic text-foreground/85 font-medium leading-snug text-center">
                        "Skin feels smooth"
                      </span>
                    </div>
                  </div>

                  {/* ── DIAGNOSTIC METRICS LIST ── */}
                  <div className="mt-3.5 border border-border/30 rounded-2xl p-3 bg-white dark:bg-neutral-800 flex flex-col gap-3 shadow-xs">
                    {/* Acne & Lesions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600/20" />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-mono uppercase text-muted-foreground tracking-wider leading-none">ACNE & LESIONS</span>
                          <span className="text-[10px] font-bold text-red-500 mt-1 leading-none">43 Spots</span>
                        </div>
                      </div>
                      <span className="text-[7px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-600/40 px-2 py-0.5 rounded-md">
                        Significant
                      </span>
                    </div>

                    {/* Dark Spots */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 dark:bg-neutral-200 border border-border/20" />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-mono uppercase text-muted-foreground tracking-wider leading-none">DARK SPOTS</span>
                          <span className="text-[10px] font-bold text-red-500 mt-1 leading-none">10%</span>
                        </div>
                      </div>
                      <span className="text-[7px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-600/40 px-2 py-0.5 rounded-md">
                        Significant
                      </span>
                    </div>

                    {/* Pores */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 border border-neutral-500/20" />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-mono uppercase text-muted-foreground tracking-wider leading-none">PORES</span>
                          <span className="text-[10px] font-bold text-amber-500 mt-1 leading-none">54%</span>
                        </div>
                      </div>
                      <span className="text-[7px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-600/40 px-2 py-0.5 rounded-md">
                        Moderate
                      </span>
                    </div>

                    {/* Texture */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 flex items-center justify-center">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-mono uppercase text-muted-foreground tracking-wider leading-none">TEXTURE</span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 leading-none">75%</span>
                        </div>
                      </div>
                      <span className="text-[7px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-600/40 px-2 py-0.5 rounded-md">
                        Moderate
                      </span>
                    </div>

                    {/* Redness */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 flex items-center justify-center">
                          <Thermometer className="w-2.5 h-2.5 text-red-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-mono uppercase text-muted-foreground tracking-wider leading-none">REDNESS</span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 leading-none">81%</span>
                        </div>
                      </div>
                      <span className="text-[7px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-600/40 px-2 py-0.5 rounded-md">
                        Minimal
                      </span>
                    </div>
                  </div>

                  {/* ── BOTTOM FLOATING NAV BAR ── */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white dark:bg-neutral-800 border border-border/30 shadow-lg rounded-2xl py-2.5 px-4 flex items-center justify-between z-20 text-[8px] font-semibold text-muted-foreground">
                    <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Routine</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Products</span>
                    </div>
                    {/* Floating Home button style wrapper */}
                    <div className="relative -mt-6.5 w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-border/30 shadow-md flex items-center justify-center cursor-pointer text-foreground">
                      <HomeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-center gap-0.5 cursor-pointer text-[#4e3629] dark:text-[var(--gold)]">
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Progress</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                      <User className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </div>
                  </div>

                  {/* ── MODAL 1: CAMERA PHOTO GUIDE ── */}
                  <AnimatePresence>
                    {activeModal === "camera" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="absolute inset-0 bg-[#FAF6EE] dark:bg-[#11100f] z-30 flex flex-col p-4 pt-12 text-[#231709] dark:text-[#f3ede0] overflow-y-auto"
                      >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b border-border/30 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">📸</span>
                            <span className="font-display font-bold text-xs">Perfect Progress Photo</span>
                          </div>
                          <button
                            onClick={() => setActiveModal(null)}
                            className="w-5 h-5 rounded-full bg-foreground/[0.04] border border-border/40 flex items-center justify-center text-[10px] font-bold text-muted-foreground hover:bg-foreground/[0.1] transition-colors cursor-pointer"
                          >
                            &times;
                          </button>
                        </div>

                        {/* Silhouette Outline box */}
                        <div className="mt-3.5 border border-dashed border-[var(--gold)]/50 rounded-2xl p-4 flex flex-col items-center justify-center bg-[var(--gold)]/5 relative">
                          <svg
                            viewBox="0 0 100 100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-28 h-28 text-muted-foreground/45"
                          >
                            {/* SVG silhouette path */}
                            <path d="M 50 10 C 65 10 78 22 78 37 C 78 50 75 58 70 65 C 65 72 58 78 50 78 C 42 78 35 72 30 65 C 25 58 22 50 22 37 C 22 22 35 10 50 10 Z" />
                            <path d="M 30 78 C 30 78 20 85 10 90" />
                            <path d="M 70 78 C 70 78 80 85 90 90" />
                            <path d="M 45 42 L 50 48 L 55 42" strokeDasharray="2 2" />
                            <path d="M 37 36 Q 40 34 43 36" strokeDasharray="1.5 1.5" />
                            <path d="M 57 36 Q 60 34 63 36" strokeDasharray="1.5 1.5" />
                            <line x1="20" y1="58" x2="80" y2="58" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.6" />
                          </svg>
                          <span className="text-[8px] font-mono tracking-widest text-[var(--gold)] uppercase font-semibold text-center mt-2.5">
                            Center your face in the frame
                          </span>
                        </div>

                        {/* The 4 guidelines */}
                        <div className="mt-5 flex flex-col gap-3.5 px-1">
                          <div className="flex gap-3 items-center">
                            <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <p className="text-[9.5px] leading-tight">
                              <span className="font-bold text-foreground">Lighting:</span>{" "}
                              <span className="text-muted-foreground">Use natural, indirect daylight</span>
                            </p>
                          </div>

                          <div className="flex gap-3 items-center">
                            <span className="text-[12px] flex-shrink-0 leading-none">😐</span>
                            <p className="text-[9.5px] leading-tight">
                              <span className="font-bold text-foreground">Expression:</span>{" "}
                              <span className="text-muted-foreground">Keep a neutral facial expression</span>
                            </p>
                          </div>

                          <div className="flex gap-3 items-center">
                            <span className="text-[12px] flex-shrink-0 leading-none">📐</span>
                            <p className="text-[9.5px] leading-tight">
                              <span className="font-bold text-foreground">Angle:</span>{" "}
                              <span className="text-muted-foreground">Hold camera at eye level</span>
                            </p>
                          </div>

                          <div className="flex gap-3 items-center">
                            <span className="text-[12px] flex-shrink-0 leading-none">🧼</span>
                            <p className="text-[9.5px] leading-tight">
                              <span className="font-bold text-foreground">Surface:</span>{" "}
                              <span className="text-muted-foreground">Clean your skin before the photo</span>
                            </p>
                          </div>
                        </div>

                        {/* Dismiss button */}
                        <button
                          onClick={() => setActiveModal(null)}
                          className="w-full py-2.5 bg-[#4e3629] hover:bg-[#3d2a1f] text-white rounded-xl font-semibold text-xs transition-colors mt-auto text-center cursor-pointer shadow-xs"
                        >
                          Got it
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── MODAL 2: PROGRESS COMPARISON ── */}
                  <AnimatePresence>
                    {activeModal === "comparison" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="absolute inset-0 bg-[#FAF6EE] dark:bg-[#11100f] z-30 flex flex-col p-4 pt-12 text-[#231709] dark:text-[#f3ede0] overflow-y-auto"
                      >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b border-border/30 pb-2">
                          <div className="flex items-center gap-1.5">
                            <Columns className="w-3.5 h-3.5 text-[var(--gold)]" />
                            <span className="font-display font-bold text-xs">Progress Comparison</span>
                          </div>
                          <button
                            onClick={() => setActiveModal(null)}
                            className="w-5 h-5 rounded-full bg-foreground/[0.04] border border-border/40 flex items-center justify-center text-[10px] font-bold text-muted-foreground hover:bg-foreground/[0.1] transition-colors cursor-pointer"
                          >
                            &times;
                          </button>
                        </div>

                        {/* Draggable Comparison Slider */}
                        <div
                          ref={compareSliderRef}
                          onPointerMove={handleComparePointerMove}
                          onPointerDown={handleComparePointerDown}
                          className="mt-3 rounded-xl border border-border/40 overflow-hidden relative aspect-[16/9] w-full flex-shrink-0 shadow-xs cursor-ew-resize select-none touch-none"
                        >
                          {/* BEFORE LAYER (Bottom) */}
                          <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
                            <img
                              src={scan}
                              alt="Before side comparison"
                              className="absolute inset-0 w-full h-full object-cover filter saturate-[1.3] sepia-[0.15] hue-rotate-[-8deg]"
                              style={{ width: "200%", maxWidth: "none" }}
                            />
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[6px] font-mono text-white/90 uppercase tracking-widest font-semibold">
                              Before
                            </span>
                          </div>

                          {/* AFTER LAYER (Top Overlay, width dynamic) */}
                          <div
                            style={{ width: `${compareSliderPos}%` }}
                            className="absolute inset-y-0 left-0 h-full overflow-hidden border-r border-white/60 pointer-events-none select-none"
                          >
                            <div className="absolute inset-y-0 left-0 w-[242px] h-full"> {/* Container width is ~242px */}
                              <img
                                src={scan}
                                alt="After side comparison"
                                className="absolute inset-0 w-[484px] h-full object-cover filter contrast-[1.01]"
                                style={{ maxWidth: "none", width: "484px", left: "0" }}
                              />
                              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[6px] font-mono text-white/90 uppercase tracking-widest font-semibold">
                                After
                              </span>
                            </div>
                          </div>

                          {/* Divider handle circle */}
                          <div
                            style={{ left: `${compareSliderPos}%` }}
                            className="absolute inset-y-0 -ml-px w-0.5 bg-white pointer-events-none z-10"
                          >
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-none z-20">
                              <span className="text-[8px] font-bold text-neutral-500 tracking-tighter leading-none select-none">
                                &laquo;&raquo;
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Breakdown title */}
                        <span className="text-[8px] font-bold tracking-wider text-muted-foreground uppercase mt-4 mb-1">
                          METRICS BREAKDOWN
                        </span>

                        {/* 6 Grid cards */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {/* Skin Type */}
                          <div className="bg-white dark:bg-neutral-800 border border-border/30 rounded-xl p-2.5 flex flex-col shadow-xs">
                            <div className="flex gap-2 items-center">
                              <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] dark:bg-neutral-900 border border-border/20 shadow-xs flex items-center justify-center flex-shrink-0">
                                <Dna className="w-3.5 h-3.5 text-blue-500" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">Skin Type</span>
                                <span className="text-[9px] font-extrabold mt-1 text-foreground leading-none">II &rarr; II</span>
                              </div>
                            </div>
                            <div className="mt-1.5 pl-9">
                              <span className="text-[5.5px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                                Consistent
                              </span>
                            </div>
                          </div>

                          {/* Redness */}
                          <div className="bg-white dark:bg-neutral-800 border border-border/30 rounded-xl p-2.5 flex flex-col shadow-xs">
                            <div className="flex gap-2 items-center">
                              <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] dark:bg-neutral-900 border border-border/20 shadow-xs flex items-center justify-center flex-shrink-0">
                                <Thermometer className="w-3.5 h-3.5 text-red-500" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">Redness</span>
                                <span className="text-[9px] font-extrabold mt-1 text-foreground leading-none">81% &rarr; 81%</span>
                              </div>
                            </div>
                            <div className="mt-1.5 pl-9">
                              <span className="text-[5.5px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-full">
                                No change
                              </span>
                            </div>
                          </div>

                          {/* Acne */}
                          <div className="bg-white dark:bg-neutral-800 border border-border/30 rounded-xl p-2.5 flex flex-col shadow-xs">
                            <div className="flex gap-2 items-center">
                              <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] dark:bg-neutral-900 border border-border/20 shadow-xs flex items-center justify-center flex-shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600/20" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">Acne</span>
                                <span className="text-[9px] font-extrabold mt-1 text-foreground leading-none">43 &rarr; 43</span>
                              </div>
                            </div>
                            <div className="mt-1.5 pl-9">
                              <span className="text-[5.5px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-full">
                                No change
                              </span>
                            </div>
                          </div>

                          {/* Pores */}
                          <div className="bg-white dark:bg-neutral-800 border border-border/30 rounded-xl p-2.5 flex flex-col shadow-xs">
                            <div className="flex gap-2 items-center">
                              <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] dark:bg-neutral-900 border border-border/20 shadow-xs flex items-center justify-center flex-shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 border border-neutral-500/20" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">Pores</span>
                                <span className="text-[9px] font-extrabold mt-1 text-foreground leading-none">54% &rarr; 54%</span>
                              </div>
                            </div>
                            <div className="mt-1.5 pl-9">
                              <span className="text-[5.5px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-full">
                                No change
                              </span>
                            </div>
                          </div>

                          {/* Texture */}
                          <div className="bg-white dark:bg-neutral-800 border border-border/30 rounded-xl p-2.5 flex flex-col shadow-xs">
                            <div className="flex gap-2 items-center">
                              <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] dark:bg-neutral-900 border border-border/20 shadow-xs flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">Texture</span>
                                <span className="text-[9px] font-extrabold mt-1 text-foreground leading-none">75% &rarr; 75%</span>
                              </div>
                            </div>
                            <div className="mt-1.5 pl-9">
                              <span className="text-[5.5px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-full">
                                No change
                              </span>
                            </div>
                          </div>

                          {/* Dark Spots */}
                          <div className="bg-white dark:bg-neutral-800 border border-border/30 rounded-xl p-2.5 flex flex-col shadow-xs">
                            <div className="flex gap-2 items-center">
                              <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] dark:bg-neutral-900 border border-border/20 shadow-xs flex items-center justify-center flex-shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800 dark:bg-neutral-200 border border-border/25" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">Dark Spots</span>
                                <span className="text-[9px] font-extrabold mt-1 text-foreground leading-none">10% &rarr; 10%</span>
                              </div>
                            </div>
                            <div className="mt-1.5 pl-9">
                              <span className="text-[5.5px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-full">
                                No change
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Dismiss button */}
                        <button
                          onClick={() => setActiveModal(null)}
                          className="w-full py-2.5 bg-[#4e3629] hover:bg-[#3d2a1f] text-white rounded-xl font-semibold text-xs transition-colors mt-auto text-center cursor-pointer shadow-xs"
                        >
                          Got it
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- Scroll-driven Timeline Layout Markup ---
  return (
    <section
      id="journal"
      ref={sectionRef}
      className="relative bg-background transition-colors duration-500"
      style={{ height: "900vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Background gradient — same warm radial as Science ── */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fdfbf7_0%,_#f5ede0_55%,_#dbcbaf_100%)] dark:bg-[radial-gradient(circle_at_center,_#1c1a17_0%,_#151312_60%,_#0a0908_100%)] transition-colors duration-500 z-0 pointer-events-none"
        />

        {/* ── Title (blurs + rises out as user enters card phase) ── */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, filter: titleFilter }}
          className="absolute top-0 left-0 right-0 pt-16 pb-4 px-6 text-center z-20 pointer-events-none"
        >
          <SectionTitle
            eyebrow="04 · Journal"
            title={
              <>
                Skin keeps <em className="text-gradient not-italic">receipts</em>.
              </>
            }
            sub="Every scan, every routine, every shift — logged, compared, and understood."
          />
          {/* Layout Mode Toggle inside sticky view */}
          <div className="mt-8 flex justify-center pointer-events-auto">
            <div className="glass p-1 rounded-full flex gap-1 border border-border/20 shadow-xs relative">
              <button
                onClick={() => handleLayoutToggle("interactive")}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  layoutMode === "interactive"
                    ? "text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {layoutMode === "interactive" && (
                  <motion.div
                    layoutId="activeLayoutBg"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Interactive Demo
              </button>
              <button
                onClick={() => handleLayoutToggle("scroll")}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  layoutMode === "scroll"
                    ? "text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {layoutMode === "scroll" && (
                  <motion.div
                    layoutId="activeLayoutBg"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Scroll Timeline
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Central Phone Mockup — floats center, glow beneath ── */}
        <motion.div
          style={{ y: phoneY }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Gold glow beneath */}
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-3/4 h-14 rounded-full bg-[var(--gold)] blur-3xl pointer-events-none"
            />

            {/* CSS Phone Chassis */}
            <div className="relative w-[290px] h-[590px] rounded-[3.2rem] border-[9px] border-[#1c1917] bg-[#FAF6EE] dark:bg-[#11100f] shadow-glass flex flex-col overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] mr-auto ml-4" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#050505] ml-auto mr-4" />
              </div>
              {/* Glass reflection shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none z-30" />
              {/* Screen content */}
              <div className="flex flex-col h-full bg-[#FAF6EE] dark:bg-[#11100f] text-[#231709] dark:text-[#f3ede0] p-4 pt-11 select-none overflow-hidden relative">
                <JournalPhoneScreen activeIndex={activeIndex} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Feature Cards — alternate left/right, scroll-driven ── */}
        {cards.map((card, i) => (
          <JournalPillarCard
            key={card.n}
            card={card}
            index={i}
            total={JOURNAL_TOTAL}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* ── Progress dots ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {cards.map((_, i) => (
            <JournalProgressDot
              key={i}
              index={i}
              total={JOURNAL_TOTAL}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


/* 7. Pricing */
export function Pricing() {
  const tiers = [
    {
      n: "Reader",
      p: "Free",
      d: "Weekly scan + baseline routine.",
      f: ["1 scan / week", "Static 4-step routine", "Community journal"],
    },
    {
      n: "Composer",
      p: "$14/mo",
      d: "A daily routine that adapts to you.",
      f: ["Unlimited scans", "Weather + sleep sync", "Personal ingredient tracker", "Travel mode"],
      featured: true,
    },
    {
      n: "Studio",
      p: "$38/mo",
      d: "Full access with monthly derm support.",
      f: [
        "Everything in Composer",
        "Monthly derm review",
        "Custom serum drops",
        "Priority lab work",
      ],
    },
  ];
  return (
    <section id="plans" className="relative py-32 px-6">
      <SectionTitle
        eyebrow="05 · Plans"
        title={
          <>
            Choose your <em className="text-gradient not-italic">cadence</em>.
          </>
        }
      />
      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((t, i) => (
          <motion.div
            key={t.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease }}
          >
            <TiltCard>
              <div
                className={`rounded-3xl p-8 relative h-full w-full ${t.featured ? "glass-strong border-[var(--gold)]/30 shadow-md animate-[pulse-glow_6s_ease-in-out_infinite]" : "glass"}`}
              >
                {t.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-medium">
                    Most chosen
                  </div>
                )}
                <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  {t.n}
                </div>
                <div className="mt-3 font-display text-5xl">{t.p}</div>
                <div className="mt-2 text-sm text-muted-foreground">{t.d}</div>
                <ul className="mt-7 space-y-2.5 text-sm">
                  {t.f.map((f) => (
                    <li key={f} className="flex gap-2 items-start">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={`mt-8 block text-center rounded-full py-3 text-sm font-medium transition ${t.featured ? "bg-primary text-primary-foreground hover:scale-[1.02] shadow-sm" : "glass hover:bg-foreground/5"}`}
                >
                  Choose {t.n}
                </a>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* 8. CTA + Footer */
export function CTA() {
  return (
    <section id="cta" className="relative py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1, ease }}
        className="mx-auto max-w-5xl glass-strong rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 aurora-bg opacity-60" />
        <div className="relative">
          <Camera className="w-8 h-8 mx-auto text-[var(--gold)]" />
          <h2 className="mt-6 font-display text-4xl md:text-6xl">
            Meet your skin, <em className="text-gradient not-italic">at last</em>.
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
            Free for the first 1,000 readers each week. No card, no commitments — just an honest
            mirror.
          </p>
          <form className="mt-9 mx-auto flex max-w-md gap-2 glass rounded-full p-1.5 bg-background/50">
            <input
              type="email"
              placeholder="you@skin.com"
              className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground text-foreground"
            />
            <button
              type="button"
              className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:scale-[1.03] transition shadow-sm"
            >
              Begin →
            </button>
          </form>
        </div>
      </motion.div>
      <footer className="mx-auto max-w-6xl mt-24 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[var(--gradient-gold)]" />
          <span>DearSkin · © {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground">
            Science
          </a>
          <a href="#" className="hover:text-foreground">
            Press
          </a>
          <a href="#" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </footer>
    </section>
  );
}

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Mouse positions relative to the card's center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to dampen the tilt action
  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig); // max 10 deg
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig); // max 10 deg

  // Soft glow position follow
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), springConfig);
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card top-left (0 to 1)
    const relativeX = (e.clientX - rect.left) / width;
    const relativeY = (e.clientY - rect.top) / height;

    // Shift to center range (-0.5 to 0.5)
    x.set(relativeX - 0.5);
    y.set(relativeY - 0.5);
  };

  const handleMouseLeave = () => {
    // Reset tilt
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3 }}
      className={`relative select-none ${className}`}
    >
      {/* 3D Reflection overlay effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 180px at ${glowX} ${glowY}, rgba(255, 255, 255, 0.15), transparent 70%)`,
        }}
      />
      {/* Glow highlight */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] z-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[oklch(0.76_0.08_80/0.18)] to-[oklch(0.68_0.08_135/0.12)]"
        style={{
          transform: "translateZ(-1px)",
        }}
      />
      <div style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}>{children}</div>
    </motion.div>
  );
}

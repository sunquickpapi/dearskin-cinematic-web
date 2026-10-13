import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  delay: number; // Factor for spring stiffness
  friction: number;
  angle: number;
  driftSpeed: number;
  driftRadius: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function InteractiveLiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initial mouse positions in center
    mouseRef.current = {
      x: width / 2,
      y: height / 2,
      tx: width / 2,
      ty: height / 2,
      active: false,
    };

    // Organic color values from our CSS design
    // Gold: oklch(0.76 0.08 80) -> rgba(230, 205, 175, 0.25)
    // Sage Green: oklch(0.68 0.08 135) -> rgba(180, 205, 175, 0.2)
    // Peach: oklch(0.92 0.03 55) -> rgba(245, 220, 210, 0.25)
    const blobs: Blob[] = [
      {
        x: width * 0.2,
        y: height * 0.3,
        vx: 0,
        vy: 0,
        radius: Math.min(width, height) * 0.32,
        color: "rgba(230, 205, 175, 0.22)", // Soft Gold
        delay: 0.03,
        friction: 0.92,
        angle: 0,
        driftSpeed: 0.001,
        driftRadius: 50,
      },
      {
        x: width * 0.8,
        y: height * 0.2,
        vx: 0,
        vy: 0,
        radius: Math.min(width, height) * 0.28,
        color: "rgba(180, 205, 175, 0.18)", // Sage Leaf Green
        delay: 0.015,
        friction: 0.94,
        angle: Math.PI / 3,
        driftSpeed: 0.0008,
        driftRadius: 40,
      },
      {
        x: width * 0.5,
        y: height * 0.7,
        vx: 0,
        vy: 0,
        radius: Math.min(width, height) * 0.36,
        color: "rgba(245, 220, 210, 0.24)", // Warm Rose/Peach
        delay: 0.02,
        friction: 0.93,
        angle: Math.PI * 1.2,
        driftSpeed: 0.0012,
        driftRadius: 60,
      },
      {
        x: width * 0.3,
        y: height * 0.8,
        vx: 0,
        vy: 0,
        radius: Math.min(width, height) * 0.22,
        color: "rgba(225, 210, 230, 0.16)", // Soft Lavender-clay
        delay: 0.025,
        friction: 0.91,
        angle: Math.PI * 0.7,
        driftSpeed: 0.0015,
        driftRadius: 35,
      },
    ];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-scale blob radii on resize
      blobs.forEach((b, i) => {
        const baseSize = i === 0 ? 0.32 : i === 1 ? 0.28 : i === 2 ? 0.36 : 0.22;
        b.radius = Math.min(width, height) * baseSize;
      });
    };

    window.addEventListener("resize", handleResize);

    // Render loop
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // We use standard composition since we want watercolor blending
      ctx.globalCompositeOperation = "source-over";

      blobs.forEach((b) => {
        // Floating organic drift logic
        b.angle += b.driftSpeed;
        const driftX = Math.cos(b.angle) * b.driftRadius;
        const driftY = Math.sin(b.angle) * b.driftRadius;

        // Target position defaults to floating drift around its base
        // (No cursor attraction following mouse)
        const targetX = b.x + driftX;
        const targetY = b.y + driftY;

        // Acceleration
        const ax = (targetX - b.x) * b.delay;
        const ay = (targetY - b.y) * b.delay;

        // Update velocity and position
        b.vx = (b.vx + ax) * b.friction;
        b.vy = (b.vy + ay) * b.friction;
        b.x += b.vx;
        b.y += b.vy;

        // Bounds correction (keep center of blob mostly in viewport)
        if (b.x < -b.radius / 2) b.x = -b.radius / 2;
        if (b.x > width + b.radius / 2) b.x = width + b.radius / 2;
        if (b.y < -b.radius / 2) b.y = -b.radius / 2;
        if (b.y > height + b.radius / 2) b.y = height + b.radius / 2;

        // Draw radial gradient representing the liquid watercolor blob
        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        gradient.addColorStop(0, b.color);
        gradient.addColorStop(0.5, b.color.replace(/[\d.]+\)$/, "0.08)"));
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70 mix-blend-multiply"
      style={{ backfaceVisibility: "hidden" }}
    />
  );
}

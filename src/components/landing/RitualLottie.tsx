import React, { useEffect, useRef, useState } from "react";

interface RitualLottieProps {
  url: string;
  className?: string;
}

export function RitualLottie({ url, className }: RitualLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    setLoading(true);
    setLoadFailed(false);

    let anim: any = null;
    let isDestroyed = false;

    // Attempt fetching the Lottie JSON file to prevent console errors and verify availability
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Lottie JSON from URL");
        return res.json();
      })
      .then((data) => {
        if (isDestroyed) return;

        // Dynamically import lottie-web only in the browser (client-side) to bypass SSR evaluation
        return import("lottie-web").then((LottieModule) => {
          if (isDestroyed || !containerRef.current) return;

          const lottieInstance = LottieModule.default || LottieModule;

          anim = lottieInstance.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: data,
          });
          setLoading(false);
        });
      })
      .catch((err) => {
        console.warn(
          "Lottie CDN failed or dynamic import rejected, rendering robust high-fidelity SVG fallback:",
          err,
        );
        if (!isDestroyed) {
          setLoadFailed(true);
          setLoading(false);
        }
      });

    return () => {
      isDestroyed = true;
      if (anim) {
        anim.destroy();
      }
    };
  }, [url]);

  if (loadFailed) {
    return (
      <div
        className={`${className} flex items-center justify-center relative overflow-hidden bg-foreground/[0.02] border border-border/20 rounded-2xl`}
      >
        {/* Glowing high-fidelity molecular network SVG fallback */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-[80%] h-[80%] text-[var(--gold)]/30"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="animate-pulse">
              <line
                x1="20"
                y1="50"
                x2="50"
                y2="20"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="50"
                y1="20"
                x2="80"
                y2="50"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="80"
                y1="50"
                x2="50"
                y2="80"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="50"
                y1="80"
                x2="20"
                y2="50"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.5" />
              <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" />

              <circle
                cx="50"
                cy="20"
                r="5"
                fill="currentColor"
                className="animate-[ping_3s_infinite_0s] fill-[var(--gold)]/80"
              />
              <circle cx="50" cy="20" r="4" fill="currentColor" className="fill-[var(--gold)]" />

              <circle
                cx="80"
                cy="50"
                r="5"
                fill="currentColor"
                className="animate-[ping_3s_infinite_0.75s] fill-[var(--gold)]/80"
              />
              <circle cx="80" cy="50" r="4" fill="currentColor" className="fill-[var(--gold)]" />

              <circle
                cx="50"
                cy="80"
                r="5"
                fill="currentColor"
                className="animate-[ping_3s_infinite_1.5s] fill-[var(--gold)]/80"
              />
              <circle cx="50" cy="80" r="4" fill="currentColor" className="fill-[var(--gold)]" />

              <circle
                cx="20"
                cy="50"
                r="5"
                fill="currentColor"
                className="animate-[ping_3s_infinite_2.25s] fill-[var(--gold)]/80"
              />
              <circle cx="20" cy="50" r="4" fill="currentColor" className="fill-[var(--gold)]" />

              <circle
                cx="50"
                cy="50"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-spin duration-10000"
              />
              <circle cx="50" cy="50" r="2" fill="currentColor" className="fill-[var(--gold)]/90" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-3 font-mono text-[9px] uppercase tracking-widest text-[var(--gold)]/70">
          Molecular Synthesis
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground font-mono tracking-widest bg-foreground/[0.01]">
          SYNTHESIZING...
        </div>
      )}
      <div ref={containerRef} className={className} />
    </div>
  );
}

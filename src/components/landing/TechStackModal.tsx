import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const techItems = [
  {
    pill: "Motion / Physics",
    pillBg: "bg-indigo-50 dark:bg-indigo-950/40",
    pillText: "text-indigo-600 dark:text-indigo-400",
    title: "GSAP",
    desc: "The industry standard. ScrollTrigger plugin powers most cinematic scroll reveals you see on premium sites.",
    footer: "Used by Apple, Stripe, Awwwards",
  },
  {
    pill: "Smooth scroll",
    pillBg: "bg-emerald-50 dark:bg-emerald-950/40",
    pillText: "text-emerald-600 dark:text-emerald-400",
    title: "Locomotive Scroll",
    desc: 'Replaces native scroll with momentum-based inertia — gives that silky "butter" feeling.',
    footer: "Used by Locomotive.ca, agencies",
  },
  {
    pill: "React / JS",
    pillBg: "bg-rose-50 dark:bg-rose-950/40",
    pillText: "text-rose-600 dark:text-rose-400",
    title: "Framer Motion",
    desc: "React-native animation library. 'whileInView' and 'useScroll' hooks make scroll animations trivial.",
    footer: "Used by Framer.com, Vercel",
  },
  {
    pill: "CSS-based",
    pillBg: "bg-blue-50 dark:bg-blue-950/40",
    pillText: "text-blue-600 dark:text-blue-400",
    title: "ScrollReveal / AOS",
    desc: "Lightweight drop-in libraries for simple fade-in/slide-up effects on scroll. Great starting point.",
    footer: "Used by marketing & portfolio sites",
  },
  {
    pill: "3D / WebGL",
    pillBg: "bg-amber-50 dark:bg-amber-950/40",
    pillText: "text-amber-600 dark:text-amber-400",
    title: "Three.js + R3F",
    desc: "For 3D scroll experiences. React Three Fiber is the React wrapper used in sites like Bruno Simon's.",
    footer: "Used by Bruno Simon, Active Theory",
  },
  {
    pill: "Native CSS",
    pillBg: "bg-green-50 dark:bg-green-950/40",
    pillText: "text-green-600 dark:text-green-400",
    title: "CSS Scroll Timeline",
    desc: "New native browser API — no JS needed. 'animation-timeline: scroll()' is gaining adoption fast.",
    footer: "Used by modern browsers, 2024+",
  },
];

export function TechStackModal({ isOpen, onClose }: TechStackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative bg-[var(--background)] border border-border/80 w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Header / Actions */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl md:text-3xl text-foreground">
                Cinematic Motion Stack
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 border border-border hover:bg-foreground/5 transition-colors focus:outline-none"
                aria-label="Close tech stack modal"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* 3x2 Grid of cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {techItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="bg-card border border-border/40 rounded-2xl p-5 flex flex-col justify-between hover:border-border transition-colors h-full group"
                >
                  <div>
                    {/* Pill label */}
                    <div className="flex">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full ${item.pillBg} ${item.pillText}`}
                      >
                        {item.pill}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg mt-4 group-hover:text-[var(--gold)] transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-6 pt-3 border-t border-border/10 font-medium">
                    {item.footer}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

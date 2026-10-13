import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TechStackModal } from "./TechStackModal";

export function Nav() {
  const [isTechOpen, setTechOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 1.45; // Appears soon after scroll enters the Hero section
      const scrollThreshold = window.innerHeight * 2.2; // Compact padding transition threshold

      if (window.scrollY > heroThreshold) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }

      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: showNav ? 0 : -100,
          opacity: showNav ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        id="site-nav"
        className="fixed top-0 left-0 right-0 w-full z-50"
      >
        <div
          className={`transition-all duration-300 flex items-start justify-between px-8 md:px-16 lg:px-24 bg-transparent ${
            isScrolled ? "py-4" : "py-7"
          }`}
        >
          {/* Logo on the left */}
          <a href="#" className="flex items-center gap-2 outline-none pt-0.5">
            <span className="font-sans uppercase font-bold tracking-[0.25em] text-sm lg:text-base text-foreground transition-colors">
              DEARSKIN<span className="text-muted-foreground/50 font-light mx-2">|</span>D
            </span>
          </a>

          {/* Right: Navigation links and CTA grouped together vertically */}
          <div className="flex flex-col items-end gap-2 pt-1 lg:pt-1.5">
            {/* Navigation links */}
            <nav className="hidden md:flex flex-col items-end gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {/* Row 1: Analysis Ritual Science */}
              <div className="flex items-center gap-8">
                {["Analysis", "Ritual", "Science"].map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    className="hover:text-foreground transition-colors outline-none"
                  >
                    {l}
                  </a>
                ))}
              </div>
              {/* Row 2: Journal Plans */}
              <div className="flex items-center gap-8">
                <a href="#journal" className="hover:text-foreground transition-colors outline-none">
                  Journal
                </a>
                <a
                  href="#plans"
                  className="hover:text-foreground transition-colors text-left outline-none uppercase font-semibold tracking-[0.2em]"
                >
                  Plans
                </a>
              </div>
            </nav>

            {/* Flat uppercase action text */}
            <a
              href="#cta"
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground hover:text-muted-foreground transition-colors outline-none"
            >
              Begin scan
            </a>
          </div>
        </div>
      </motion.header>

      <TechStackModal isOpen={isTechOpen} onClose={() => setTechOpen(false)} />
    </>
  );
}

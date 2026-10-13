import { motion } from "framer-motion";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function ScrollRevealText({
  text,
  className = "",
  delay = 0,
  once = false,
}: ScrollRevealTextProps) {
  // Split words by space
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      y: "115%",
      skewY: 4,
      opacity: 0,
    },
    visible: {
      y: 0,
      skewY: 0,
      opacity: 1,
      transition: {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-15%" }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.22em] py-[0.15em] -my-[0.15em] relative"
        >
          <motion.span variants={childVariants} className="inline-block origin-left">
            {word === "" ? "\u00A0" : word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

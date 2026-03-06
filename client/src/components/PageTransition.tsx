
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  variant?: "doors" | "unroll" | "fade";
}


function GoldenDoors({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 1 }}
    >

      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full"
        style={{
          background: "linear-gradient(90deg, oklch(0.08 0.005 285) 0%, oklch(0.12 0.01 85) 100%)",
          borderRight: "2px solid rgba(201,168,76,0.4)",
          boxShadow: "inset -20px 0 40px rgba(201,168,76,0.1)",
        }}
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
      >

        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-px h-1/2 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="w-6 h-6 border border-gold/30 rotate-45" />
        </div>
      </motion.div>


      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full"
        style={{
          background: "linear-gradient(270deg, oklch(0.08 0.005 285) 0%, oklch(0.12 0.01 85) 100%)",
          borderLeft: "2px solid rgba(201,168,76,0.4)",
          boxShadow: "inset 20px 0 40px rgba(201,168,76,0.1)",
        }}
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
      >

        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-px h-1/2 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="absolute left-12 top-1/2 -translate-y-1/2">
          <div className="w-6 h-6 border border-gold/30 rotate-45" />
        </div>
      </motion.div>


      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.6), transparent)",
          boxShadow: "0 0 30px rgba(201,168,76,0.3)",
        }}
        initial={{ opacity: 1, scaleY: 1 }}
        animate={{ opacity: 0, scaleY: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.div>
  );
}


function ScrollUnroll({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, oklch(0.06 0.005 285) 0%, oklch(0.1 0.01 85) 100%)",
        }}
        initial={{ clipPath: "inset(0 0 0 0)" }}
        animate={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
      >

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-4"
          style={{
            background: "linear-gradient(0deg, rgba(201,168,76,0.3), transparent)",
            borderBottom: "1px solid rgba(201,168,76,0.2)",
          }}
        />

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/30" />
          <div className="w-2 h-2 border border-gold/30 rotate-45" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/30" />
        </div>
      </motion.div>
    </motion.div>
  );
}


export default function PageTransition({ children, variant = "doors" }: PageTransitionProps) {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <>

      <AnimatePresence>
        {showOverlay && variant === "doors" && (
          <GoldenDoors onComplete={() => setShowOverlay(false)} />
        )}
        {showOverlay && variant === "unroll" && (
          <ScrollUnroll onComplete={() => setShowOverlay(false)} />
        )}
      </AnimatePresence>


      <motion.div
        initial={{
          opacity: 0,
          y: variant === "unroll" ? 30 : 0,
          scale: variant === "doors" ? 0.98 : 1,
          filter: "blur(5px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          y: -20,
          filter: "blur(5px)",
        }}
        transition={{
          duration: 0.8,
          delay: variant === "doors" ? 0.5 : 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full flex-grow flex flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}

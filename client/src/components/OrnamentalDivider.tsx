
import { motion } from "framer-motion";

interface OrnamentalDividerProps {
  className?: string;
}

export default function OrnamentalDivider({ className = "" }: OrnamentalDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center justify-center gap-4 ${className}`}
    >
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-gold/40" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold/50">
        <path
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-gold/40" />
    </motion.div>
  );
}

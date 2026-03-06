import { motion } from "framer-motion";

interface TextSplitProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function TextSplit({ text, className = "", delay = 0 }: TextSplitProps) {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: delay * 0.1 }
        })
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100
            }
        },
        hidden: {
            opacity: 0,
            y: 40,
            rotate: 5,
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className={`flex flex-wrap gap-x-2 ${className}`}
        >
            {words.map((word, idx) => (
                <motion.span variants={child} key={idx} className="block overflow-hidden pb-2">
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}

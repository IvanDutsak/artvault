import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticProps {
    children: React.ReactElement;
    intensity?: number;
    actionArea?: "element" | "parent";
}

export default function Magnetic({ children, intensity = 0.5, actionArea = "element" }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const position = {
        x: useSpring(0, springConfig),
        y: useSpring(0, springConfig)
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        position.x.set(middleX * intensity);
        position.y.set(middleY * intensity);
    };

    const reset = () => {
        setIsHovered(false);
        position.x.set(0);
        position.y.set(0);
    };

    const handleMouseEnter = () => setIsHovered(true);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={reset}
            animate={{
                scale: isHovered ? 1.05 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ display: "inline-block", position: "relative" } as any}
        >
            <motion.div style={{ x: position.x, y: position.y }}>
                {children}
            </motion.div>
        </motion.div>
    );
}

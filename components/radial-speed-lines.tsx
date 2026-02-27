'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function RadialSpeedLines() {
    const [lines, setLines] = useState<{ id: number; angle: number; length: number; thickness: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate random lines radiating from center
        const newLines = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            angle: Math.random() * 360,
            length: 50 + Math.random() * 100, // percentage of viewport
            thickness: 1 + Math.random() * 5,
            delay: Math.random() * 0.5,
        }));
        setLines(newLines);
    }, []);

    return (
        <div className="absolute flex items-center justify-center pointer-events-none inset-0 w-[200vw] h-[200vw] min-w-[2000px] min-h-[2000px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden z-0 mix-blend-multiply opacity-80">
            {lines.map((line) => (
                <motion.div
                    key={line.id}
                    className="absolute bg-black origin-left"
                    style={{
                        height: `${line.thickness}px`,
                        width: `${line.length}%`,
                        top: '50%',
                        left: '50%',
                        rotate: `${line.angle}deg`,
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0], x: ['20%', '100%', '150%'] }}
                    transition={{
                        duration: 0.8 + Math.random() * 0.6,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 2,
                        delay: line.delay,
                        ease: "easeOut"
                    }}
                />
            ))}

            {/* Center mask so text isn't obscured by lines */}
            <div className="absolute w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] bg-white rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function CenterPanel() {
    // State for block position (0: left, 1: grabbed, 2: right)
    const [blockPos, setBlockPos] = useState(0);

    // Animation controls
    const baseControls = useAnimation();
    const lowerArmControls = useAnimation();
    const upperArmControls = useAnimation();
    const blockControls = useAnimation();

    useEffect(() => {
        let isSubscribed = true;

        const runSequence = async () => {
            while (isSubscribed) {
                // 1. Move to left block
                await Promise.all([
                    baseControls.start({ rotate: -45, transition: { duration: 1.5, ease: "easeInOut" } }),
                    lowerArmControls.start({ rotate: -20, transition: { duration: 1.5, ease: "easeInOut" } }),
                    upperArmControls.start({ rotate: 40, transition: { duration: 1.5, ease: "easeInOut" } })
                ]);

                await new Promise(r => setTimeout(r, 500));

                // 2. Grab block
                setBlockPos(1);

                await new Promise(r => setTimeout(r, 500));

                // 3. Lift and move to right
                await Promise.all([
                    baseControls.start({ rotate: 45, transition: { duration: 2, ease: "easeInOut" } }),
                    lowerArmControls.start({ rotate: 10, transition: { duration: 2, ease: "easeInOut" } }),
                    upperArmControls.start({ rotate: 10, transition: { duration: 2, ease: "easeInOut" } }),
                    blockControls.start({
                        x: 230, y: -20,
                        transition: { duration: 2, ease: "easeInOut" }
                    })
                ]);

                await new Promise(r => setTimeout(r, 500));

                // 4. Drop block
                setBlockPos(2);

                await new Promise(r => setTimeout(r, 500));

                // 5. Reset block silently back to left after a pause
                await new Promise(r => setTimeout(r, 1000));
                setBlockPos(0);
                blockControls.set({ x: 0, y: 0 });
            }
        };

        runSequence();

        return () => {
            isSubscribed = false;
        };
    }, [baseControls, lowerArmControls, upperArmControls, blockControls]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#fafafa]">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-2 pl-2 opacity-80 absolute top-2 left-2 z-10">3D SIMULATOR AREA</h2>

            {/* 3D Scene Container built with SVG */}
            <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                {/* Perspective Grid Background */}
                <g stroke="#ddd" strokeWidth="1">
                    <g transform="translate(400, 350) scale(1, 0.5) rotate(45)">
                        {[...Array(41)].map((_, i) => (
                            <React.Fragment key={i}>
                                <line x1={-800} y1={i * 40 - 800} x2={800} y2={i * 40 - 800} />
                                <line x1={i * 40 - 800} y1={-800} x2={i * 40 - 800} y2={800} />
                            </React.Fragment>
                        ))}
                    </g>
                </g>

                <ellipse cx="400" cy="400" rx="80" ry="30" fill="rgba(0,0,0,0.15)" filter="blur(4px)" />

                {/* --- SCENE OBJECTS --- */}

                {/* Left Orange Cube (Animated or static depending on state) */}
                {blockPos === 0 && (
                    <g transform="translate(230, 340) scale(1.2)">
                        <ellipse cx="30" cy="50" rx="35" ry="12" fill="rgba(0,0,0,0.15)" filter="blur(2px)" />
                        <polygon points="0,15 30,0 60,15 30,30" fill="#e89e5d" stroke="#bd6e29" strokeWidth="1" />
                        <polygon points="0,15 30,30 30,70 0,55" fill="#d47926" stroke="#bd6e29" strokeWidth="1" />
                        <polygon points="30,30 60,15 60,55 30,70" fill="#a45511" stroke="#bd6e29" strokeWidth="1" />
                    </g>
                )}

                {/* Right Target Box (Static outline or base) */}
                <g transform="translate(520, 360) scale(1.2)">
                    <polygon points="0,15 30,0 60,15 30,30" fill="transparent" stroke="#aaa" strokeWidth="1" strokeDasharray="4 4" />
                </g>

                {/* Right Orange Cube (Visible when dropped) */}
                {blockPos === 2 && (
                    <g transform="translate(520, 340) scale(1.2)">
                        <ellipse cx="30" cy="50" rx="35" ry="12" fill="rgba(0,0,0,0.15)" filter="blur(2px)" />
                        <polygon points="0,15 30,0 60,15 30,30" fill="#e89e5d" stroke="#bd6e29" strokeWidth="1" />
                        <polygon points="0,15 30,30 30,70 0,55" fill="#d47926" stroke="#bd6e29" strokeWidth="1" />
                        <polygon points="30,30 60,15 60,55 30,70" fill="#a45511" stroke="#bd6e29" strokeWidth="1" />
                    </g>
                )}

                {/* ROBOT ARM */}
                <motion.g transform="translate(400, 380)">

                    <path d="M-50,0 L-50,-40 A50,20 0 0,0 50,-40 L50,0 A50,20 0 0,1 -50,0 Z" fill="#999" stroke="#666" strokeWidth="1.5" />
                    <ellipse cx="0" cy="-40" rx="50" ry="20" fill="#aaa" stroke="#666" strokeWidth="1.5" />

                    {/* Base rotation group */}
                    <motion.g animate={baseControls} style={{ transformOrigin: "0px -40px" }}>
                        <path d="M-25,-45 L-25,-100 A25,10 0 0,0 25,-100 L25,-45 Z" fill="#888" stroke="#555" strokeWidth="1.5" />
                        <ellipse cx="0" cy="-100" rx="25" ry="10" fill="#777" stroke="#555" strokeWidth="1.5" />

                        {/* Lower Arm rotation group */}
                        <motion.g animate={lowerArmControls} style={{ transformOrigin: "0px -100px" }}>
                            <polygon points="-18,-90 18,-85 18,-200 -18,-195" fill="#d47926" stroke="#a45511" strokeWidth="1" />
                            <polygon points="18,-85 30,-95 30,-210 18,-200" fill="#a45511" stroke="#844511" strokeWidth="1" />

                            <path d="M-30,-195 A18,35 0 0,0 -30,-255 L30,-255 A18,35 0 0,1 30,-195 Z" fill="#888" stroke="#555" strokeWidth="1" />
                            <ellipse cx="-30" cy="-225" rx="12" ry="30" fill="#aaa" stroke="#555" strokeWidth="1.5" />
                            <ellipse cx="-30" cy="-225" rx="5" ry="12" fill="#666" />

                            {/* Upper Arm rotation group */}
                            <motion.g animate={upperArmControls} style={{ transformOrigin: "0px -225px" }}>
                                <polygon points="8,-220 20,-230 65,-160 53,-150" fill="#a45511" stroke="#844511" strokeWidth="1" />
                                <polygon points="-8,-200 8,-220 53,-150 40,-130" fill="#e89e5d" stroke="#c47926" strokeWidth="1" />
                                <polygon points="-15,-215 -8,-200 53,-150 45,-165" fill="#f4b574" stroke="#c47926" strokeWidth="1" />

                                <path d="M40,-130 L53,-150 C58,-145 60,-138 56,-130 L42,-110 C38,-115 36,-122 40,-130 Z" fill="#777" stroke="#444" strokeWidth="1.5" />
                                <ellipse cx="48" cy="-130" rx="10" ry="18" fill="#666" stroke="#444" strokeWidth="1" transform="rotate(35 48 -130)" />

                                <polygon points="35,-125 22,-95 28,-90 40,-115" fill="#555" stroke="#333" strokeWidth="1" />
                                <polygon points="52,-140 65,-110 59,-105 48,-130" fill="#555" stroke="#333" strokeWidth="1" />

                                {/* Grabbed Block */}
                                {blockPos === 1 && (
                                    <g transform="translate(10, -50) scale(0.6)">
                                        <polygon points="0,15 30,0 60,15 30,30" fill="#e89e5d" stroke="#bd6e29" strokeWidth="1" />
                                        <polygon points="0,15 30,30 30,70 0,55" fill="#d47926" stroke="#bd6e29" strokeWidth="1" />
                                        <polygon points="30,30 60,15 60,55 30,70" fill="#a45511" stroke="#bd6e29" strokeWidth="1" />
                                    </g>
                                )}
                            </motion.g>
                        </motion.g>
                    </motion.g>

                </motion.g>
            </svg>

            {/* Decorative center frame crosses */}
            <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-gray-400"></div>
            <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-gray-400"></div>
            <div className="absolute top-0 left-1/2 h-4 w-[1px] bg-gray-400"></div>
            <div className="absolute bottom-0 left-1/2 h-4 w-[1px] bg-gray-400"></div>
        </div>
    );
}

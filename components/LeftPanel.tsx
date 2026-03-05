'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const Dial = ({ value, label, max = 180, icon }: { value: number, label: string, max?: number, icon?: React.ReactNode }) => {
    const percentage = value / max;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - percentage * circumference;

    // Calculate end dot position
    const angle = (percentage * 360) - 90;
    const dotX = 50 + radius * Math.cos(angle * Math.PI / 180);
    const dotY = 50 + radius * Math.sin(angle * Math.PI / 180);

    return (
        <div className="relative w-28 h-28 flex flex-col items-center">
            <div className="absolute top-0 right-2 w-6 h-6 flex justify-center items-center text-gray-500">
                {icon}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider self-end mr-4 mb-[-10px] z-10">{label}</div>
            <div className="relative w-full h-full">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r={radius} stroke="#ccc" strokeWidth="4" fill="none" />
                    <circle
                        cx="50" cy="50" r={radius}
                        stroke="var(--color-accent)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out"
                    />
                    <circle cx={dotX} cy={dotY} r="3" fill="var(--color-accent)" className="transition-all duration-300 ease-out" />
                    <circle cx="50" cy="50" r={radius - 6} stroke="#ccc" strokeWidth="1" fill="none" strokeDasharray="2, 6" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <span className="font-mono-numbers text-xl font-bold leading-none">{value.toFixed(1)}°</span>
                </div>
                <div className="absolute bottom-0 left-2 text-[8px] font-bold">0</div>
                <div className="absolute bottom-0 right-2 text-[8px] font-bold">180°</div>
            </div>
        </div>
    );
};

export default function LeftPanel() {
    const [joints, setJoints] = useState([45.0, 90.0, 135.0]);
    const [simForce, setSimForce] = useState("65.2");
    const [forceData, setForceData] = useState<{ time: string, force: number }[]>([]);

    useEffect(() => {
        // Initial data hydration for force chart
        const initialData = [];
        for (let i = 0; i < 20; i++) {
            initialData.push({ time: i.toString(), force: Math.random() * 80 + 20 });
        }
        setForceData(initialData);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // Wiggle joints slightly automatically
            setJoints(prev => [
                Math.min(180, Math.max(0, prev[0] + (Math.random() - 0.5) * 5)),
                Math.min(180, Math.max(0, prev[1] + (Math.random() - 0.5) * 5)),
                Math.min(180, Math.max(0, prev[2] + (Math.random() - 0.5) * 5)),
            ]);

            // Update Force overlay readout
            setSimForce((Math.random() * 80 + 20).toFixed(1));

            // Advance Force Chart Data sporadically
            if (Math.random() > 0.5) {
                setForceData(prev => {
                    const newForce = Math.random() * 80 + 20;
                    const newArr = [...prev.slice(1)];
                    newArr.push({ time: Date.now().toString(), force: newForce });
                    return newArr;
                });
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* JOINT ANGLES */}
            <div className="flex-1 tech-border tech-border-corners bg-panel p-3 flex flex-col min-h-[300px]">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-4 pl-2 opacity-80">JOINT ANGLES</h2>

                <div className="flex flex-wrap justify-between items-center relative gap-y-4">
                    <Dial value={joints[0]} label="JOINT 1" icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 6 4-2-2 6 5 2v4l-6-2-4 5-3-4-4 2 1-7-5-3 6-1 2-6z" /></svg>
                    } />

                    <div className="w-16 h-28 flex justify-center items-center opacity-40">
                        {/* Robot body icon mock */}
                        <svg viewBox="0 0 100 150" fill="currentColor">
                            <rect x="30" y="20" width="40" height="40" rx="5" />
                            <rect x="25" y="65" width="50" height="60" rx="5" />
                            <rect x="10" y="65" width="10" height="50" rx="2" />
                            <rect x="80" y="65" width="10" height="50" rx="2" />
                            <rect x="35" y="130" width="12" height="20" rx="2" />
                            <rect x="53" y="130" width="12" height="20" rx="2" />
                        </svg>
                    </div>

                    <div className="w-full flex justify-between">
                        <Dial value={joints[1]} label="JOINT 2" icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="6" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
                        } />
                        <Dial value={joints[2]} label="JOINT 3" />
                    </div>
                </div>
            </div>

            {/* FORCE READOUT */}
            <div className="h-[250px] tech-border tech-border-corners tech-border-bottom-corners bg-panel p-3 flex flex-col relative">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-2 pl-2 opacity-80 z-10">FORCE READOUT</h2>

                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorForce" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                            <XAxis dataKey="time" hide />
                            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} hide domain={[0, 100]} />
                            <Area
                                type="monotone"
                                dataKey="force"
                                stroke="var(--color-accent)"
                                fillOpacity={1}
                                fill="url(#colorForce)"
                                strokeWidth={2}
                                dot={{ stroke: 'var(--color-accent)', strokeWidth: 1, r: 2, fill: '#fff' }}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Force value overlay */}
                    <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 w-16 h-20 bg-orange-400 opacity-90 flex flex-col items-center justify-start py-2 font-mono-numbers">
                        <span className="text-black font-bold">{simForce} N</span>
                    </div>
                </div>
            </div>

            {/* MANUAL CONTROL */}
            <div className="h-[150px] tech-border tech-border-bottom-corners bg-panel p-3 flex flex-col justify-between">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-2 pl-2 opacity-80">MANUAL CONTROL</h2>

                <div className="flex flex-col gap-3 px-2">
                    {[{ label: 'JOINT 1', value: joints[0] }, { label: 'JOINT 2', value: joints[1] }, { label: 'JOINT 3', value: joints[2] }].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                            <span className="w-16">{item.label}</span>
                            <div className="flex-1 h-3 bg-gray-300 relative rounded-full overflow-hidden flex items-center">
                                <div
                                    className="absolute left-0 h-1 bg-orange-400 top-1/2 -mt-0.5 rounded-l-full transition-all duration-300 ease-out"
                                    style={{ width: `${(item.value / 180) * 100}%` }}
                                ></div>
                                <div
                                    className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white absolute shadow-sm transition-all duration-300 ease-out"
                                    style={{ left: `calc(${(item.value / 180) * 100}% - 8px)` }}
                                ></div>
                                {/* Track line */}
                                <div className="w-full border-t border-gray-400 absolute h-0 z-0"></div>
                            </div>
                            <span className="w-12 text-right font-mono-numbers">{((item.value / 180) * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

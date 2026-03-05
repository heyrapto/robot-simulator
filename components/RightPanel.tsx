'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line } from 'recharts';
import { Play, Pause, FastForward, Square } from 'lucide-react';

export default function RightPanel() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [timeMs, setTimeMs] = useState(81450); // Starting at 02:15.450 roughly 135450ms

    // Dynamic velocity data
    const [velocityData, setVelocityData] = useState<{ time: string, speed: number, avg: number }[]>([]);
    const [currentSpeed, setCurrentSpeed] = useState("0.85");
    const [maxSpeed, setMaxSpeed] = useState("1.20");
    const [avgSpeed, setAvgSpeed] = useState("0.46");

    // Terminal Logs
    const [logs, setLogs] = useState([
        "MoveTo Target",
        "Wait 500ms",
        "Grasp: Success",
        "Wait 500ms",
        "SetVelocity 0.5",
        "RotateJoint 1 45 deg",
        "CheckSensor Status",
    ]);

    useEffect(() => {
        // Initial data hydration
        const initialData = [];
        let runningSum = 0;
        for (let i = 0; i < 20; i++) {
            const speed = Math.random() * 80 + 10;
            runningSum += speed;
            initialData.push({ time: i.toString(), speed, avg: runningSum / (i + 1) });
        }
        setVelocityData(initialData);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying) {
            interval = setInterval(() => {
                // Advance Time
                setTimeMs(prev => prev + 50);

                // Advance Chart Data sporadically
                if (Math.random() > 0.5) {
                    setVelocityData(prev => {
                        const newSpeed = Math.random() * 80 + 10;
                        const newArr = [...prev.slice(1)];
                        const newAvg = newArr.reduce((acc, curr) => acc + curr.speed, 0) / newArr.length;
                        newArr.push({ time: Date.now().toString(), speed: newSpeed, avg: newAvg });

                        // Update Text Stats
                        setCurrentSpeed((newSpeed / 100).toFixed(2));
                        const newMax = Math.max(...newArr.map(d => d.speed)) / 100;
                        if (newMax > parseFloat(maxSpeed)) setMaxSpeed(newMax.toFixed(2));
                        setAvgSpeed((newAvg / 100).toFixed(2));

                        return newArr;
                    });
                }

                // Sporadically add logs
                if (Math.random() > 0.98) {
                    const logTemplates = ["Adjusting trajectory...", "Calibrating sensor...", "Torque limit: O.K.", "Calculating IK...", "Executing Move..."];
                    setLogs(prev => {
                        const newLogs = [...prev, logTemplates[Math.floor(Math.random() * logTemplates.length)]];
                        if (newLogs.length > 8) newLogs.shift();
                        return newLogs;
                    });
                }

            }, 50);
        }

        return () => clearInterval(interval);
    }, [isPlaying, maxSpeed]);

    const formatTime = (ms: number) => {
        const mins = Math.floor(ms / 60000).toString().padStart(2, '0');
        const secs = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
        const millis = (ms % 1000).toString().padStart(3, '0');
        return `${mins}:${secs}.${millis}`;
    };

    return (
        <>
            {/* VELOCITY METRICS */}
            <div className="h-[250px] tech-border tech-border-corners bg-panel p-3 flex flex-col pt-4 relative">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-2 pl-2 opacity-80 absolute top-2 left-2 z-10">VELOCITY METRICS</h2>

                {/* Speed Readouts */}
                <div className="flex justify-between items-end px-2 mt-4 mb-2">
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold tracking-widest uppercase">SPEED:</span>
                        <span className="text-4xl font-mono-numbers font-bold leading-none tracking-tighter w-24">{currentSpeed}</span>
                        <span className="text-sm font-bold">m/s</span>
                    </div>
                    <div className="flex flex-col text-[10px] font-bold tracking-wider font-mono-numbers text-right opacity-70">
                        <span>MAX: {maxSpeed} m/s</span>
                        <span>AVG: {avgSpeed} m/s</span>
                    </div>
                </div>

                {/* Chart */}
                <div className="flex-1 w-full relative -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={velocityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.6} />
                                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                            <XAxis dataKey="time" hide />
                            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} hide domain={[0, 100]} />

                            {/* Average reference line (dashed) */}
                            <Line
                                type="monotone"
                                dataKey="avg"
                                stroke="#888"
                                strokeWidth={1}
                                strokeDasharray="3 3"
                                dot={false}
                                isAnimationActive={false}
                            />
                            {/* Actual speed area */}
                            <Area
                                type="monotone"
                                dataKey="speed"
                                stroke="var(--color-accent)"
                                fillOpacity={1}
                                fill="url(#colorVelocity)"
                                strokeWidth={2}
                                dot={{ stroke: 'var(--color-accent)', strokeWidth: 1, r: 1, fill: '#fff' }}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Frame decorative corners */}
                    <div className="absolute top-0 left-4 w-2 h-2 border-t-2 border-l-2 border-gray-400 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-400 pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-gray-400 pointer-events-none"></div>
                    <div className="absolute bottom-4 right-0 w-2 h-2 border-b-2 border-r-2 border-gray-400 pointer-events-none"></div>
                </div>
            </div>

            {/* TIME CONTROL */}
            <div className="h-[180px] tech-border bg-panel p-3 flex flex-col items-center justify-center relative">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-2 pl-2 opacity-80 absolute top-2 left-2 z-10">TIME CONTROL</h2>

                <div className="mt-4 flex flex-col items-center">
                    <div className="text-5xl font-mono-numbers font-bold leading-none tracking-tighter w-48 text-center">{formatTime(timeMs)}</div>
                    <div className="text-xs font-bold tracking-widest uppercase mt-1 opacity-70">{isPlaying ? 'PLAYBACK' : 'PAUSED'}</div>
                </div>

                <div className="flex gap-3 my-4">
                    <button onClick={() => setIsPlaying(true)} className={`w-10 h-8 flex items-center justify-center rounded-sm transition-colors ${isPlaying ? 'bg-orange-400 text-black' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
                        <Play size={18} fill="currentColor" />
                    </button>
                    <button onClick={() => setIsPlaying(false)} className={`w-10 h-8 flex items-center justify-center rounded-sm transition-colors ${!isPlaying ? 'bg-orange-400 text-black' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
                        <Pause size={18} fill="currentColor" />
                    </button>
                    <button className="w-10 h-8 bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-gray-700 rounded-sm">
                        <FastForward size={18} fill="currentColor" />
                    </button>
                    <button onClick={() => { setIsPlaying(false); setTimeMs(0); }} className="w-10 h-8 bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-gray-700 rounded-sm">
                        <Square size={16} fill="currentColor" />
                    </button>
                </div>

                <div className="w-full px-4 flex flex-col mt-1">
                    <div className="w-full h-1 bg-gray-300 relative rounded-full flex items-center">
                        <div className="absolute left-0 h-1 bg-orange-400 rounded-l-full" style={{ width: `${(timeMs % 60000) / 60000 * 100}%` }}></div>
                        <div className="w-3 h-3 bg-orange-500 rounded-full absolute shadow-sm border border-white" style={{ left: `calc(${(timeMs % 60000) / 60000 * 100}% - 6px)` }}></div>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase mt-2 opacity-70">
                        SIM SPEED: 1X
                    </div>
                </div>
            </div>

            {/* COMMAND TERMINAL */}
            <div className="flex-1 tech-border tech-border-bottom-corners bg-panel p-3 relative overflow-hidden flex flex-col">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-3 pl-2 opacity-80 z-10 w-full bg-panel">COMMAND TERMINAL</h2>

                <div className="flex-1 overflow-y-auto font-mono-numbers text-xs leading-relaxed opacity-90 pl-2 flex flex-col justify-end">
                    {logs.map((log, idx) => (
                        <div key={idx} className="mb-1 animate-pulse" style={{ animationDuration: '0.3s', animationIterationCount: 1 }}><span className="text-gray-500 mr-2">{'>'} {'>'}</span>{log}</div>
                    ))}
                    {/* Blinking cursor */}
                    <div className="mt-1 flex text-orange-500 animate-pulse">
                        <span className="text-gray-500 mr-2">{'>'} {'>'}</span>
                        <span className="w-2 h-4 bg-orange-500 inline-block"></span>
                    </div>
                </div>
            </div>
        </>
    );
}

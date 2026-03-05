'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Bluetooth, Wifi, Signal, UploadCloud, BatteryCharging, Settings, LogOut, Bot } from "lucide-react";

export default function Header() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' AM');
            setDate(now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'));
        };

        updateTime(); // initial
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-[90px] w-full flex-shrink-0 flex items-stretch">
            {/* Left Section - Avatar & Connection */}
            <div className="w-[320px] flex items-center bg-[#e6e8e6] tech-border tech-border-corners tech-border-bottom-corners pr-4 pl-0 py-2 relative mr-[14px]">
                {/* Slanted right edge effect using an absolute pseudo-element overlay if needed, or CSS clip-path */}
                <div style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }} className="w-full h-full absolute top-0 left-0 bg-[#e6e8e6] z-0"></div>

                <div className="relative z-10 flex w-full h-full items-center">
                    {/* Avatar Area */}
                    <div className="w-16 h-16 rounded-full border border-gray-400 flex items-center justify-center bg-gray-100 ml-2 shadow-inner">
                        <Bot size={40} className="text-gray-500" strokeWidth={1} />
                    </div>

                    <div className="ml-4 flex flex-col justify-center h-full flex-1">
                        {/* Top Row Icons */}
                        <div className="flex gap-2 text-gray-500 mb-2">
                            <span className="w-4 h-4 text-gray-300"><Mic size={16} /></span>
                            <span className="w-4 h-4"><Volume2 size={16} /></span>
                            <span className="w-4 h-4"><Bluetooth size={16} /></span>
                            <span className="w-4 h-4"><Wifi size={16} /></span>
                            <span className="w-4 h-4"><Signal size={16} /></span>
                            <span className="w-4 h-4 text-gray-300"><UploadCloud size={16} /></span>
                        </div>
                        {/* Bottom Row Connection Status */}
                        <div className="flex items-center text-xs font-bold leading-none tracking-wider gap-2">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <div className="flex flex-col uppercase text-[10px]">
                                    <span className="text-green-600">GREEN</span>
                                    <span>CONNECTED</span>
                                </div>
                            </div>
                            <div className="flex-1 flex justify-end items-center pr-4">
                                <BatteryCharging size={18} className="text-gray-600" />
                                <div className="w-[30px] h-[10px] border border-gray-400 ml-1 rounded-[1px] p-[1px] flex">
                                    <div className="h-full bg-orange-400 w-[70%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Section - Timing & Status */}
            <div className="flex-1 flex flex-col tech-border tech-border-bottom-corners bg-[#e6e8e6] relative overflow-hidden">
                {/* Decorative lines (mocked via SVG background) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.1) 100%), repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.5) 10px, rgba(0,0,0,0.5) 11px)' }}></div>

                {/* Top Status Bar */}
                <div className="h-6 w-full flex justify-center items-center gap-4 text-[10px] font-bold tracking-widest uppercase relative z-10">
                    <div className="bg-black text-orange-400 px-3 py-[2px] animate-pulse">SIMULATION RUNNING</div>
                    <div>STATUS: <span className="text-orange-400">OPTIMAL</span></div>
                    <div>SYSTEM LOAD: <span className="text-orange-400">38%</span></div>
                </div>

                {/* Time and Date */}
                <div className="flex-1 flex items-center justify-center gap-8 relative z-10">
                    <div className="text-5xl font-mono-numbers font-bold tracking-tighter text-gray-800 w-48 text-right">
                        {time || "00:00:00 AM"}
                    </div>
                    {/* Slanted divider */}
                    <div className="w-[2px] h-12 bg-gray-400 rotate-12"></div>
                    <div className="text-3xl font-mono-numbers font-bold tracking-tight text-gray-600 w-48">
                        {date || "00.00.0000"}
                    </div>

                    {/* Decorative background numbers */}
                    <div className="absolute right-4 bottom-1 text-xs font-mono-numbers font-bold opacity-20 truncate w-32 text-right">
                        SYS.ID.9982.X
                    </div>
                </div>
            </div>

            {/* Right Section - Settings & Logout */}
            <div className="w-[320px] ml-[14px] flex items-center justify-end gap-3 h-full tech-border tech-border-corners bg-[#e6e8e6] px-4">
                <button className="tech-button bg-orange-400 hover:bg-orange-500 text-black px-4 py-1 text-sm uppercase tracking-wider relative h-8 rounded-sm inline-flex items-center">
                    SETTINGS <Settings size={14} className="ml-1" />
                </button>
                <button className="tech-button bg-orange-400 hover:bg-orange-500 text-black px-4 py-1 text-sm uppercase tracking-wider h-8 rounded-sm inline-flex items-center">
                    LOGOUT <LogOut size={14} className="ml-1" />
                </button>
            </div>
        </div>
    );
}

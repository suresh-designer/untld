'use client';

import { RadialSpeedLines } from "./radial-speed-lines";
import { UnifiedInput } from "./unified-input";
import { Button } from "./ui/button";
import { LogIn, Sparkles, Zap, Image as ImageIcon, Type, Link as LinkIcon, Palette } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function LandingPage() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-white text-black selection:bg-[#E0FF22]">

            {/* Top Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-0 left-0 right-0 p-6 md:p-8 flex items-center justify-between z-30 mx-auto w-full max-w-7xl"
            >
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-black flex items-center justify-center transform -skew-x-12">
                        <span className="text-white font-black text-2xl italic">U</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic ml-1">Untld</span>
                </div>
                <Link href="/login">
                    <Button className="rounded-none px-6 py-5 bg-black text-white hover:bg-black/80 font-bold uppercase tracking-widest text-xs border-2 border-black transform transition hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <LogIn className="h-4 w-4 mr-2" />
                        Log in
                    </Button>
                </Link>
            </motion.nav>

            {/* Explosive Hero Section */}
            <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center min-h-[90vh] pt-20 pb-10 px-4">

                {/* Background Speed Lines */}
                <RadialSpeedLines />

                <div className="relative z-10 text-center w-full max-w-5xl mx-auto flex flex-col items-center">

                    {/* Small pre-title */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 flex items-center gap-3 bg-black text-white px-4 py-1.5 transform -skew-x-12"
                    >
                        <Zap className="h-4 w-4 text-[#F4F820]" fill="#F4F820" />
                        <span className="text-sm font-bold uppercase tracking-[0.2em] italic">The Ultimate</span>
                    </motion.div>

                    {/* MASSIVE TITLES */}
                    <div className="relative w-full max-w-[800px] h-[300px] md:h-[400px] flex items-center justify-center mx-auto mt-4 mb-10">

                        {/* UNTLD Layered Text */}
                        <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 flex ml-[-20px]"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: -2 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                        >
                            <span className="text-[120px] md:text-[180px] font-black uppercase leading-none tracking-tighter text-black mix-blend-normal relative z-10">
                                U
                            </span>
                            <div className="absolute inset-0 bg-[#E0FF22] -z-10 transform scale-90 translate-y-4 -translate-x-2 w-[60%] h-[80%]" />

                            <span className="text-[120px] md:text-[180px] font-black uppercase leading-none tracking-tighter text-black relative z-10 -ml-4">
                                N
                            </span>
                            <div className="absolute inset-0 bg-[#E3A8F9] -z-10 transform scale-90 translate-y-6 translate-x-[30%] w-[50%] h-[70%]" />

                            <span className="text-[120px] md:text-[180px] font-black uppercase leading-none tracking-tighter text-black relative z-10 -ml-2">
                                T
                            </span>
                            <div className="absolute inset-0 bg-[#85D6A0] -z-10 transform scale-90 translate-y-4 translate-x-[60%] w-[40%] h-[85%]" />

                            <span className="text-[120px] md:text-[180px] font-black uppercase leading-none tracking-tighter text-black relative z-10 -ml-4">
                                L
                            </span>
                            <div className="absolute inset-0 bg-[#85CEF3] -z-10 transform scale-90 translate-y-8 translate-x-[85%] w-[40%] h-[75%]" />

                            <span className="text-[120px] md:text-[180px] font-black uppercase leading-none tracking-tighter text-black relative z-10 -ml-2">
                                D
                            </span>
                            <div className="absolute inset-0 bg-[#F48B47] -z-10 transform scale-90 translate-y-2 translate-x-[110%] w-[50%] h-[90%]" />
                        </motion.div>

                        {/* MOODBOARD Layered Text */}
                        <motion.div
                            className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 flex items-center z-20"
                            initial={{ scale: 0, rotate: 10, y: 50 }}
                            animate={{ scale: 1, rotate: 2, y: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
                        >
                            <div className="bg-black text-white px-6 py-2 flex items-center justify-center border-4 border-white shadow-[8px_8px_0px_0px_rgba(227,168,249,1)]">
                                <span className="text-[50px] md:text-[90px] font-black uppercase tracking-widest leading-none whitespace-nowrap">
                                    MOODBOARD
                                </span>
                            </div>
                        </motion.div>

                        {/* Decorator Squiggles */}
                        <motion.svg width="100" height="40" viewBox="0 0 100 40" className="absolute bottom-[-10px] left-[-20px] -z-1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                        >
                            <path d="M5 20 Q 20 5, 40 20 T 80 20" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" />
                        </motion.svg>
                        <motion.svg width="60" height="60" viewBox="0 0 60 60" className="absolute top-[20px] right-[-30px] -z-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 1.2 }}
                        >
                            <path d="M10 30 L50 30 M30 10 L30 50 M15 15 L45 45 M15 45 L45 15" stroke="black" strokeWidth="6" strokeLinecap="round" />
                        </motion.svg>
                    </div>

                    {/* The Hero Input */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                        className="w-full relative group max-w-3xl mt-12"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#E0FF22] via-[#E3A8F9] to-[#85CEF3] blur-lg opacity-30 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />

                        <div
                            className="w-full relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl bg-white border-4 border-black group-focus-within:translate-x-[2px] group-focus-within:translate-y-[2px] group-focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                            style={{
                                '--muted': 'oklch(1 0 0)',
                                '--border': 'oklch(0 0 0)',
                                '--background': 'oklch(1 0 0)',
                                '--muted-foreground': 'oklch(0.556 0 0)',
                                '--primary': 'oklch(0 0 0)'
                            } as React.CSSProperties}
                        >
                            <UnifiedInput onAdd={async () => {
                                window.location.href = '/login';
                                return null;
                            }} />
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-black">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 border-2 border-black rounded bg-[#85D6A0]">Cmd</span>
                                <span>+</span>
                                <span className="px-2 py-1 border-2 border-black rounded bg-[#F48B47]">V</span>
                                <span className="ml-2">to paste instantly</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>

            {/* Solid Divider */}
            <div className="w-full h-8 bg-black mt-20" />

            {/* Features Banner */}
            <section className="relative z-10 w-full bg-[#F4F820] border-b-8 border-black pt-20 pb-24">
                <div className="max-w-7xl mx-auto px-6 space-y-16">
                    <div className="text-center">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black transform -skew-x-6">
                            WHY UNTLD?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 hover:-translate-x-2 transition-transform">
                            <div className="h-16 w-16 rounded-full border-4 border-black bg-[#E3A8F9] flex items-center justify-center mb-6">
                                <Zap className="h-8 w-8 text-black" />
                            </div>
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-3">Paste Anything</h4>
                            <p className="font-medium text-black/70">
                                Paste hex codes, typography samples, images, or web links. We grab it all instantly.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 transition-transform">
                            <div className="h-16 w-16 rounded-full border-4 border-black bg-[#85CEF3] flex items-center justify-center mb-6">
                                <Palette className="h-8 w-8 text-black" />
                            </div>
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-3">Magic Palette</h4>
                            <p className="font-medium text-black/70">
                                Drop an image and our AI perfectly extracts a beautiful color palette into your workspace.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 hover:translate-x-2 transition-transform">
                            <div className="h-16 w-16 rounded-full border-4 border-black bg-[#F48B47] flex items-center justify-center mb-6">
                                <Sparkles className="h-8 w-8 text-black" />
                            </div>
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-3">Speed First</h4>
                            <p className="font-medium text-black/70">
                                Never leave keyboard. Cmd+V creates a card without breaking your creative flow.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

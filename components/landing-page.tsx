'use client';

import { Button } from "./ui/button";
import { LogIn, Sun, Laptop, Zap, FileDown, History, ArrowUpSquare, Paintbrush, Infinity, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UntldLogo } from "./untld-logo";

export function LandingPage() {
    return (
        <div className="relative min-h-screen w-full bg-white text-black dark:bg-[#0a0a0a] dark:text-white font-sans selection:bg-black/10 dark:selection:bg-white/10 z-50">

            {/* Top Navigation */}
            <nav className="flex items-center justify-between px-6 py-8 max-w-[1200px] mx-auto w-full">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <UntldLogo className="text-[2.5rem] text-black dark:text-white" />
                </div>
                <div className="flex items-center gap-8 font-semibold text-[13px] tracking-tight">
                    <Link href="#" className="hidden sm:block text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors">Contact</Link>
                    <Link href="#" className="hidden sm:block text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors">Twitter</Link>
                    <Link href="/login">
                        <Button className="rounded-xl px-5 py-5 bg-[#1C1C1E] dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90 text-white font-semibold text-[13px] border-none shadow-none h-auto transition-transform hover:scale-105">
                            <LogIn className="h-3.5 w-3.5 mr-2" />
                            Log In
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="w-full flex-1 flex flex-col items-center">
                
                {/* Hero Section */}
                <div className="w-full max-w-[1200px] mx-auto px-6 pt-16 md:pt-28 flex flex-col items-start">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[4rem] leading-[0.95] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tighter max-w-[900px]"
                    >
                        A tiny moodboard<br className="hidden md:block"/> for your next big project
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-12 md:mt-16 ml-2"
                    >
                        <Link href="/login">
                            <Button className="rounded-2xl px-6 py-6 lg:px-8 lg:py-7 bg-[#1C1C1E] dark:bg-white dark:text-black hover:bg-[#2C2C2E] dark:hover:bg-white/90 text-white font-semibold text-sm lg:text-base shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 h-auto">
                                <LogIn className="h-5 w-5 mr-3" />
                                Start Creating
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Image / Mockup */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 mt-20 md:mt-32"
                >
                    <div className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[2/1] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative bg-gradient-to-tr from-[#12A0F8] via-[#5C27E5] to-[#FF4D15]">
                        {/* Organic Gradient Blobs */}
                        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-[#10C0E8] blur-[100px] opacity-60 mix-blend-screen rounded-full translate-x-1/4 -translate-y-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-[#FFB800] blur-[120px] opacity-70 mix-blend-overlay rounded-full -translate-x-1/4 translate-y-1/4"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-r from-purple-500/30 to-rose-500/30 blur-[80px]" />
                        
                        {/* Fake UI Elements */}
                        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-3xl rounded-3xl p-2.5 pr-5 flex items-center gap-3 text-white text-[13px] font-medium shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-white/20">
                            <div className="w-8 h-8 rounded-2xl bg-white/20 flex items-center justify-center">
                                <span className="font-bold italic text-sm">U</span>
                            </div>
                            <span className="opacity-95">Untld Workspace</span>
                            <span className="opacity-50 ml-1 text-xs">Beta</span>
                        </div>

                        <div className="absolute bottom-12 left-8 md:bottom-20 md:left-20 w-72 md:w-80 bg-[#1C1C1E]/80 backdrop-blur-2xl rounded-[2rem] p-6 shadow-2xl border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3 text-white font-semibold text-sm">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-inner">
                                        <Heart className="h-4 w-4 text-white fill-white" />
                                    </div>
                                    Moodboard
                                </div>
                                <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                                    Active
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Colors', value: '12 items', bg: 'bg-rose-500' },
                                    { label: 'Images', value: '4 items', bg: 'bg-emerald-500' },
                                    { label: 'Typography', value: '2 items', bg: 'bg-blue-500' },
                                    { label: 'Links', value: '8 items', bg: 'bg-amber-500' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-[13px]">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", item.bg)} />
                                            <span className="text-white/70 font-medium">{item.label}</span>
                                        </div>
                                        <span className="text-white font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fake dock */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-20 bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/20 flex items-center px-5 gap-4 shadow-2xl">
                            <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner"></div>
                            <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-purple-400 to-purple-600 shadow-inner"></div>
                            <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-orange-400 to-orange-600 shadow-inner"></div>
                            <div className="w-px h-10 bg-white/20 mx-2"></div>
                            <div className="w-12 h-12 rounded-[1.2rem] bg-white text-black flex items-center justify-center shadow-inner">
                                <span className="font-black italic text-xl">U</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="w-full max-w-[1000px] mx-auto px-6 py-32 md:py-48">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-20 gap-x-8 text-center">
                        <Feature icon={Sun} title={<span>Hassle-free tracking</span>} />
                        <Feature icon={Laptop} title={<>Perfect for <span className="relative inline-block z-10"><span className="relative z-10">freelancers</span><svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] -z-10 text-purple-600/60 dark:text-purple-400/80 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M5,15 Q30,2 60,5 T95,15 Q70,28 40,25 T5,15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-80"/></svg></span></>} />
                        <Feature icon={Zap} title={<span>Useful insights and analytics</span>} />
                        <Feature icon={FileDown} title={<span>Quick export to CSV</span>} />
                        <Feature icon={History} title={<span>Daily limits and notifications</span>} />
                        <Feature icon={ArrowUpSquare} title={<span>Menubar extension</span>} />
                        <Feature icon={Paintbrush} title={<span>Playful customization</span>} />
                        <Feature icon={Infinity} title={<span>Unlimited projects</span>} />
                    </div>
                </div>

                {/* Footer Section */}
                <div className="w-full flex flex-col items-center pb-24 px-6 md:pb-32">
                    <Link href="/login">
                        <Button className="rounded-2xl px-6 py-6 lg:px-8 lg:py-7 bg-[#1C1C1E] dark:bg-white dark:text-black hover:bg-[#2C2C2E] dark:hover:bg-white/90 text-white font-semibold text-sm lg:text-base shadow-xl hover:shadow-2xl transition-all h-auto mb-20 md:mb-24">
                            <LogIn className="h-5 w-5 mr-3" />
                            Start Creating
                        </Button>
                    </Link>
                    
                    <Heart className="h-5 w-5 text-black/30 dark:text-white/30 fill-current mb-5" />
                    <p className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">Made by freelancers for freelancers</p>
                    <p className="text-[13px] font-medium text-black/30 dark:text-white/30">Developed in 2024</p>
                </div>

            </main>
        </div>
    );
}

function Feature({ icon: Icon, title }: { icon: any, title: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center group">
            <div className="text-black dark:text-white mb-6 transform transition-transform group-hover:scale-110 duration-300">
                <Icon className="h-[42px] w-[42px] stroke-[1.5]" />
            </div>
            <p className="text-sm md:text-[15px] font-bold leading-tight max-w-[150px]">
                {title}
            </p>
        </div>
    );
}

'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Type,
  StickyNote,
  Wand2,
  LayoutDashboard,
  Link2,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: Palette,
      label: "Colors",
      colorClass: "text-red-500 bg-red-50 dark:bg-red-500/10",
      title: "Save unlimited colors",
      description: "Paste any hex code to instantly save it. We'll automatically identify the color name and save it to your moodboard."
    },
    {
      icon: Type,
      label: "Fonts",
      colorClass: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
      title: "Track your typography",
      description: "Keep a clean list of all the fonts and typefaces you plan to use. Just type \"Font: Inter\" in the main input to instantly save it."
    },
    {
      icon: StickyNote,
      label: "Notes",
      colorClass: "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10",
      title: "Jot down ideas",
      description: "Any text you paste is instantly saved as a neat little note card, perfect for capturing fleeting thoughts."
    },
    {
      icon: Wand2,
      label: "Magic Palette",
      colorClass: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
      title: "AI generated palettes",
      description: "Hit the magic button to automatically generate a cohesive color palette based on the images you've saved."
    },
    {
      icon: LayoutDashboard,
      label: "Moodboard",
      colorClass: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
      title: "Visual inspiration",
      description: "Paste URLs of images and we'll instantly fetch and save them into a stunning masonry grid for your moodboard."
    },
    {
      icon: Link2,
      label: "Links",
      colorClass: "text-slate-500 bg-slate-50 dark:bg-slate-500/10",
      title: "Save references",
      description: "Paste any website URL and we'll automatically fetch its metadata, title, and favicon to build your reference list."
    }
  ];

  const handleNext = () => {
    if (currentSlide < features.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onOpenChange(false);
      // Reset slide after closing animation
      setTimeout(() => setCurrentSlide(0), 300);
    }
  };

  const handlePrev = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const activeFeature = features[currentSlide];

  return (
    <Dialog open={open} onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) setTimeout(() => setCurrentSlide(0), 300);
    }}>
      <DialogContent className="p-0 sm:max-w-[420px] overflow-hidden gap-0 border-none shadow-2xl rounded-2xl">
        <DialogTitle className="sr-only">Workspace Features Overview</DialogTitle>
        
        {/* Top Graphical Section */}
        <div className="bg-[#FFF6F0] dark:bg-orange-950/30 w-full h-[220px] p-8 flex items-center justify-center relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 w-[200px] aspect-square flex flex-col items-center justify-center gap-4 border border-black/5 dark:border-white/5">
                <motion.div 
                  className={cn("p-6 rounded-2xl", activeFeature.colorClass)}
                  animate={activeFeature.label === "Magic Palette" ? {
                    rotate: [0, -15, 15, -15, 15, 0],
                    scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                    <activeFeature.icon className="w-12 h-12" strokeWidth={2} />
                </motion.div>
                <span className="font-bold text-sm tracking-tight">{activeFeature.label}</span>
              </div>
            </motion.div>
          </AnimatePresence>
          
        </div>

        {/* Bottom Text Section */}
        <div className="p-6 bg-background relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-muted/30">
            <motion.div 
                className="h-full bg-foreground"
                initial={{ width: `${(1 / features.length) * 100}%` }}
                animate={{ width: `${((currentSlide + 1) / features.length) * 100}%` }}
                transition={{ duration: 0.3 }}
            />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-4 mt-2">
            Step {currentSlide + 1} of {features.length}
          </div>
          
          <div className="h-[90px]">
              <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <h2 className="text-[17px] font-bold leading-tight mb-2 text-foreground">
                        {activeFeature.title}
                    </h2>
                    
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {activeFeature.description}
                    </p>
                </motion.div>
              </AnimatePresence>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-1.5">
                {features.map((_, i) => (
                    <div 
                        key={i} 
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            i === currentSlide ? "w-4 bg-foreground" : "w-1.5 bg-muted"
                        )} 
                    />
                ))}
            </div>

            <div className="flex items-center gap-2">
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full disabled:opacity-30"
                    onClick={handlePrev}
                    disabled={currentSlide === 0}
                >
                <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                    className="bg-foreground hover:bg-foreground/90 text-background text-[13px] font-bold rounded-full px-6 h-9 transition-all"
                    onClick={handleNext}
                >
                {currentSlide === features.length - 1 ? 'Get Started' : 'Next'}
                </Button>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}



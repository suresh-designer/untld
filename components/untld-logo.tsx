import { cn } from "@/lib/utils";
import * as React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function UntldLogo({ className, ...props }: LogoProps) {
  return (
    <div 
        className={cn(
            "relative inline-flex items-center justify-center overflow-hidden transform -skew-x-[15deg] leading-none select-none",
            className
        )}
        style={{
            backgroundColor: "currentColor",
            padding: "0.2em 0.4em",
        }}
        {...props}
    >
      <span 
        className="font-black uppercase italic tracking-tighter text-background"
        style={{ fontSize: "1em", paddingTop: "0.1em" }}
      >
        Untld<span style={{ fontSize: "1em", opacity: 0.9 }}>.</span>
      </span>
    </div>
  )
}

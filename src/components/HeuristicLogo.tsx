import React, { forwardRef } from "react";

export interface HeuristicLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "light";
  className?: string;
}

const HeuristicLogo = forwardRef<HTMLDivElement, HeuristicLogoProps>(
  ({ size = "md", showText = true, variant = "default", className }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    const iconSizes = {
      sm: 18,
      md: 22,
      lg: 26,
    };

    const textSizes = {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
    };

    return (
      <div ref={ref} className={`flex items-center gap-3 ${className || ""}`}>
        <div className={`${sizeClasses[size]} bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25`}>
          {/* Professional Logo: Graduation Cap + Ascending Path */}
          <svg 
            width={iconSizes[size]} 
            height={iconSizes[size]} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary-foreground"
          >
            {/* Graduation Cap - Diamond top */}
            <path 
              d="M12 2L20 6L12 10L4 6L12 2Z" 
              fill="currentColor"
              opacity="0.9"
            />
            {/* Cap base and tassel anchor */}
            <path 
              d="M6 8V13C6 14.5 8.5 16 12 16C15.5 16 18 14.5 18 13V8" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              fill="none"
            />
            {/* Ascending path - career growth trajectory */}
            <path 
              d="M19 10V15L21 13" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Connection node - student to company bridge */}
            <circle 
              cx="12" 
              cy="20" 
              r="2" 
              fill="currentColor"
              opacity="0.7"
            />
            {/* Rising connection line */}
            <path 
              d="M12 16V18" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
          </svg>
        </div>
        {showText && (
          <span className={`${textSizes[size]} font-bold font-display ${variant === "light" ? "text-white" : "text-foreground"} tracking-tight`}>
            Heuristic
          </span>
        )}
      </div>
    );
  }
);

HeuristicLogo.displayName = "HeuristicLogo";

export default HeuristicLogo;

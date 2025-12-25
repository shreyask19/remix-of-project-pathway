interface HeuristicLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "light";
}

const HeuristicLogo = ({ size = "md", showText = true, variant = "default" }: HeuristicLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25`}>
        {/* Custom H Logo Mark - Modern geometric design */}
        <svg 
          width={iconSizes[size]} 
          height={iconSizes[size]} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-foreground"
        >
          {/* Abstract H with forward momentum */}
          <path 
            d="M6 4V20M6 12H14M14 4V20" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M18 8L21 12L18 16" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.7"
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
};

export default HeuristicLogo;
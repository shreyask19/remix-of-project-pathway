import { GraduationCap } from "lucide-react";

interface HeuristicLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const HeuristicLogo = ({ size = "md", showText = true }: HeuristicLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} bg-primary rounded-2xl flex items-center justify-center shadow-lg`}>
        <GraduationCap className={`${iconSizes[size]} text-primary-foreground`} />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold font-display text-foreground tracking-tight`}>
          Heuristic
        </span>
      )}
    </div>
  );
};

export default HeuristicLogo;

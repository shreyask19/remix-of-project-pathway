import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

export interface SkillGraphDataPoint {
  category: string;
  score: number;
}

interface SkillRadarGraphProps {
  data: SkillGraphDataPoint[];
  size?: "sm" | "md" | "lg";
  className?: string;
  showAnimation?: boolean;
}

const defaultCategories = [
  "Architectural Thinking",
  "Code Quality",
  "Security",
  "UI/UX",
  "Testing",
  "Documentation",
];

const SkillRadarGraph = ({
  data,
  size = "md",
  className,
  showAnimation = true,
}: SkillRadarGraphProps) => {
  // Ensure we have all categories with at least 0 score
  const chartData = useMemo(() => {
    const dataMap = new Map(data.map((d) => [d.category, d.score]));
    return defaultCategories.map((category) => ({
      category: category.length > 12 ? category.slice(0, 10) + "..." : category,
      fullCategory: category,
      score: dataMap.get(category) || 0,
      fullMark: 100,
    }));
  }, [data]);

  const hasData = data.some((d) => d.score > 0);

  const sizeConfig = {
    sm: { height: 180, fontSize: 9 },
    md: { height: 280, fontSize: 11 },
    lg: { height: 380, fontSize: 13 },
  };

  const config = sizeConfig[size];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-foreground text-sm">{data.fullCategory}</p>
          <p className="text-primary font-bold">{data.score}%</p>
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)} style={{ height: config.height }}>
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="8.5" x2="22" y2="15.5" />
            <line x1="22" y1="8.5" x2="2" y2="15.5" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Complete projects to build your skill graph
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={showAnimation ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={config.height}>
        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{ 
              fill: "hsl(var(--muted-foreground))", 
              fontSize: config.fontSize,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickCount={5}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "hsl(var(--primary))",
              stroke: "hsl(var(--background))",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "hsl(var(--primary))",
              stroke: "hsl(var(--background))",
              strokeWidth: 2,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SkillRadarGraph;

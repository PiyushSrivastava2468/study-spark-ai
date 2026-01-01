import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  gradient?: "primary" | "accent" | "warm" | "success";
  className?: string;
}

const gradientStyles = {
  primary: "from-primary/20 to-primary/5",
  accent: "from-accent/20 to-accent/5",
  warm: "from-orange-500/20 to-yellow-500/5",
  success: "from-emerald-500/20 to-green-500/5",
};

const iconBgStyles = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  warm: "bg-orange-500/10 text-orange-500",
  success: "bg-emerald-500/10 text-emerald-500",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gradient = "primary",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "stat-card relative overflow-hidden",
        className
      )}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          gradientStyles[gradient]
        )}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2 sm:mb-4">
          <div
            className={cn(
              "p-2 sm:p-3 rounded-lg sm:rounded-xl",
              iconBgStyles[gradient]
            )}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg",
                trend.positive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              )}
            >
              {trend.positive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>

        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1">
          {title}
        </h3>
        <p className="text-xl sm:text-3xl font-display font-bold text-foreground animate-count-up">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

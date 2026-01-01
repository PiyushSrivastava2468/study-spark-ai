import { Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/contexts/AppDataContext";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCard() {
  const { streak, getStreakData } = useAppData();
  const streakData = getStreakData();

  return (
    <div className="stat-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/5" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-orange-500/10">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Longest</p>
            <p className="text-sm font-semibold text-foreground">{streak.longest} days</p>
          </div>
        </div>

        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          Study Streak
        </h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-display font-bold text-foreground">
            {streak.current}
          </span>
          <span className="text-lg text-muted-foreground">days</span>
          {streak.current > 0 && <TrendingUp className="w-4 h-4 text-emerald-500 ml-auto" />}
        </div>

        {/* Week visualization */}
        <div className="flex items-center justify-between gap-1">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  streakData[index]
                    ? "bg-gradient-to-br from-orange-500 to-yellow-500 text-white shadow-md"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {streakData[index] && <Flame className="w-4 h-4" />}
              </div>
              <span className="text-xs text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

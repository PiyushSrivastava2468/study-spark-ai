import { cn } from "@/lib/utils";

// Generate mock heatmap data for the last 12 weeks
const generateHeatmapData = () => {
  const data: number[][] = [];
  for (let week = 0; week < 12; week++) {
    const weekData: number[] = [];
    for (let day = 0; day < 7; day++) {
      // Random focus hours between 0 and 8
      weekData.push(Math.floor(Math.random() * 9));
    }
    data.push(weekData);
  }
  return data;
};

const heatmapData = generateHeatmapData();
const days = ["", "Mon", "", "Wed", "", "Fri", ""];

const getIntensityClass = (hours: number) => {
  if (hours === 0) return "bg-secondary";
  if (hours <= 2) return "bg-primary/20";
  if (hours <= 4) return "bg-primary/40";
  if (hours <= 6) return "bg-primary/60";
  return "bg-primary";
};

export function FocusHeatmap() {
  const totalHours = heatmapData.flat().reduce((a, b) => a + b, 0);
  const avgHours = (totalHours / 84).toFixed(1);

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">Focus Activity</h3>
        <div className="text-right">
          <p className="text-2xl font-display font-bold text-foreground">{totalHours}h</p>
          <p className="text-xs text-muted-foreground">{avgHours}h avg/day</p>
        </div>
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-2">
          {days.map((day, i) => (
            <div
              key={i}
              className="h-3 text-[10px] text-muted-foreground flex items-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((hours, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer",
                    getIntensityClass(hours)
                  )}
                  title={`${hours} hours of focus`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex gap-1">
          {[0, 2, 4, 6, 8].map((hours) => (
            <div
              key={hours}
              className={cn("w-3 h-3 rounded-sm", getIntensityClass(hours))}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
}

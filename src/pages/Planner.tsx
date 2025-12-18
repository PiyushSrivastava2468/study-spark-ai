import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, BookOpen, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "study" | "break" | "class" | "other";
  subject?: string;
}

const timeSlots = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const sampleBlocks: TimeBlock[] = [
  { id: "1", title: "Calculus Lecture", startTime: "09:00", endTime: "10:30", type: "class", subject: "Mathematics" },
  { id: "2", title: "Study Session", startTime: "11:00", endTime: "13:00", type: "study", subject: "Physics" },
  { id: "3", title: "Lunch Break", startTime: "13:00", endTime: "14:00", type: "break" },
  { id: "4", title: "Lab Work", startTime: "14:00", endTime: "16:00", type: "class", subject: "Chemistry" },
  { id: "5", title: "Review Notes", startTime: "17:00", endTime: "18:30", type: "study", subject: "Computer Science" },
];

const typeStyles = {
  study: "bg-primary/20 border-primary/40 text-primary",
  break: "bg-accent/20 border-accent/40 text-accent",
  class: "bg-emerald-500/20 border-emerald-500/40 text-emerald-500",
  other: "bg-secondary border-border text-foreground",
};

const typeIcons = {
  study: BookOpen,
  break: Coffee,
  class: Clock,
  other: Clock,
};

export default function Planner() {
  const [selectedDay, setSelectedDay] = useState(0); // Monday
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const today = new Date();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Daily Planner
          </h1>
          <p className="text-muted-foreground">
            Plan your day with time blocks
          </p>
        </div>
        <Button className="btn-gradient rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Add Block
        </Button>
      </div>

      {/* Week Navigation */}
      <div className="glass-card rounded-2xl p-4 mb-6 animate-fade-in stagger-1 opacity-0">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentWeek(newDate);
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="font-semibold text-foreground">
            {weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentWeek(newDate);
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDay === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : isToday
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary"
                )}
              >
                <span className="text-xs font-medium opacity-70">{daysOfWeek[index]}</span>
                <span className="text-lg font-semibold">{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Grid */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-2 opacity-0">
        <div className="relative">
          {/* Time labels */}
          <div className="absolute left-0 top-0 w-16 h-full">
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className="absolute text-xs text-muted-foreground -translate-y-1/2"
                style={{ top: `${(index / timeSlots.length) * 100}%` }}
              >
                {time}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="ml-20 relative" style={{ height: "800px" }}>
            {/* Hour lines */}
            {timeSlots.map((_, index) => (
              <div
                key={index}
                className="absolute left-0 right-0 border-t border-border/50"
                style={{ top: `${(index / timeSlots.length) * 100}%` }}
              />
            ))}

            {/* Time blocks */}
            {sampleBlocks.map((block) => {
              const startHour = parseInt(block.startTime.split(":")[0]) - 6;
              const endHour = parseInt(block.endTime.split(":")[0]) - 6;
              const startMin = parseInt(block.startTime.split(":")[1]);
              const endMin = parseInt(block.endTime.split(":")[1]);
              const top = ((startHour + startMin / 60) / 16) * 100;
              const height = (((endHour - startHour) + (endMin - startMin) / 60) / 16) * 100;
              const Icon = typeIcons[block.type];

              return (
                <div
                  key={block.id}
                  className={cn(
                    "absolute left-2 right-2 rounded-xl border-l-4 p-3 cursor-pointer hover-lift",
                    typeStyles[block.type]
                  )}
                  style={{ top: `${top}%`, height: `${height}%` }}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{block.title}</p>
                      {block.subject && (
                        <p className="text-xs opacity-70">{block.subject}</p>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {block.startTime} - {block.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Current time indicator */}
            {selectedDay === today.getDay() - 1 && (
              <div
                className="absolute left-0 right-0 flex items-center z-10"
                style={{
                  top: `${((today.getHours() - 6 + today.getMinutes() / 60) / 16) * 100}%`,
                }}
              >
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="flex-1 h-0.5 bg-destructive" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 animate-fade-in stagger-3 opacity-0">
        {(["class", "study", "break"] as const).map((type) => {
          const Icon = typeIcons[type];
          return (
            <div key={type} className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded", typeStyles[type].split(" ")[0])} />
              <span className="text-sm text-muted-foreground capitalize">{type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

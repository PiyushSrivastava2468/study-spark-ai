import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SessionType = "focus" | "break";

export function QuickPomodoro() {
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds

  const totalTime = sessionType === "focus" ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(sessionType === "focus" ? 25 * 60 : 5 * 60);
  }, [sessionType]);

  const toggleSession = () => {
    const newType = sessionType === "focus" ? "break" : "focus";
    setSessionType(newType);
    setTimeLeft(newType === "focus" ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Auto switch to break/focus
      toggleSession();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return (
    <div className="stat-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Quick Focus</h3>
          <button
            onClick={toggleSession}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              sessionType === "focus"
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent"
            )}
          >
            {sessionType === "focus" ? (
              <>Focus</>
            ) : (
              <>
                <Coffee className="w-4 h-4" />
                Break
              </>
            )}
          </button>
        </div>

        {/* Timer Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              className="fill-none stroke-secondary"
              strokeWidth="8"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              className={cn(
                "fill-none transition-all duration-300",
                sessionType === "focus" ? "stroke-primary" : "stroke-accent"
              )}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-bold text-foreground">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-muted-foreground capitalize">
              {sessionType} session
            </span>
          </div>
          
          {/* Pulse effect when running */}
          {isRunning && (
            <div
              className={cn(
                "absolute inset-4 rounded-full animate-pulse-ring",
                sessionType === "focus" ? "bg-primary/20" : "bg-accent/20"
              )}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="rounded-full w-12 h-12"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "rounded-full w-16 h-16 shadow-lg",
              sessionType === "focus" ? "btn-gradient" : "bg-accent hover:bg-accent/90"
            )}
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>
          <div className="w-12 h-12" /> {/* Spacer for alignment */}
        </div>
      </div>
    </div>
  );
}

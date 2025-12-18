import { useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Zap,
  Moon,
  Volume2,
  VolumeX,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type SessionMode = "pomodoro" | "shortBreak" | "longBreak" | "deepFocus";

const sessionConfigs = {
  pomodoro: { label: "Pomodoro", duration: 25, icon: Zap, color: "primary" },
  shortBreak: { label: "Short Break", duration: 5, icon: Coffee, color: "accent" },
  longBreak: { label: "Long Break", duration: 15, icon: Moon, color: "accent" },
  deepFocus: { label: "Deep Focus", duration: 50, icon: Zap, color: "primary" },
};

const ambientSounds = [
  { id: "rain", label: "Rain" },
  { id: "forest", label: "Forest" },
  { id: "waves", label: "Ocean Waves" },
  { id: "fire", label: "Fireplace" },
  { id: "cafe", label: "Café" },
];

export default function Focus() {
  const [mode, setMode] = useState<SessionMode>("pomodoro");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionConfigs.pomodoro.duration * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState("rain");
  const [volume, setVolume] = useState([50]);

  const config = sessionConfigs[mode];
  const totalTime = config.duration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const switchMode = (newMode: SessionMode) => {
    setMode(newMode);
    setTimeLeft(sessionConfigs[newMode].duration * 60);
    setIsRunning(false);
  };

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(config.duration * 60);
  }, [config.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "pomodoro" || mode === "deepFocus") {
        setSessionsCompleted((s) => s + 1);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const todayStats = {
    focusTime: "2h 45m",
    sessions: sessionsCompleted,
    streak: 5,
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Focus Mode
        </h1>
        <p className="text-muted-foreground">
          Stay focused and productive with timed sessions
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center gap-2 mb-10 animate-fade-in stagger-1 opacity-0">
        {(Object.keys(sessionConfigs) as SessionMode[]).map((key) => {
          const cfg = sessionConfigs[key];
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                mode === key
                  ? cfg.color === "primary"
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{cfg.label}</span>
              <span className="text-sm opacity-70">{cfg.duration}m</span>
            </button>
          );
        })}
      </div>

      {/* Main Timer */}
      <div className="flex justify-center mb-10 animate-fade-in stagger-2 opacity-0">
        <div className="relative">
          {/* Timer circle */}
          <svg className="w-80 h-80 -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="145"
              className="fill-none stroke-secondary"
              strokeWidth="12"
            />
            <circle
              cx="160"
              cy="160"
              r="145"
              className={cn(
                "fill-none transition-all duration-300",
                config.color === "primary" ? "stroke-primary" : "stroke-accent"
              )}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 145}
              strokeDashoffset={2 * Math.PI * 145 * (1 - progress / 100)}
            />
          </svg>

          {/* Timer content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-display font-bold text-foreground mb-2">
              {formatTime(timeLeft)}
            </span>
            <span className="text-lg text-muted-foreground">{config.label}</span>
          </div>

          {/* Pulse effect */}
          {isRunning && (
            <div
              className={cn(
                "absolute inset-6 rounded-full animate-pulse-ring",
                config.color === "primary" ? "bg-primary/10" : "bg-accent/10"
              )}
            />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-10 animate-fade-in stagger-3 opacity-0">
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="rounded-full w-14 h-14"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={cn(
            "rounded-full w-20 h-20 shadow-lg text-lg",
            config.color === "primary"
              ? "btn-gradient"
              : "bg-accent hover:bg-accent/90 text-accent-foreground"
          )}
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-14 h-14"
        >
          <Settings2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Stats */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-4 opacity-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-primary/5">
              <p className="text-2xl font-display font-bold text-primary">
                {todayStats.focusTime}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Focus Time</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent/5">
              <p className="text-2xl font-display font-bold text-accent">
                {todayStats.sessions}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Sessions</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-orange-500/5">
              <p className="text-2xl font-display font-bold text-orange-500">
                {todayStats.streak}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Ambient Sounds */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-5 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Ambient Sounds</h3>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                soundEnabled ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              )}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {ambientSounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => setSelectedSound(sound.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  selectedSound === sound.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {sound.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <VolumeX className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

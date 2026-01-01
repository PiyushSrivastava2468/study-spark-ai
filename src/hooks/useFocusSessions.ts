import { useState, useEffect } from "react";

export interface FocusSession {
  id: string;
  type: "pomodoro" | "shortBreak" | "longBreak" | "deepFocus";
  duration: number; // in minutes
  completedAt: Date;
  date: string;
}

export interface DailyStats {
  date: string;
  totalMinutes: number;
  sessions: number;
}

const STORAGE_KEY = "focusflow-focus-sessions";
const STREAK_KEY = "focusflow-streak";

export function useFocusSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((s: any) => ({
        ...s,
        completedAt: new Date(s.completedAt),
      }));
    }
    return [];
  });

  const [streak, setStreak] = useState<{ current: number; longest: number }>(() => {
    const stored = localStorage.getItem(STREAK_KEY);
    return stored ? JSON.parse(stored) : { current: 0, longest: 0 };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    updateStreak();
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  }, [streak]);

  const addSession = (type: FocusSession["type"], duration: number) => {
    const today = new Date().toISOString().split("T")[0];
    const newSession: FocusSession = {
      id: crypto.randomUUID(),
      type,
      duration,
      completedAt: new Date(),
      date: today,
    };
    setSessions((prev) => [newSession, ...prev]);
    return newSession;
  };

  const updateStreak = () => {
    const today = new Date();
    const dates = new Set(sessions.map((s) => s.date));
    
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    while (dates.has(checkDate.toISOString().split("T")[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    setStreak((prev) => ({
      current: currentStreak,
      longest: Math.max(prev.longest, currentStreak),
    }));
  };

  const getTodayStats = (): DailyStats => {
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = sessions.filter((s) => s.date === today && (s.type === "pomodoro" || s.type === "deepFocus"));
    return {
      date: today,
      totalMinutes: todaySessions.reduce((sum, s) => sum + s.duration, 0),
      sessions: todaySessions.length,
    };
  };

  const getWeeklyStats = (): DailyStats[] => {
    const stats: DailyStats[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const daySessions = sessions.filter((s) => s.date === dateStr && (s.type === "pomodoro" || s.type === "deepFocus"));
      stats.push({
        date: dateStr,
        totalMinutes: daySessions.reduce((sum, s) => sum + s.duration, 0),
        sessions: daySessions.length,
      });
    }
    
    return stats;
  };

  const getHeatmapData = (): number[][] => {
    const weeks: number[][] = [];
    const today = new Date();
    
    for (let w = 11; w >= 0; w--) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().split("T")[0];
        const daySessions = sessions.filter((s) => s.date === dateStr && (s.type === "pomodoro" || s.type === "deepFocus"));
        const hours = daySessions.reduce((sum, s) => sum + s.duration, 0) / 60;
        week.push(Math.round(hours * 10) / 10);
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  const getStreakData = (): boolean[] => {
    const data: boolean[] = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const hasSessions = sessions.some((s) => s.date === dateStr && (s.type === "pomodoro" || s.type === "deepFocus"));
      data.push(hasSessions);
    }
    
    return data;
  };

  return {
    sessions,
    streak,
    addSession,
    getTodayStats,
    getWeeklyStats,
    getHeatmapData,
    getStreakData,
  };
}

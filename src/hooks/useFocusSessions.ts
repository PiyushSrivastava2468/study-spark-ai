import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

export function useFocusSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Streak can be derived from sessions or stored separately. 
  // For simplicity, we'll derive it on load.
  const [streak, setStreak] = useState<{ current: number; longest: number }>({ current: 0, longest: 0 });

  useEffect(() => {
    if (!user) {
      setSessions([]);
      return;
    }
    fetchSessions();
  }, [user]);

  useEffect(() => {
    // Calculate streak whenever sessions change
    updateStreak();
  }, [sessions]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("focus_sessions")
        .select("*")
        .order("completed_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setSessions(data.map((s: any) => ({
          id: s.id,
          type: s.type,
          duration: s.duration,
          completedAt: new Date(s.completed_at),
          date: s.date,
        })));
      }
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load focus sessions");
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (type: FocusSession["type"], duration: number) => {
    try {
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const newSessionData = {
        user_id: user.id,
        type,
        duration,
        date: today,
        completed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("focus_sessions")
        .insert(newSessionData)
        .select()
        .single();

      if (error) throw error;

      const newSession: FocusSession = {
        id: data.id,
        type: data.type,
        duration: data.duration,
        completedAt: new Date(data.completed_at),
        date: data.date,
      };

      setSessions((prev) => [newSession, ...prev]);
      return newSession;
    } catch (error: any) {
      console.error("Error adding session:", error);
      toast.error("Failed to save session");
    }
  };

  const updateStreak = () => {
    const today = new Date();
    const dates = new Set(sessions.map((s) => s.date));

    let currentStreak = 0;
    let checkDate = new Date(today);

    // Check backwards from today
    while (dates.has(checkDate.toISOString().split("T")[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    setStreak(prev => ({
      current: currentStreak,
      longest: Math.max(prev.longest, currentStreak), // Basic implementation, calculating true longest streak from history is more complex
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
    loading,
    addSession,
    getTodayStats,
    getWeeklyStats,
    getHeatmapData,
    getStreakData,
  };
}

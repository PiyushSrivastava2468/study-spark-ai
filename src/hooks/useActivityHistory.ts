import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type ActivityType = "task" | "goal" | "focus" | "note" | "planner";
export type ActivityAction = "created" | "updated" | "deleted" | "completed";

export interface Activity {
  id: string;
  type: ActivityType;
  action: ActivityAction;
  title: string;
  description?: string;
  timestamp: Date;
}

const MAX_ACTIVITIES = 100;

export function useActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Or handle local storage fallback if needed, but we're going full Supabase

      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(MAX_ACTIVITIES);

      if (error) throw error;

      if (data) {
        setActivities(data.map(item => ({
          id: item.id,
          type: item.type,
          action: item.action,
          title: item.title,
          description: item.description,
          timestamp: new Date(item.created_at) // Map created_at to timestamp
        })));
      }
    } catch (err) {
      console.error("Error fetching activity history:", err);
    }
  };

  const addActivity = async (
    type: ActivityType,
    action: ActivityAction,
    title: string,
    description?: string
  ) => {
    const newActivityLocal: Activity = {
      id: crypto.randomUUID(),
      type,
      action,
      title,
      description,
      timestamp: new Date(),
    };

    // Optimistic update
    setActivities((prev) => [newActivityLocal, ...prev].slice(0, MAX_ACTIVITIES));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return newActivityLocal;

      const { error } = await supabase
        .from("activity_logs")
        .insert([{
          user_id: user.id,
          type,
          action,
          title,
          description,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (err) {
      console.error("Error logging activity:", err);
      // Revert optimistic update if critical, but for logging it's usually fine to just log error
    }

    return newActivityLocal;
  };

  const clearHistory = async () => {
    setActivities([]); // Optimistic clear
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("activity_logs")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  const getRecentActivities = (limit: number = 20) => {
    return activities.slice(0, limit);
  };

  const getActivitiesByType = (type: ActivityType) => {
    return activities.filter((a) => a.type === type);
  };

  const getActivitiesByDate = (date: string) => {
    return activities.filter(
      (a) => a.timestamp.toISOString().split("T")[0] === date
    );
  };

  return {
    activities,
    addActivity,
    clearHistory,
    getRecentActivities,
    getActivitiesByType,
    getActivitiesByDate,
  };
}

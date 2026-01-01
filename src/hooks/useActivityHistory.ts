import { useState, useEffect } from "react";

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

const STORAGE_KEY = "focusflow-activity-history";
const MAX_ACTIVITIES = 100;

export function useActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const addActivity = (
    type: ActivityType,
    action: ActivityAction,
    title: string,
    description?: string
  ) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      type,
      action,
      title,
      description,
      timestamp: new Date(),
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, MAX_ACTIVITIES));
    return newActivity;
  };

  const clearHistory = () => {
    setActivities([]);
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

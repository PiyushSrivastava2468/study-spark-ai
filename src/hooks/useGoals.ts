import { useState, useEffect } from "react";

export interface Goal {
  id: string;
  title: string;
  target: string;
  progress: number;
  deadline: string;
  category: "academic" | "study" | "skill";
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "focusflow-goals";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((g: any) => ({
        ...g,
        createdAt: new Date(g.createdAt),
        updatedAt: new Date(g.updatedAt),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: Omit<Goal, "id" | "completed" | "createdAt" | "updatedAt">) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      completed: goal.progress >= 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              ...updates,
              completed: (updates.progress ?? goal.progress) >= 100,
              updatedAt: new Date(),
            }
          : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const getActiveGoals = () => goals.filter((g) => !g.completed);
  const getCompletedGoals = () => goals.filter((g) => g.completed);

  const getAverageProgress = () => {
    if (goals.length === 0) return 0;
    return Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length);
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getActiveGoals,
    getCompletedGoals,
    getAverageProgress,
  };
}

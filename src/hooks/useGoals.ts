import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      return;
    }
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setGoals(data.map((g: any) => ({
          id: g.id,
          title: g.title,
          target: g.target,
          progress: g.progress,
          deadline: g.deadline,
          category: g.category,
          completed: g.completed,
          createdAt: new Date(g.created_at),
          updatedAt: new Date(g.updated_at),
        })));
      }
    } catch (error: any) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Omit<Goal, "id" | "completed" | "createdAt" | "updatedAt">) => {
    try {
      if (!user) return;

      const newGoalData = {
        user_id: user.id,
        title: goal.title,
        target: goal.target,
        progress: goal.progress,
        deadline: goal.deadline,
        category: goal.category,
        completed: goal.progress >= 100,
      };

      const { data, error } = await supabase
        .from("goals")
        .insert(newGoalData)
        .select()
        .single();

      if (error) throw error;

      const newGoal: Goal = {
        id: data.id,
        title: data.title,
        target: data.target,
        progress: data.progress,
        deadline: data.deadline,
        category: data.category,
        completed: data.completed,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setGoals((prev) => [newGoal, ...prev]);
      return newGoal;
    } catch (error: any) {
      console.error("Error adding goal:", error);
      toast.error("Failed to add goal");
    }
  };

  const updateGoal = async (id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => {
    try {
      // Optimistic update
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

      const apiUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title) apiUpdates.title = updates.title;
      if (updates.target) apiUpdates.target = updates.target;
      if (updates.progress !== undefined) {
        apiUpdates.progress = updates.progress;
        apiUpdates.completed = updates.progress >= 100;
      }
      if (updates.deadline) apiUpdates.deadline = updates.deadline;
      if (updates.category) apiUpdates.category = updates.category;

      const { error } = await supabase
        .from("goals")
        .update(apiUpdates)
        .eq("id", id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal");
      fetchGoals();
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
      fetchGoals();
    }
  };

  const getActiveGoals = () => goals.filter((g) => !g.completed);
  const getCompletedGoals = () => goals.filter((g) => g.completed);

  const getAverageProgress = () => {
    if (goals.length === 0) return 0;
    return Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length);
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    getActiveGoals,
    getCompletedGoals,
    getAverageProgress,
  };
}

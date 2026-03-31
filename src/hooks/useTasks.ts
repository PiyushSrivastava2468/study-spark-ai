import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setTasks(
          data.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            subject: t.subject,
            priority: t.priority,
            dueDate: t.due_date, // Map from snake_case
            completed: t.completed,
            createdAt: new Date(t.created_at),
            updatedAt: new Date(t.updated_at),
          }))
        );
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, "id" | "completed" | "createdAt" | "updatedAt">) => {
    try {
      if (!user) return;

      const newTaskData = {
        user_id: user.id,
        title: task.title,
        description: task.description,
        subject: task.subject,
        priority: task.priority,
        due_date: task.dueDate,
        completed: false,
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert(newTaskData)
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        priority: data.priority,
        dueDate: data.due_date,
        completed: data.completed,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (error: any) {
      console.error("Error adding task:", error);
      toast.error("Failed to adding task");
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
        )
      );

      const apiUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title !== undefined) apiUpdates.title = updates.title;
      if (updates.description !== undefined) apiUpdates.description = updates.description;
      if (updates.subject !== undefined) apiUpdates.subject = updates.subject;
      if (updates.priority !== undefined) apiUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) apiUpdates.due_date = updates.dueDate;
      if (updates.completed !== undefined) apiUpdates.completed = updates.completed;

      const { error } = await supabase
        .from("tasks")
        .update(apiUpdates)
        .eq("id", id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      // Revert? (Not implemented for simplicity)
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      fetchTasks();
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.filter((t) => t.dueDate === today);
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return tasks
      .filter((t) => !t.completed && new Date(t.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTodaysTasks,
    getUpcomingDeadlines,
  };
}

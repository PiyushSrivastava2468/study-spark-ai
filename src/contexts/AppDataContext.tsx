import React, { createContext, useContext, ReactNode } from "react";
import { useTasks, Task } from "@/hooks/useTasks";
import { useGoals, Goal } from "@/hooks/useGoals";
import { usePlanner, TimeBlock } from "@/hooks/usePlanner";
import { useFocusSessions, FocusSession, DailyStats } from "@/hooks/useFocusSessions";
import { useActivityHistory, Activity, ActivityType, ActivityAction } from "@/hooks/useActivityHistory";
import { useNotes, Note } from "@/hooks/useNotes";

interface AppDataContextType {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  getTodaysTasks: () => Task[];
  getUpcomingDeadlines: () => Task[];

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "completed" | "createdAt" | "updatedAt">) => Goal;
  updateGoal: (id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => void;
  deleteGoal: (id: string) => void;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
  getAverageProgress: () => number;

  // Planner
  blocks: TimeBlock[];
  addBlock: (block: Omit<TimeBlock, "id" | "createdAt" | "updatedAt">) => TimeBlock;
  updateBlock: (id: string, updates: Partial<Omit<TimeBlock, "id" | "createdAt">>) => void;
  deleteBlock: (id: string) => void;
  getBlocksForDate: (date: string) => TimeBlock[];

  // Focus Sessions
  sessions: FocusSession[];
  streak: { current: number; longest: number };
  addSession: (type: FocusSession["type"], duration: number) => FocusSession;
  getTodayStats: () => DailyStats;
  getWeeklyStats: () => DailyStats[];
  getHeatmapData: () => number[][];
  getStreakData: () => boolean[];

  // Activity History
  activities: Activity[];
  addActivity: (type: ActivityType, action: ActivityAction, title: string, description?: string) => Activity;
  clearHistory: () => void;
  getRecentActivities: (limit?: number) => Activity[];

  // Notes
  notes: Note[];
  createNote: (title: string, content: string, category: string) => Note;
  updateNote: (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => void;
  deleteNote: (id: string) => void;
  noteCategories: string[];
  addNoteCategory: (category: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const tasksHook = useTasks();
  const goalsHook = useGoals();
  const plannerHook = usePlanner();
  const focusHook = useFocusSessions();
  const activityHook = useActivityHistory();
  const notesHook = useNotes();

  // Wrap functions to add activity tracking
  const addTaskWithActivity = (task: Omit<Task, "id" | "completed" | "createdAt" | "updatedAt">) => {
    const newTask = tasksHook.addTask(task);
    activityHook.addActivity("task", "created", task.title, `Added to ${task.subject}`);
    return newTask;
  };

  const updateTaskWithActivity = (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    const task = tasksHook.tasks.find((t) => t.id === id);
    tasksHook.updateTask(id, updates);
    if (task) {
      activityHook.addActivity("task", "updated", task.title);
    }
  };

  const deleteTaskWithActivity = (id: string) => {
    const task = tasksHook.tasks.find((t) => t.id === id);
    tasksHook.deleteTask(id);
    if (task) {
      activityHook.addActivity("task", "deleted", task.title);
    }
  };

  const toggleTaskWithActivity = (id: string) => {
    const task = tasksHook.tasks.find((t) => t.id === id);
    tasksHook.toggleTask(id);
    if (task) {
      activityHook.addActivity("task", task.completed ? "updated" : "completed", task.title);
    }
  };

  const addGoalWithActivity = (goal: Omit<Goal, "id" | "completed" | "createdAt" | "updatedAt">) => {
    const newGoal = goalsHook.addGoal(goal);
    activityHook.addActivity("goal", "created", goal.title, `Target: ${goal.target}`);
    return newGoal;
  };

  const updateGoalWithActivity = (id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => {
    const goal = goalsHook.goals.find((g) => g.id === id);
    goalsHook.updateGoal(id, updates);
    if (goal) {
      if (updates.progress === 100) {
        activityHook.addActivity("goal", "completed", goal.title);
      } else {
        activityHook.addActivity("goal", "updated", goal.title, `Progress: ${updates.progress ?? goal.progress}%`);
      }
    }
  };

  const deleteGoalWithActivity = (id: string) => {
    const goal = goalsHook.goals.find((g) => g.id === id);
    goalsHook.deleteGoal(id);
    if (goal) {
      activityHook.addActivity("goal", "deleted", goal.title);
    }
  };

  const addBlockWithActivity = (block: Omit<TimeBlock, "id" | "createdAt" | "updatedAt">) => {
    const newBlock = plannerHook.addBlock(block);
    activityHook.addActivity("planner", "created", block.title, `${block.startTime} - ${block.endTime}`);
    return newBlock;
  };

  const updateBlockWithActivity = (id: string, updates: Partial<Omit<TimeBlock, "id" | "createdAt">>) => {
    const block = plannerHook.blocks.find((b) => b.id === id);
    plannerHook.updateBlock(id, updates);
    if (block) {
      activityHook.addActivity("planner", "updated", block.title);
    }
  };

  const deleteBlockWithActivity = (id: string) => {
    const block = plannerHook.blocks.find((b) => b.id === id);
    plannerHook.deleteBlock(id);
    if (block) {
      activityHook.addActivity("planner", "deleted", block.title);
    }
  };

  const addSessionWithActivity = (type: FocusSession["type"], duration: number) => {
    const session = focusHook.addSession(type, duration);
    const typeLabels = {
      pomodoro: "Pomodoro",
      shortBreak: "Short Break",
      longBreak: "Long Break",
      deepFocus: "Deep Focus",
    };
    activityHook.addActivity("focus", "completed", `${typeLabels[type]} Session`, `${duration} minutes`);
    return session;
  };

  const createNoteWithActivity = (title: string, content: string, category: string) => {
    const note = notesHook.createNote(title, content, category);
    activityHook.addActivity("note", "created", title, `Category: ${category}`);
    return note;
  };

  const updateNoteWithActivity = (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
    const note = notesHook.notes.find((n) => n.id === id);
    notesHook.updateNote(id, updates);
    if (note) {
      activityHook.addActivity("note", "updated", note.title);
    }
  };

  const deleteNoteWithActivity = (id: string) => {
    const note = notesHook.notes.find((n) => n.id === id);
    notesHook.deleteNote(id);
    if (note) {
      activityHook.addActivity("note", "deleted", note.title);
    }
  };

  const value: AppDataContextType = {
    // Tasks
    tasks: tasksHook.tasks,
    addTask: addTaskWithActivity,
    updateTask: updateTaskWithActivity,
    deleteTask: deleteTaskWithActivity,
    toggleTask: toggleTaskWithActivity,
    getTodaysTasks: tasksHook.getTodaysTasks,
    getUpcomingDeadlines: tasksHook.getUpcomingDeadlines,

    // Goals
    goals: goalsHook.goals,
    addGoal: addGoalWithActivity,
    updateGoal: updateGoalWithActivity,
    deleteGoal: deleteGoalWithActivity,
    getActiveGoals: goalsHook.getActiveGoals,
    getCompletedGoals: goalsHook.getCompletedGoals,
    getAverageProgress: goalsHook.getAverageProgress,

    // Planner
    blocks: plannerHook.blocks,
    addBlock: addBlockWithActivity,
    updateBlock: updateBlockWithActivity,
    deleteBlock: deleteBlockWithActivity,
    getBlocksForDate: plannerHook.getBlocksForDate,

    // Focus Sessions
    sessions: focusHook.sessions,
    streak: focusHook.streak,
    addSession: addSessionWithActivity,
    getTodayStats: focusHook.getTodayStats,
    getWeeklyStats: focusHook.getWeeklyStats,
    getHeatmapData: focusHook.getHeatmapData,
    getStreakData: focusHook.getStreakData,

    // Activity History
    activities: activityHook.activities,
    addActivity: activityHook.addActivity,
    clearHistory: activityHook.clearHistory,
    getRecentActivities: activityHook.getRecentActivities,

    // Notes
    notes: notesHook.notes,
    createNote: createNoteWithActivity,
    updateNote: updateNoteWithActivity,
    deleteNote: deleteNoteWithActivity,
    noteCategories: notesHook.categories,
    addNoteCategory: notesHook.addCategory,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}

import { useState } from "react";
import { Check, Clock, AlertCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";
import { Link } from "react-router-dom";

const priorityStyles = {
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function TasksToday() {
  const { getTodaysTasks, toggleTask } = useAppData();
  const tasks = getTodaysTasks();
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="stat-card h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
          <p className="text-sm text-muted-foreground">
            {tasks.length > 0 ? `${completedCount}/${tasks.length} completed` : "No tasks due today"}
          </p>
        </div>
        <Link to="/tasks">
          <Button size="sm" variant="ghost" className="rounded-full">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </Link>
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="h-2 bg-secondary rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      )}

      {/* Tasks list */}
      <div className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-hide">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Check className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">All caught up!</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer group",
                task.completed
                  ? "bg-muted/50 border-border/50"
                  : "bg-card border-border hover:border-primary/30 hover:shadow-soft"
              )}
              onClick={() => toggleTask(task.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                  task.completed
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/30 group-hover:border-primary/50"
                )}
              >
                {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium text-sm leading-tight",
                    task.completed && "text-muted-foreground line-through"
                  )}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-muted-foreground">{task.subject}</span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      priorityStyles[task.priority]
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>

              {/* Time */}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

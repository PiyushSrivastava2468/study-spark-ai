import { useState } from "react";
import { Plus, Target, Trophy, TrendingUp, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  target: string;
  progress: number;
  deadline: string;
  category: "academic" | "study" | "skill";
  completed: boolean;
}

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Achieve 3.8 GPA this semester",
    target: "3.8 GPA",
    progress: 75,
    deadline: "May 2024",
    category: "academic",
    completed: false,
  },
  {
    id: "2",
    title: "Complete Data Structures Course",
    target: "100% completion",
    progress: 60,
    deadline: "March 2024",
    category: "study",
    completed: false,
  },
  {
    id: "3",
    title: "Learn React & TypeScript",
    target: "Build 3 projects",
    progress: 100,
    deadline: "Feb 2024",
    category: "skill",
    completed: true,
  },
  {
    id: "4",
    title: "Study 4 hours daily",
    target: "120 hours/month",
    progress: 45,
    deadline: "Ongoing",
    category: "study",
    completed: false,
  },
];

const categoryColors = {
  academic: "bg-primary/10 text-primary border-primary/20",
  study: "bg-accent/10 text-accent border-accent/20",
  skill: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const completedGoals = goals.filter((g) => g.completed).length;
  const inProgressGoals = goals.filter((g) => !g.completed).length;
  const avgProgress =
    goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Academic Goals
          </h1>
          <p className="text-muted-foreground">
            Track your progress and stay motivated
          </p>
        </div>
        <Button className="btn-gradient rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="stat-card animate-fade-in stagger-1 opacity-0">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-foreground">
                {inProgressGoals}
              </p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
        <div className="stat-card animate-fade-in stagger-2 opacity-0">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Trophy className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-foreground">
                {completedGoals}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <div className="stat-card animate-fade-in stagger-3 opacity-0">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-foreground">
                {avgProgress}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div
            key={goal.id}
            className={cn(
              "glass-card rounded-2xl p-6 transition-all hover-lift animate-fade-in opacity-0",
              goal.completed && "opacity-70"
            )}
            style={{ animationDelay: `${(index + 4) * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Completion indicator */}
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  goal.completed
                    ? "bg-emerald-500 text-white"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {goal.completed ? (
                  <Trophy className="w-5 h-5" />
                ) : (
                  <Target className="w-5 h-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className={cn(
                      "font-semibold text-lg text-foreground",
                      goal.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {goal.title}
                  </h3>
                  <span
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border capitalize",
                      categoryColors[goal.category]
                    )}
                  >
                    {goal.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {goal.target}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {goal.deadline}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span
                      className={cn(
                        "font-semibold",
                        goal.progress === 100 ? "text-emerald-500" : "text-foreground"
                      )}
                    >
                      {goal.progress}%
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-4">
            Set your first goal to start tracking your progress
          </p>
          <Button className="btn-gradient rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      )}
    </div>
  );
}

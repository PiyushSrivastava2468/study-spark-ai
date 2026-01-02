import { useState } from "react";
import {
  Plus,
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAppData } from "@/contexts/AppDataContext";
import { Goal } from "@/hooks/useGoals";

const categoryColors = {
  academic: "bg-primary/10 text-primary border-primary/20",
  study: "bg-accent/10 text-accent border-accent/20",
  skill: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export default function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getActiveGoals,
    getCompletedGoals,
    getAverageProgress,
  } = useAppData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    progress: 0,
    deadline: "",
    category: "academic" as "academic" | "study" | "skill",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      target: "",
      progress: 0,
      deadline: "",
      category: "academic",
    });
    setEditingGoal(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.target || !formData.deadline) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
    } else {
      addGoal(formData);
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      target: goal.target,
      progress: goal.progress,
      deadline: goal.deadline,
      category: goal.category,
    });
    setIsDialogOpen(true);
  };

  const completedGoals = getCompletedGoals().length;
  const inProgressGoals = getActiveGoals().length;
  const avgProgress = getAverageProgress();

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
            Academic Goals
          </h1>
          <p className="text-muted-foreground">
            Track your progress and stay motivated
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="btn-gradient rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? "Edit Goal" : "Create New Goal"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Goal title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Input
                placeholder="Target (e.g., 3.8 GPA, 100 hours)"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
              />
              <Select
                value={formData.category}
                onValueChange={(value: "academic" | "study" | "skill") =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="skill">Skill</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Deadline (e.g., May 2024)"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Progress: {formData.progress}%
                </label>
                <Slider
                  value={[formData.progress]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, progress: value[0] })
                  }
                  max={100}
                  step={5}
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full btn-gradient rounded-xl"
              >
                {editingGoal ? "Save Changes" : "Create Goal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
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
              "glass-card rounded-2xl p-4 sm:p-6 transition-all hover-lift animate-fade-in opacity-0 group",
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
                <div className="flex items-start justify-between mb-2 gap-2">
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
                      "text-xs px-3 py-1 rounded-full border capitalize flex-shrink-0",
                      categoryColors[goal.category]
                    )}
                  >
                    {goal.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
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
                        goal.progress === 100
                          ? "text-emerald-500"
                          : "text-foreground"
                      )}
                    >
                      {goal.progress}%
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => handleEdit(goal)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteGoal(goal.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No goals yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Set your first goal to start tracking your progress
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="btn-gradient rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      )}
    </div>
  );
}

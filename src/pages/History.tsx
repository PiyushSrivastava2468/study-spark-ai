import { useState } from "react";
import { Clock, CheckSquare, Target, FileText, Calendar, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeIcons = {
  task: CheckSquare,
  goal: Target,
  focus: Clock,
  note: FileText,
  planner: Calendar,
};

const typeColors = {
  task: "bg-emerald-500/10 text-emerald-500",
  goal: "bg-primary/10 text-primary",
  focus: "bg-accent/10 text-accent",
  note: "bg-yellow-500/10 text-yellow-500",
  planner: "bg-purple-500/10 text-purple-500",
};

const actionLabels = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
  completed: "Completed",
};

export default function History() {
  const { activities, clearHistory } = useAppData();
  const [filter, setFilter] = useState<string>("all");

  const filteredActivities = filter === "all"
    ? activities
    : activities.filter((a) => a.type === filter);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Activity History
          </h1>
          <p className="text-muted-foreground">
            {activities.length} activities recorded
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="goal">Goals</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="planner">Planner</SelectItem>
            </SelectContent>
          </Select>
          {activities.length > 0 && (
            <Button variant="outline" onClick={clearHistory} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No activity yet</h3>
          <p className="text-muted-foreground">
            Your actions will appear here as you use the app.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity, index) => {
            const Icon = typeIcons[activity.type];
            return (
              <div
                key={activity.id}
                className="glass-card rounded-xl p-4 flex items-center gap-4 animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className={cn("p-2 rounded-lg", typeColors[activity.type])}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="capitalize">{activity.type}</span>
                    <span>•</span>
                    <span>{actionLabels[activity.action]}</span>
                    {activity.description && (
                      <>
                        <span>•</span>
                        <span className="truncate">{activity.description}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

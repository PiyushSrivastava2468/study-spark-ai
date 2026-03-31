import { Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/contexts/AppDataContext";
import { Link } from "react-router-dom";

export function UpcomingDeadlines() {
  const { getUpcomingDeadlines } = useAppData();
  const deadlines = getUpcomingDeadlines();

  const getDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-destructive/10">
            <Calendar className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Deadlines</h3>
        </div>
        <Link to="/tasks" className="text-sm text-primary hover:underline">View all</Link>
      </div>

      <div className="space-y-3">
        {deadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines.</p>
        ) : (
          deadlines.map((task, index) => {
            const daysLeft = getDaysLeft(task.dueDate);
            const urgent = daysLeft <= 2;
            const date = new Date(task.dueDate);

            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl border transition-all hover:shadow-soft cursor-pointer group",
                  urgent
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-card border-border hover:border-primary/30"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Date badge */}
                <div
                  className={cn(
                    "flex flex-col items-center justify-center w-14 h-14 rounded-xl",
                    urgent
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary text-foreground"
                  )}
                >
                  <span className="text-lg font-bold leading-tight">
                    {date.getDate()}
                  </span>
                  <span className="text-xs uppercase">
                    {date.toLocaleString('default', { month: 'short' })}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground truncate">
                      {task.title}
                    </p>
                    {urgent && (
                      <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.subject}
                  </p>
                </div>

                {/* Days left */}
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      urgent ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {daysLeft > 0 ? `${daysLeft}d` : "Due"}
                  </p>
                  <p className="text-xs text-muted-foreground">left</p>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import { Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Deadline {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  daysLeft: number;
  urgent: boolean;
}

const deadlines: Deadline[] = [
  {
    id: "1",
    title: "Research Paper Submission",
    subject: "English",
    dueDate: "Dec 20",
    daysLeft: 2,
    urgent: true,
  },
  {
    id: "2",
    title: "Group Project Presentation",
    subject: "Business Studies",
    dueDate: "Dec 22",
    daysLeft: 4,
    urgent: false,
  },
  {
    id: "3",
    title: "Final Exam - Calculus",
    subject: "Mathematics",
    dueDate: "Dec 25",
    daysLeft: 7,
    urgent: false,
  },
];

export function UpcomingDeadlines() {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-destructive/10">
            <Calendar className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Deadlines</h3>
        </div>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-3">
        {deadlines.map((deadline, index) => (
          <div
            key={deadline.id}
            className={cn(
              "flex items-center gap-4 p-3 rounded-xl border transition-all hover:shadow-soft cursor-pointer group",
              deadline.urgent
                ? "bg-destructive/5 border-destructive/20"
                : "bg-card border-border hover:border-primary/30"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Date badge */}
            <div
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-xl",
                deadline.urgent
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary text-foreground"
              )}
            >
              <span className="text-lg font-bold leading-tight">
                {deadline.dueDate.split(" ")[1]}
              </span>
              <span className="text-xs uppercase">
                {deadline.dueDate.split(" ")[0]}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm text-foreground truncate">
                  {deadline.title}
                </p>
                {deadline.urgent && (
                  <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {deadline.subject}
              </p>
            </div>

            {/* Days left */}
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-semibold",
                  deadline.urgent ? "text-destructive" : "text-foreground"
                )}
              >
                {deadline.daysLeft}d
              </p>
              <p className="text-xs text-muted-foreground">left</p>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}

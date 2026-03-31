import { BarChart3, TrendingUp, Clock, Target, Calendar, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/contexts/AppDataContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Analytics() {
  const { sessions, tasks, getWeeklyStats } = useAppData();

  const weeklyStats = getWeeklyStats();

  // Convert weeklyStats (which is last 7 days) to chart format
  // map DailyStats { date, totalMinutes, sessions } to { day: "Mon", hours: ... }
  const weeklyData = weeklyStats.map(stat => {
    const date = new Date(stat.date);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      hours: Number((stat.totalMinutes / 60).toFixed(1)),
      sessions: stat.sessions
    };
  }).reverse(); // getWeeklyStats returns decreasing date order usually, check useFocusSessions implementation
  // Actually useFocusSessions.ts returns today at index 0, so we should reverse to show Mon->Sun or Oldest->Newest

  // Calculate Subject Data from Tasks (since sessions don't have subjects yet)
  // Group tasks by subject and count them (or use estimated time if we had it)
  const subjectCounts: Record<string, number> = {};
  tasks.forEach(task => {
    if (task.subject) {
      subjectCounts[task.subject] = (subjectCounts[task.subject] || 0) + 1;
    }
  });

  const subjectData = Object.entries(subjectCounts)
    .map(([subject, count], index) => ({
      subject,
      count,
      color: ["bg-primary", "bg-accent", "bg-emerald-500", "bg-orange-500", "bg-pink-500", "bg-blue-500"][index % 6]
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 subjects

  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1); // Avoid div by 0
  const totalTasksCount = Object.values(subjectCounts).reduce((a, b) => a + b, 0);

  const totalFocusHours = (sessions.reduce((acc, s) => acc + s.duration, 0) / 60).toFixed(1);
  const totalSessions = sessions.length;
  // Simple "Avg/Day" based on all time? Or just this week? Let's use this week stats.
  const thisWeekTotalHours = weeklyData.reduce((acc, d) => acc + d.hours, 0);
  const avgHoursPerDay = (thisWeekTotalHours / 7).toFixed(1);

  const hasData = sessions.length > 0 || tasks.length > 0;

  if (!hasData) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your study patterns and productivity
          </p>
        </div>

        <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No Data Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Start using the app to generate analytics. Complete tasks, use the focus timer, and set goals to see your progress here.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/focus">
              <Button className="gap-2">
                <Clock className="w-4 h-4" />
                Start Focus Session
              </Button>
            </Link>
            <Link to="/tasks">
              <Button variant="outline" className="gap-2">
                <Target className="w-4 h-4" />
                Add Tasks
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your study patterns and productivity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Focus Hours", value: `${totalFocusHours}h`, icon: Clock, change: "All time", color: "primary" },
          { label: "Total Sessions", value: `${totalSessions}`, icon: Target, change: "All time", color: "accent" },
          { label: "Avg/Day (Week)", value: `${avgHoursPerDay}h`, icon: TrendingUp, change: "Last 7 days", color: "emerald" },
          { label: "Tasks Tracked", value: `${tasks.length}`, icon: Brain, change: "Total", color: "orange" },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="stat-card animate-fade-in opacity-0"
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "p-2.5 rounded-xl",
                stat.color === "primary" && "bg-primary/10",
                stat.color === "accent" && "bg-accent/10",
                stat.color === "emerald" && "bg-emerald-500/10",
                stat.color === "orange" && "bg-orange-500/10"
              )}>
                <stat.icon className={cn(
                  "w-5 h-5",
                  stat.color === "primary" && "text-primary",
                  stat.color === "accent" && "text-accent",
                  stat.color === "emerald" && "text-emerald-500",
                  stat.color === "orange" && "text-orange-500"
                )} />
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-3 opacity-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Weekly Focus Time</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last 7 Days</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48 mb-4">
            {weeklyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-secondary rounded-t-lg relative overflow-hidden" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(data.hours / maxHours) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.day}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total (Week): <span className="font-semibold text-foreground">{thisWeekTotalHours.toFixed(1)} hours</span>
            </span>
          </div>
        </div>

        {/* Subject Breakdown (Tasks) */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-4 opacity-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Tasks by Subject</h3>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">All Tasks</span>
            </div>
          </div>

          <div className="space-y-4">
            {subjectData.length > 0 ? subjectData.map((subject, index) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{subject.subject}</span>
                  <span className="text-muted-foreground">{subject.count} tasks</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", subject.color)}
                    style={{
                      width: `${(subject.count / totalTasksCount) * 100}%`,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No tasks with subjects found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

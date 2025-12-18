import { BarChart3, TrendingUp, Clock, Target, Calendar, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const weeklyData = [
  { day: "Mon", hours: 4.5, sessions: 3 },
  { day: "Tue", hours: 5.2, sessions: 4 },
  { day: "Wed", hours: 3.8, sessions: 3 },
  { day: "Thu", hours: 6.1, sessions: 5 },
  { day: "Fri", hours: 4.2, sessions: 3 },
  { day: "Sat", hours: 2.5, sessions: 2 },
  { day: "Sun", hours: 3.0, sessions: 2 },
];

const subjectData = [
  { subject: "Mathematics", hours: 12, color: "bg-primary" },
  { subject: "Physics", hours: 8, color: "bg-accent" },
  { subject: "Computer Science", hours: 10, color: "bg-emerald-500" },
  { subject: "Chemistry", hours: 6, color: "bg-orange-500" },
  { subject: "English", hours: 4, color: "bg-pink-500" },
];

const maxHours = Math.max(...weeklyData.map((d) => d.hours));
const totalSubjectHours = subjectData.reduce((sum, s) => sum + s.hours, 0);

export default function Analytics() {
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
          { label: "Total Hours", value: "29.3h", icon: Clock, change: "+12%", color: "primary" },
          { label: "Sessions", value: "22", icon: Target, change: "+8%", color: "accent" },
          { label: "Avg/Day", value: "4.2h", icon: TrendingUp, change: "+5%", color: "emerald" },
          { label: "AI Uses", value: "18", icon: Brain, change: "+24%", color: "orange" },
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
              <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
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
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48 mb-4">
            {weeklyData.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
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
              Total: <span className="font-semibold text-foreground">29.3 hours</span>
            </span>
            <span className="text-muted-foreground">
              Avg: <span className="font-semibold text-foreground">4.2h/day</span>
            </span>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-4 opacity-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Subject Breakdown</h3>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
          </div>

          <div className="space-y-4">
            {subjectData.map((subject, index) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{subject.subject}</span>
                  <span className="text-muted-foreground">{subject.hours}h</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", subject.color)}
                    style={{
                      width: `${(subject.hours / totalSubjectHours) * 100}%`,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Study Time</span>
              <span className="font-semibold text-foreground">{totalSubjectHours} hours</span>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-fade-in stagger-5 opacity-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Peak Hours</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You're most productive between <span className="font-semibold text-foreground">9 AM - 12 PM</span>. 
                Schedule difficult tasks during this time.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-accent" />
                <span className="font-medium text-foreground">Focus Areas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Chemistry</span> needs more attention. 
                Consider adding extra study sessions this week.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-emerald-500" />
                <span className="font-medium text-foreground">Weekly Goal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You've hit <span className="font-semibold text-foreground">83%</span> of your 35-hour weekly goal. 
                Keep up the great work!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Clock, CheckSquare, Target, Brain, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickPomodoro } from "@/components/dashboard/QuickPomodoro";
import { TasksToday } from "@/components/dashboard/TasksToday";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { FocusHeatmap } from "@/components/dashboard/FocusHeatmap";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";

export default function Dashboard() {
  const { tasks, goals, sessions, getTodayStats, getAverageProgress } = useAppData();

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  const todayStats = getTodayStats();
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const weeklyGoalProgress = getAverageProgress();
  const aiSessions = sessions.filter((s) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(s.completedAt) >= weekAgo;
  }).length;

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const hasData = tasks.length > 0 || goals.length > 0 || sessions.length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
          {greeting}, Student! 👋
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {hasData
            ? "Let's make today productive. You've got this!"
            : "Welcome! Start by adding your first task or goal."}
        </p>
      </div>

      {/* Empty State for New Users */}
      {!hasData && (
        <div className="glass-card rounded-2xl p-8 mb-8 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Welcome to Study Spark AI!
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Your personal study companion. Start by adding tasks, setting goals, or beginning a focus session.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/tasks">
              <Button className="btn-gradient rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add First Task
              </Button>
            </Link>
            <Link to="/goals">
              <Button variant="outline" className="rounded-xl">
                <Target className="w-4 h-4 mr-2" />
                Set a Goal
              </Button>
            </Link>
            <Link to="/focus">
              <Button variant="outline" className="rounded-xl">
                <Clock className="w-4 h-4 mr-2" />
                Start Focus Session
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <div className="animate-fade-in stagger-1 opacity-0">
          <StatCard
            title="Focus Today"
            value={todayStats.totalMinutes > 0 ? formatFocusTime(todayStats.totalMinutes) : "0m"}
            subtitle={todayStats.sessions > 0 ? `${todayStats.sessions} sessions` : "No sessions yet"}
            icon={Clock}
            gradient="primary"
          />
        </div>
        <div className="animate-fade-in stagger-2 opacity-0">
          <StatCard
            title="Tasks Done"
            value={totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "0"}
            subtitle={totalTasks > 0 ? `${tasks.filter((t) => t.priority === "high" && !t.completed).length} high priority` : "Add your first task"}
            icon={CheckSquare}
            gradient="success"
          />
        </div>
        <div className="animate-fade-in stagger-3 opacity-0">
          <StatCard
            title="Weekly Goal"
            value={goals.length > 0 ? `${weeklyGoalProgress}%` : "—"}
            subtitle={goals.length > 0 ? (weeklyGoalProgress >= 70 ? "On track!" : "Keep going!") : "Set a goal"}
            icon={Target}
            gradient="accent"
          />
        </div>
        <div className="animate-fade-in stagger-4 opacity-0">
          <StatCard
            title="Focus Sessions"
            value={aiSessions}
            subtitle="This week"
            icon={Brain}
            gradient="warm"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-fade-in stagger-3 opacity-0">
            <TasksToday />
          </div>
          <div className="animate-fade-in stagger-4 opacity-0">
            <FocusHeatmap />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="animate-fade-in stagger-2 opacity-0">
            <QuickPomodoro />
          </div>
          <div className="animate-fade-in stagger-3 opacity-0">
            <StreakCard />
          </div>
          <div className="animate-fade-in stagger-4 opacity-0">
            <UpcomingDeadlines />
          </div>
        </div>
      </div>
    </div>
  );
}

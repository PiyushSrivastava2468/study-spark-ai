import { Clock, CheckSquare, Target, Brain } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickPomodoro } from "@/components/dashboard/QuickPomodoro";
import { TasksToday } from "@/components/dashboard/TasksToday";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { FocusHeatmap } from "@/components/dashboard/FocusHeatmap";

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {greeting}, Student! 👋
        </h1>
        <p className="text-muted-foreground">
          Let's make today productive. You've got this!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="animate-fade-in stagger-1 opacity-0">
          <StatCard
            title="Focus Today"
            value="3h 24m"
            subtitle="Goal: 5 hours"
            icon={Clock}
            trend={{ value: 12, positive: true }}
            gradient="primary"
          />
        </div>
        <div className="animate-fade-in stagger-2 opacity-0">
          <StatCard
            title="Tasks Done"
            value="7/12"
            subtitle="3 high priority"
            icon={CheckSquare}
            gradient="success"
          />
        </div>
        <div className="animate-fade-in stagger-3 opacity-0">
          <StatCard
            title="Weekly Goal"
            value="68%"
            subtitle="On track!"
            icon={Target}
            trend={{ value: 5, positive: true }}
            gradient="accent"
          />
        </div>
        <div className="animate-fade-in stagger-4 opacity-0">
          <StatCard
            title="AI Sessions"
            value="4"
            subtitle="This week"
            icon={Brain}
            gradient="warm"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

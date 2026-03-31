import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Timer,
  Brain,
  Target,
  GraduationCap,
  BarChart3,
  Calendar,
  FileText,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorialStep {
  title: string;
  description: string;
}

interface Tutorial {
  id: string;
  title: string;
  icon: any;
  color: string;
  steps: TutorialStep[];
}

const tutorials: Record<string, Tutorial[]> = {
  "Getting Started": [
    {
      id: "account",
      title: "Creating Your Account",
      icon: Sparkles,
      color: "text-primary",
      steps: [
        { title: "Sign Up", description: "Visit the login page and create a new account using your email and password, or sign in with Google." },
        { title: "Set Up Profile", description: "Go to Settings to customize your display name, theme preferences, and notification settings." },
        { title: "Explore Dashboard", description: "Your Dashboard shows a quick overview of tasks, focus sessions, streaks, and upcoming deadlines." },
      ],
    },
    {
      id: "navigation",
      title: "Navigating the App",
      icon: BookOpen,
      color: "text-accent",
      steps: [
        { title: "Sidebar Navigation", description: "Use the left sidebar to access all features. On mobile, tap the hamburger menu icon." },
        { title: "Quick Actions", description: "Most pages have action buttons at the top for creating new items (tasks, notes, goals)." },
        { title: "Theme Toggle", description: "Switch between light and dark mode using the theme toggle in the sidebar or settings." },
      ],
    },
  ],
  "Productivity Tools": [
    {
      id: "tasks",
      title: "Managing Tasks",
      icon: CheckSquare,
      color: "text-emerald-500",
      steps: [
        { title: "Create a Task", description: "Click 'Add Task' on the Tasks page. Enter a title, set priority (low/medium/high), and assign a due date." },
        { title: "Organize Tasks", description: "Filter tasks by status (pending, in-progress, completed) or priority using the filter dropdown." },
        { title: "Track Progress", description: "Check off tasks as you complete them. Your completion rate shows on the Dashboard." },
      ],
    },
    {
      id: "focus",
      title: "Focus Timer (Pomodoro)",
      icon: Timer,
      color: "text-orange-500",
      steps: [
        { title: "Set Duration", description: "Choose from preset times (25, 45, 60 minutes) or set a custom focus duration." },
        { title: "Start a Session", description: "Hit 'Start' to begin. The timer runs in the background so you can navigate to other pages." },
        { title: "Track Sessions", description: "Completed sessions are logged automatically and visible in Analytics and the Focus Heatmap." },
      ],
    },
    {
      id: "planner",
      title: "Weekly Planner",
      icon: Calendar,
      color: "text-purple-500",
      steps: [
        { title: "View Your Week", description: "The Planner shows a 7-day view. Click any day to add study blocks or events." },
        { title: "Add Events", description: "Create time-blocked study sessions with subjects, start time, and duration." },
        { title: "Drag & Adjust", description: "Reorganize your schedule by editing or removing events as your plans change." },
      ],
    },
    {
      id: "notes",
      title: "Taking Notes",
      icon: FileText,
      color: "text-yellow-500",
      steps: [
        { title: "Create a Note", description: "Click 'New Note' on the Notes page. Give it a title and start writing." },
        { title: "Organize Notes", description: "Use folders or tags to categorize your notes by subject or topic." },
        { title: "Search Notes", description: "Use the search bar to quickly find notes by title or content." },
      ],
    },
  ],
  "AI-Powered Features": [
    {
      id: "ai-hub",
      title: "AI Study Hub",
      icon: Brain,
      color: "text-primary",
      steps: [
        { title: "Enter Content", description: "Paste your notes, type a topic, upload a PDF, snap a photo of your textbook, or use voice input." },
        { title: "Choose a Tool", description: "Select from Smart Summary, Flashcards, Quiz Me, Important Questions, Revision Notes, or 5-Min Revision." },
        { title: "Generate & Save", description: "Click 'Generate' and wait for the AI. Save results to your Library for later review." },
      ],
    },
    {
      id: "ai-chat",
      title: "AI Chat Assistant",
      icon: MessageCircle,
      color: "text-accent",
      steps: [
        { title: "Open Chat", description: "Navigate to 'AI Chat' in the sidebar to open the conversational assistant." },
        { title: "Ask Anything", description: "Type any question — explain concepts, solve problems, get study advice, or brainstorm ideas." },
        { title: "Use Context", description: "The chat remembers your conversation history, so you can ask follow-up questions naturally." },
      ],
    },
  ],
  "Academic Tracking": [
    {
      id: "gpa",
      title: "GPA Calculator",
      icon: GraduationCap,
      color: "text-blue-500",
      steps: [
        { title: "Add Courses", description: "Enter course names, credit hours, and grades to calculate your GPA." },
        { title: "Track Semesters", description: "Add multiple semesters to see your cumulative GPA over time." },
        { title: "Set Targets", description: "Set a target GPA to track your progress towards your academic goals." },
      ],
    },
    {
      id: "goals",
      title: "Goal Setting",
      icon: Target,
      color: "text-rose-500",
      steps: [
        { title: "Create Goals", description: "Set specific, measurable goals with deadlines (e.g., 'Complete 5 chapters by Friday')." },
        { title: "Track Progress", description: "Update your progress percentage as you work towards each goal." },
        { title: "Review & Reflect", description: "Check completed goals in your History to see how productive you've been." },
      ],
    },
    {
      id: "analytics",
      title: "Analytics Dashboard",
      icon: BarChart3,
      color: "text-cyan-500",
      steps: [
        { title: "View Stats", description: "See your focus hours, tasks completed, and active streaks at a glance." },
        { title: "Charts & Trends", description: "Interactive charts show your productivity patterns over days, weeks, and months." },
        { title: "Heatmap", description: "The Focus Heatmap visualizes your most productive times and days." },
      ],
    },
  ],
};

export default function Tutorials() {
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>("account");

  const toggleTutorial = (id: string) => {
    setExpandedTutorial(expandedTutorial === id ? null : id);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">Learn the App</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
          Tutorials
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Step-by-step guides to help you get the most out of Study Spark AI. Click on any tutorial to expand.
        </p>
      </div>

      {/* Tutorial Categories */}
      <div className="space-y-8">
        {Object.entries(tutorials).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              {category}
            </h2>
            <div className="space-y-3">
              {items.map((tutorial) => {
                const Icon = tutorial.icon;
                const isExpanded = expandedTutorial === tutorial.id;

                return (
                  <div
                    key={tutorial.id}
                    className="glass-card rounded-xl overflow-hidden border border-border transition-all"
                  >
                    <button
                      onClick={() => toggleTutorial(tutorial.id)}
                      className="w-full p-4 flex items-center gap-4 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <div className={cn("p-2 rounded-lg bg-secondary", tutorial.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-foreground flex-1">
                        {tutorial.title}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 animate-fade-in">
                        <div className="ml-3 border-l-2 border-primary/20 pl-6 space-y-4">
                          {tutorial.steps.map((step, stepIdx) => (
                            <div key={stepIdx} className="relative">
                              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                                <span className="text-[8px] font-bold text-primary">
                                  {stepIdx + 1}
                                </span>
                              </div>
                              <h4 className="font-semibold text-foreground text-sm">
                                {step.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {step.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

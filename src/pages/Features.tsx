import {
  Brain,
  CheckSquare,
  Timer,
  Calendar,
  GraduationCap,
  Target,
  BarChart3,
  FileText,
  MessageCircle,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  Clock,
  Lightbulb,
  Upload,
  Mic,
  Save,
  Moon,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  benefits: string[];
  icon: any;
  color: string;
  gradient: string;
}

const featureSections: { title: string; features: Feature[] }[] = [
  {
    title: "🧠 AI-Powered Learning",
    features: [
      {
        title: "AI Chat Assistant",
        description:
          "Have real-time conversations with an AI tutor. Ask questions, get explanations, solve problems — all with full conversation memory.",
        benefits: ["Instant doubt resolution", "Context-aware follow-ups", "Works with any subject"],
        icon: MessageCircle,
        color: "text-violet-500",
        gradient: "from-violet-500/10 to-purple-500/10",
      },
      {
        title: "Smart Summaries",
        description:
          "Turn lengthy notes or textbook chapters into concise, easy-to-review summaries powered by Google Gemini AI.",
        benefits: ["Save study time", "Focus on key points", "Multiple difficulty levels"],
        icon: FileText,
        color: "text-blue-500",
        gradient: "from-blue-500/10 to-cyan-500/10",
      },
      {
        title: "AI Flashcards",
        description:
          "Automatically generate interactive flashcards from any text. Flip to reveal answers with a beautiful card UI.",
        benefits: ["Active recall practice", "Auto-generated content", "Interactive flip animation"],
        icon: Layers,
        color: "text-amber-500",
        gradient: "from-amber-500/10 to-yellow-500/10",
      },
      {
        title: "Quiz Generator",
        description:
          "Create multiple-choice quizzes instantly. Test your understanding with auto-graded questions and score tracking.",
        benefits: ["Self-assessment", "Instant feedback", "Score history"],
        icon: HelpCircle,
        color: "text-rose-500",
        gradient: "from-rose-500/10 to-pink-500/10",
      },
      {
        title: "Important Questions",
        description:
          "Get AI-predicted likely exam questions for any topic. Prepare smarter by focusing on what matters.",
        benefits: ["Exam preparation", "Topic-specific", "Answer hints included"],
        icon: Lightbulb,
        color: "text-emerald-500",
        gradient: "from-emerald-500/10 to-green-500/10",
      },
      {
        title: "5-Minute Revision",
        description:
          "Quick revision notes for last-minute study sessions. Get the most critical points in a compact format.",
        benefits: ["Time-efficient", "High-yield content", "Pre-exam boost"],
        icon: Clock,
        color: "text-orange-500",
        gradient: "from-orange-500/10 to-red-500/10",
      },
    ],
  },
  {
    title: "⚡ Productivity Suite",
    features: [
      {
        title: "Task Manager",
        description:
          "Create, organize, and track tasks with priorities, due dates, and status tracking. Never miss a deadline.",
        benefits: ["Priority levels", "Due date tracking", "Status filters"],
        icon: CheckSquare,
        color: "text-emerald-500",
        gradient: "from-emerald-500/10 to-teal-500/10",
      },
      {
        title: "Focus Timer",
        description:
          "Pomodoro-style focus timer with customizable durations. Track your focused study time automatically.",
        benefits: ["Customizable durations", "Session logging", "Productivity heatmap"],
        icon: Timer,
        color: "text-orange-500",
        gradient: "from-orange-500/10 to-amber-500/10",
      },
      {
        title: "Weekly Planner",
        description:
          "Plan your entire week with time-blocked study sessions. Organize by subject, priority, and time.",
        benefits: ["Visual schedule", "Time blocking", "Drag & edit"],
        icon: Calendar,
        color: "text-purple-500",
        gradient: "from-purple-500/10 to-violet-500/10",
      },
      {
        title: "Notes",
        description:
          "Create and organize study notes with full-text editing. Search through your notes instantly.",
        benefits: ["Quick capture", "Full-text search", "Organized by subject"],
        icon: FileText,
        color: "text-yellow-500",
        gradient: "from-yellow-500/10 to-orange-500/10",
      },
      {
        title: "Goal Tracking",
        description:
          "Set academic goals and track your progress. Stay motivated with visual progress indicators.",
        benefits: ["Progress tracking", "Deadline management", "Achievement history"],
        icon: Target,
        color: "text-rose-500",
        gradient: "from-rose-500/10 to-pink-500/10",
      },
    ],
  },
  {
    title: "📊 Academic Tracking",
    features: [
      {
        title: "GPA Calculator",
        description:
          "Calculate and track your GPA across subjects and semesters. Set target GPAs and monitor progress.",
        benefits: ["Multi-semester", "Target tracking", "Grade predictions"],
        icon: GraduationCap,
        color: "text-blue-500",
        gradient: "from-blue-500/10 to-indigo-500/10",
      },
      {
        title: "Analytics Dashboard",
        description:
          "Comprehensive analytics with charts showing study patterns, productivity trends, and academic progress.",
        benefits: ["Visual insights", "Trend analysis", "Monthly reports"],
        icon: BarChart3,
        color: "text-cyan-500",
        gradient: "from-cyan-500/10 to-blue-500/10",
      },
      {
        title: "Activity History",
        description:
          "Complete log of all your actions — tasks completed, goals achieved, focus sessions done, and more.",
        benefits: ["Full audit trail", "Filter by type", "Persistent storage"],
        icon: Clock,
        color: "text-indigo-500",
        gradient: "from-indigo-500/10 to-purple-500/10",
      },
    ],
  },
  {
    title: "✨ Platform Features",
    features: [
      {
        title: "Multi-Input Support",
        description:
          "Input content via text, PDF upload, image OCR, or voice recording. Study from any source material.",
        benefits: ["PDF text extraction", "Image OCR (Tesseract)", "Voice-to-text"],
        icon: Upload,
        color: "text-teal-500",
        gradient: "from-teal-500/10 to-green-500/10",
      },
      {
        title: "AI Material Library",
        description:
          "Save AI-generated content to your personal library. Access flashcards, quizzes, and notes anytime.",
        benefits: ["Persistent storage", "Organized by type", "Quick access"],
        icon: Save,
        color: "text-primary",
        gradient: "from-primary/10 to-accent/10",
      },
      {
        title: "Dark & Light Mode",
        description:
          "Beautiful themes for day and night study sessions. Easy on the eyes with carefully chosen colors.",
        benefits: ["Reduces eye strain", "System preference sync", "One-click toggle"],
        icon: Moon,
        color: "text-slate-500",
        gradient: "from-slate-500/10 to-gray-500/10",
      },
      {
        title: "Secure Authentication",
        description:
          "Powered by Supabase Auth with email/password login. Your data is securely stored and synced.",
        benefits: ["Secure login", "Data encryption", "Cross-device sync"],
        icon: Shield,
        color: "text-green-500",
        gradient: "from-green-500/10 to-emerald-500/10",
      },
      {
        title: "Mobile Ready",
        description:
          "Fully responsive design that works on phones, tablets, and desktops. Also available as an Android app via Capacitor.",
        benefits: ["Responsive UI", "Android APK", "Touch optimized"],
        icon: Smartphone,
        color: "text-fuchsia-500",
        gradient: "from-fuchsia-500/10 to-pink-500/10",
      },
    ],
  },
];

export default function Features() {
  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Everything You Need</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
          All Features
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Study Spark AI combines AI-powered learning, productivity tools, and academic tracking into one powerful application.
        </p>
      </div>

      {/* Feature Sections */}
      <div className="space-y-12">
        {featureSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={cn(
                      "group relative rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                      `bg-gradient-to-br ${feature.gradient}`
                    )}
                  >
                    <div className={cn("p-2.5 rounded-xl bg-background/80 w-fit mb-4 shadow-sm", feature.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="space-y-1.5">
                      {feature.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-center gap-2 text-xs text-foreground/80"
                        >
                          <Sparkles className="w-3 h-3 text-primary shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
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

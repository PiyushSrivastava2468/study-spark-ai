import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Calendar,
  GraduationCap,
  Brain,
  Target,
  BarChart3,
  Settings,
  ChevronLeft,
  Sparkles,
  Menu,
  X,
  FileText,
  Clock,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: Timer, label: "Focus", path: "/focus" },
  { icon: Calendar, label: "Planner", path: "/planner" },
  { icon: GraduationCap, label: "GPA", path: "/gpa" },
  { icon: Brain, label: "AI Study Hub", path: "/ai-hub", highlight: true },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Clock, label: "History", path: "/history" },
  { icon: Download, label: "Install App", path: "/install" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              FocusFlow
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
          isMobile
            ? cn(
                "left-0 w-72 top-16 h-[calc(100vh-4rem)]",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
              )
            : cn(
                "left-0",
                collapsed ? "w-20" : "w-64"
              )
        )}
      >
        {/* Logo - Desktop only */}
        {!isMobile && (
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-xl text-foreground">
                FocusFlow
              </span>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={cn(
                  "nav-item group relative",
                  isActive && "nav-item-active",
                  item.highlight && !isActive && "text-accent"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0",
                    item.highlight && "text-accent"
                  )}
                />
                {(!collapsed || isMobile) && (
                  <span className="font-medium">{item.label}</span>
                )}
                {item.highlight && (!collapsed || isMobile) && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-accent/10 text-accent">
                    AI
                  </span>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          {!isMobile && (
            <div className="nav-item justify-center">
              <ThemeToggle />
            </div>
          )}
          <Link to="/settings" onClick={closeMobile} className="nav-item">
            <Settings className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>Settings</span>}
          </Link>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="nav-item w-full"
            >
              <ChevronLeft
                className={cn(
                  "w-5 h-5 transition-transform flex-shrink-0",
                  collapsed && "rotate-180"
                )}
              />
              {!collapsed && <span>Collapse</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

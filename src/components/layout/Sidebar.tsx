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
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useScreenSize } from "@/hooks/use-mobile";
import { useSidebar } from "@/contexts/SidebarContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: Timer, label: "Focus", path: "/focus" },
  { icon: Calendar, label: "Planner", path: "/planner" },
  { icon: GraduationCap, label: "GPA", path: "/gpa" },
  { icon: Brain, label: "AI Study Hub", path: "/ai-hub", highlight: true },
  { icon: MessageCircle, label: "AI Chat", path: "/ai-chat", highlight: true },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Clock, label: "History", path: "/history" },
];

const mobileQuickNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Brain, label: "AI Hub", path: "/ai-hub", highlight: true },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: Timer, label: "Focus", path: "/focus" },
];

export function Sidebar() {
  const location = useLocation();
  const { isMobile } = useScreenSize();
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* Mobile Top Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Study Spark AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-foreground"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Drawer Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar (Desktop / Tablet / Mobile Drawer) */}
      <aside
        className={cn(
          "fixed top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
          isMobile
            ? cn(
                "left-0 w-72 top-16 h-[calc(100vh-4rem)] pb-16",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
              )
            : cn(
                "left-0",
                collapsed ? "w-20" : "w-64"
              )
        )}
      >
        {/* Logo - Desktop/Tablet */}
        {!isMobile && (
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-xl text-foreground truncate">
                Study Spark AI
              </span>
            )}
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                title={collapsed && !isMobile ? item.label : undefined}
                className={cn(
                  "nav-item group relative flex items-center",
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
                  <span className="font-medium truncate ml-3">{item.label}</span>
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

        {/* Bottom controls */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          {!isMobile && (
            <div className="nav-item justify-center">
              <ThemeToggle />
            </div>
          )}
          <Link
            to="/settings"
            onClick={closeMobile}
            title={collapsed && !isMobile ? "Settings" : undefined}
            className="nav-item"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span className="ml-3 font-medium">Settings</span>}
          </Link>
          {!isMobile && (
            <button
              onClick={toggleCollapsed}
              className="nav-item w-full flex items-center"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "w-5 h-5 transition-transform flex-shrink-0",
                  collapsed && "rotate-180"
                )}
              />
              {!collapsed && <span className="ml-3 font-medium">Collapse</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Quick Navigation Bar */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-sidebar/95 backdrop-blur-md border-t border-sidebar-border flex items-center justify-around px-2 z-40">
          {mobileQuickNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all text-xs font-medium",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-1 rounded-lg transition-colors",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}


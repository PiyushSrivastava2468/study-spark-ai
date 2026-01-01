import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={showLabel ? "default" : "icon"}
      onClick={toggleTheme}
      className={cn("rounded-xl", className)}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-5 h-5" />
          {showLabel && <span className="ml-2">Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-5 h-5" />
          {showLabel && <span className="ml-2">Dark Mode</span>}
        </>
      )}
    </Button>
  );
}

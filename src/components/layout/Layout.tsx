import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useScreenSize } from "@/hooks/use-mobile";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { isMobile } = useScreenSize();
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          "min-h-screen overflow-x-hidden transition-all duration-300",
          isMobile
            ? "pt-16 pb-20 w-full"
            : collapsed
            ? "ml-20 w-[calc(100%-5rem)]"
            : "ml-64 w-[calc(100%-16rem)]"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}


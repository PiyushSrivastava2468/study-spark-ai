import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className={
          isMobile
            ? "pt-16 min-h-screen w-full overflow-x-hidden"
            : "ml-64 min-h-screen w-[calc(100%-16rem)] overflow-x-hidden"
        }
      >
        {children}
      </main>
    </div>
  );
}

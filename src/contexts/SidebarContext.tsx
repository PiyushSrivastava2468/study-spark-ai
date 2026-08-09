import React, { createContext, useContext, useState, useEffect } from "react";
import { useScreenSize } from "@/hooks/use-mobile";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleCollapsed: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const { isTablet, isMobile } = useScreenSize();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Automatically collapse sidebar on tablet screens to optimize canvas space
  useEffect(() => {
    if (isTablet) {
      setCollapsed(true);
    } else if (!isMobile) {
      setCollapsed(false);
    }
  }, [isTablet, isMobile]);

  // Close mobile drawer when screen resizes to desktop/tablet
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        mobileOpen,
        setMobileOpen,
        toggleCollapsed,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

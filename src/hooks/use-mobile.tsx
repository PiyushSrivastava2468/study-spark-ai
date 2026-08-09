import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export type ScreenType = "phone" | "tablet" | "desktop";

export function useScreenSize() {
  const [screenType, setScreenType] = React.useState<ScreenType>("desktop");

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setScreenType("phone");
      } else if (width < TABLET_BREAKPOINT) {
        setScreenType("tablet");
      } else {
        setScreenType("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    screenType,
    isMobile: screenType === "phone",
    isTablet: screenType === "tablet",
    isDesktop: screenType === "desktop",
  };
}

export function useIsMobile() {
  const { isMobile } = useScreenSize();
  return isMobile;
}

export function useIsTablet() {
  const { isTablet } = useScreenSize();
  return isTablet;
}

export function useIsDesktop() {
  const { isDesktop } = useScreenSize();
  return isDesktop;
}


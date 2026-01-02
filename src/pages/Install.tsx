import { useState, useEffect } from "react";
import { Download, Check, Smartphone, Monitor, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(checkStandalone);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
            App Installed!
          </h1>
          <p className="text-muted-foreground">
            You're using FocusFlow as an installed app. Enjoy the full experience!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-glow">
          <Download className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
          Install FocusFlow
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Install FocusFlow on your device for the best experience. Works offline and loads instantly!
        </p>
      </div>

      {/* Install Section */}
      <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in stagger-1 opacity-0">
        {isInstalled ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Successfully Installed!
            </h2>
            <p className="text-muted-foreground">
              FocusFlow has been added to your home screen.
            </p>
          </div>
        ) : deferredPrompt ? (
          <div className="text-center py-4">
            <Button onClick={handleInstall} className="btn-gradient rounded-xl text-lg px-8 py-6">
              <Download className="w-5 h-5 mr-2" />
              Install Now
            </Button>
          </div>
        ) : isIOS ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              Install on iOS
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap the Share button</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Look for <Share className="w-4 h-4" /> at the bottom of Safari
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Scroll down and tap</p>
                  <p className="text-sm text-muted-foreground">"Add to Home Screen"</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap "Add"</p>
                  <p className="text-sm text-muted-foreground">FocusFlow will appear on your home screen</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground text-center">
              Install on Android
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Open browser menu</p>
                  <p className="text-sm text-muted-foreground">Tap the three dots in the top right</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap "Install app" or "Add to Home screen"</p>
                  <p className="text-sm text-muted-foreground">The option may vary by browser</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Confirm installation</p>
                  <p className="text-sm text-muted-foreground">FocusFlow will appear on your home screen</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid sm:grid-cols-2 gap-4 animate-fade-in stagger-2 opacity-0">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Works Offline</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Access your tasks, notes, and planner even without internet connection.
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Monitor className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">Instant Loading</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Launches instantly like a native app, no browser delays.
          </p>
        </div>
      </div>
    </div>
  );
}

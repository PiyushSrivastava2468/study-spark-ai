import { User, Bell, Palette, Clock, Shield, Download, Moon, Sun, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useState } from "react";
import { useScreenSize } from "@/hooks/use-mobile";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "focus", label: "Focus Settings", icon: Clock },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "data", label: "Data & Backup", icon: Download },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSetting } = useNotificationSettings();
  const { isMobile, isTablet } = useScreenSize();

  const isDesktop = !isMobile && !isTablet;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Customize your Study Spark AI experience
        </p>
      </div>

      {/* Layout: side nav on tablet/desktop, top tabs on mobile */}
      <div className={cn("gap-4 sm:gap-6", isDesktop || isTablet ? "grid grid-cols-4" : "flex flex-col")}>

        {/* ── Section Nav ── */}
        {/* Mobile: horizontal scrollable pill tabs */}
        {isMobile && (
          <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 animate-fade-in">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Tablet: 2-col icon+label sidebar */}
        {isTablet && (
          <div className="col-span-1">
            <nav className="flex flex-col gap-1 animate-fade-in stagger-1" style={{ opacity: 0 }}>
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                      activeSection === section.id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Desktop: full label sidebar */}
        {isDesktop && (
          <div className="col-span-1">
            <nav className="flex flex-col gap-1 animate-fade-in stagger-1" style={{ opacity: 0 }}>
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                      activeSection === section.id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-base">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* ── Content Panel ── */}
        <div className={cn(isDesktop || isTablet ? "col-span-3" : "")}>
          <div className="glass-card rounded-2xl p-4 sm:p-6 animate-fade-in stagger-2" style={{ opacity: 0 }}>

            {/* Profile */}
            {activeSection === "profile" && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Profile Settings</h2>
                <div className={cn("flex gap-4 sm:gap-6", isMobile ? "flex-col items-center text-center" : "flex-row items-center")}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl sm:text-2xl font-bold text-primary-foreground flex-shrink-0">
                    S
                  </div>
                  <div className={isMobile ? "text-center" : "text-left"}>
                    <h3 className="font-semibold text-foreground">Student Name</h3>
                    <p className="text-sm text-muted-foreground">student@university.edu</p>
                    <Button variant="outline" size="sm" className="mt-2 rounded-xl">
                      Change Photo
                    </Button>
                  </div>
                </div>
                <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Student Name"
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary border border-border input-focus text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      defaultValue="student@university.edu"
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary border border-border input-focus text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">University</label>
                  <input
                    type="text"
                    defaultValue="State University"
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary border border-border input-focus text-foreground"
                  />
                </div>
                <Button className="btn-gradient rounded-xl w-full sm:w-auto">Save Changes</Button>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Notification Preferences</h2>
                <div className="space-y-3">
                  {/* Study Reminders */}
                  <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm sm:text-base">Study Reminders</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Get reminded to start your study sessions</p>
                      </div>
                      <Switch
                        checked={settings.studyReminders}
                        onCheckedChange={(checked) => updateSetting("studyReminders", checked)}
                      />
                    </div>
                    {settings.studyReminders && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border flex-wrap">
                        <span className="text-sm text-muted-foreground">Remind at:</span>
                        <Input
                          type="time"
                          value={settings.studyReminderTime}
                          onChange={(e) => updateSetting("studyReminderTime", e.target.value)}
                          className="w-auto rounded-xl bg-background"
                        />
                      </div>
                    )}
                  </div>

                  {/* Break Alerts */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">Break Alerts</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Notifications when it's time for a break</p>
                    </div>
                    <Switch
                      checked={settings.breakAlerts}
                      onCheckedChange={(checked) => updateSetting("breakAlerts", checked)}
                    />
                  </div>

                  {/* Deadline Warnings */}
                  <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm sm:text-base">Deadline Warnings</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Alerts for upcoming assignment deadlines</p>
                      </div>
                      <Switch
                        checked={settings.deadlineWarnings}
                        onCheckedChange={(checked) => updateSetting("deadlineWarnings", checked)}
                      />
                    </div>
                    {settings.deadlineWarnings && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border flex-wrap">
                        <span className="text-sm text-muted-foreground">Warn</span>
                        <select
                          value={settings.deadlineWarningDays}
                          onChange={(e) => updateSetting("deadlineWarningDays", Number(e.target.value))}
                          className="px-3 py-1.5 rounded-xl bg-background border border-border text-sm text-foreground"
                        >
                          <option value={1}>1 day</option>
                          <option value={2}>2 days</option>
                          <option value={3}>3 days</option>
                          <option value={7}>1 week</option>
                        </select>
                        <span className="text-sm text-muted-foreground">before deadline</span>
                      </div>
                    )}
                  </div>

                  {/* Weekly Reports */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">Weekly Reports</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Receive weekly study analytics summary</p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => updateSetting("weeklyReports", checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeSection === "appearance" && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Appearance</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3 min-w-0">
                      {theme === "dark" ? <Moon className="w-5 h-5 flex-shrink-0" /> : <Sun className="w-5 h-5 flex-shrink-0" />}
                      <div>
                        <p className="font-medium text-foreground text-sm sm:text-base">Dark Mode</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Toggle between light and dark themes</p>
                      </div>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-3 text-sm sm:text-base">Accent Color</p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { cls: "bg-cyan-500", label: "Cyan" },
                        { cls: "bg-violet-500", label: "Violet" },
                        { cls: "bg-emerald-500", label: "Emerald" },
                        { cls: "bg-orange-500", label: "Orange" },
                        { cls: "bg-pink-500", label: "Pink" },
                      ].map(({ cls, label }) => (
                        <button
                          key={cls}
                          title={label}
                          className={cn(
                            "w-9 h-9 rounded-full transition-transform hover:scale-110 active:scale-95",
                            cls,
                            cls === "bg-cyan-500" && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-3 text-sm sm:text-base">Font Size</p>
                    <div className="flex gap-2 flex-wrap">
                      {["Small", "Medium", "Large"].map((size) => (
                        <button
                          key={size}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                            size === "Medium"
                              ? "bg-primary text-primary-foreground"
                              : "bg-background border border-border text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Focus Settings */}
            {activeSection === "focus" && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Focus Settings</h2>
                <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <label className="text-sm font-medium text-foreground">Pomodoro Duration</label>
                    <select className="w-full mt-2 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground">
                      <option>25 minutes</option>
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>50 minutes</option>
                    </select>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <label className="text-sm font-medium text-foreground">Short Break</label>
                    <select className="w-full mt-2 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground">
                      <option>5 minutes</option>
                      <option>10 minutes</option>
                      <option>15 minutes</option>
                    </select>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <label className="text-sm font-medium text-foreground">Long Break</label>
                    <select className="w-full mt-2 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground">
                      <option>15 minutes</option>
                      <option>20 minutes</option>
                      <option>30 minutes</option>
                    </select>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <label className="text-sm font-medium text-foreground">Sessions Before Long Break</label>
                    <select className="w-full mt-2 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground">
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground text-sm sm:text-base">Auto-start Breaks</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Automatically start break timer when session ends</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeSection === "privacy" && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Privacy Settings</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">AI Data Collection</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Allow AI to learn from your study patterns</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">Private Notes</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Keep all notes private by default</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">Analytics Sharing</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Share anonymous usage data to improve the app</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            )}

            {/* Data & Backup */}
            {activeSection === "data" && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Data & Backup</h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-1 text-sm sm:text-base">Export Your Data</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">Download all your tasks, notes, and study data</p>
                    <Button variant="outline" className="rounded-xl w-full sm:w-auto">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-1 text-sm sm:text-base">Cloud Sync</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                      Your data is automatically synced with Supabase cloud
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm text-emerald-500 font-medium">Connected to cloud</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="font-medium text-destructive mb-1 text-sm sm:text-base">Danger Zone</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                      Clear all app data and reset to fresh state. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      className="rounded-xl w-full sm:w-auto"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset App Data
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

import { User, Bell, Palette, Clock, Shield, Download, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useState } from "react";

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Customize your FocusFlow experience
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar - Horizontal on mobile */}
        <div className="lg:col-span-1">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide animate-fade-in stagger-1" style={{ opacity: 0 }}>
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-left transition-all whitespace-nowrap flex-shrink-0",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-4 sm:p-6 animate-fade-in stagger-2" style={{ opacity: 0 }}>
            {activeSection === "profile" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Profile Settings</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl sm:text-2xl font-bold text-primary-foreground flex-shrink-0">
                    S
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-foreground">Student Name</h3>
                    <p className="text-sm text-muted-foreground">student@university.edu</p>
                    <Button variant="outline" size="sm" className="mt-2 rounded-xl">
                      Change Photo
                    </Button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Student Name"
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-secondary border border-border input-focus text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      defaultValue="student@university.edu"
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-secondary border border-border input-focus text-foreground"
                    />
                  </div>
                </div>
                <Button className="btn-gradient rounded-xl w-full sm:w-auto">Save Changes</Button>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Notification Preferences</h2>
                <div className="space-y-3 sm:space-y-4">
                  {/* Study Reminders */}
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm sm:text-base">Study Reminders</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Get reminded to start your study sessions</p>
                      </div>
                      <Switch
                        checked={settings.studyReminders}
                        onCheckedChange={(checked) => updateSetting("studyReminders", checked)}
                      />
                    </div>
                    {settings.studyReminders && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
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
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">Break Alerts</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Notifications when it's time for a break</p>
                    </div>
                    <Switch
                      checked={settings.breakAlerts}
                      onCheckedChange={(checked) => updateSetting("breakAlerts", checked)}
                    />
                  </div>

                  {/* Deadline Warnings */}
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm sm:text-base">Deadline Warnings</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Alerts for upcoming assignment deadlines</p>
                      </div>
                      <Switch
                        checked={settings.deadlineWarnings}
                        onCheckedChange={(checked) => updateSetting("deadlineWarnings", checked)}
                      />
                    </div>
                    {settings.deadlineWarnings && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
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
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <div>
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

            {activeSection === "appearance" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Appearance</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <div>
                        <p className="font-medium text-foreground text-sm sm:text-base">Dark Mode</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Toggle between light and dark themes</p>
                      </div>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-3 text-sm sm:text-base">Accent Color</p>
                    <div className="flex flex-wrap gap-3">
                      {["bg-cyan-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500"].map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full transition-transform hover:scale-110",
                            color,
                            color === "bg-cyan-500" && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "focus" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Focus Settings</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <label className="text-sm font-medium text-foreground">Pomodoro Duration</label>
                    <select className="w-full mt-2 px-4 py-2 rounded-xl bg-background border border-border text-foreground">
                      <option>25 minutes</option>
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>50 minutes</option>
                    </select>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <label className="text-sm font-medium text-foreground">Short Break</label>
                    <select className="w-full mt-2 px-4 py-2 rounded-xl bg-background border border-border text-foreground">
                      <option>5 minutes</option>
                      <option>10 minutes</option>
                      <option>15 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Privacy Settings</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">AI Data Collection</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Allow AI to learn from your study patterns</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">Private Notes</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Keep all notes private by default</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "data" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Data & Backup</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-2 text-sm sm:text-base">Export Your Data</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">Download all your tasks, notes, and study data</p>
                    <Button variant="outline" className="rounded-xl w-full sm:w-auto">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-2 text-sm sm:text-base">Cloud Sync</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">Sync your data across all devices</p>
                    <Button className="btn-gradient rounded-xl w-full sm:w-auto">Enable Cloud Sync</Button>
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

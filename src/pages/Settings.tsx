import { useState } from "react";
import { User, Bell, Palette, Clock, Shield, Download, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    breakAlerts: true,
    deadlineWarnings: true,
    weeklyReports: false,
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your FocusFlow experience
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <nav className="space-y-1 animate-fade-in stagger-1 opacity-0">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-2 opacity-0">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Profile Settings</h2>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Student Name</h3>
                    <p className="text-sm text-muted-foreground">student@university.edu</p>
                    <Button variant="outline" size="sm" className="mt-2 rounded-xl">
                      Change Photo
                    </Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Student Name"
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-secondary border border-border input-focus"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      defaultValue="student@university.edu"
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-secondary border border-border input-focus"
                    />
                  </div>
                </div>
                <Button className="btn-gradient rounded-xl">Save Changes</Button>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: "studyReminders", label: "Study Reminders", desc: "Get reminded to start your study sessions" },
                    { key: "breakAlerts", label: "Break Alerts", desc: "Notifications when it's time for a break" },
                    { key: "deadlineWarnings", label: "Deadline Warnings", desc: "Alerts for upcoming assignment deadlines" },
                    { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly study analytics summary" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [item.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <div>
                        <p className="font-medium text-foreground">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                      </div>
                    </div>
                    <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-3">Accent Color</p>
                    <div className="flex gap-3">
                      {["bg-cyan-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500"].map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full transition-transform hover:scale-110",
                            color,
                            color === "bg-cyan-500" && "ring-2 ring-offset-2 ring-offset-background ring-white"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "focus" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Focus Settings</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <label className="text-sm font-medium text-foreground">Pomodoro Duration</label>
                    <select className="w-full mt-2 px-4 py-2 rounded-xl bg-background border border-border">
                      <option>25 minutes</option>
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>50 minutes</option>
                    </select>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <label className="text-sm font-medium text-foreground">Short Break</label>
                    <select className="w-full mt-2 px-4 py-2 rounded-xl bg-background border border-border">
                      <option>5 minutes</option>
                      <option>10 minutes</option>
                      <option>15 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Privacy Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div>
                      <p className="font-medium text-foreground">AI Data Collection</p>
                      <p className="text-sm text-muted-foreground">Allow AI to learn from your study patterns</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div>
                      <p className="font-medium text-foreground">Private Notes</p>
                      <p className="text-sm text-muted-foreground">Keep all notes private by default</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "data" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Data & Backup</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-2">Export Your Data</p>
                    <p className="text-sm text-muted-foreground mb-3">Download all your tasks, notes, and study data</p>
                    <Button variant="outline" className="rounded-xl">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="font-medium text-foreground mb-2">Cloud Sync</p>
                    <p className="text-sm text-muted-foreground mb-3">Sync your data across all devices</p>
                    <Button className="btn-gradient rounded-xl">Enable Cloud Sync</Button>
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

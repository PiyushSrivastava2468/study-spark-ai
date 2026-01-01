import { useState, useEffect } from "react";

export interface NotificationSettings {
  studyReminders: boolean;
  studyReminderTime: string;
  breakAlerts: boolean;
  deadlineWarnings: boolean;
  deadlineWarningDays: number;
  weeklyReports: boolean;
}

const defaultSettings: NotificationSettings = {
  studyReminders: true,
  studyReminderTime: "09:00",
  breakAlerts: true,
  deadlineWarnings: true,
  deadlineWarningDays: 1,
  weeklyReports: false,
};

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const stored = localStorage.getItem("focusflow-notifications");
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("focusflow-notifications", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return { settings, updateSetting, resetSettings };
}

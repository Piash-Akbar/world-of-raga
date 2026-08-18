// src/app/profile/settings/page.tsx
"use client";

import { useState } from "react";
import { Settings, Bell, Lock, Moon, Sun, Globe, Shield, Mail } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: true,
    language: "English",
    twoFactor: false,
    newsletter: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-4">
          {/* Notifications */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-amber-400" />
              Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/70">Email Notifications</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-amber-400 transition">
                    <div className="w-4 h-4 bg-white rounded-full m-1 peer-checked:translate-x-5 transition" />
                  </div>
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/70">Newsletter</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.newsletter}
                    onChange={(e) => setSettings({ ...settings, newsletter: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-amber-400 transition">
                    <div className="w-4 h-4 bg-white rounded-full m-1 peer-checked:translate-x-5 transition" />
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-amber-400" />
              Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Language</span>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/70 flex items-center gap-2">
                  {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Dark Mode
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-amber-400 transition">
                    <div className="w-4 h-4 bg-white rounded-full m-1 peer-checked:translate-x-5 transition" />
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-amber-400" />
              Security
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition flex items-center justify-between">
                <span className="text-white/70">Change Password</span>
                <Lock className="w-4 h-4 text-white/40" />
              </button>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/70">Two-Factor Authentication</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.twoFactor}
                    onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-amber-400 transition">
                    <div className="w-4 h-4 bg-white rounded-full m-1 peer-checked:translate-x-5 transition" />
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-amber-400" />
              Account
            </h3>
            <button className="w-full text-left px-4 py-2 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition text-red-400 font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
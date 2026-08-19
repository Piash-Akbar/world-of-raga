// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  Video, 
  Music, 
  ShoppingBag, 
  Film, 
  BookOpen,
  Plus,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Eye,
  MoreVertical
} from "lucide-react";

const initialStats = [
  { label: "Free Videos", value: "0", change: "0", trend: "neutral", icon: Video },
  { label: "Compositions", value: "0", change: "0", trend: "neutral", icon: Music },
  { label: "Masterclasses", value: "0", change: "0", trend: "neutral", icon: BookOpen },
  { label: "Reels", value: "0", change: "0", trend: "neutral", icon: Film },
];

const recentActivity = [
  { id: 1, user: "Sarah K.", action: "purchased", item: "Raga Yaman — Bandish", amount: "৳299", time: "2 min ago" },
  { id: 2, user: "Mike R.", action: "purchased", item: "Mastering Bow Control", amount: "৳1,499", time: "15 min ago" },
  { id: 3, user: "Priya S.", action: "watched", item: "Bowing Exercise #03", amount: "Free", time: "45 min ago" },
  { id: 4, user: "John D.", action: "purchased", item: "Raga Bhairav — Gat", amount: "৳399", time: "2 hours ago" },
  { id: 5, user: "Emma W.", action: "purchased", item: "Practice Notebook", amount: "৳420", time: "3 hours ago" },
];

const quickActions = [
  { label: "Add Practice Video", icon: Video, href: "/admin/practice-videos", color: "blue" },
  { label: "Add Composition", icon: Music, href: "/admin/compositions", color: "amber" },
  { label: "Add Masterclass", icon: BookOpen, href: "/admin/masterclasses", color: "purple" },
  { label: "Add Reel", icon: Film, href: "/admin/reels", color: "green" },
];

const topContent = [
  { title: "Raga Yaman — Bandish", type: "Composition", views: 3456, revenue: "৳89,234" },
  { title: "Open String Warm-up", type: "Practice", views: 5678, revenue: "Free" },
  { title: "Mastering Bow Control", type: "Masterclass", views: 2341, revenue: "৳34,991" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [practiceRes, compositionsRes, masterclassesRes] = await Promise.all([
          fetch('/api/practice-videos'),
          fetch('/api/compositions'),
          fetch('/api/masterclasses'),
        ]);

        const practice = await practiceRes.json();
        const compositions = await compositionsRes.json();
        const masterclasses = await masterclassesRes.json();

        setStats([
          {
            label: 'Free Videos',
            value: String(Array.isArray(practice) ? practice.length : 0),
            change: 'live',
            trend: 'up',
            icon: Video,
          },
          {
            label: 'Compositions',
            value: String(Array.isArray(compositions) ? compositions.length : 0),
            change: 'live',
            trend: 'up',
            icon: Music,
          },
          {
            label: 'Masterclasses',
            value: String(Array.isArray(masterclasses) ? masterclasses.length : 0),
            change: 'live',
            trend: 'up',
            icon: BookOpen,
          },
          {
            label: 'Reels',
            value: '0',
            change: '0',
            trend: 'neutral',
            icon: Film,
          },
        ]);
      } catch (error) {
        console.error('Failed to load dashboard counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/40">Content overview and management</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/analytics"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === "up";
            return (
              <div
                key={stat.label}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-white/40" />
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: "border-blue-500/30 hover:bg-blue-500/10 text-blue-400",
              amber: "border-amber-500/30 hover:bg-amber-500/10 text-amber-400",
              purple: "border-purple-500/30 hover:bg-purple-500/10 text-purple-400",
              green: "border-green-500/30 hover:bg-green-500/10 text-green-400",
            };
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition ${colorClasses[action.color as keyof typeof colorClasses]}`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-white text-sm">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-white/40 ml-1">{activity.action}</span>
                      <span className="text-amber-400 ml-1">{activity.item}</span>
                    </p>
                    <p className="text-white/30 text-xs">{activity.time}</p>
                  </div>
                  <span className={`text-sm font-medium ${
                    activity.amount === "Free" ? "text-white/40" : "text-white/60"
                  }`}>
                    {activity.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Revenue Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/40">This Month</span>
                  <span className="text-white">৳82,430</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/40">Last Month</span>
                  <span className="text-white">৳74,210</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400/50 rounded-full" style={{ width: "58%" }} />
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Total Revenue</span>
                  <span className="text-white font-semibold">৳1,284,590</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/40">Active Users</span>
                  <span className="text-white font-semibold">2,431</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/40">New Users (Month)</span>
                  <span className="text-white font-semibold">142</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-white/40 text-xs uppercase tracking-wider mb-3">Top Content</h4>
              <div className="space-y-3">
                {topContent.map((content, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm">{content.title}</p>
                      <p className="text-white/30 text-xs">{content.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">{content.revenue}</p>
                      <p className="text-white/30 text-xs">{content.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
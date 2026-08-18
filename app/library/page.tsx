// src/app/library/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Music, 
  Users, 
  Play, 
  Download, 
  Clock,
  CheckCircle,
  Circle,
  ArrowRight
} from "lucide-react";

const libraryItems = [
  {
    id: "1",
    type: "composition",
    title: "Raga Yaman — Bandish",
    progress: 72,
    lastAccessed: "2 days ago",
    purchasedAt: "2026-01-15",
  },
  {
    id: "2",
    type: "composition",
    title: "Raga Kafi — Composition",
    progress: 35,
    lastAccessed: "5 days ago",
    purchasedAt: "2026-02-01",
  },
  {
    id: "3",
    type: "masterclass",
    title: "Building a Singing Violin Tone",
    progress: 100,
    lastAccessed: "1 week ago",
    purchasedAt: "2026-01-20",
  },
  {
    id: "4",
    type: "composition",
    title: "Bhairav — Gat",
    progress: 0,
    lastAccessed: "Not started",
    purchasedAt: "2026-02-10",
  },
  {
    id: "5",
    type: "masterclass",
    title: "Taal & Rhythm Mastery",
    progress: 45,
    lastAccessed: "3 days ago",
    purchasedAt: "2026-02-05",
  },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"all" | "compositions" | "masterclasses">("all");

  const filteredItems = libraryItems.filter(item => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const completed = libraryItems.filter(item => item.progress === 100).length;
  const inProgress = libraryItems.filter(item => item.progress > 0 && item.progress < 100).length;
  const notStarted = libraryItems.filter(item => item.progress === 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">My Library</h1>
          <p className="text-white/40">Everything you have purchased or saved, in one place.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{libraryItems.length}</div>
            <div className="text-white/40 text-sm">Total Items</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-amber-400">{inProgress}</div>
            <div className="text-white/40 text-sm">In Progress</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">{completed}</div>
            <div className="text-white/40 text-sm">Completed</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white/40">{notStarted}</div>
            <div className="text-white/40 text-sm">Not Started</div>
          </div>
        </div>

        {/* Today's Practice */}
        <div className="bg-gradient-to-r from-amber-900/20 to-purple-900/20 rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Today's Practice
              </h3>
              <p className="text-white/40 text-sm">30 min • Bow • Scale • Raga phrase</p>
            </div>
            <button className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-2 rounded-lg font-medium transition flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start Session
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          {[
            { id: "all", label: "All", count: libraryItems.length },
            { id: "compositions", label: "Compositions", count: libraryItems.filter(i => i.type === "composition").length },
            { id: "masterclasses", label: "Masterclasses", count: libraryItems.filter(i => i.type === "masterclass").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-amber-400 border-amber-400"
                  : "text-white/40 border-transparent hover:text-white/60"
              }`}
            >
              {tab.label}
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Library Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isCompleted = item.progress === 100;
            const isNotStarted = item.progress === 0;
            
            return (
              <div
                key={item.id}
                className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group"
              >
                <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center">
                  {item.type === "composition" ? (
                    <Music className="w-12 h-12 text-amber-400/50" />
                  ) : (
                    <Users className="w-12 h-12 text-purple-400/50" />
                  )}
                  {!isNotStarted && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div
                        className={`h-full transition-all ${
                          isCompleted ? "bg-green-400" : "bg-amber-400"
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
                    isCompleted ? "bg-green-500/70" : isNotStarted ? "bg-white/10" : "bg-amber-400/70"
                  }`}>
                    {isCompleted ? "Completed" : isNotStarted ? "Not started" : `${item.progress}%`}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-white/40 text-sm capitalize">{item.type}</p>
                    </div>
                    <span className="text-white/30 text-xs">{item.lastAccessed}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/library/${item.type}/${item.id}`}
                      className={`flex-1 text-sm py-2 rounded font-medium transition text-center flex items-center justify-center gap-1 ${
                        isCompleted
                          ? "bg-green-400/20 text-green-400 hover:bg-green-400/30"
                          : isNotStarted
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-amber-400 hover:bg-amber-500 text-black"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Review
                        </>
                      ) : isNotStarted ? (
                        <>
                          <Play className="w-4 h-4" />
                          Start
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Continue
                        </>
                      )}
                    </Link>
                    {item.type === "composition" && (
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded transition">
                        <Download className="w-4 h-4 text-white/60" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No items in your library yet.</p>
            <div className="flex gap-4 justify-center mt-4">
              <Link
                href="/compositions"
                className="text-amber-400 hover:text-amber-300 transition inline-flex items-center gap-1"
              >
                Browse Compositions <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/masterclasses"
                className="text-purple-400 hover:text-purple-300 transition inline-flex items-center gap-1"
              >
                Browse Masterclasses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
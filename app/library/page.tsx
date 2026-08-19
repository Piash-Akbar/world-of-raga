// src/app/library/page.tsx
"use client";

import { useState, useEffect } from "react";
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

interface LibraryItem {
  id: string;
  userId: string;
  itemType: 'composition' | 'masterclass';
  itemId: string;
  progress: number;
  lastAccessed: string;
  purchasedAt: string;
  content: {
    id: string;
    title: string;
    description?: string;
    level?: string;
    price?: number;
    duration?: number;
    videoUrl?: string;
    pdfUrl?: string;
    thumbnailUrl?: string;
    tags?: string[];
    maestro?: string;
    lessons?: any[];
  };
}

type LibraryTab = "all" | "composition" | "masterclass";

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LibraryTab>("all");

  useEffect(() => {
    fetch('/api/user-library/details')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredItems = items.filter(item => {
    if (activeTab === "all") return true;
    return item.itemType === activeTab;
  });

  const completed = items.filter(item => item.progress === 100).length;
  const inProgress = items.filter(item => item.progress > 0 && item.progress < 100).length;
  const notStarted = items.filter(item => item.progress === 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40">Loading your library...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">My Library</h1>
          <p className="text-white/40">Everything you have purchased or saved, in one place.</p>
        </div>

        {/* Stats - responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-white">{items.length}</div>
            <div className="text-white/40 text-sm">Total Items</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-amber-400">{inProgress}</div>
            <div className="text-white/40 text-sm">In Progress</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-green-400">{completed}</div>
            <div className="text-white/40 text-sm">Completed</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-white/40">{notStarted}</div>
            <div className="text-white/40 text-sm">Not Started</div>
          </div>
        </div>

        {/* Today's Practice - responsive */}
        {items.length > 0 && (
          <div className="bg-gradient-to-r from-amber-900/20 to-purple-900/20 rounded-xl p-4 sm:p-6 border border-white/10 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-white font-semibold text-lg flex items-center justify-center sm:justify-start gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Today's Practice
                </h3>
                <p className="text-white/40 text-sm">30 min • Bow • Scale • Raga phrase</p>
              </div>
              <button className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 w-full sm:w-auto justify-center">
                <Play className="w-4 h-4" />
                Start Session
              </button>
            </div>
          </div>
        )}

        {/* Tabs - responsive */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-2">
          {[
            { id: "all", label: "All", count: items.length },
            { id: "composition", label: "Compositions", count: items.filter(i => i.itemType === "composition").length },
            { id: "masterclass", label: "Masterclasses", count: items.filter(i => i.itemType === "masterclass").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as LibraryTab)}
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

        {/* Library Grid - fully responsive */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40">No items in your library yet.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => {
              const isCompleted = item.progress === 100;
              const isNotStarted = item.progress === 0;
              const content = item.content;
              const isComposition = item.itemType === 'composition';

              return (
                <div
                  key={item.id}
                  className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group flex flex-col"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center">
                    {isComposition ? (
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
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm sm:text-base">{content.title}</h3>
                      <p className="text-white/40 text-xs sm:text-sm mt-1 line-clamp-2">
                        {isComposition ? content.level : content.maestro}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/library/${item.itemType}/${item.itemId}`}
                        className={`flex-1 text-xs sm:text-sm py-2 rounded font-medium transition text-center ${
                          isCompleted
                            ? "bg-green-400/20 text-green-400 hover:bg-green-400/30"
                            : isNotStarted
                            ? "bg-white/10 hover:bg-white/20 text-white"
                            : "bg-amber-400 hover:bg-amber-500 text-black"
                        }`}
                      >
                        {isCompleted ? "Review" : isNotStarted ? "Start" : "Continue"}
                      </Link>
                      {isComposition && (
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
        )}
      </div>
    </div>
  );
}
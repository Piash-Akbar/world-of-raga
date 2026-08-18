// src/app/compositions/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Music2, Play, ShoppingCart, Eye, ChevronDown, Search } from "lucide-react";

const compositions = [
  {
    id: "1",
    title: "Raga Yaman — Bandish",
    level: "Intermediate",
    price: 299,
    duration: "08:42",
    description: "A guided version of the composition, with bowing, fingering and phrase-by-phrase explanation.",
    isPurchased: false,
    tags: ["Yaman", "Teentaal"],
  },
  {
    id: "2",
    title: "Raga Bhairav — Gat",
    level: "Advanced",
    price: 399,
    duration: "12:15",
    description: "Advanced composition with intricate rhythmic patterns and improvisation techniques.",
    isPurchased: false,
    tags: ["Bhairav", "Jhaptaal"],
  },
  {
    id: "3",
    title: "Raga Kafi — Composition",
    level: "Intermediate",
    price: 299,
    duration: "09:30",
    description: "Beautiful Kafi composition with detailed instruction on ornamentation.",
    isPurchased: true,
    tags: ["Kafi", "Dadra"],
  },
  {
    id: "4",
    title: "Raga Todi — Alap",
    level: "Advanced",
    price: 499,
    duration: "15:20",
    description: "Deep dive into the alap of Raga Todi with detailed phrase-by-phrase instruction.",
    isPurchased: false,
    tags: ["Todi", "Alap"],
  },
  {
    id: "5",
    title: "Bihag — Fast Gat",
    level: "Intermediate",
    price: 349,
    duration: "10:15",
    description: "Learn a fast gat in Raga Bihag with intricate taans and improvisation.",
    isPurchased: false,
    tags: ["Bihag", "Teentaal"],
  },
  {
    id: "6",
    title: "Malkauns — Introduction",
    level: "Beginner",
    price: 249,
    duration: "07:45",
    description: "Introduction to the beautiful Raga Malkauns with basic phrases and compositions.",
    isPurchased: false,
    tags: ["Malkauns", "Rupak"],
  },
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CompositionsPage() {
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompositions = compositions.filter(comp => {
    const matchesLevel = selectedLevel === "All" || comp.level === selectedLevel;
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Premium Compositions</h1>
          <p className="text-white/40">Full learning video + downloadable sheet music PDF.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search compositions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-400 transition cursor-pointer min-w-[150px]"
            >
              {levels.map(level => (
                <option key={level} value={level} className="bg-gray-900">
                  {level}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-white/40 text-sm mb-4">
          Showing {filteredCompositions.length} of {compositions.length} compositions
        </div>

        {/* Composition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompositions.map((comp) => (
            <div
              key={comp.id}
              className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group"
            >
              <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/30 transition">
                  <Music2 className="w-8 h-8 text-amber-400" />
                </div>
                <span className="absolute top-2 right-2 bg-amber-400/90 text-black text-xs px-2 py-1 rounded font-medium">
                  ৳{comp.price}
                </span>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {comp.duration}
                </span>
                {comp.isPurchased && (
                  <span className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded font-medium">
                    Owned
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold">{comp.title}</h3>
                <p className="text-white/40 text-sm mt-1 line-clamp-2">{comp.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {comp.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-amber-400 text-sm">{comp.level}</span>
                  {comp.isPurchased ? (
                    <Link
                      href={`/library/composition/${comp.id}`}
                      className="text-green-400 hover:text-green-300 text-sm font-medium transition flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Open
                    </Link>
                  ) : (
                    <div className="flex gap-2">
                      <button className="text-white/60 hover:text-white text-sm transition flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        Preview
                      </button>
                      <button className="bg-amber-400 hover:bg-amber-500 text-black text-sm px-3 py-1 rounded font-medium transition flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        Buy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCompositions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No compositions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
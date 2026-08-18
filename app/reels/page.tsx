// src/app/reels/page.tsx
"use client";

import { useState } from "react";
import { Film, Play, Clock, Eye, Heart, Share2, ChevronRight } from "lucide-react";

const reels = [
  {
    id: "1",
    title: "Yaman Phrase Preview",
    description: "A beautiful phrase from Raga Yaman demonstrating the characteristic meend.",
    duration: "0:20",
    views: 4521,
    likes: 234,
    type: "Phrase",
  },
  {
    id: "2",
    title: "Maestro Rehearsal Moment",
    description: "Behind the scenes from Pt. Rajendra Mishra's masterclass rehearsal.",
    duration: "0:24",
    views: 3876,
    likes: 189,
    type: "Behind the Scenes",
  },
  {
    id: "3",
    title: "Bow Technique in 20 Sec",
    description: "Quick bow technique tip for better tone production and control.",
    duration: "0:28",
    views: 6234,
    likes: 456,
    type: "Technique",
  },
  {
    id: "4",
    title: "Workshop Sneak Peek",
    description: "Exclusive preview of the upcoming 'Gayaki Ang' workshop.",
    duration: "0:32",
    views: 2987,
    likes: 156,
    type: "Preview",
  },
  {
    id: "5",
    title: "Raga Bhairav Phrase",
    description: "Exploring the characteristic phrases of Raga Bhairav.",
    duration: "0:18",
    views: 5432,
    likes: 321,
    type: "Phrase",
  },
  {
    id: "6",
    title: "Tone Production Tip",
    description: "Quick tip for achieving a singing tone on the violin.",
    duration: "0:15",
    views: 7654,
    likes: 567,
    type: "Technique",
  },
];

const categories = ["All", "Technique", "Phrase", "Preview", "Behind the Scenes"];

export default function ReelsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = reels.filter(reel => 
    selectedCategory === "All" || reel.type === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Violin Reels</h1>
          <p className="text-white/40">Short-form violin content for discovery and inspiration.</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-amber-400 text-black"
                  : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((reel) => (
            <div
              key={reel.id}
              className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group cursor-pointer"
            >
              <div className="relative aspect-[9/16] bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/30 transition">
                  <Play className="w-6 h-6 text-amber-400" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {reel.duration}
                </span>
                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {reel.type}
                </span>
                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-white/60 text-xs bg-black/50 px-2 py-1 rounded">
                    <Eye className="w-3 h-3" />
                    {reel.views}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-white text-sm font-medium">{reel.title}</h3>
                <p className="text-white/40 text-xs mt-1 line-clamp-2">{reel.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-white/40 hover:text-red-400 text-xs transition">
                      <Heart className="w-3 h-3" />
                      {reel.likes}
                    </button>
                  </div>
                  <button className="text-white/40 hover:text-white text-xs transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No reels found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
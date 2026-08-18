// src/app/learn/page.tsx
"use client";

import { useState } from "react";
import { Search, Play, ChevronDown, Clock, Eye } from "lucide-react";

const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const categories = ["All", "Technique", "Raga", "Bowing", "Scales", "Repertoire"];

const practiceVideos = [
  { id: "1", title: "Open String Warm-up", level: "Beginner", duration: "10 min", category: "Technique", views: 3421, description: "Start your practice with proper open string warm-up exercises." },
  { id: "2", title: "Bow Distribution Exercise", level: "Intermediate", duration: "12 min", category: "Bowing", views: 2156, description: "Master even bow distribution across the entire bow length." },
  { id: "3", title: "Raga Alankar • Yaman", level: "Intermediate", duration: "15 min", category: "Raga", views: 1876, description: "Learn the basic alankar patterns in Raga Yaman." },
  { id: "4", title: "Intonation Drill", level: "Beginner", duration: "8 min", category: "Technique", views: 2934, description: "Perfect your intonation with these focused ear-training exercises." },
  { id: "5", title: "Meend Practice", level: "Advanced", duration: "18 min", category: "Technique", views: 1432, description: "Advanced meend techniques for smooth note transitions." },
  { id: "6", title: "Gamak Exercise", level: "Advanced", duration: "20 min", category: "Technique", views: 987, description: "Master the art of gamak with these progressive exercises." },
  { id: "7", title: "Raga Bhairav — Alap", level: "Intermediate", duration: "22 min", category: "Raga", views: 765, description: "Explore the alap section of Raga Bhairav." },
  { id: "8", title: "Finger Independence", level: "Beginner", duration: "14 min", category: "Technique", views: 2103, description: "Develop finger independence and strength." },
  { id: "9", title: "Teentaal Practice", level: "Intermediate", duration: "16 min", category: "Rhythm", views: 1456, description: "Practice compositions in 16-beat Teentaal." },
];

export default function LearnPage() {
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = practiceVideos.filter(video => {
    const matchesLevel = selectedLevel === "All" || video.level === selectedLevel;
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Free Practice Library</h1>
          <p className="text-white/40">Admin-curated exercises for daily practice.</p>
        </div>

        {/* Daily Practice CTA */}
        <div className="bg-gradient-to-r from-amber-900/20 to-purple-900/20 rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Today's Practice
              </h3>
              <p className="text-white/40 text-sm">10 min bowing • 10 min scales • 10 min raga phrase</p>
            </div>
            <button className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-2 rounded-lg font-medium transition flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start Session
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search practice videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-400 transition cursor-pointer min-w-[130px]"
              >
                {levels.map(level => (
                  <option key={level} value={level} className="bg-gray-900">
                    {level}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-400 transition cursor-pointer min-w-[130px]"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-white/40 text-sm mb-4">
          Showing {filteredVideos.length} of {practiceVideos.length} videos
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group cursor-pointer"
            >
              <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/30 transition">
                  <Play className="w-8 h-8 text-amber-400" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </span>
                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.level}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium">{video.title}</h3>
                <p className="text-white/40 text-sm mt-1 line-clamp-2">{video.description}</p>
                <div className="flex items-center justify-between mt-3 text-sm text-white/40">
                  <span>{video.category}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No videos found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
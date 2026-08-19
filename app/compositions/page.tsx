"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Music2, Play, ShoppingCart, Eye, ChevronDown, Search } from "lucide-react";
import { getOptimizedVideoUrl } from '@/lib/videoUtils';

interface Composition {
  id: string;
  title: string;
  description?: string;
  level: string;
  price: number;
  duration: number;
  videoUrl?: string;
  pdfUrl?: string;
  previewVideoUrl?: string;
  tags: string[];
  isPublished: boolean;
}

export default function CompositionsPage() {
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/api/compositions')
      .then(res => res.json())
      .then(data => {
        setCompositions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = compositions.filter(comp => {
    const matchesLevel = selectedLevel === "All" || comp.level === selectedLevel;
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white/40">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Premium Compositions</h1>
          <p className="text-white/40">Full learning video + downloadable sheet music PDF.</p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search compositions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-400 cursor-pointer min-w-[150px]"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => (
            <div key={comp.id} className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group">
              <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center overflow-hidden">
                {comp.previewVideoUrl || comp.videoUrl ? (
                  <video
                    src={getOptimizedVideoUrl(comp.previewVideoUrl || comp.videoUrl || '')}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  <Music2 className="w-12 h-12 text-white/20" />
                )}
                <span className="absolute top-2 right-2 bg-amber-400/90 text-black text-xs px-2 py-1 rounded font-medium">৳{comp.price}</span>
                <span className="absolute top-12 right-2 bg-white/90 text-black text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm">
                  {Math.floor(comp.duration / 60)}:{String(comp.duration % 60).padStart(2, '0')}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold">{comp.title}</h3>
                <p className="text-white/40 text-sm mt-1 line-clamp-2">{comp.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {comp.tags?.map((tag, i) => (
                    <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/40">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-amber-400 text-sm">{comp.level}</span>
                  <div className="flex gap-2">
                    <button className="text-white/60 hover:text-white text-sm transition flex items-center gap-1">
                      <Play className="w-4 h-4" /> Preview
                    </button>
                    <button className="bg-amber-400 hover:bg-amber-500 text-black text-sm px-3 py-1 rounded font-medium transition flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4" /> Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-white/40 text-center py-12">No compositions found.</p>}
      </div>
    </div>
  );
}
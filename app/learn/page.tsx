// src/app/learn/page.tsx (updated)
"use client";

import { useState, useEffect } from "react";
import { Search, Play, ChevronDown, Clock, Eye } from "lucide-react";

const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const categories = ["All", "Technique", "Raga", "Bowing", "Scales", "Repertoire"];

interface Video {
  id: string;
  title: string;
  description?: string;
  level: string;
  category: string;
  duration: number; // seconds
  videoUrl: string;
  thumbnailUrl?: string;
  views: number;
}

export default function LearnPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/api/practice-videos')
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesLevel = selectedLevel === "All" || video.level === selectedLevel;
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/40">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      {/* ... same JSX as before but use filteredVideos and display videoUrl/video thumbnail ... */}
      <div className="max-w-7xl mx-auto">
        {/* same header, filters, etc. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group cursor-pointer">
              <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center overflow-hidden">
                {video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    poster={video.thumbnailUrl || undefined}
                    controls
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/30 transition">
                    <Play className="w-8 h-8 text-amber-400" />
                  </div>
                )}
                <span className="absolute top-2 right-2 bg-white/90 text-black text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm">
                  {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
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
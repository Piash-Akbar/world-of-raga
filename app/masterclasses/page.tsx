// src/app/masterclasses/page.tsx
"use client";

import { useState } from "react";
import { Users, Play, Clock, User, Search, ChevronDown, ArrowRight } from "lucide-react";

const masterclasses = [
  {
    id: "1",
    title: "Mastering Bow Control",
    maestro: "Pt. Rajendra Mishra",
    about: "A comprehensive workshop on bow control, tone production, and expressive playing.",
    price: 1499,
    duration: "90 min",
    level: "Advanced",
    lessons: 8,
    isPurchased: false,
  },
  {
    id: "2",
    title: "Approach to Raga Improvisation",
    maestro: "Ustad Zakir Hussain",
    about: "Learn the art of improvisation in Indian classical music with a living legend.",
    price: 1999,
    duration: "78 min",
    level: "Advanced",
    lessons: 6,
    isPurchased: false,
  },
  {
    id: "3",
    title: "Building a Singing Violin Tone",
    maestro: "Vidushi Kala Ramnath",
    about: "Discover techniques to achieve a singing, vocal-like tone on the violin.",
    price: 1299,
    duration: "64 min",
    level: "Intermediate",
    lessons: 5,
    isPurchased: true,
  },
  {
    id: "4",
    title: "Taal & Rhythm Mastery",
    maestro: "Pt. Anindo Chatterjee",
    about: "Master the intricate rhythms of Indian classical music with tabla accompaniment.",
    price: 1699,
    duration: "85 min",
    level: "Intermediate",
    lessons: 7,
    isPurchased: false,
  },
  {
    id: "5",
    title: "Gayaki Ang on Violin",
    maestro: "Vidushi Nandini Shankar",
    about: "Learn to emulate vocal ornamentations and phrasings on the violin.",
    price: 1499,
    duration: "72 min",
    level: "Advanced",
    lessons: 6,
    isPurchased: false,
  },
  {
    id: "6",
    title: "Foundation of Violin Playing",
    maestro: "Pt. V.V. Subrahmanyam",
    about: "A complete foundation course for beginners covering basics to intermediate concepts.",
    price: 999,
    duration: "120 min",
    level: "Beginner",
    lessons: 12,
    isPurchased: false,
  },
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function MasterclassesPage() {
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = masterclasses.filter(mc => {
    const matchesLevel = selectedLevel === "All" || mc.level === selectedLevel;
    const matchesSearch = mc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mc.maestro.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Learn from the Maestros</h1>
          <p className="text-white/40">Long-form workshops, ideas, repertoire and artistry.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search masterclasses or maestros..."
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
          Showing {filtered.length} of {masterclasses.length} masterclasses
        </div>

        {/* Masterclass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mc) => (
            <div
              key={mc.id}
              className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group"
            >
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/30 to-amber-900/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-400/20 flex items-center justify-center group-hover:bg-purple-400/30 transition">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <span className="absolute top-2 right-2 bg-purple-400/90 text-black text-xs px-2 py-1 rounded font-medium">
                  ৳{mc.price}
                </span>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {mc.duration}
                </span>
                {mc.isPurchased && (
                  <span className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded font-medium">
                    Owned
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{mc.title}</h3>
                    <p className="text-purple-400 text-sm flex items-center gap-1 mt-1">
                      <User className="w-3 h-3" />
                      {mc.maestro}
                    </p>
                  </div>
                  <span className="text-white/30 text-xs">{mc.lessons} lessons</span>
                </div>
                <p className="text-white/40 text-sm mt-2 line-clamp-2">{mc.about}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/40 text-sm">{mc.level}</span>
                  {mc.isPurchased ? (
                    <button className="text-green-400 hover:text-green-300 text-sm font-medium transition flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      Continue
                    </button>
                  ) : (
                    <button className="bg-purple-400 hover:bg-purple-500 text-black text-sm px-3 py-1 rounded font-medium transition flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No masterclasses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
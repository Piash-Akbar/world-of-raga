// src/app/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ChevronRight, Star, Clock, Users, Music2, ArrowRight } from "lucide-react";

// Mock data
const featuredPractice = [
  { id: "1", title: "Open String Warm-up", level: "Beginner", duration: "10 min", views: 3421, category: "Technique" },
  { id: "2", title: "Bow Distribution Exercise", level: "Intermediate", duration: "12 min", views: 2156, category: "Bowing" },
  { id: "3", title: "Raga Alankar • Yaman", level: "Intermediate", duration: "15 min", views: 1876, category: "Raga" },
];

const featuredCompositions = [
  { id: "1", title: "Raga Yaman — Bandish", level: "Intermediate", price: "৳299", duration: "08:42", description: "A guided version with bowing, fingering and phrase-by-phrase explanation." },
  { id: "2", title: "Raga Bhairav — Gat", level: "Advanced", price: "৳399", duration: "12:15", description: "Advanced composition with intricate rhythmic patterns." },
];

const featuredMasterclasses = [
  { id: "1", title: "Mastering Bow Control", maestro: "Pt. Rajendra Mishra", duration: "90 min", level: "Advanced" },
  { id: "2", title: "Approach to Raga Improvisation", maestro: "Ustad Zakir Hussain", duration: "78 min", level: "Advanced" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-30" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/20 rounded-full">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-amber-400 text-sm font-medium">Live • New content weekly</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Master the <br />
              <span className="text-amber-400">Violin</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/60 mb-10 max-w-2xl mx-auto">
              Learn. Practice. Listen. Perform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/learn"
                className="bg-amber-400 hover:bg-amber-500 text-black px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
              >
                <Play className="w-5 h-5" />
                Explore Practice
              </Link>
              <Link
                href="/compositions"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition border border-white/20 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                View Compositions
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Free Practice Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Free Practice Library</h2>
            <p className="text-white/40">Admin-curated exercises for daily practice.</p>
          </div>
          <Link
            href="/learn"
            className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1 group"
          >
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPractice.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-white/40">{video.category}</span>
                  <span className="text-white/40">{video.views} views</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Compositions */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-white/5 border-y border-white/10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Compositions</h2>
            <p className="text-white/40">Full learning video + downloadable sheet music PDF.</p>
          </div>
          <Link
            href="/compositions"
            className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1 group"
          >
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCompositions.map((comp, index) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group"
            >
              <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/30 transition">
                  <Music2 className="w-8 h-8 text-amber-400" />
                </div>
                <span className="absolute top-2 right-2 bg-amber-400/90 text-black text-xs px-2 py-1 rounded font-medium">
                  {comp.price}
                </span>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {comp.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium">{comp.title}</h3>
                <p className="text-white/40 text-sm mt-1 line-clamp-2">{comp.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-amber-400 text-sm">{comp.level}</span>
                  <div className="flex gap-2">
                    <button className="text-white/60 hover:text-white text-sm transition flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="bg-amber-400 hover:bg-amber-500 text-black text-sm px-3 py-1 rounded font-medium transition">
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Masterclasses */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Learn from the Maestros</h2>
            <p className="text-white/40">Long-form workshops, ideas, repertoire and artistry.</p>
          </div>
          <Link
            href="/masterclasses"
            className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1 group"
          >
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMasterclasses.map((mc, index) => (
            <motion.div
              key={mc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group"
            >
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/30 to-amber-900/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-400/20 flex items-center justify-center group-hover:bg-purple-400/30 transition">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {mc.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium">{mc.title}</h3>
                <p className="text-purple-400 text-sm mt-1">{mc.maestro}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/40 text-sm">{mc.level}</span>
                  <button className="text-white/60 hover:text-white text-sm transition flex items-center gap-1">
                    Watch Trailer
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Play, label: "Practice Videos", value: "94+", color: "text-blue-400" },
            { icon: Music2, label: "Compositions", value: "38+", color: "text-amber-400" },
            { icon: Users, label: "Masterclasses", value: "12+", color: "text-purple-400" },
            { icon: Star, label: "Total Students", value: "2.4k+", color: "text-green-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
// src/app/library/composition/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Download, Music2, FileText, Clock, User, Share2 } from "lucide-react";

// Mock data - in real app would fetch from API
const compositionData = {
  "1": {
    title: "Raga Yaman — Bandish",
    level: "Intermediate",
    duration: "08:42",
    description: "A guided version of the composition, with bowing, fingering and phrase-by-phrase explanation.",
    price: 299,
    progress: 72,
    files: [
      { type: "video", title: "Full Learning Video", url: "#" },
      { type: "pdf", title: "Sheet Music", url: "#" },
      { type: "pdf", title: "Practice Notes", url: "#" },
    ],
  },
  "3": {
    title: "Raga Kafi — Composition",
    level: "Intermediate",
    duration: "09:30",
    description: "Beautiful Kafi composition with detailed instruction on ornamentation.",
    price: 299,
    progress: 35,
    files: [
      { type: "video", title: "Full Learning Video", url: "#" },
      { type: "pdf", title: "Sheet Music", url: "#" },
    ],
  },
};

export default function CompositionViewPage() {
  const params = useParams();
  const id = params.id as string;
  const composition = compositionData[id as keyof typeof compositionData];

  if (!composition) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40">Composition not found</p>
          <Link href="/library" className="text-amber-400 hover:text-amber-300 transition mt-2 inline-block">
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>

        {/* Video Player */}
        <div className="aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 rounded-xl border border-white/10 flex items-center justify-center relative">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-amber-400/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-white/40">Video Player</p>
            <p className="text-white/20 text-sm">{composition.duration}</p>
          </div>
          {composition.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-amber-400 transition-all"
                style={{ width: `${composition.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{composition.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-amber-400 text-sm">{composition.level}</span>
                <span className="text-white/40 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {composition.duration}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">{composition.progress}% complete</span>
              <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-white/60 mt-4">{composition.description}</p>
        </div>

        {/* Files */}
        <div className="mt-8">
          <h3 className="text-white font-semibold mb-4">Content</h3>
          <div className="space-y-3">
            {composition.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 transition"
              >
                <div className="flex items-center gap-3">
                  {file.type === "video" ? (
                    <Music2 className="w-5 h-5 text-amber-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">{file.title}</p>
                    <p className="text-white/30 text-xs uppercase">{file.type}</p>
                  </div>
                </div>
                <button className="bg-amber-400 hover:bg-amber-500 text-black px-3 py-1 rounded font-medium transition flex items-center gap-1 text-sm">
                  {file.type === "video" ? <Play className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {file.type === "video" ? "Watch" : "Download"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
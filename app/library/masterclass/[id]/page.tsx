// src/app/library/masterclass/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Users, Clock, User, CheckCircle, Circle } from "lucide-react";

// Mock data
const masterclassData = {
  "3": {
    title: "Building a Singing Violin Tone",
    maestro: "Vidushi Kala Ramnath",
    description: "Discover techniques to achieve a singing, vocal-like tone on the violin.",
    duration: "64 min",
    level: "Intermediate",
    progress: 100,
    lessons: [
      { title: "Introduction", duration: "8 min", completed: true },
      { title: "Bow Pressure & Speed", duration: "12 min", completed: true },
      { title: "Left Hand Vibrato", duration: "15 min", completed: true },
      { title: "Tone Production Exercises", duration: "18 min", completed: true },
      { title: "Application to Raga", duration: "11 min", completed: true },
    ],
  },
  "5": {
    title: "Taal & Rhythm Mastery",
    maestro: "Pt. Anindo Chatterjee",
    description: "Master the intricate rhythms of Indian classical music with tabla accompaniment.",
    duration: "85 min",
    level: "Intermediate",
    progress: 45,
    lessons: [
      { title: "Understanding Taal", duration: "12 min", completed: true },
      { title: "Teentaal Basics", duration: "15 min", completed: true },
      { title: "Rhythmic Patterns", duration: "18 min", completed: true },
      { title: "Jhaptaal", duration: "14 min", completed: false },
      { title: "Rupak Taal", duration: "12 min", completed: false },
      { title: "Advanced Rhythms", duration: "14 min", completed: false },
    ],
  },
};

export default function MasterclassViewPage() {
  const params = useParams();
  const id = params.id as string;
  const masterclass = masterclassData[id as keyof typeof masterclassData];

  if (!masterclass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40">Masterclass not found</p>
          <Link href="/library" className="text-amber-400 hover:text-amber-300 transition mt-2 inline-block">
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const completedLessons = masterclass.lessons.filter(l => l.completed).length;
  const totalLessons = masterclass.lessons.length;

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

        {/* Header */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{masterclass.title}</h1>
              <p className="text-purple-400 flex items-center gap-1 mt-1">
                <User className="w-4 h-4" />
                {masterclass.maestro}
              </p>
              <p className="text-white/60 mt-2">{masterclass.description}</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-sm">{masterclass.level}</p>
              <p className="text-white/40 text-sm flex items-center gap-1 justify-end">
                <Clock className="w-4 h-4" />
                {masterclass.duration}
              </p>
              <p className="text-amber-400 text-sm font-medium">{masterclass.progress}% complete</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Progress</span>
            <span className="text-white">{completedLessons}/{totalLessons} lessons</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 rounded-full transition-all"
              style={{ width: `${masterclass.progress}%` }}
            />
          </div>
        </div>

        {/* Lessons */}
        <h3 className="text-white font-semibold mb-4">Lessons</h3>
        <div className="space-y-3">
          {masterclass.lessons.map((lesson, index) => (
            <div
              key={index}
              className={`flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg p-4 border ${
                lesson.completed ? 'border-green-500/30' : 'border-white/10'
              } transition cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                {lesson.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/30" />
                )}
                <div>
                  <p className="text-white font-medium">
                    {index + 1}. {lesson.title}
                  </p>
                  <p className="text-white/30 text-xs">{lesson.duration}</p>
                </div>
              </div>
              <button className="text-white/40 hover:text-white transition">
                <Play className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
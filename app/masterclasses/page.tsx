"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Play, Users } from "lucide-react";
import { getOptimizedVideoUrl } from '@/lib/videoUtils';

interface Masterclass {
  id: string;
  title: string;
  maestro: string;
  about?: string;
  price: number;
  duration: number;
  previewVideoUrl?: string;
  thumbnailUrl?: string;
  lessons?: Array<unknown>;
  isPublished?: boolean;
}

export default function MasterclassesPage() {
  const [items, setItems] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/masterclasses')
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/40">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Masterclasses</h1>
          <p className="text-white/40">Deep-dive workshops on technique, repertoire, expression, and performance practice.</p>
        </div>

        {items.length === 0 ? (
          <p className="text-white/40 text-center py-12">No masterclasses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group">
                <div className="relative aspect-video bg-gradient-to-br from-purple-900/30 to-amber-900/30 flex items-center justify-center overflow-hidden">
                  {item.previewVideoUrl ? (
                    <video
                      src={getOptimizedVideoUrl(item.previewVideoUrl || '')}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                      playsInline
                    />
                  ) : (
                    <Users className="w-12 h-12 text-white/20" />
                  )}
                  <span className="absolute top-2 right-2 bg-purple-400/90 text-black text-xs px-2 py-1 rounded font-medium">
                    ৳{item.price}
                  </span>
                  <span className="absolute top-12 right-2 bg-white/90 text-black text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm">
                    {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-purple-400 text-sm mt-1">{item.maestro}</p>
                  <p className="text-white/40 text-sm mt-2 line-clamp-3">{item.about}</p>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-white/50 flex items-center gap-1">
                      <Clock3 className="w-4 h-4" />
                      {item.lessons?.length || 0} lessons
                    </span>
                    <Link href={`/library/masterclass/${item.id}`} className="text-amber-400 hover:text-amber-300 flex items-center gap-1">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <button className="mt-4 w-full bg-amber-400 hover:bg-amber-500 text-black font-medium px-3 py-2 rounded-lg transition flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> Watch preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
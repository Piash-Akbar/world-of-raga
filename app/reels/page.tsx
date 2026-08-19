"use client";

import { useEffect, useState } from "react";
import { Clock3, Film, Play, Volume2, X } from "lucide-react";
import { getOptimizedVideoUrl } from '@/lib/videoUtils';

interface Reel {
  id: string;
  title: string;
  description?: string;
  type?: string;
  duration: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  views?: number;
  createdAt?: string;
}

export default function ReelsPage() {
  const [items, setItems] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  useEffect(() => {
    fetch('/api/reels')
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedReel) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedReel(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedReel]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/40">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {selectedReel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedReel(null)}
        >
          <div
            className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 transition hover:bg-black/70"
              onClick={() => setSelectedReel(null)}
              aria-label="Close reel"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[9/16] bg-black">
              {selectedReel.videoUrl ? (
                <video
                  src={getOptimizedVideoUrl(selectedReel.videoUrl)}
                  className="h-full w-full object-cover"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-900/40 via-black to-red-900/40 text-white/40">
                  <Film className="h-16 w-16" />
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{selectedReel.type || 'Reel'}</p>
                <span className="text-xs text-white/60">
                  {Math.floor(selectedReel.duration / 60)}:{String(selectedReel.duration % 60).padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-white">{selectedReel.title}</h2>
              {selectedReel.description && (
                <p className="mt-2 text-sm text-white/70">{selectedReel.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-amber-400 text-sm uppercase tracking-[0.25em] font-medium">Short Form</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold">Reels</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/50 text-sm">
            <Film className="w-4 h-4" />
            {items.length} videos
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/40">
            No reels yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="group cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                onClick={() => setSelectedReel(item)}
              >
                <div className="relative mx-auto aspect-[9/16] w-full overflow-hidden bg-black">
                  {item.videoUrl ? (
                    <video
                      src={getOptimizedVideoUrl(item.videoUrl)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      muted
                      autoPlay
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-900/40 via-black to-red-900/40">
                      <Film className="h-14 w-14 text-white/30" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
                    <Volume2 className="h-3 w-3" />
                    {item.type || "reel"}
                  </div>

                  <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                    {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="mb-2 flex items-center gap-2 text-white/70 text-xs">
                      <Clock3 className="h-3.5 w-3.5" />
                      {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
                    </div>
                    <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-white/70">{item.description}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                        <Play className="h-3 w-3" />
                        Play
                      </span>
                      <span className="text-xs text-white/60">{item.views ?? 0} views</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
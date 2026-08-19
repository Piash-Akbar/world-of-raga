"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Trash2, Edit, Plus, X } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  createdAt: string;
}

const MAX_VIDEO_SIZE_BYTES = 4 * 1024 * 1024 * 1024;

export default function AdminPracticeVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    category: 'Technique',
    duration: 0,
    video: null as File | null,
  });
  const router = useRouter();

  // Fetch videos
  const fetchVideos = async () => {
    setLoading(true);
    const res = await fetch('/api/practice-videos');
    const data = await res.json();
    setVideos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.video && formData.video.size > MAX_VIDEO_SIZE_BYTES) {
      alert(`Video is too large. Please upload a file smaller than ${MAX_VIDEO_SIZE_BYTES / (1024 * 1024)}MB.`);
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('level', formData.level);
    form.append('category', formData.category);
    form.append('duration', String(formData.duration));
    if (formData.video) {
      form.append('video', formData.video);
    }

    const url = editingId ? `/api/practice-videos/${editingId}` : '/api/practice-videos';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: editingId ? JSON.stringify(formData) : form,
      headers: editingId ? { 'Content-Type': 'application/json' } : undefined,
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        level: 'Beginner',
        category: 'Technique',
        duration: 0,
        video: null,
      });
      fetchVideos();
    } else {
      const errorData = await res.json().catch(() => ({ error: 'Failed to save video' }));
      alert(errorData.error || 'Failed to save video');
    }
  };

  // Delete video
  const deleteVideo = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    const res = await fetch(`/api/practice-videos/${id}`, { method: 'DELETE' });
    if (res.ok) fetchVideos();
  };

  // For editing, we'll just open the form with existing data (simplified)
  const startEdit = (video: Video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      description: video.description || '',
      level: video.level,
      category: video.category || 'Technique',
      duration: video.duration,
      video: null,
    });
    setShowForm(true);
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Practice Videos</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                level: 'Beginner',
                category: 'Technique',
                duration: 0,
                video: null,
              });
            }}
            className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Video
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Edit Video' : 'Add New Video'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      placeholder="e.g., Technique, Raga"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Video File *</label>
                    <input
                      type="file"
                      accept="video/*"
                      required={!editingId}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const selectedFile = e.target.files[0];

                          if (selectedFile.size > MAX_VIDEO_SIZE_BYTES) {
                            alert(`Video is too large. Please upload a file smaller than ${MAX_VIDEO_SIZE_BYTES / (1024 * 1024)}MB.`);
                            e.target.value = '';
                            setFormData({ ...formData, video: null });
                            return;
                          }

                          setFormData({ ...formData, video: selectedFile });
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-amber-400 file:text-black hover:file:bg-amber-500"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-black py-2 rounded-lg font-medium transition"
                >
                  {editingId ? 'Update' : 'Upload'} Video
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Video List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center overflow-hidden">
                {video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  <>
                    <Play className="w-12 h-12 text-white/20" />
                  </>
                )}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}s
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold">{video.title}</h3>
                <p className="text-white/40 text-sm line-clamp-2">{video.description}</p>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-amber-400">{video.level}</span>
                  <span className="text-white/30">{video.category}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(video)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1 rounded flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-1 rounded flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {videos.length === 0 && (
          <p className="text-white/40 text-center py-12">No videos yet. Add one!</p>
        )}
      </div>
    </div>
  );
}
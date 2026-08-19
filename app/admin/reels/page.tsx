"use client";

import { useState, useEffect } from 'react';
import { Film, Plus, Edit, Trash2, X, Play } from 'lucide-react';

interface Reel {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  videoUrl: string;
  views: number;
  createdAt: string;
}

export default function AdminReels() {
  const [items, setItems] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Technique',
    duration: 0,
    video: null as File | null,
  });

  const fetchItems = async () => {
    const res = await fetch('/api/reels');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'video') {
        if (value instanceof File) form.append(key, value);
      } else {
        form.append(key, String(value));
      }
    });

    const url = editingId ? `/api/reels/${editingId}` : '/api/reels';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: editingId ? JSON.stringify(formData) : form,
      headers: editingId ? { 'Content-Type': 'application/json' } : undefined,
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchItems();
    } else {
      alert('Failed to save');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Technique',
      duration: 0,
      video: null,
    });
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/reels/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Reels</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }}
            className="bg-green-400 hover:bg-green-500 text-black px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Reel
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{editingId ? 'Edit' : 'Add'} Reel</h2>
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
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
                    >
                      <option value="Technique">Technique</option>
                      <option value="Phrase">Phrase</option>
                      <option value="Preview">Preview</option>
                      <option value="Behind the Scenes">Behind the Scenes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Duration (seconds)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Video File *</label>
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={(e) => {
                        if (e.target.files) setFormData({ ...formData, video: e.target.files[0] });
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-400 file:text-black hover:file:bg-green-500"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-green-400 hover:bg-green-500 text-black py-2 rounded-lg font-medium transition"
                >
                  {editingId ? 'Update' : 'Upload'} Reel
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="relative aspect-[9/16] bg-gradient-to-br from-green-900/30 to-blue-900/30 flex items-center justify-center overflow-hidden">
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  <Film className="w-12 h-12 text-white/20" />
                )}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.duration}s
                </span>
                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.type}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-white font-medium text-sm">{item.title}</h3>
                <p className="text-white/40 text-xs line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/30 text-xs">{item.views} views</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setFormData({
                          title: item.title,
                          description: item.description || '',
                          type: item.type,
                          duration: item.duration,
                          video: null,
                        });
                        setShowForm(true);
                      }}
                      className="p-1 bg-white/10 hover:bg-white/20 rounded"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && <p className="text-white/40 text-center py-12">No reels yet.</p>}
      </div>
    </div>
  );
}
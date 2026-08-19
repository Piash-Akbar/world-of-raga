"use client";

import { useState, useEffect } from 'react';
import { Music, Plus, Edit, Trash2, X, Play } from 'lucide-react';

const MAX_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024 * 1024;

interface Composition {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  duration: number;
  videoUrl: string;
  pdfUrl: string;
  previewVideoUrl: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
}

export default function AdminCompositions() {
  const [items, setItems] = useState<Composition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Intermediate',
    price: 0,
    duration: 0,
    tags: '',
    video: null as File | null,
    pdf: null as File | null,
  });

  const fetchItems = async () => {
    const res = await fetch('/api/compositions');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.video && formData.video.size > MAX_UPLOAD_SIZE_BYTES) {
      alert(`Video is too large. Please upload a file smaller than ${(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024 * 1024)).toFixed(0)}GB.`);
      return;
    }

    if (formData.pdf && formData.pdf.size > MAX_UPLOAD_SIZE_BYTES) {
      alert(`PDF is too large. Please upload a file smaller than ${(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024 * 1024)).toFixed(0)}GB.`);
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'tags') form.append(key, value as string);
        else if (key === 'video' || key === 'pdf') {
          if (value instanceof File) form.append(key, value);
        } else {
          form.append(key, String(value));
        }
      }
    });

    const url = editingId ? `/api/compositions/${editingId}` : '/api/compositions';
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
      let message = 'Failed to save';
      try {
        const errorPayload = await res.json();
        if (errorPayload?.error) message = errorPayload.error;
      } catch {
        message = 'Failed to save';
      }
      alert(message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      level: 'Intermediate',
      price: 0,
      duration: 0,
      tags: '',
      video: null,
      pdf: null,
    });
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/compositions/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Compositions</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }}
            className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Composition
          </button>
        </div>

        {/* Form Modal - similar to practice video but with fields for price, tags, pdf */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{editingId ? 'Edit' : 'Add'} Composition</h2>
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
                    <label className="block text-white/70 text-sm mb-1">Price (BDT)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
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
                <div>
                  <label className="block text-white/70 text-sm mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    placeholder="Yaman, Teentaal"
                  />
                </div>
                {!editingId && (
                  <>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Video File *</label>
                      <input
                        type="file"
                        accept="video/*"
                        required={!editingId}
                        onChange={(e) => {
                          if (e.target.files) setFormData({ ...formData, video: e.target.files[0] });
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-amber-400 file:text-black hover:file:bg-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">PDF (Sheet Music)</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          if (e.target.files) setFormData({ ...formData, pdf: e.target.files[0] });
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-amber-400 file:text-black hover:file:bg-amber-500"
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-black py-2 rounded-lg font-medium transition"
                >
                  {editingId ? 'Update' : 'Upload'} Composition
                </button>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center overflow-hidden">
                {item.previewVideoUrl || item.videoUrl ? (
                  <video
                    src={item.previewVideoUrl || item.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  <Music className="w-12 h-12 text-white/20" />
                )}
                <span className="absolute top-2 right-2 bg-amber-400/90 text-black text-xs px-2 py-1 rounded font-medium">
                  ৳{item.price}
                </span>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.duration}s
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-white/40 text-sm line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/40">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-amber-400">{item.level}</span>
                  <span className="text-white/30">{item.price > 0 ? 'Paid' : 'Free'}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setFormData({
                        title: item.title,
                        description: item.description || '',
                        level: item.level,
                        price: item.price,
                        duration: item.duration,
                        tags: item.tags.join(', '),
                        video: null,
                        pdf: null,
                      });
                      setShowForm(true);
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1 rounded flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-1 rounded flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && <p className="text-white/40 text-center py-12">No compositions yet.</p>}
      </div>
    </div>
  );
}
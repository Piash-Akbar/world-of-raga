"use client";

import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X, Play } from 'lucide-react';

const MAX_MASTERCLASS_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024 * 1024;

interface Masterclass {
  id: string;
  title: string;
  maestro: string;
  about: string;
  price: number;
  duration: number;
  previewVideoUrl: string;
  lessons: any[];
  isPublished: boolean;
  createdAt: string;
}

export default function AdminMasterclasses() {
  const [items, setItems] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ tone: 'info' | 'success' | 'error'; message: string }>({
    tone: 'info',
    message: 'No video selected yet.',
  });
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    maestro: '',
    about: '',
    price: 0,
    duration: 0,
    lessons: '[]',
    video: null as File | null,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateVideoFile = (file: File | null) => {
    if (!file) {
      setUploadStatus({ tone: 'info', message: 'No video selected yet.' });
      return null;
    }

    if (!file.type.startsWith('video/')) {
      setUploadStatus({ tone: 'error', message: 'Selected file is not a valid video. Please choose a video file.' });
      return null;
    }

    if (file.size > MAX_MASTERCLASS_UPLOAD_SIZE_BYTES) {
      setUploadStatus({
        tone: 'error',
        message: `Video is too large (${formatFileSize(file.size)}). Please upload a file smaller than ${(MAX_MASTERCLASS_UPLOAD_SIZE_BYTES / (1024 * 1024 * 1024)).toFixed(0)}GB.`,
      });
      return null;
    }

    setUploadStatus({
      tone: 'success',
      message: `Valid video selected (${formatFileSize(file.size)}).`,
    });
    return file;
  };

  const fetchItems = async () => {
    const res = await fetch('/api/masterclasses');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedVideo = validateVideoFile(formData.video);
    if (!selectedVideo) {
      return;
    }

    setUploading(true);
    setUploadStatus({ tone: 'info', message: 'Validating video and uploading to Cloudinary…' });

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (key === 'video') {
        if (value instanceof File) form.append(key, value);
      } else {
        form.append(key, String(value));
      }
    });

    const url = editingId ? `/api/masterclasses/${editingId}` : '/api/masterclasses';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: form,
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      resetForm();
      setUploadStatus({ tone: 'success', message: 'Upload complete.' });
      setUploading(false);
      fetchItems();
    } else {
      const message = data.error || 'Failed to save';
      setUploadStatus({ tone: 'error', message });
      setUploading(false);
      alert(message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      maestro: '',
      about: '',
      price: 0,
      duration: 0,
      lessons: '[]',
      video: null,
    });
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/masterclasses/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Masterclasses</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }}
            className="bg-purple-400 hover:bg-purple-500 text-black px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Masterclass
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{editingId ? 'Edit' : 'Add'} Masterclass</h2>
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
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Maestro *</label>
                  <input
                    type="text"
                    required
                    value={formData.maestro}
                    onChange={(e) => setFormData({ ...formData, maestro: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">About</label>
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Price (BDT)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Duration (seconds)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Lessons (JSON array)</label>
                  <textarea
                    value={formData.lessons}
                    onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400 font-mono text-sm"
                    rows={4}
                    placeholder='[{"lessonTitle":"Intro","videoUrl":"","description":"","orderNo":1}]'
                  />
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Preview Video</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0] ?? null;
                        const validatedFile = validateVideoFile(selectedFile);
                        if (!validatedFile) {
                          e.target.value = '';
                          setFormData({ ...formData, video: null });
                          return;
                        }
                        setFormData({ ...formData, video: validatedFile });
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-400 file:text-black hover:file:bg-purple-500"
                    />
                    {uploadStatus.message && (
                      <p className={`mt-2 text-sm ${uploadStatus.tone === 'error' ? 'text-red-400' : uploadStatus.tone === 'success' ? 'text-emerald-400' : 'text-white/60'}`}>
                        {uploadStatus.message}
                      </p>
                    )}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-purple-400 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-black py-2 rounded-lg font-medium transition"
                >
                  {uploading ? 'Uploading...' : editingId ? 'Update' : 'Upload'} Masterclass
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/30 to-amber-900/30 flex items-center justify-center overflow-hidden">
                {item.previewVideoUrl ? (
                  <video
                    src={item.previewVideoUrl}
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
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.duration}s
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-purple-400 text-sm">{item.maestro}</p>
                <p className="text-white/40 text-sm line-clamp-2">{item.about}</p>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-white/30">{item.lessons?.length || 0} lessons</span>
                  <span className="text-white/30">{item.price > 0 ? 'Paid' : 'Free'}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setFormData({
                        title: item.title,
                        maestro: item.maestro,
                        about: item.about || '',
                        price: item.price,
                        duration: item.duration,
                        lessons: JSON.stringify(item.lessons || []),
                        video: null,
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
        {items.length === 0 && <p className="text-white/40 text-center py-12">No masterclasses yet.</p>}
      </div>
    </div>
  );
}
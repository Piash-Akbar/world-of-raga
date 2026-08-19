"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, X, Play } from "lucide-react";
import { CloudinaryUploadWidget } from "@/components/CloudinaryUploadWidget";

interface Masterclass {
  id: string;
  title: string;
  maestro: string;
  about: string;
  price: number;
  duration: number;
  previewVideoUrl: string;
  thumbnailUrl?: string;
  lessons: any[];
  isPublished: boolean;
  createdAt: string;
}

export default function AdminMasterclasses() {
  const [items, setItems] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    maestro: "",
    about: "",
    price: 0,
    duration: 0,
    lessons: "[]",
  });

  // Upload state – store the result from CloudinaryUploadWidget
  const [uploadedVideo, setUploadedVideo] = useState<{
    secure_url: string;
    public_id: string;
  } | null>(null);

  const [uploadStatus, setUploadStatus] = useState<{
    tone: "info" | "success" | "error";
    message: string;
  }>({ tone: "info", message: "Upload a video (max 5GB)" });

  const fetchItems = async () => {
    const res = await fetch("/api/masterclasses");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      maestro: "",
      about: "",
      price: 0,
      duration: 0,
      lessons: "[]",
    });
    setUploadedVideo(null);
    setUploadStatus({ tone: "info", message: "Upload a video (max 5GB)" });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title || !formData.maestro) {
      setUploadStatus({ tone: "error", message: "Title and Maestro are required" });
      setIsSubmitting(false);
      return;
    }

    // For new masterclasses, video is required (either uploaded via widget or we have a publicId)
    if (!editingId && !uploadedVideo) {
      setUploadStatus({ tone: "error", message: "Please upload a video first" });
      setIsSubmitting(false);
      return;
    }

    // Build FormData for submission
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("maestro", formData.maestro);
    submitData.append("about", formData.about);
    submitData.append("price", String(formData.price));
    submitData.append("duration", String(formData.duration));
    submitData.append("lessons", formData.lessons);

    // If we have an uploaded video from the widget, include its URL and public ID
    if (uploadedVideo) {
      submitData.append("videoUrl", uploadedVideo.secure_url);
      submitData.append("publicId", uploadedVideo.public_id);
    }

    const url = editingId ? `/api/masterclasses/${editingId}` : "/api/masterclasses";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: submitData,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchItems();
        setUploadStatus({ tone: "success", message: "Masterclass saved!" });
      } else {
        const errorMsg = data.error || "Failed to save masterclass";
        setUploadStatus({ tone: "error", message: errorMsg });
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setUploadStatus({ tone: "error", message: "Network error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this masterclass?")) return;
    const res = await fetch(`/api/masterclasses/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  };

  const openEdit = (item: Masterclass) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      maestro: item.maestro,
      about: item.about || "",
      price: item.price,
      duration: item.duration,
      lessons: JSON.stringify(item.lessons || []),
    });
    // Pre‑populate the uploaded video state if there is a preview URL
    if (item.previewVideoUrl) {
      setUploadedVideo({
        secure_url: item.previewVideoUrl,
        public_id: "", // We don't have public_id from the item, but we can leave empty
      });
      setUploadStatus({ tone: "success", message: "Existing video will be kept" });
    } else {
      setUploadedVideo(null);
      setUploadStatus({ tone: "info", message: "Upload a new video (optional)" });
    }
    setShowForm(true);
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Masterclasses</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-purple-400 hover:bg-purple-500 text-black px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Masterclass
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit" : "Add"} Masterclass
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-white/70 text-sm mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Maestro */}
                <div>
                  <label className="block text-white/70 text-sm mb-1">Maestro *</label>
                  <input
                    type="text"
                    required
                    value={formData.maestro}
                    onChange={(e) =>
                      setFormData({ ...formData, maestro: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* About */}
                <div>
                  <label className="block text-white/70 text-sm mb-1">About</label>
                  <textarea
                    value={formData.about}
                    onChange={(e) =>
                      setFormData({ ...formData, about: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                    rows={3}
                  />
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Price (BDT)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Duration (seconds)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Lessons JSON */}
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    Lessons (JSON array)
                  </label>
                  <textarea
                    value={formData.lessons}
                    onChange={(e) =>
                      setFormData({ ...formData, lessons: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400 font-mono text-sm"
                    rows={4}
                    placeholder='[{"lessonTitle":"Intro","videoUrl":"","description":"","orderNo":1}]'
                  />
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    {editingId ? "Video (optional)" : "Video *"}
                  </label>
                  <CloudinaryUploadWidget
                    folder="masterclasses"
                    onUpload={(info) => {
                      setUploadedVideo({
                        secure_url: info.secure_url,
                        public_id: info.public_id,
                      });
                      setUploadStatus({
                        tone: "success",
                        message: `Video uploaded: ${info.secure_url.substring(0, 50)}...`,
                      });
                    }}
                    onProgress={(percent) => {
                      setUploadStatus({
                        tone: "info",
                        message: `Uploading… ${percent}%`,
                      });
                    }}
                    onError={(msg) => {
                      setUploadStatus({ tone: "error", message: msg });
                    }}
                  />
                  {uploadStatus.message && (
                    <p
                      className={`mt-2 text-sm ${
                        uploadStatus.tone === "error"
                          ? "text-red-400"
                          : uploadStatus.tone === "success"
                          ? "text-emerald-400"
                          : "text-white/60"
                      }`}
                    >
                      {uploadStatus.message}
                    </p>
                  )}
                  {uploadedVideo && editingId && (
                    <p className="mt-1 text-xs text-white/40">
                      Current video will be replaced with the new upload if you submit.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-400 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-black py-2 rounded-lg font-medium transition"
                >
                  {isSubmitting
                    ? "Saving…"
                    : editingId
                    ? "Update Masterclass"
                    : "Create Masterclass"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Masterclass List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
            >
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
                  <span className="text-white/30">
                    {item.lessons?.length || 0} lessons
                  </span>
                  <span className="text-white/30">
                    {item.price > 0 ? "Paid" : "Free"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(item)}
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
        {items.length === 0 && (
          <p className="text-white/40 text-center py-12">No masterclasses yet.</p>
        )}
      </div>
    </div>
  );
}
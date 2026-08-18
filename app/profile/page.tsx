// src/app/profile/page.tsx
"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, Camera } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Demo User",
    email: "demo@worldofraag.com",
    bio: "Passionate violin learner exploring Indian classical music.",
    location: "Mumbai, India",
    instrument: "Violin",
    experience: "Intermediate",
    joined: "January 2026",
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-amber-400/20 flex items-center justify-center">
                <User className="w-12 h-12 text-amber-400" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-amber-400 text-black p-1 rounded-full">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-2xl font-bold text-white bg-white/5 border border-white/10 rounded-lg px-3 py-1 w-full max-w-md focus:outline-none focus:border-amber-400"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              )}
              <div className="flex items-center gap-2 text-white/40 mt-1">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
            <div>
              <label className="text-white/40 text-sm block mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  rows={3}
                />
              ) : (
                <p className="text-white">{profile.bio}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/40 text-sm block mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-amber-400"
                  />
                ) : (
                  <p className="text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/40" />
                    {profile.location}
                  </p>
                )}
              </div>

              <div>
                <label className="text-white/40 text-sm block mb-1">Instrument</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.instrument}
                    onChange={(e) => setProfile({ ...profile, instrument: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-amber-400"
                  />
                ) : (
                  <p className="text-white">{profile.instrument}</p>
                )}
              </div>

              <div>
                <label className="text-white/40 text-sm block mb-1">Experience Level</label>
                {isEditing ? (
                  <select
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                ) : (
                  <p className="text-amber-400">{profile.experience}</p>
                )}
              </div>

              <div>
                <label className="text-white/40 text-sm block mb-1">Member Since</label>
                <p className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/40" />
                  {profile.joined}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-amber-400">12</div>
            <div className="text-white/40 text-sm">Practice Sessions</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-purple-400">4</div>
            <div className="text-white/40 text-sm">Masterclasses</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-green-400">85%</div>
            <div className="text-white/40 text-sm">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
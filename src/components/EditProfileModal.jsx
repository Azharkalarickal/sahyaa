import React, { useState } from 'react';
import { X, Check, Camera, Image as ImageIcon, Briefcase, GraduationCap, MapPin, Heart, Globe, Sparkles } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&auto=format&fit=crop&q=80',
];

export default function EditProfileModal({ isOpen, onClose, currentUser, onUpdateSuccess }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [penName, setPenName] = useState(currentUser?.pen_name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [intro, setIntro] = useState(currentUser?.intro || '');
  const [work, setWork] = useState(currentUser?.work || '');
  const [education, setEducation] = useState(currentUser?.education || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [hometown, setHometown] = useState(currentUser?.hometown || '');
  const [relationshipStatus, setRelationshipStatus] = useState(currentUser?.relationship_status || 'In a relationship with poetry');
  const [website, setWebsite] = useState(currentUser?.website || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0]);
  const [coverPhoto, setCoverPhoto] = useState(currentUser?.cover_photo || COVER_PRESETS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          pen_name: penName,
          bio,
          intro,
          work,
          education,
          location,
          hometown,
          relationship_status: relationshipStatus,
          website,
          avatar,
          cover_photo: coverPhoto
        })
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdateSuccess(updated);
        onClose();
      }
    } catch {} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div 
        className="w-full max-w-2xl rounded-3xl glass-panel-elevated bg-[#141b24] border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-white">Edit Profile & Persona</h3>
            <p className="text-xs text-slate-400 font-literary italic">Saved in <code className="text-emerald-400 font-mono">sahyaa.db</code></p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl glass-panel text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. Profile Picture & Cover Photo Preview & Chooser */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Avatars & Visual Themes</h4>
            
            {/* Avatar picker */}
            <div>
              <label className="text-xs text-slate-300 block mb-1">Choose Profile Photo</label>
              <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                {AVATAR_PRESETS.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Preset"
                    onClick={() => setAvatar(url)}
                    className={`w-12 h-12 rounded-full object-cover cursor-pointer ring-2 transition-all ${
                      avatar === url ? 'ring-emerald-400 scale-110 shadow-lg' : 'ring-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Cover photo picker */}
            <div>
              <label className="text-xs text-slate-300 block mb-1">Choose Cover Banner</label>
              <div className="grid grid-cols-5 gap-2">
                {COVER_PRESETS.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Cover"
                    onClick={() => setCoverPhoto(url)}
                    className={`w-full h-12 rounded-xl object-cover cursor-pointer ring-2 transition-all ${
                      coverPhoto === url ? 'ring-emerald-400 scale-105 shadow-md' : 'ring-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 2. Display Name & Pen Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Pen Name / Bard Handle</label>
              <input
                type="text"
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Bio & Intro Statement */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Short Profile Intro (Shown under name)</label>
            <input
              type="text"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="E.g. Chronicling monsoon rain, ancestral nostalgia, and unfettered verses."
              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none font-literary italic"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Bio / Confessional Statement</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none font-literary"
            />
          </div>

          {/* 4. Social Details (Work, Education, Places lived, Relationship) */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Social Network Provenance</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">💼 Work / Career</label>
                <input
                  type="text"
                  placeholder="e.g. Author & Novelist at Sahyaa Guild"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">🎓 Education / Studies</label>
                <input
                  type="text"
                  placeholder="e.g. Studied Literature at Calicut University"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">🏠 Current City / Lives in</label>
                <input
                  type="text"
                  placeholder="e.g. Kochi, Kerala"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">📍 Hometown / From</label>
                <input
                  type="text"
                  placeholder="e.g. Malabar, Kerala"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">❤️ Relationship / Status</label>
                <input
                  type="text"
                  placeholder="e.g. Married, Single, In a romance with poetry"
                  value={relationshipStatus}
                  onChange={(e) => setRelationshipStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">🌐 Website / Portfolio URL</label>
                <input
                  type="text"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Database...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

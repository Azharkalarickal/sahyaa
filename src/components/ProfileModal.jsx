import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  BookOpen, 
  Bookmark, 
  Feather, 
  Settings, 
  Award, 
  Check, 
  Flame, 
  Eye, 
  Clock, 
  FileText,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function ProfileModal({ 
  user, 
  onClose, 
  onSelectPost, 
  onUpdateProfile 
}) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published'); // published, drafts, bookmarks, edit
  
  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [penName, setPenName] = useState(user?.pen_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [role, setRole] = useState(user?.role || 'writer');
  const [location, setLocation] = useState(user?.location || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`/api/users/${user.id}`)
      .then(r => r.json())
      .then(data => {
        setProfileData(data);
        setName(data.name || '');
        setPenName(data.pen_name || '');
        setBio(data.bio || '');
        setRole(data.role || 'writer');
        setLocation(data.location || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.id]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pen_name: penName, bio, role, location })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfileData(prev => ({ ...prev, ...updated }));
        onUpdateProfile(updated);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch {}
  };

  const currentUserData = profileData || user;
  const publishedPosts = profileData?.posts?.filter(p => p.status === 'published') || [];
  const draftPosts = profileData?.posts?.filter(p => p.status === 'draft') || [];
  const bookmarkedPosts = profileData?.bookmarks || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      
      <div 
        className="w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-3xl glass-panel-elevated bg-[#0e141c] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Profile Header Cover */}
        <div className="relative h-44 bg-gradient-to-r from-emerald-950 via-[#141b24] to-[#0c1015] p-6 flex justify-between items-start border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              {currentUserData?.role} Persona
            </span>
            {currentUserData?.badge && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ✦ {currentUserData.badge}
              </span>
            )}
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl glass-panel text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-6 relative -mt-14 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end space-x-4">
              <img
                src={currentUserData?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                alt={currentUserData?.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#0e141c] shadow-2xl"
              />
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-white">{currentUserData?.name}</h2>
                <p className="text-xs text-emerald-400 font-mono">Pen Name: @{currentUserData?.pen_name || currentUserData?.username}</p>
                <p className="text-xs text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{currentUserData?.location || 'South Asia'}</span>
                </p>
              </div>
            </div>

            {/* Author Metrics */}
            <div className="flex items-center space-x-4 p-3 rounded-2xl glass-panel border border-white/5 text-xs font-mono">
              <div className="text-center px-2">
                <span className="block font-bold text-white text-base">{publishedPosts.length}</span>
                <span className="text-slate-400 text-[10px]">Works</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center px-2">
                <span className="block font-bold text-emerald-400 text-base">{currentUserData?.followers_count || 1420}</span>
                <span className="text-slate-400 text-[10px]">Followers</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center px-2">
                <span className="block font-bold text-amber-400 text-base">{bookmarkedPosts.length}</span>
                <span className="text-slate-400 text-[10px]">Saved</span>
              </div>
            </div>
          </div>

          <p className="text-sm font-literary italic text-slate-300 leading-relaxed max-w-2xl">
            "{currentUserData?.bio || 'Writing and reading along the Western Ghats.'}"
          </p>

          {/* Literary Genres Tags */}
          {currentUserData?.genres && currentUserData.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentUserData.genres.map((g, idx) => (
                <span key={idx} className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  #{g}
                </span>
              ))}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center space-x-2 border-b border-white/10 pt-2">
            {[
              { id: 'published', label: `Published Works (${publishedPosts.length})`, icon: Feather },
              { id: 'drafts', label: `Drafts (${draftPosts.length})`, icon: FileText },
              { id: 'bookmarks', label: `Reading List (${bookmarkedPosts.length})`, icon: Bookmark },
              { id: 'edit', label: 'Persona Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'border-emerald-400 text-emerald-300 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="pt-2">
            {activeTab === 'published' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {publishedPosts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => { onClose(); onSelectPost(post); }}
                    className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/40 cursor-pointer space-y-2 transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                      <span className="capitalize">{post.type}</span>
                      <span>{post.read_time_mins} min</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">{post.title}</h4>
                    <p className="text-xs text-slate-400 font-literary italic line-clamp-2">"{post.excerpt}"</p>
                    <div className="flex items-center space-x-4 pt-2 text-xs text-slate-400 font-mono">
                      <span className="flex items-center space-x-1"><Flame className="w-3.5 h-3.5 text-amber-400" /> {post.applauds_count}</span>
                      <span className="flex items-center space-x-1"><Eye className="w-3.5 h-3.5 text-teal-400" /> {post.views_count}</span>
                    </div>
                  </div>
                ))}
                {publishedPosts.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-8 col-span-2">No published works yet.</p>
                )}
              </div>
            )}

            {activeTab === 'drafts' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {draftPosts.map(post => (
                  <div key={post.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">Draft</span>
                    <h4 className="font-display text-lg font-bold text-white">{post.title}</h4>
                    <p className="text-xs text-slate-400 font-literary italic line-clamp-2">"{post.excerpt}"</p>
                  </div>
                ))}
                {draftPosts.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-8 col-span-2">No private drafts stored.</p>
                )}
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookmarkedPosts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => { onClose(); onSelectPost(post); }}
                    className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/40 cursor-pointer space-y-2 transition-all"
                  >
                    <span className="text-xs text-amber-400 font-mono capitalize">{post.type}</span>
                    <h4 className="font-display text-lg font-bold text-white">{post.title}</h4>
                    <p className="text-xs text-slate-300 font-literary italic">Author: {post.pen_name || post.author_name}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">"{post.excerpt}"</p>
                  </div>
                ))}
                {bookmarkedPosts.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-8 col-span-2">Your reading list is empty. Click the bookmark icon on any piece to save it here.</p>
                )}
              </div>
            )}

            {activeTab === 'edit' && (
              <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 max-w-xl">
                {savedSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-300 text-xs flex items-center space-x-2 border border-emerald-500/40">
                    <Check className="w-4 h-4" />
                    <span>Profile preferences updated!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Pen Name / Bard Handle</label>
                    <input
                      type="text"
                      value={penName}
                      onChange={(e) => setPenName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Primary Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                    >
                      <option value="writer">Writer & Bard</option>
                      <option value="reader">Avid Reader & Critic</option>
                      <option value="editor">Journal Curator / Editor</option>
                      <option value="moderator">Platform Guardian</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Location / Regional Lore</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Bio / Confessional Statement</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none font-literary"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-md"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

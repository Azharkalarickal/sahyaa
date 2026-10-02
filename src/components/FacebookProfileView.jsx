import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Edit3, 
  Plus, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Globe, 
  Sparkles, 
  Bookmark, 
  Feather, 
  Image as ImageIcon, 
  Share2, 
  FileText,
  Clock,
  ThumbsUp,
  MessageCircle,
  MoreHorizontal
} from 'lucide-react';
import FacebookPostCard from './FacebookPostCard.jsx';
import FacebookComposer from './FacebookComposer.jsx';

export default function FacebookProfileView({ 
  user, 
  currentUser, 
  onSelectPost, 
  onApplaud, 
  onBookmark, 
  onOpenQuoteModal, 
  onOpenReportModal, 
  onAddComment,
  openStudio,
  openEditProfile,
  onFollowAuthor 
}) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline'); // timeline, about, followers, photos, saved, drafts

  const fetchProfile = () => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`/api/users/${user.id}`)
      .then(r => r.json())
      .then(data => {
        setProfileData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const displayUser = profileData || user;
  const isSelf = currentUser?.id === displayUser?.id;
  const publishedPosts = profileData?.posts?.filter(p => p.status === 'published') || [];
  const draftPosts = profileData?.posts?.filter(p => p.status === 'draft') || [];
  const bookmarkedPosts = profileData?.bookmarks || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 pb-12">
      
      {/* 1. COVER PHOTO & PROFILE HEADER CONTAINER */}
      <div className="rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] overflow-hidden shadow-xl">
        
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-900">
          <img
            src={displayUser?.cover_photo || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&auto=format&fit=crop&q=80'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141b24] via-transparent to-black/30" />

          {isSelf && (
            <button
              onClick={openEditProfile}
              className="absolute right-4 bottom-4 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-2 border border-white/10 transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Edit Cover Photo</span>
            </button>
          )}
        </div>

        {/* Profile Details Row */}
        <div className="px-6 sm:px-10 pb-6 relative -mt-16 sm:-mt-20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-5">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full ring-4 ring-[#141b24] shadow-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                <img
                  src={displayUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'}
                  alt={displayUser?.name}
                  className="w-full h-full object-cover"
                />
                {isSelf && (
                  <button
                    onClick={openEditProfile}
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-emerald-500 text-emerald-950 shadow-lg hover:scale-110 transition-transform"
                    title="Change Profile Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{displayUser?.name}</h1>
                  {displayUser?.badge && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      ✦ {displayUser.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-400 font-mono">@{displayUser?.pen_name || displayUser?.username} • <span className="capitalize text-slate-300">{displayUser?.role}</span></p>
                <p className="text-xs text-slate-400 font-mono">
                  {displayUser?.followers_count || 1420} followers • {displayUser?.following_count || 18} following
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2.5">
              {isSelf ? (
                <>
                  <button
                    onClick={openStudio}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Piece</span>
                  </button>

                  <button
                    onClick={openEditProfile}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#1e293b] hover:bg-[#2a384f] border border-white/10 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>Edit Profile</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onFollowAuthor(displayUser.id)}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Follow Author</span>
                </button>
              )}
            </div>

          </div>

          {/* Bio / Confessional Statement */}
          <p className="font-literary text-sm sm:text-base italic text-slate-300 leading-relaxed max-w-3xl pt-2">
            "{displayUser?.intro || displayUser?.bio || 'Crafting stories and verses on Sahyaa.'}"
          </p>

          {/* Profile Navigation Tabs (Facebook Style) */}
          <div className="flex items-center space-x-1 border-t border-white/10 pt-2 overflow-x-auto">
            {[
              { id: 'timeline', label: 'Timeline / Posts' },
              { id: 'about', label: 'About' },
              { id: 'followers', label: `Followers (${displayUser?.followers_count || 1420})` },
              { id: 'photos', label: `Artworks & Media (${publishedPosts.length})` },
              { id: 'saved', label: `Reading List (${bookmarkedPosts.length})` },
              { id: 'drafts', label: `Private Drafts (${draftPosts.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 2. TAB VIEWPORTS */}

      {/* TAB A: TIMELINE / POSTS (2-Column Facebook Layout: Left Intro Box, Right Posts) */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Intro & Details Card */}
          <div className="space-y-4">
            
            {/* Intro Details Box */}
            <div className="p-5 rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] space-y-4 shadow-md text-xs text-slate-300">
              <h3 className="font-display text-base font-bold text-white">Intro & Provenance</h3>
              
              <p className="font-literary italic text-slate-300">
                "{displayUser?.bio || 'Writing and reading along the Western Ghats.'}"
              </p>

              <div className="space-y-2.5 pt-2 border-t border-white/5">
                {displayUser?.work && (
                  <div className="flex items-start space-x-2.5">
                    <Briefcase className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Works at <strong className="text-white">{displayUser.work}</strong></span>
                  </div>
                )}

                {displayUser?.education && (
                  <div className="flex items-start space-x-2.5">
                    <GraduationCap className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>Studied at <strong className="text-white">{displayUser.education}</strong></span>
                  </div>
                )}

                {displayUser?.location && (
                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>Lives in <strong className="text-white">{displayUser.location}</strong></span>
                  </div>
                )}

                {displayUser?.hometown && (
                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>From <strong className="text-white">{displayUser.hometown}</strong></span>
                  </div>
                )}

                {displayUser?.relationship_status && (
                  <div className="flex items-start space-x-2.5">
                    <Heart className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>Status: <strong className="text-white">{displayUser.relationship_status}</strong></span>
                  </div>
                )}

                {displayUser?.website && (
                  <div className="flex items-start space-x-2.5">
                    <Globe className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <a href={displayUser.website} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline truncate">
                      {displayUser.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Literary Genres Tags */}
              {displayUser?.genres && displayUser.genres.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Literary Interests</span>
                  <div className="flex flex-wrap gap-1.5">
                    {displayUser.genres.map((g, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        #{g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isSelf && (
                <button
                  onClick={openEditProfile}
                  className="w-full py-2 rounded-xl bg-[#1e293b] hover:bg-[#29374d] text-slate-200 font-semibold text-xs transition-colors"
                >
                  Edit Details
                </button>
              )}
            </div>

            {/* Photo Gallery Shortcut Box */}
            <div className="p-5 rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">Cover Artworks</h3>
                <span onClick={() => setActiveTab('photos')} className="text-xs text-emerald-400 hover:underline cursor-pointer">See all</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {publishedPosts.slice(0, 6).map(p => (
                  <img
                    key={p.id}
                    src={p.cover_image || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=300'}
                    alt={p.title}
                    onClick={() => onSelectPost(p)}
                    className="w-full h-20 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Post Composer + User's Timeline Posts */}
          <div className="lg:col-span-2 space-y-6">
            {isSelf && (
              <FacebookComposer
                currentUser={currentUser}
                openStudio={openStudio}
                openQuoteModal={onOpenQuoteModal}
                setCurrentTab={() => {}}
              />
            )}

            {/* Published Posts */}
            <div className="space-y-6">
              {publishedPosts.map(post => (
                <FacebookPostCard
                  key={post.id}
                  post={{ ...post, author_avatar: displayUser.avatar, author_name: displayUser.name, pen_name: displayUser.pen_name }}
                  currentUser={currentUser}
                  onSelectPost={onSelectPost}
                  onApplaud={onApplaud}
                  onBookmark={onBookmark}
                  onOpenQuoteModal={onOpenQuoteModal}
                  onOpenReportModal={onOpenReportModal}
                  onAddComment={onAddComment}
                />
              ))}

              {publishedPosts.length === 0 && (
                <div className="p-12 text-center glass-panel rounded-3xl border border-white/10 space-y-2">
                  <Feather className="w-8 h-8 text-emerald-400/60 mx-auto" />
                  <p className="text-sm font-semibold text-white">No published pieces on this timeline yet.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB B: ABOUT OVERVIEW */}
      {activeTab === 'about' && (
        <div className="p-8 rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-display text-2xl font-bold text-white">About {displayUser?.name}</h2>
            {isSelf && (
              <button
                onClick={openEditProfile}
                className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Information</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase text-emerald-400">Work & Literary Career</h4>
              <p className="flex items-center space-x-2"><Briefcase className="w-4 h-4 text-slate-400" /> <span>{displayUser?.work || 'Author & Bard'}</span></p>
              <p className="flex items-center space-x-2"><GraduationCap className="w-4 h-4 text-slate-400" /> <span>{displayUser?.education || 'Self-taught in regional literature'}</span></p>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase text-teal-400">Places Lived</h4>
              <p className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-slate-400" /> <span>Current City: {displayUser?.location || 'Kerala'}</span></p>
              <p className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-slate-400" /> <span>Hometown: {displayUser?.hometown || 'Malabar'}</span></p>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase text-pink-400">Relationship & Persona</h4>
              <p className="flex items-center space-x-2"><Heart className="w-4 h-4 text-slate-400" /> <span>{displayUser?.relationship_status || 'In a relationship with words'}</span></p>
              <p className="flex items-center space-x-2"><Globe className="w-4 h-4 text-slate-400" /> <span>{displayUser?.website || 'https://sahyaa.lit'}</span></p>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase text-amber-400">Literary Taxonomy</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {displayUser?.genres && displayUser.genres.map((g, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-black/40 text-emerald-300 text-xs border border-white/10">
                    #{g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: SAVED / BOOKMARKS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white px-1">Saved Reading List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedPosts.map(post => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="p-5 rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] hover:border-amber-500/40 cursor-pointer space-y-2 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                  <span className="capitalize">{post.type}</span>
                  <span>{post.read_time_mins} min</span>
                </div>
                <h4 className="font-display text-lg font-bold text-white">{post.title}</h4>
                <p className="text-xs text-slate-300 font-literary italic">By {post.pen_name || post.author_name}</p>
                <p className="text-xs text-slate-400 line-clamp-2">"{post.excerpt}"</p>
              </div>
            ))}
            {bookmarkedPosts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8 col-span-2">No saved pieces in this reading list.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB D: PRIVATE DRAFTS */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white px-1">Writer Studio Drafts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draftPosts.map(post => (
              <div key={post.id} className="p-5 rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase font-bold">Draft</span>
                <h4 className="font-display text-lg font-bold text-white">{post.title}</h4>
                <p className="text-xs text-slate-400 font-literary italic line-clamp-2">"{post.excerpt}"</p>
              </div>
            ))}
            {draftPosts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8 col-span-2">No private drafts stored.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB E: PHOTOS & ARTWORKS */}
      {activeTab === 'photos' && (
        <div className="p-6 rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Cover Art & Visual Cards</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {publishedPosts.map(p => (
              <div 
                key={p.id}
                onClick={() => onSelectPost(p)}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-black/40 cursor-pointer shadow-md"
              >
                <img src={p.cover_image || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600'} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                  <span className="text-[11px] font-semibold text-white truncate">{p.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

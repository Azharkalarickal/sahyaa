import React from 'react';
import { 
  Users, 
  Bookmark, 
  BookMarked, 
  Feather, 
  Share2, 
  FileCheck2, 
  ShieldAlert, 
  Layers, 
  Settings, 
  Sparkles,
  Compass,
  Award
} from 'lucide-react';

export default function FacebookSidebarLeft({ 
  currentUser, 
  currentTab, 
  setCurrentTab, 
  openProfile, 
  openStudio, 
  openQuoteModal,
  openOnboarding 
}) {
  return (
    <aside className="hidden lg:block w-72 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto p-3 space-y-2 text-slate-300 text-xs">
      
      {/* Current User Item */}
      <div 
        onClick={openProfile}
        className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
      >
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
          alt={currentUser?.name}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
        />
        <div className="truncate flex-1">
          <p className="font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
            {currentUser?.name}
          </p>
          <p className="text-[11px] text-emerald-400 truncate">
            @{currentUser?.pen_name || currentUser?.username}
          </p>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="space-y-0.5 pt-1">
        <button
          onClick={() => setCurrentTab('feed')}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-colors ${
            currentTab === 'feed' ? 'bg-emerald-500/15 text-emerald-300 font-semibold' : 'hover:bg-white/5'
          }`}
        >
          <Compass className="w-5 h-5 text-emerald-400" />
          <span className="text-sm">Discover Feed</span>
        </button>

        <button
          onClick={openProfile}
          className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-left hover:bg-white/5 transition-colors"
        >
          <Bookmark className="w-5 h-5 text-amber-400" />
          <span className="text-sm">Saved Reading List</span>
        </button>

        <button
          onClick={() => setCurrentTab('magazines')}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-colors ${
            currentTab === 'magazines' ? 'bg-emerald-500/15 text-emerald-300 font-semibold' : 'hover:bg-white/5'
          }`}
        >
          <BookMarked className="w-5 h-5 text-teal-400" />
          <span className="text-sm">Literary Magazines</span>
        </button>

        <button
          onClick={openStudio}
          className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-left hover:bg-white/5 transition-colors"
        >
          <Feather className="w-5 h-5 text-emerald-300" />
          <span className="text-sm">Writer Studio</span>
        </button>

        <button
          onClick={() => openQuoteModal(null)}
          className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-left hover:bg-white/5 transition-colors"
        >
          <Share2 className="w-5 h-5 text-amber-300" />
          <span className="text-sm">Quote Card Creator</span>
        </button>

        <button
          onClick={() => setCurrentTab('editorial')}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-colors ${
            currentTab === 'editorial' ? 'bg-amber-500/15 text-amber-300 font-semibold' : 'hover:bg-white/5'
          }`}
        >
          <FileCheck2 className="w-5 h-5 text-amber-400" />
          <span className="text-sm">Editorial Desk</span>
        </button>

        <button
          onClick={() => setCurrentTab('moderation')}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-colors ${
            currentTab === 'moderation' ? 'bg-rose-500/15 text-rose-300 font-semibold' : 'hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span className="text-sm">Guardian Safety</span>
        </button>

        <button
          onClick={() => setCurrentTab('architecture')}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-colors ${
            currentTab === 'architecture' ? 'bg-indigo-500/15 text-indigo-300 font-semibold' : 'hover:bg-white/5'
          }`}
        >
          <Layers className="w-5 h-5 text-indigo-400" />
          <span className="text-sm">MVP User Flowchart</span>
        </button>
      </div>

      {/* Literary Guild Shortcuts */}
      <div className="pt-4 border-t border-white/5 space-y-2">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-2.5">
          Your Literary Circles
        </h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
              M
            </div>
            <span className="text-xs text-slate-300 truncate">Malabar Monsoon Guild</span>
          </div>
          <div className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
              K
            </div>
            <span className="text-xs text-slate-300 truncate">Kavya Poets Circle</span>
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="pt-4 text-[11px] text-slate-500 px-2 leading-relaxed">
        <p>Sahyaa Literary Network © 2026</p>
        <p className="text-[10px] text-emerald-500/80 font-mono mt-0.5">SQLite database: sahyaa.db</p>
      </div>

    </aside>
  );
}

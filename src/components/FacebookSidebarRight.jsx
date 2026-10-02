import React from 'react';
import { UserPlus, Check, Flame, BookMarked, Sparkles, ExternalLink } from 'lucide-react';

export default function FacebookSidebarRight({ 
  users = [], 
  currentUser, 
  onFollowAuthor, 
  setCurrentTab,
  onSelectUser 
}) {
  const suggestedUsers = users.filter(u => u.id !== currentUser?.id);

  return (
    <aside className="hidden xl:block w-80 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto p-4 space-y-6 text-xs text-slate-300">
      
      {/* Featured Anthology Issue Promo */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
          Curator's Spotlight
        </h4>
        <div 
          onClick={() => setCurrentTab('magazines')}
          className="p-3.5 rounded-2xl glass-panel bg-gradient-to-br from-emerald-950/40 to-black/40 border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition-all space-y-2"
        >
          <img
            src="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&auto=format&fit=crop&q=80"
            alt="Monsoon Review"
            className="w-full h-28 rounded-xl object-cover"
          />
          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">The Monsoon Review • Vol IV</span>
            <p className="font-display text-sm font-bold text-white mt-0.5">Monsoon Whispers & Rain Lore</p>
            <p className="text-[11px] text-slate-400 font-literary italic line-clamp-2">Featuring 13 selected voices from the Western Ghats.</p>
          </div>
        </div>
      </div>

      {/* Suggested Authors to Follow */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
          Authors You May Know
        </h4>
        <div className="space-y-2.5">
          {suggestedUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
              <div 
                onClick={() => onSelectUser(u)}
                className="flex items-center space-x-2.5 cursor-pointer min-w-0 flex-1"
              >
                <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" />
                <div className="truncate pr-1">
                  <p className="font-semibold text-white text-xs truncate">{u.name}</p>
                  <p className="text-[10px] text-emerald-400 truncate">@{u.pen_name || u.username}</p>
                </div>
              </div>

              <button
                onClick={() => onFollowAuthor(u.id)}
                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs flex items-center space-x-1"
                title="Follow Author"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Online Poets & Literary Contacts */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Online Bards & Readers
          </h4>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="space-y-2">
          {users.map(u => (
            <div 
              key={u.id}
              onClick={() => onSelectUser(u)}
              className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="relative">
                <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0c1015]" />
              </div>
              <span className="text-xs text-slate-200 truncate">{u.pen_name || u.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center space-x-1">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>Trending in South Asia</span>
        </h4>
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="cursor-pointer hover:text-emerald-400">#MonsoonLore2026</p>
          <p className="cursor-pointer hover:text-emerald-400">#MalayalamPoetry</p>
          <p className="cursor-pointer hover:text-emerald-400">#BeyporeStories</p>
          <p className="cursor-pointer hover:text-emerald-400">#EcologicalCriticism</p>
        </div>
      </div>

    </aside>
  );
}

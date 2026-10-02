import React, { useState } from 'react';
import { 
  BookOpen, 
  Feather, 
  BookMarked, 
  ShieldAlert, 
  Layers, 
  UserCheck, 
  Sparkles, 
  PlusCircle, 
  Compass, 
  ChevronDown,
  FileCheck2,
  Share2
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  users = [], 
  setCurrentUser, 
  openStudio, 
  openProfile,
  openOnboarding,
  openQuoteModal
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#0c1015]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('feed')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-900 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-500/30">
            <Feather className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-2xl font-bold tracking-tight text-white">Sahyaa</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">MVP Lit</span>
            </div>
            <p className="text-[11px] text-slate-400 font-literary italic hidden sm:block">Sanctuary of South Asian Literature & Anthologies</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setCurrentTab('feed')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'feed'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </button>

          <button
            onClick={() => setCurrentTab('magazines')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'magazines'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Magazines</span>
          </button>

          <button
            onClick={() => setCurrentTab('editorial')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'editorial'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>Editorial Desk</span>
          </button>

          <button
            onClick={() => setCurrentTab('moderation')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'moderation'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Guardian</span>
          </button>

          <button
            onClick={() => setCurrentTab('architecture')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              currentTab === 'architecture'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-indigo-400/90 hover:text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>MVP Flowchart</span>
          </button>
        </nav>

        {/* Right Actions: Write Button & Persona Switcher */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Quote Generator Button */}
          <button
            onClick={() => openQuoteModal(null)}
            title="Create Visual Quote Card"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Quote Card</span>
          </button>

          {/* Write New Piece Button */}
          <button
            onClick={openStudio}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write Piece</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl glass-panel hover:bg-white/10 transition-all border border-white/10"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/40"
              />
              <div className="hidden lg:block text-left text-xs pr-1">
                <p className="font-semibold text-white leading-tight truncate max-w-[120px]">{currentUser?.pen_name || currentUser?.name}</p>
                <p className="text-[10px] text-emerald-400 capitalize">{currentUser?.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona Switcher Menu */}
            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel-elevated bg-[#141c26] border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-white/10 mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Switch Demo Persona</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Dual-Role</span>
                </div>

                <div className="space-y-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => setCurrentUser(u)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-xl text-left transition-all ${
                        currentUser?.id === u.id
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                          {u.badge && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">{u.badge}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          <span className="capitalize text-emerald-400/90 font-medium">{u.role}</span> • {u.pen_name || u.username}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                  <button
                    onClick={openProfile}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>View Full Profile & Archive</span>
                  </button>
                  <button
                    onClick={openOnboarding}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Re-run Onboarding Calibration</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-4 border-t border-white/5 bg-[#0c1015]/95 text-xs">
        <button onClick={() => setCurrentTab('feed')} className={`py-1 px-2 rounded ${currentTab === 'feed' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>Discover</button>
        <button onClick={() => setCurrentTab('magazines')} className={`py-1 px-2 rounded ${currentTab === 'magazines' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>Magazines</button>
        <button onClick={() => setCurrentTab('editorial')} className={`py-1 px-2 rounded ${currentTab === 'editorial' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>Editorial</button>
        <button onClick={() => setCurrentTab('moderation')} className={`py-1 px-2 rounded ${currentTab === 'moderation' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>Guardian</button>
        <button onClick={() => setCurrentTab('architecture')} className={`py-1 px-2 rounded ${currentTab === 'architecture' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>MVP Map</button>
      </div>
    </header>
  );
}

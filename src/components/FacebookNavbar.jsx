import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  BookMarked, 
  ShieldAlert, 
  Layers, 
  Search, 
  Plus, 
  MessageCircle, 
  Bell, 
  ChevronDown, 
  LogOut, 
  LogIn, 
  User, 
  Edit3, 
  Sparkles, 
  Feather, 
  Share2, 
  Check, 
  Users,
  Compass
} from 'lucide-react';

export default function FacebookNavbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  users = [], 
  setCurrentUser, 
  openStudio, 
  openProfile,
  openEditProfile,
  openAuthModal,
  openQuoteModal,
  openOnboarding,
  onLogout,
  searchQuery,
  setSearchQuery
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(3);

  const notifications = [
    { id: 1, text: 'Vaikom Basheer applauded your piece "The Scent of Wet Red Mud"', time: '10m ago', unread: true },
    { id: 2, text: 'Dr. Ananya Roy accepted your submission for Monsoon Review Vol. IV', time: '1h ago', unread: true },
    { id: 3, text: 'Rohan Verma started following your literary archive', time: '3h ago', unread: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111722]/95 backdrop-blur-md border-b border-[#232f3e] shadow-md">
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* LEFT SECTION: Brand Logo & Search */}
        <div className="flex items-center space-x-2.5 min-w-[280px]">
          <div 
            onClick={() => setCurrentTab('feed')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-950/40 text-white font-bold text-lg">
              S
            </div>
          </div>

          {/* Facebook-style Search Bar */}
          <div className="relative flex-1 max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Sahyaa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full bg-[#1e293b]/70 hover:bg-[#1e293b] border border-transparent focus:border-emerald-500/40 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* CENTER SECTION: Facebook Navigation Tabs */}
        <nav className="hidden md:flex items-center justify-center space-x-2 h-full flex-1 max-w-2xl">
          {[
            { id: 'feed', label: 'Home Feed', icon: Home },
            { id: 'magazines', label: 'Magazines & Pages', icon: BookMarked },
            { id: 'editorial', label: 'Editorial Desk', icon: BookOpen },
            { id: 'moderation', label: 'Guardian Safety', icon: ShieldAlert },
            { id: 'architecture', label: 'MVP Architecture Map', icon: Layers },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                title={tab.label}
                className={`relative flex items-center justify-center px-6 h-full transition-colors group ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl my-1.5'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 rounded-t-full shadow-sm shadow-emerald-400/50" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT SECTION: Create, Messenger, Notifications & Profile Menu */}
        <div className="flex items-center space-x-2.5 min-w-[280px] justify-end">
          
          {/* Quick Create Menu */}
          <div className="relative">
            <button
              onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
              title="Create"
              className="w-10 h-10 rounded-full bg-[#1e293b] hover:bg-[#2d3a4f] text-slate-200 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>

            {createDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel-elevated bg-[#141c26] border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in"
                onClick={() => setCreateDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-mono uppercase text-slate-400 border-b border-white/5 mb-1">
                  Create Content
                </div>
                <button
                  onClick={openStudio}
                  className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left text-xs text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                >
                  <Feather className="w-4 h-4 text-emerald-400" />
                  <span>Write Poem or Story</span>
                </button>
                <button
                  onClick={() => openQuoteModal(null)}
                  className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left text-xs text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Create Quote Card</span>
                </button>
                <button
                  onClick={() => setCurrentTab('magazines')}
                  className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left text-xs text-slate-200 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                >
                  <BookMarked className="w-4 h-4 text-purple-400" />
                  <span>Submit to Magazine</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => { setNotificationsOpen(!notificationsOpen); setUnreadNotifs(0); }}
              title="Notifications"
              className="relative w-10 h-10 rounded-full bg-[#1e293b] hover:bg-[#2d3a4f] text-slate-200 flex items-center justify-center transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel-elevated bg-[#141c26] border border-white/10 p-3 shadow-2xl z-50 animate-in fade-in space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h4 className="font-semibold text-xs text-white">Notifications</h4>
                  <span className="text-[10px] text-emerald-400 cursor-pointer">Mark all as read</span>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-black/20 hover:bg-white/5 text-xs text-slate-200 space-y-1 transition-colors cursor-pointer">
                      <p className="leading-snug">{n.text}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full bg-[#1e293b] hover:ring-2 hover:ring-emerald-500/40 transition-all"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel-elevated bg-[#141c26] border border-white/15 p-3 shadow-2xl z-50 animate-in fade-in"
                onClick={() => setProfileDropdownOpen(false)}
              >
                {/* User Header */}
                <div 
                  onClick={openProfile}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors flex items-center space-x-3 mb-2"
                >
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                    alt={currentUser?.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{currentUser?.name}</p>
                    <p className="text-xs text-emerald-400 truncate">@{currentUser?.pen_name || currentUser?.username}</p>
                    <p className="text-[10px] text-slate-400">See your profile</p>
                  </div>
                </div>

                <div className="space-y-1 border-t border-white/10 pt-2">
                  <button
                    onClick={openEditProfile}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>Edit Profile & Bio</span>
                  </button>

                  <button
                    onClick={openOnboarding}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Onboarding & Taxonomy</span>
                  </button>

                  {/* Switch Demo Persona */}
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 px-3 block mb-1">
                      Switch Active Account:
                    </span>
                    <div className="space-y-0.5">
                      {users.map(u => (
                        <button
                          key={u.id}
                          onClick={() => setCurrentUser(u)}
                          className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-left text-xs ${
                            currentUser?.id === u.id
                              ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                          <span className="truncate flex-1">{u.pen_name || u.name}</span>
                          {currentUser?.id === u.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={openAuthModal}
                      className="flex items-center space-x-2 px-3 py-2 text-xs text-emerald-400 hover:underline"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Login / Register</span>
                    </button>

                    <button
                      onClick={onLogout}
                      className="flex items-center space-x-1.5 px-3 py-2 text-xs text-rose-400 hover:underline"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}

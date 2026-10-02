import React from 'react';
import { 
  Home, 
  BookMarked, 
  Plus, 
  BookOpen, 
  User, 
  Smartphone,
  Layers,
  ShieldAlert
} from 'lucide-react';

export default function MobileBottomNav({ 
  currentTab, 
  setCurrentTab, 
  openStudio, 
  openProfile,
  currentUser,
  openInstallApp
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f151e]/95 backdrop-blur-xl border-t border-[#232f3e] px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
      {/* 1. Feed / Home */}
      <button
        onClick={() => setCurrentTab('feed')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'feed' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'feed' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-0.5">Feed</span>
      </button>

      {/* 2. Magazines */}
      <button
        onClick={() => setCurrentTab('magazines')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'magazines' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookMarked className={`w-5 h-5 ${currentTab === 'magazines' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-0.5">Journals</span>
      </button>

      {/* 3. Center Elevated Write Button */}
      <button
        onClick={openStudio}
        className="flex flex-col items-center justify-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-emerald-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform border-4 border-[#0c1015]">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <span className="text-[10px] mt-0.5 font-bold text-emerald-300">Write</span>
      </button>

      {/* 4. Editorial / Architecture */}
      <button
        onClick={() => setCurrentTab(currentUser?.role === 'editor' ? 'editorial' : 'editorial')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'editorial' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookOpen className={`w-5 h-5 ${currentTab === 'editorial' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] mt-0.5">Editorial</span>
      </button>

      {/* 5. Profile */}
      <button
        onClick={openProfile}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {currentUser?.avatar ? (
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className={`w-5 h-5 rounded-full object-cover border ${currentTab === 'profile' ? 'border-emerald-400 ring-1 ring-emerald-400' : 'border-slate-500'}`} 
          />
        ) : (
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        )}
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </nav>
  );
}

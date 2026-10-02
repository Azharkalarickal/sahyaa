import React from 'react';
import { Feather, Image as ImageIcon, Quote, BookMarked, Sparkles } from 'lucide-react';

export default function FacebookComposer({ currentUser, openStudio, openQuoteModal, setCurrentTab }) {
  return (
    <div className="rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] p-4 space-y-3 shadow-md">
      
      {/* Top Input Trigger */}
      <div className="flex items-center space-x-3">
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
          alt={currentUser?.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
        />
        <button
          onClick={openStudio}
          className="flex-1 text-left px-4 py-2.5 rounded-full bg-[#1e293b]/80 hover:bg-[#28364d] text-slate-400 hover:text-slate-200 text-xs sm:text-sm font-literary italic transition-colors border border-white/5"
        >
          What verses or stories are whispering in your mind, {currentUser?.pen_name || currentUser?.name}?
        </button>
      </div>

      <div className="border-t border-white/5 pt-2.5 flex items-center justify-between text-xs text-slate-300">
        
        {/* Write Poem / Story */}
        <button
          onClick={openStudio}
          className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-emerald-400 font-medium"
        >
          <Feather className="w-4 h-4" />
          <span>Write Piece</span>
        </button>

        {/* Photo / Artwork */}
        <button
          onClick={openStudio}
          className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-teal-400 font-medium"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Cover Artwork</span>
        </button>

        {/* Visual Quote Card */}
        <button
          onClick={() => openQuoteModal(null)}
          className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-amber-400 font-medium"
        >
          <Quote className="w-4 h-4" />
          <span>Quote Card</span>
        </button>

        {/* Magazine Submission */}
        <button
          onClick={() => setCurrentTab('magazines')}
          className="hidden sm:flex flex-1 items-center justify-center space-x-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-purple-400 font-medium"
        >
          <BookMarked className="w-4 h-4" />
          <span>Magazine Pitch</span>
        </button>

      </div>

    </div>
  );
}

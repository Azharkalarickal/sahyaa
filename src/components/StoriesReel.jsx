import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Feather, X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function StoriesReel({ currentUser, openStudio }) {
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [themeColor, setThemeColor] = useState('emerald');

  const fetchStories = () => {
    fetch('/api/user-stories')
      .then(r => r.json())
      .then(data => setStories(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!storyText.trim()) return;
    try {
      await fetch('/api/user-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser?.id || 1,
          text_content: storyText,
          theme_color: themeColor,
          media_url: currentUser?.cover_photo || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600'
        })
      });
      setStoryText('');
      setAddStoryModalOpen(false);
      fetchStories();
    } catch {}
  };

  return (
    <div className="w-full relative">
      {/* Stories Reel Carousel */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
        
        {/* Create Story Card */}
        <div 
          onClick={() => setAddStoryModalOpen(true)}
          className="relative flex-shrink-0 w-28 sm:w-32 h-44 sm:h-48 rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all group flex flex-col justify-between bg-[#141d27]"
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
            alt="My Avatar"
            className="w-full h-3/4 object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
          />
          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center border-2 border-[#141d27] shadow-lg">
            <Plus className="w-5 h-5 font-bold" />
          </div>
          <div className="p-2 pt-3 text-center bg-[#141d27]">
            <span className="text-[11px] font-semibold text-white">Create Story</span>
          </div>
        </div>

        {/* User Stories Cards */}
        {stories.map(story => (
          <div
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="relative flex-shrink-0 w-28 sm:w-32 h-44 sm:h-48 rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-all group p-3 flex flex-col justify-between"
          >
            <img
              src={story.media_url || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600'}
              alt={story.user_name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

            {/* Top Author Avatar Ring */}
            <div className="relative z-10">
              <img
                src={story.user_avatar}
                alt={story.user_name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400 p-0.5 shadow-md"
              />
            </div>

            {/* Bottom Story Text & Author Name */}
            <div className="relative z-10 space-y-0.5">
              <p className="font-literary text-[11px] text-white italic line-clamp-2 leading-snug">
                "{story.text_content}"
              </p>
              <p className="text-[10px] font-semibold text-emerald-300 truncate">
                {story.pen_name || story.user_name}
              </p>
            </div>
          </div>
        ))}

      </div>

      {/* Story View Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative w-full max-w-sm h-[580px] rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl flex flex-col justify-between p-6">
            <img
              src={activeStory.media_url || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800'}
              alt="Story"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img src={activeStory.user_avatar} alt={activeStory.user_name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400" />
                <div>
                  <p className="text-sm font-bold text-white">{activeStory.pen_name || activeStory.user_name}</p>
                  <p className="text-[10px] text-slate-300 font-mono">{new Date(activeStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <button onClick={() => setActiveStory(null)} className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center Text */}
            <div className="relative z-10 text-center px-4 space-y-3">
              <p className="font-literary text-2xl font-bold text-white italic leading-relaxed drop-shadow-md">
                "{activeStory.text_content}"
              </p>
            </div>

            {/* Bottom Footer */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono text-[10px]">Sahyaa 24h Fleet</span>
              <button 
                onClick={() => setActiveStory(null)}
                className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium backdrop-blur-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Story Modal */}
      {addStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl glass-panel-elevated bg-[#141c26] border border-emerald-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-lg font-bold text-white">Create Literary Story / Fleet</h3>
              <button onClick={() => setAddStoryModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateStory} className="space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Share a momentary verse, thought, or observation along the rain..."
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none font-literary italic"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddStoryModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300"
                >
                  Share Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

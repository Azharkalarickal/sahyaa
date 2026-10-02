import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Feather, 
  BookOpen, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  ThumbsUp, 
  Clock, 
  Search, 
  Filter, 
  Award, 
  Flag,
  Quote,
  Eye,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Feed({ 
  posts = [], 
  currentUser, 
  onSelectPost, 
  onApplaud, 
  onBookmark, 
  onOpenQuoteModal, 
  onOpenReportModal,
  fetchPosts,
  currentFilter,
  setCurrentFilter
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [clapAnimPostId, setClapAnimPostId] = useState(null);

  const genres = ['All', 'Poetry', 'Short Stories', 'Essays & Criticism', 'Poetry & Musings', 'Monsoon Lore', 'Western Ghats'];

  // Handle applause with confetti & animation
  const handleClap = (e, post) => {
    e.stopPropagation();
    onApplaud(post.id, 1);
    setClapAnimPostId(post.id);
    setTimeout(() => setClapAnimPostId(null), 800);

    // Trigger subtle celebratory confetti from click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { x, y },
      colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b'],
      disableForReducedMotion: true
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre === 'All' || post.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const spotlightPost = posts.find(p => p.is_editor_pick) || posts[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Editorial Spotlight Banner */}
      {spotlightPost && currentFilter === 'all' && (
        <div 
          onClick={() => onSelectPost(spotlightPost)}
          className="relative rounded-3xl overflow-hidden cursor-pointer group glass-panel-elevated border border-emerald-500/30 transition-all duration-300 hover:border-emerald-500/60 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1015] via-[#0c1015]/80 to-transparent z-10" />
          <img 
            src={spotlightPost.cover_image || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200'} 
            alt={spotlightPost.title}
            className="w-full h-72 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
          />
          <div className="absolute inset-0 z-20 p-6 sm:p-10 flex flex-col justify-end space-y-3">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Editor's Featured Work</span>
              </span>
              <span className="text-xs text-slate-300 font-mono capitalize">{spotlightPost.type} • {spotlightPost.read_time_mins} min read</span>
            </div>
            
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight group-hover:text-emerald-200 transition-colors">
              {spotlightPost.title}
            </h1>
            
            <p className="font-literary text-slate-300 text-sm sm:text-lg italic line-clamp-2 max-w-3xl">
              "{spotlightPost.excerpt || spotlightPost.featured_quote}"
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <img src={spotlightPost.author_avatar} alt={spotlightPost.author_name} className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40" />
                <div>
                  <p className="text-sm font-semibold text-white">{spotlightPost.author_name}</p>
                  <p className="text-xs text-emerald-400/90">{spotlightPost.author_badge || 'Author'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-300 font-mono">
                <span className="flex items-center space-x-1"><Flame className="w-4 h-4 text-amber-400" /> {spotlightPost.applauds_count} applauds</span>
                <span className="flex items-center space-x-1"><Eye className="w-4 h-4 text-teal-400" /> {spotlightPost.views_count} reads</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discovery Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Feed Tab Selectors */}
          <div className="flex items-center space-x-1 p-1 rounded-2xl glass-panel border border-white/10 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Pieces', icon: BookOpen },
              { id: 'trending', label: 'Trending', icon: Flame },
              { id: 'picks', label: "Editor's Picks", icon: Award },
              { id: 'poetry', label: 'Poetry Lounge', icon: Feather },
              { id: 'stories', label: 'Short Stories', icon: BookOpen },
              { id: 'essays', label: 'Essays', icon: Sparkles },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentFilter(tab.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    currentFilter === tab.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search literature, bards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-panel bg-[#141c26] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>

        {/* Genre Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 flex items-center space-x-1 pl-1 pr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Genre:</span>
          </span>
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedGenre === genre
                  ? 'bg-emerald-500 text-emerald-950 font-semibold'
                  : 'glass-panel text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Literary Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group relative rounded-3xl glass-panel border border-white/10 overflow-hidden card-hover-effect cursor-pointer flex flex-col justify-between"
          >
            {/* Top Cover Image if present */}
            {post.cover_image && (
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141b24] via-transparent to-black/30" />
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                    {post.type}
                  </span>
                  {post.is_editor_pick ? (
                    <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-500/80 text-amber-950 flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>Curated</span>
                    </span>
                  ) : null}
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              
              <div className="space-y-2">
                {/* Author Info & Read Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={post.author_avatar}
                      alt={post.author_name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30"
                    />
                    <div className="text-xs">
                      <span className="font-medium text-slate-200">{post.pen_name || post.author_name}</span>
                      {post.author_badge && (
                        <span className="ml-1.5 text-[10px] text-amber-400 font-mono">✦ {post.author_badge}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{post.read_time_mins} min</span>
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="font-literary text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 italic">
                  "{post.excerpt || post.content.slice(0, 140) + '...'}"
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400" onClick={(e) => e.stopPropagation()}>
                
                {/* Multi-Applaud Clapper */}
                <button
                  onClick={(e) => handleClap(e, post)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    post.is_applauded 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'hover:bg-white/5 hover:text-emerald-300'
                  }`}
                  title="Applaud piece"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-mono font-medium">{post.applauds_count}</span>
                  {clapAnimPostId === post.id && (
                    <span className="absolute -top-6 left-2 font-mono text-xs font-bold text-emerald-300 animate-float-clap">
                      +1 👏
                    </span>
                  )}
                </button>

                {/* Comments Trigger */}
                <button
                  onClick={() => onSelectPost(post)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-white/5 hover:text-slate-200 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-mono">{post.comments_count || 0}</span>
                </button>

                {/* Quote Card Creator Trigger */}
                <button
                  onClick={() => onOpenQuoteModal(post)}
                  title="Create Visual Quote Card"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                >
                  <Quote className="w-4 h-4" />
                  <span>Card</span>
                </button>

                {/* Bookmark Trigger */}
                <button
                  onClick={() => onBookmark(post.id)}
                  title={post.is_bookmarked ? 'Remove Bookmark' : 'Save to Reading List'}
                  className={`p-2 rounded-xl transition-colors ${
                    post.is_bookmarked ? 'text-amber-400 bg-amber-500/10' : 'hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
                </button>

                {/* Flag / Moderation Report Trigger */}
                <button
                  onClick={() => onOpenReportModal(post)}
                  title="Report Content"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 space-y-3 glass-panel rounded-3xl p-8 border border-white/10">
          <Feather className="w-10 h-10 text-emerald-400/60 mx-auto" />
          <h3 className="font-display text-xl font-bold text-white">No literary pieces found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Try clearing your search query or selecting a different literary genre filter.</p>
        </div>
      )}
    </div>
  );
}

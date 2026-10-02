import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bookmark, 
  ThumbsUp, 
  Share2, 
  Volume2, 
  VolumeX, 
  Type, 
  Sun, 
  Moon, 
  Coffee, 
  Quote, 
  Send, 
  MessageSquare, 
  Check, 
  UserPlus, 
  Clock, 
  Feather,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReaderModal({ 
  post, 
  onClose, 
  currentUser, 
  onApplaud, 
  onBookmark, 
  onFollowAuthor, 
  onOpenQuoteModal,
  onAddComment
}) {
  const [theme, setTheme] = useState('obsidian'); // obsidian, emerald, sepia, parchment
  const [fontSize, setFontSize] = useState('text-lg'); // text-base, text-lg, text-xl, text-2xl
  const [fontFamily, setFontFamily] = useState('font-literary'); // font-literary, font-display, font-ui
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch full details of post including comments & related
  useEffect(() => {
    if (!post?.id) return;
    setLoading(true);
    fetch(`/api/posts/${post.id}?current_user_id=${currentUser?.id || 1}`)
      .then(r => r.json())
      .then(data => {
        setPostData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [post?.id, currentUser?.id]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Audio Speech Synthesis
  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${postData?.title || post.title}. Written by ${postData?.author_name || post.author_name}. ${postData?.content || post.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleClap = (e) => {
    onApplaud(post.id, 1);
    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#10b981', '#fbbf24', '#f59e0b']
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText);
    setCommentText('');
    // refresh post data
    setTimeout(() => {
      fetch(`/api/posts/${post.id}?current_user_id=${currentUser?.id || 1}`)
        .then(r => r.json())
        .then(data => setPostData(data));
    }, 200);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentPost = postData || post;
  const isPoem = currentPost.type === 'poem' || currentPost.type === 'musing';

  const getThemeClass = () => {
    switch (theme) {
      case 'emerald': return 'theme-emerald';
      case 'sepia': return 'theme-sepia';
      case 'parchment': return 'theme-parchment';
      default: return 'theme-obsidian';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      
      {/* Main Modal Container */}
      <div 
        className={`w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 border border-white/10 ${getThemeClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Floating Top Reader Controls Bar */}
        <div className="sticky top-0 z-30 px-6 py-3.5 glass-panel border-b border-white/10 flex items-center justify-between backdrop-blur-md">
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {currentPost.type}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              {currentPost.read_time_mins} min read
            </span>
          </div>

          {/* Reading Customization Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Theme Picker */}
            <div className="flex items-center p-1 rounded-xl bg-black/20 border border-white/10 text-xs">
              <button 
                onClick={() => setTheme('obsidian')} 
                title="Obsidian Dark"
                className={`p-1.5 rounded-lg ${theme === 'obsidian' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setTheme('emerald')} 
                title="Emerald Night"
                className={`p-1.5 rounded-lg ${theme === 'emerald' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-emerald-300'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setTheme('sepia')} 
                title="Warm Sepia"
                className={`p-1.5 rounded-lg ${theme === 'sepia' ? 'bg-amber-800/30 text-amber-900' : 'text-slate-400 hover:text-amber-800'}`}
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setTheme('parchment')} 
                title="Parchment Light"
                className={`p-1.5 rounded-lg ${theme === 'parchment' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center p-1 rounded-xl bg-black/20 border border-white/10 text-xs">
              <button 
                onClick={() => setFontSize('text-base')} 
                className={`px-2 py-0.5 rounded text-xs ${fontSize === 'text-base' ? 'bg-white/20 font-bold' : 'text-slate-400'}`}
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('text-xl')} 
                className={`px-2 py-0.5 rounded text-sm ${fontSize === 'text-xl' ? 'bg-white/20 font-bold' : 'text-slate-400'}`}
              >
                A+
              </button>
            </div>

            {/* Font Family Switcher */}
            <button
              onClick={() => setFontFamily(f => f === 'font-literary' ? 'font-display' : f === 'font-display' ? 'font-ui' : 'font-literary')}
              title="Switch Typography"
              className="p-1.5 rounded-xl bg-black/20 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center space-x-1"
            >
              <Type className="w-3.5 h-3.5" />
            </button>

            {/* Text to Speech Voice Synth */}
            <button
              onClick={toggleSpeech}
              title={isPlayingAudio ? "Stop Audio Reader" : "Listen to Audio Reader"}
              className={`p-1.5 rounded-xl border transition-colors ${
                isPlayingAudio 
                  ? 'bg-emerald-500 text-emerald-950 border-emerald-400 animate-pulse' 
                  : 'bg-black/20 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-black/20 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reading Article Body */}
        <div className="p-6 sm:p-12 space-y-8 flex-1">
          
          {/* Header Section */}
          <header className="space-y-4 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-500">
              <span>✦</span>
              <span>{currentPost.genre}</span>
              <span>✦</span>
              <span>{currentPost.language || 'English'}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-current leading-tight">
              {currentPost.title}
            </h1>

            {/* Author Attribution */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              <img
                src={currentPost.author_avatar}
                alt={currentPost.author_name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div className="text-left text-xs">
                <p className="font-semibold text-current">{currentPost.pen_name || currentPost.author_name}</p>
                <p className="opacity-70">{currentPost.author_badge || 'Author'} • {currentPost.author_location || 'Kerala'}</p>
              </div>
              <button
                onClick={() => onFollowAuthor(currentPost.author_id)}
                className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>Follow</span>
              </button>
            </div>
          </header>

          {/* Cover Art if Present */}
          {currentPost.cover_image && (
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <img
                src={currentPost.cover_image}
                alt={currentPost.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Featured Quote Banner */}
          {currentPost.featured_quote && (
            <div className="max-w-2xl mx-auto my-6 p-6 rounded-2xl bg-emerald-950/20 border-l-4 border-emerald-500 italic font-literary text-lg sm:text-xl text-emerald-300/90 shadow-sm flex items-start space-x-3">
              <Quote className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1 opacity-70" />
              <div className="flex-1">
                <p>"{currentPost.featured_quote}"</p>
                <button
                  onClick={() => onOpenQuoteModal(currentPost)}
                  className="mt-2 text-xs font-sans not-italic text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Generate Quote Card</span>
                </button>
              </div>
            </div>
          )}

          {/* Actual Literary Content */}
          <div className={`max-w-2xl mx-auto reader-text ${fontSize} ${fontFamily} ${isPoem ? 'poetry-content text-center sm:text-left' : 'leading-relaxed space-y-4'}`}>
            {currentPost.content}
          </div>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="max-w-2xl mx-auto pt-6 flex flex-wrap gap-2 border-t border-white/10">
              {currentPost.tags.map((tag, idx) => (
                <span key={idx} className="text-xs font-mono px-3 py-1 rounded-lg bg-black/20 text-slate-400 border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Sticky Reader Appreciation Bar */}
          <div className="max-w-2xl mx-auto p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClap}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-sm transition-all active:scale-95"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Applaud ({currentPost.applauds_count || 0})</span>
              </button>

              <button
                onClick={() => onBookmark(currentPost.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  currentPost.is_bookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'glass-panel text-slate-300 hover:text-white border-white/10'
                }`}
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${currentPost.is_bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenQuoteModal(currentPost)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
              >
                <Quote className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Make Quote Card</span>
              </button>

              <button
                onClick={handleShareLink}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium glass-panel text-slate-300 hover:text-white border border-white/10 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Author Biography Card */}
          <div className="max-w-2xl mx-auto p-6 rounded-2xl glass-panel border border-white/10 flex items-start space-x-4">
            <img
              src={currentPost.author_avatar}
              alt={currentPost.author_name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40"
            />
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-base text-current">{currentPost.author_name} ({currentPost.pen_name})</h3>
              <p className="text-xs text-slate-400 font-literary leading-relaxed italic">{currentPost.author_bio || 'Chronicler of thoughts and literary works on Sahyaa.'}</p>
              <div className="pt-2 flex items-center space-x-4 text-xs text-emerald-400 font-mono">
                <span>✦ {currentPost.author_badge || 'Verified Bard'}</span>
                <span>✦ {currentPost.author_location || 'South Asia'}</span>
              </div>
            </div>
          </div>

          {/* Literary Comments & Discussions Section */}
          <div className="max-w-2xl mx-auto space-y-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-current flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Literary Discourse ({postData?.comments?.length || currentPost.comments_count || 0})</span>
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <div className="flex items-start space-x-3">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/40"
                />
                <div className="flex-1 relative">
                  <textarea
                    rows={2}
                    placeholder={`Share your thoughts on "${currentPost.title}"...`}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-3 rounded-xl glass-panel bg-black/20 border border-white/10 text-sm text-current placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all font-literary"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="absolute right-2.5 bottom-2.5 p-1.5 rounded-lg bg-emerald-500 text-emerald-950 font-medium hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {postData?.comments && postData.comments.length > 0 ? (
                postData.comments.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl glass-panel border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={c.user_avatar} alt={c.user_name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-semibold text-current">{c.user_name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm font-literary text-current opacity-90 pl-8">{c.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 font-literary italic">Be the first to share an impression on this piece.</p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  ThumbsUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Globe, 
  Quote, 
  Send, 
  Sparkles, 
  Flag, 
  Clock, 
  Feather,
  Check,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

const REACTIONS = [
  { id: 'like', label: 'Like', emoji: '👍', color: 'text-blue-400' },
  { id: 'love', label: 'Love', emoji: '❤️', color: 'text-rose-400' },
  { id: 'care', label: 'Care', emoji: '🌿', color: 'text-emerald-400' },
  { id: 'insight', label: 'Insight', emoji: '💡', color: 'text-amber-400' },
];

export default function FacebookPostCard({ 
  post, 
  currentUser, 
  onSelectPost, 
  onApplaud, 
  onBookmark, 
  onOpenQuoteModal, 
  onOpenReportModal, 
  onAddComment,
  onSelectAuthor 
}) {
  const [showFullText, setShowFullText] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [postComments, setPostComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(post.user_reaction || (post.is_applauded ? 'like' : null));
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleReact = (e, reactionId = 'like') => {
    e.stopPropagation();
    setSelectedReaction(reactionId);
    setShowReactionPicker(false);
    onApplaud(post.id, 1);

    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#10b981', '#fbbf24', '#f59e0b', '#3b82f6']
    });
  };

  const toggleComments = (e) => {
    e.stopPropagation();
    if (!commentsOpen && postComments.length === 0) {
      setLoadingComments(true);
      fetch(`/api/posts/${post.id}?current_user_id=${currentUser?.id || 1}`)
        .then(r => r.json())
        .then(data => {
          setPostComments(data.comments || []);
          setLoadingComments(false);
        })
        .catch(() => setLoadingComments(false));
    }
    setCommentsOpen(!commentsOpen);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput);
    
    // Optimistic comment insert
    const temp = {
      id: Date.now(),
      user_name: currentUser?.name || 'You',
      user_avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      content: commentInput,
      created_at: new Date().toISOString()
    };
    setPostComments(prev => [...prev, temp]);
    setCommentInput('');
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isPoem = post.type === 'poem' || post.type === 'musing';
  const textContent = post.content || '';
  const shouldTruncate = textContent.length > 280 && !showFullText;

  return (
    <article className="rounded-3xl glass-panel bg-[#141b24] border border-[#232f3e] shadow-md overflow-hidden text-slate-200">
      
      {/* 1. POST HEADER */}
      <div className="p-4 sm:p-5 flex items-start justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectAuthor && onSelectAuthor(post.author_id)}>
          <img
            src={post.author_avatar}
            alt={post.author_name}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
          />
          <div>
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="font-semibold text-white text-sm hover:underline">{post.author_name}</span>
              {post.author_badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 font-mono">
                  ✦ {post.author_badge}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono pt-0.5">
              <span>@{post.pen_name || post.author_username}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Public</span>
              </span>
              <span>•</span>
              <span className="capitalize text-emerald-400 font-medium">{post.type}</span>
            </div>
          </div>
        </div>

        {/* 3-Dot Options Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div 
              className="absolute right-0 mt-1 w-48 rounded-2xl glass-panel-elevated bg-[#141c26] border border-white/10 p-1.5 shadow-2xl z-40 text-xs animate-in fade-in"
              onClick={() => setMenuOpen(false)}
            >
              <button
                onClick={() => onBookmark(post.id)}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-left hover:bg-white/5"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>{post.is_bookmarked ? 'Remove Bookmark' : 'Save Piece'}</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-left hover:bg-white/5"
              >
                <Share2 className="w-4 h-4 text-teal-400" />
                <span>Copy Post Link</span>
              </button>
              <button
                onClick={() => onOpenReportModal(post)}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/10"
              >
                <Flag className="w-4 h-4" />
                <span>Report to Guardian</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. POST BODY TEXT & TITLE */}
      <div className="px-4 sm:px-6 pb-4 space-y-3">
        {/* Title */}
        <h2 
          onClick={() => onSelectPost(post)}
          className="font-display text-xl sm:text-2xl font-bold text-white hover:text-emerald-300 transition-colors cursor-pointer leading-snug"
        >
          {post.title}
        </h2>

        {/* Featured Quote Extract */}
        {post.featured_quote && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/25 border-l-4 border-emerald-500 font-literary italic text-emerald-300 text-sm sm:text-base flex items-start space-x-2">
            <Quote className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
            <p>"{post.featured_quote}"</p>
          </div>
        )}

        {/* Content */}
        <div 
          onClick={() => onSelectPost(post)}
          className={`font-literary text-sm sm:text-base text-slate-200 leading-relaxed cursor-pointer ${
            isPoem ? 'poetry-content' : ''
          }`}
        >
          {shouldTruncate ? `${textContent.slice(0, 280)}...` : textContent}
        </div>

        {textContent.length > 280 && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-xs font-semibold text-emerald-400 hover:underline block pt-1"
          >
            {showFullText ? 'See less' : 'See more...'}
          </button>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-[11px] font-mono text-emerald-400/90 hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. ATTACHED COVER PHOTO */}
      {post.cover_image && (
        <div 
          onClick={() => onSelectPost(post)}
          className="relative w-full max-h-[460px] overflow-hidden bg-black/40 cursor-pointer group"
        >
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          {post.is_editor_pick ? (
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-amber-950 flex items-center space-x-1 backdrop-blur-md shadow-md">
              <Award className="w-3.5 h-3.5" />
              <span>Curator's Pick</span>
            </span>
          ) : null}
        </div>
      )}

      {/* 4. ENGAGEMENT COUNTS ROW */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-slate-400 border-b border-white/5">
        <div className="flex items-center space-x-1.5">
          <div className="flex -space-x-1">
            <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">👍</span>
            <span className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white">❤️</span>
          </div>
          <span className="font-mono text-slate-300 font-medium">{post.applauds_count || 0} applauds</span>
        </div>

        <div className="flex items-center space-x-3 font-mono text-[11px]">
          <span onClick={toggleComments} className="hover:underline cursor-pointer">
            {post.comments_count || 0} comments
          </span>
          <span>•</span>
          <span onClick={() => onOpenQuoteModal(post)} className="hover:underline cursor-pointer text-amber-400">
            Quote Cards
          </span>
        </div>
      </div>

      {/* 5. FACEBOOK ACTION BUTTONS BAR */}
      <div className="px-2 py-1 flex items-center justify-between text-xs font-medium text-slate-300">
        
        {/* Like / Applaud Button with Reaction Picker */}
        <div className="relative flex-1">
          <button
            onClick={(e) => handleReact(e, 'like')}
            onMouseEnter={() => setShowReactionPicker(true)}
            className={`w-full flex items-center justify-center space-x-2 py-2 rounded-xl hover:bg-white/5 transition-all ${
              selectedReaction ? 'text-emerald-400 font-bold' : 'text-slate-300'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${selectedReaction ? 'fill-current' : ''}`} />
            <span>{selectedReaction ? 'Applauded' : 'Applaud'}</span>
          </button>

          {showReactionPicker && (
            <div 
              onMouseLeave={() => setShowReactionPicker(false)}
              className="absolute -top-12 left-2 flex items-center space-x-1.5 p-1.5 rounded-full glass-panel-elevated bg-[#141c26] border border-white/15 shadow-2xl z-40 animate-in zoom-in-75 duration-150"
            >
              {REACTIONS.map(r => (
                <button
                  key={r.id}
                  onClick={(e) => handleReact(e, r.id)}
                  className="w-8 h-8 rounded-full hover:scale-125 transition-transform flex items-center justify-center text-lg"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Trigger */}
        <button
          onClick={toggleComments}
          className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-slate-300"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Quote Card Creator */}
        <button
          onClick={() => onOpenQuoteModal(post)}
          className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-amber-300"
        >
          <Quote className="w-4 h-4" />
          <span>Quote Card</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => onBookmark(post.id)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl hover:bg-white/5 transition-colors ${
            post.is_bookmarked ? 'text-amber-400 font-bold' : 'text-slate-300'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">Save</span>
        </button>

      </div>

      {/* 6. FACEBOOK COMMENTS SECTION */}
      {commentsOpen && (
        <div className="p-4 sm:p-5 border-t border-white/5 bg-black/20 space-y-4 animate-in fade-in duration-200">
          
          {/* Write Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2.5">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Write a literary thought, ${currentUser?.pen_name || currentUser?.name}...`}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full bg-[#1e293b] border border-white/5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-emerald-400 hover:text-emerald-300 disabled:opacity-30 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 pt-1 max-h-60 overflow-y-auto">
            {loadingComments ? (
              <p className="text-xs text-slate-400 text-center py-2">Loading discussion...</p>
            ) : postComments.length > 0 ? (
              postComments.map(c => (
                <div key={c.id} className="flex items-start space-x-2.5 text-xs">
                  <img src={c.user_avatar} alt={c.user_name} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5" />
                  <div className="bg-[#1e293b] p-2.5 rounded-2xl rounded-tl-none border border-white/5 max-w-[85%] space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{c.user_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="font-literary text-slate-200 text-xs leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-400 text-center py-2 font-literary italic">
                Be the first to share an impression on this piece.
              </p>
            )}
          </div>

        </div>
      )}

    </article>
  );
}

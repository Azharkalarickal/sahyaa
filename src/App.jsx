import React, { useState, useEffect } from 'react';
import FacebookNavbar from './components/FacebookNavbar.jsx';
import FacebookSidebarLeft from './components/FacebookSidebarLeft.jsx';
import FacebookSidebarRight from './components/FacebookSidebarRight.jsx';
import StoriesReel from './components/StoriesReel.jsx';
import FacebookComposer from './components/FacebookComposer.jsx';
import FacebookPostCard from './components/FacebookPostCard.jsx';
import FacebookProfileView from './components/FacebookProfileView.jsx';
import EditProfileModal from './components/EditProfileModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import AuthPage from './components/AuthPage.jsx';
import ReaderModal from './components/ReaderModal.jsx';
import StudioEditor from './components/StudioEditor.jsx';
import MagazinesHub from './components/MagazinesHub.jsx';
import EditorialDashboard from './components/EditorialDashboard.jsx';
import QuoteCardModal from './components/QuoteCardModal.jsx';
import ModerationDashboard from './components/ModerationDashboard.jsx';
import ArchitectureViewer from './components/ArchitectureViewer.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import ReportModal from './components/ReportModal.jsx';
import { 
  CheckCircle2, 
  Flame, 
  Award, 
  Feather, 
  BookOpen, 
  Sparkles, 
  Filter 
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('feed'); // feed, profile, magazines, editorial, moderation, architecture
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileViewUser, setProfileViewUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [readerPost, setReaderPost] = useState(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [quoteModalPost, setQuoteModalPost] = useState(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [reportTargetPost, setReportTargetPost] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Users
  const fetchUsers = () => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        
        // Restore session only if user previously logged in
        const savedUserId = localStorage.getItem('sahyaa_active_user_id');
        if (savedUserId) {
          const found = data.find(u => u.id === Number(savedUserId));
          if (found) {
            setCurrentUser(found);
          }
        }
      })
      .catch(() => {});
  };

  // Fetch Posts
  const fetchPosts = (filter = currentFilter, genre = selectedGenre) => {
    const userId = currentUser?.id || 1;
    let url = `/api/posts?tab=${filter}&current_user_id=${userId}`;
    if (genre && genre !== 'All') url += `&genre=${encodeURIComponent(genre)}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    fetch(url)
      .then(r => r.json())
      .then(data => setPosts(data))
      .catch(() => {});
  };

  // Fetch Magazines
  const fetchMagazines = () => {
    fetch('/api/magazines')
      .then(r => r.json())
      .then(data => setMagazines(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
    fetchMagazines();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sahyaa_active_user_id', currentUser.id);
      fetchPosts(currentFilter, selectedGenre);
    }
  }, [currentUser?.id, currentFilter, selectedGenre, searchQuery]);

  // Auth Success Handler
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('sahyaa_active_user_id', user.id);
    fetchUsers();
    showToast(`Welcome back, ${user.pen_name || user.name}! 🌿`);
  };

  const handleLogout = () => {
    localStorage.removeItem('sahyaa_active_user_id');
    setCurrentUser(null);
    setProfileViewUser(null);
    showToast('Logged out of session');
  };

  // Profile Update Handler
  const handleUpdateProfileSuccess = (updatedUser) => {
    setCurrentUser(updatedUser);
    setProfileViewUser(updatedUser);
    fetchUsers();
    fetchPosts();
    showToast('Profile updated & saved in sahyaa.db ✨');
  };

  // Handle Applaud
  const handleApplaud = async (postId, count = 1) => {
    try {
      const res = await fetch(`/api/posts/${postId}/applaud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser?.id || 1, count })
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, applauds_count: data.applauds_count, is_applauded: true } : p));
        if (readerPost && readerPost.id === postId) {
          setReaderPost(prev => ({ ...prev, applauds_count: data.applauds_count, is_applauded: true }));
        }
        showToast('Applauded piece! 👍');
      }
    } catch {}
  };

  // Handle Bookmark
  const handleBookmark = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser?.id || 1 })
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? { 
          ...p, 
          is_bookmarked: data.is_bookmarked,
          bookmarks_count: data.is_bookmarked ? p.bookmarks_count + 1 : Math.max(0, p.bookmarks_count - 1)
        } : p));
        if (readerPost && readerPost.id === postId) {
          setReaderPost(prev => ({ ...prev, is_bookmarked: data.is_bookmarked }));
        }
        showToast(data.is_bookmarked ? 'Saved to reading list 🔖' : 'Removed from reading list');
      }
    } catch {}
  };

  // Handle Follow Author
  const handleFollowAuthor = async (authorId) => {
    try {
      const res = await fetch(`/api/users/${authorId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser?.id || 1 })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.is_following ? 'Following author! ✦' : 'Unfollowed author');
      }
    } catch {}
  };

  // Handle Add Comment
  const handleAddComment = async (postId, content) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser?.id || 1, content })
      });
      if (res.ok) {
        showToast('Comment shared in discourse 💬');
        fetchPosts();
      }
    } catch {}
  };

  const handlePublishSuccess = (newPost, submittedToMag) => {
    fetchPosts();
    showToast(submittedToMag ? 'Piece published & pitched to magazine! 🌿' : 'Piece published to timeline! ✨');
  };

  const handleCompleteOnboarding = (newUser) => {
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome to Sahyaa, ${newUser.pen_name || newUser.name}! 🌿`);
  };

  const openUserProfile = (userToView) => {
    setProfileViewUser(userToView || currentUser);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const genres = ['All', 'Poetry', 'Short Stories', 'Essays & Criticism', 'Monsoon Lore', 'Magic Realism'];

  // If user is not authenticated, show full Facebook / Sahyaa Auth Page
  if (!currentUser) {
    return (
      <>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl glass-panel-elevated bg-[#141d27] border border-emerald-500/40 text-emerald-200 shadow-2xl text-xs font-medium animate-in slide-in-from-bottom-5 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1015] text-[#e2e8f0] flex flex-col font-ui selection:bg-emerald-800/40 selection:text-emerald-200">
      
      {/* 1. TOP FACEBOOK-STYLE NAVIGATION */}
      <FacebookNavbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'profile') setProfileViewUser(currentUser);
          setCurrentTab(tab);
        }}
        currentUser={currentUser}
        users={users}
        setCurrentUser={(u) => {
          setCurrentUser(u);
          localStorage.setItem('sahyaa_active_user_id', u.id);
          showToast(`Switched active account to ${u.pen_name || u.name}`);
        }}
        openStudio={() => setStudioOpen(true)}
        openProfile={() => openUserProfile(currentUser)}
        openEditProfile={() => setEditProfileModalOpen(true)}
        openAuthModal={() => setAuthModalOpen(true)}
        openQuoteModal={(post) => setQuoteModalPost(post || posts[0])}
        openOnboarding={() => setOnboardingOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl glass-panel-elevated bg-[#141d27] border border-emerald-500/40 text-emerald-200 shadow-2xl text-xs font-medium animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* 2. FACEBOOK 3-COLUMN MAIN BODY LAYOUT */}
      <div className="flex-1 max-w-[1920px] mx-auto w-full flex justify-between">
        
        {/* LEFT COLUMN: Facebook Navigation & Shortcuts Sidebar */}
        <FacebookSidebarLeft
          currentUser={currentUser}
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (tab === 'profile') setProfileViewUser(currentUser);
            setCurrentTab(tab);
          }}
          openProfile={() => openUserProfile(currentUser)}
          openStudio={() => setStudioOpen(true)}
          openQuoteModal={() => setQuoteModalPost(posts[0])}
          openOnboarding={() => setOnboardingOpen(true)}
        />

        {/* CENTER COLUMN: Main Feed, Profile, or Module Viewports */}
        <main className="flex-1 max-w-3xl min-h-[calc(100vh-3.5rem)] px-2 sm:px-4 py-4 space-y-5">
          
          {/* VIEW A: HOME DISCOVERY FEED (Facebook Style) */}
          {currentTab === 'feed' && (
            <div className="space-y-4">
              
              {/* Top Stories / Fleets Reel */}
              <StoriesReel
                currentUser={currentUser}
                openStudio={() => setStudioOpen(true)}
              />

              {/* What's on your mind? Composer Box */}
              <FacebookComposer
                currentUser={currentUser}
                openStudio={() => setStudioOpen(true)}
                openQuoteModal={(post) => setQuoteModalPost(post || posts[0])}
                setCurrentTab={setCurrentTab}
              />

              {/* Feed Category Filter Pills */}
              <div className="flex items-center space-x-1 p-1 rounded-2xl glass-panel bg-[#141b24] border border-[#232f3e] overflow-x-auto text-xs">
                {[
                  { id: 'all', label: 'All Posts', icon: BookOpen },
                  { id: 'trending', label: 'Trending', icon: Flame },
                  { id: 'picks', label: "Editor's Picks", icon: Award },
                  { id: 'poetry', label: 'Poetry Lounge', icon: Feather },
                  { id: 'stories', label: 'Short Stories', icon: BookOpen },
                  { id: 'essays', label: 'Essays', icon: Sparkles },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = currentFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentFilter(tab.id)}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Genre Filter Sub-row */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-500 flex items-center space-x-1 pl-1 pr-1 font-mono text-[11px]">
                  <span>Filter:</span>
                </span>
                {genres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                      selectedGenre === genre
                        ? 'bg-emerald-500 text-emerald-950 font-semibold shadow-sm'
                        : 'glass-panel bg-[#141b24] text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Facebook Post Feed Stream */}
              <div className="space-y-4">
                {posts.map(post => (
                  <FacebookPostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onSelectPost={(p) => setReaderPost(p)}
                    onApplaud={handleApplaud}
                    onBookmark={handleBookmark}
                    onOpenQuoteModal={(p) => setQuoteModalPost(p)}
                    onOpenReportModal={(p) => setReportTargetPost(p)}
                    onAddComment={handleAddComment}
                    onSelectAuthor={(authorId) => {
                      const author = users.find(u => u.id === authorId);
                      openUserProfile(author);
                    }}
                  />
                ))}

                {posts.length === 0 && (
                  <div className="text-center py-16 space-y-3 glass-panel rounded-3xl p-8 border border-white/10">
                    <Feather className="w-10 h-10 text-emerald-400/60 mx-auto" />
                    <h3 className="font-display text-xl font-bold text-white">No posts in this stream</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">Be the first to share a thought, poem, or story from the composer above!</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* VIEW B: FULL FACEBOOK PROFILE VIEW */}
          {currentTab === 'profile' && (
            <FacebookProfileView
              user={profileViewUser || currentUser}
              currentUser={currentUser}
              onSelectPost={(p) => setReaderPost(p)}
              onApplaud={handleApplaud}
              onBookmark={handleBookmark}
              onOpenQuoteModal={(p) => setQuoteModalPost(p)}
              onOpenReportModal={(p) => setReportTargetPost(p)}
              onAddComment={handleAddComment}
              openStudio={() => setStudioOpen(true)}
              openEditProfile={() => setEditProfileModalOpen(true)}
              onFollowAuthor={handleFollowAuthor}
            />
          )}

          {/* VIEW C: MAGAZINES & ANTHOLOGIES */}
          {currentTab === 'magazines' && (
            <MagazinesHub
              currentUser={currentUser}
              onSelectPost={(post) => setReaderPost(post)}
              openStudio={() => setStudioOpen(true)}
            />
          )}

          {/* VIEW D: EDITORIAL DESK */}
          {currentTab === 'editorial' && (
            <EditorialDashboard
              currentUser={currentUser}
              onSelectPost={(post) => setReaderPost(post)}
            />
          )}

          {/* VIEW E: GUARDIAN MODERATION */}
          {currentTab === 'moderation' && (
            <ModerationDashboard
              currentUser={currentUser}
              onSelectPost={(post) => setReaderPost(post)}
            />
          )}

          {/* VIEW F: INTERACTIVE MVP ARCHITECTURE MAP */}
          {currentTab === 'architecture' && (
            <ArchitectureViewer
              onNavigateFlow={(tab) => setCurrentTab(tab)}
              openStudio={() => setStudioOpen(true)}
              openOnboarding={() => setOnboardingOpen(true)}
              openQuoteModal={() => setQuoteModalPost(posts[0])}
            />
          )}

        </main>

        {/* RIGHT COLUMN: Facebook Sponsored, Suggested Authors & Online Contacts */}
        <FacebookSidebarRight
          users={users}
          currentUser={currentUser}
          onFollowAuthor={handleFollowAuthor}
          setCurrentTab={setCurrentTab}
          onSelectUser={(u) => openUserProfile(u)}
        />

      </div>

      {/* 3. MODALS & OVERLAYS */}

      {/* Email / Password Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        users={users}
      />

      {/* Full Social Network Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateSuccess={handleUpdateProfileSuccess}
      />

      {/* Distraction-Free Reader Modal */}
      {readerPost && (
        <ReaderModal
          post={readerPost}
          currentUser={currentUser}
          onClose={() => setReaderPost(null)}
          onApplaud={handleApplaud}
          onBookmark={handleBookmark}
          onFollowAuthor={handleFollowAuthor}
          onOpenQuoteModal={(p) => setQuoteModalPost(p)}
          onAddComment={handleAddComment}
        />
      )}

      {/* Writer Studio Workshop */}
      {studioOpen && (
        <StudioEditor
          currentUser={currentUser}
          magazines={magazines}
          onClose={() => setStudioOpen(false)}
          onPublishSuccess={handlePublishSuccess}
        />
      )}

      {/* Visual Quote Card Creator Modal */}
      {quoteModalPost && (
        <QuoteCardModal
          post={quoteModalPost}
          currentUser={currentUser}
          onClose={() => setQuoteModalPost(null)}
        />
      )}

      {/* Onboarding Taxonomy Calibration */}
      {onboardingOpen && (
        <OnboardingModal
          onClose={() => setOnboardingOpen(false)}
          onCompleteOnboarding={handleCompleteOnboarding}
        />
      )}

      {/* Content Reporting Modal */}
      {reportTargetPost && (
        <ReportModal
          targetPost={reportTargetPost}
          currentUser={currentUser}
          onClose={() => setReportTargetPost(null)}
        />
      )}

    </div>
  );
}

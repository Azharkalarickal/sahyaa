import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Database, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Feather, 
  BookMarked, 
  ShieldAlert, 
  UserCheck, 
  Share2, 
  Play, 
  Code,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const ARCHITECTURE_NODES = [
  {
    id: 'node-onboard',
    step: '01',
    title: 'Onboarding & Taxonomy',
    icon: UserCheck,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    summary: 'Dual-role persona selection, pen-name creation, and regional literary taste calibration.',
    flowSteps: [
      'Welcome & Cultural Intro to Sahyaa',
      'Select Role Persona (Reader vs Writer vs Editor vs Mod)',
      'Multi-select Literary Genres (Monsoon Lore, Malayalam Lit, Poetry, Magic Realism)',
      'Pen-Name & Bio Registration',
      'Personalized Feed Inception'
    ],
    dbTables: ['users (id, username, pen_name, role, genres, badge)'],
    apiEndpoints: ['POST /api/users/onboard', 'GET /api/users'],
    actionTab: 'onboarding'
  },
  {
    id: 'node-profile',
    step: '02',
    title: 'Dual Profiles & Archives',
    icon: Feather,
    color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/40 text-teal-300',
    summary: 'Author works catalog, private drafts repository, and reader bookmarks.',
    flowSteps: [
      'Author Header with Pen Name & Verified Bard Badge',
      'Published Works Matrix (Stories, Poetry, Essays)',
      'Private Drafts Storage',
      'Saved Reading List (Bookmarks)',
      'Followers & Following Network'
    ],
    dbTables: ['users', 'posts (status=published|draft)', 'interactions (target_type=post_bookmark)'],
    apiEndpoints: ['GET /api/users/:id', 'PUT /api/users/:id'],
    actionTab: 'profile'
  },
  {
    id: 'node-studio',
    step: '03',
    title: 'Writer Studio & Publishing',
    icon: Sparkles,
    color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
    summary: 'Distraction-free rich editor with dual Verse/Prose formatting, metrics, and magazine pitching.',
    flowSteps: [
      'Select Format: Poetry / Short Story / Essay / Musing',
      'Live Stanza Spacing & Reading Time Calculation',
      'Cover Art Preset Selector (Monsoon Rains, Teak Library)',
      'Featured Quote Highlight Extractor',
      'Direct Feed Publication OR Literary Journal Pitch Submission'
    ],
    dbTables: ['posts (id, author_id, title, content, type, genre, featured_quote, status)', 'quote_cards'],
    apiEndpoints: ['POST /api/posts', 'PUT /api/posts/:id'],
    actionTab: 'studio'
  },
  {
    id: 'node-feed',
    step: '04',
    title: 'Social Discovery & Sharing',
    icon: Share2,
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300',
    summary: 'Immersion reader mode, multi-applaud clapping, discussions, and visual quote card generator.',
    flowSteps: [
      'Multi-category Feed (Trending, Poetry Lounge, Picks)',
      'Distraction-free Reader (Themes: Obsidian, Emerald, Sepia, Parchment)',
      'Speech Synthesis Audio Narration',
      'Multi-Applaud Animated Clapping (+1, +5)',
      'Visual Quote Card Generator (High-res themed image cards)'
    ],
    dbTables: ['posts', 'interactions (target_type=post_applaud)', 'comments', 'quote_cards'],
    apiEndpoints: ['GET /api/posts', 'POST /api/posts/:id/applaud', 'POST /api/posts/:id/comments', 'POST /api/quote-cards'],
    actionTab: 'feed'
  },
  {
    id: 'node-magazines',
    step: '05',
    title: 'Journals & Anthologies',
    icon: BookMarked,
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
    summary: 'Curated literary journals with themed issues, open submission windows, and peer editorial review.',
    flowSteps: [
      'Browse Literary Journals (The Monsoon Review, Sahya Chronicles, Kavya Quarterly)',
      'Review Open Call Submission Windows & Guidelines',
      'Author Submits Draft with Editorial Pitch Note',
      'Chief Editor Review Desk (Accept, Decline, Critique)',
      'Curated Anthology Issue Publication'
    ],
    dbTables: ['magazines', 'magazine_issues', 'magazine_submissions (status=pending|accepted|rejected)'],
    apiEndpoints: ['GET /api/magazines', 'POST /api/submissions', 'PUT /api/submissions/:id/review'],
    actionTab: 'magazines'
  },
  {
    id: 'node-moderation',
    step: '06',
    title: 'Guardian Moderation & Safety',
    icon: ShieldAlert,
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300',
    summary: 'Community report intake, plagiarism detection, quarantine workflows, and audit logs.',
    flowSteps: [
      'User Flags Content (Plagiarism, Hate Speech, NSFW, Spam)',
      'Quarantine Queue in Guardian Desk',
      'Moderator Evaluation & Context Inspection',
      'Resolution Actions: Dismiss, Author Warning, Content Takedown',
      'Audit Trail Logging'
    ],
    dbTables: ['moderation_reports (id, reporter_id, target_type, reason, status, resolution_note)'],
    apiEndpoints: ['GET /api/moderation/reports', 'POST /api/moderation/report', 'PUT /api/moderation/resolve/:id'],
    actionTab: 'moderation'
  }
];

export default function ArchitectureViewer({ 
  onNavigateFlow, 
  openStudio, 
  openOnboarding,
  openQuoteModal 
}) {
  const [selectedNode, setSelectedNode] = useState(ARCHITECTURE_NODES[0]);
  const [dbStats, setDbStats] = useState(null);

  useEffect(() => {
    // Fetch live platform stats for database overview
    fetch('/api/posts')
      .then(r => r.json())
      .then(posts => {
        fetch('/api/users')
          .then(r => r.json())
          .then(users => {
            fetch('/api/magazines')
              .then(r => r.json())
              .then(mags => {
                fetch('/api/moderation/reports')
                  .then(r => r.json())
                  .then(reports => {
                    setDbStats({
                      usersCount: users.length,
                      postsCount: posts.length,
                      magazinesCount: mags.length,
                      reportsCount: reports.length
                    });
                  });
              });
          });
      })
      .catch(() => {});
  }, []);

  const handleRunFlowAction = (tabId) => {
    if (tabId === 'onboarding') openOnboarding();
    else if (tabId === 'studio') openStudio();
    else onNavigateFlow(tabId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Banner */}
      <div className="rounded-3xl p-8 sm:p-12 glass-panel-elevated bg-gradient-to-br from-[#121424] via-[#141c26] to-[#0c1015] border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive MVP User Flow & Architecture</span>
        </div>
        
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Sahyaa Platform Architecture Map
        </h1>
        
        <p className="font-literary text-slate-300 text-base sm:text-lg italic leading-relaxed max-w-3xl">
          Visual interactive specification of Sahyaa's end-to-end MVP user flow—from dual-role onboarding and rich literary creation to digital magazines, social discovery, and community moderation.
        </p>

        {/* Local SQLite Database Spec Badge */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-emerald-300">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Database: <strong className="text-white">sahyaa.db</strong> (Local SQLite in Workspace Root)</span>
          </div>
          {dbStats && (
            <div className="flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-300">
              <span>{dbStats.usersCount} Users</span> •
              <span>{dbStats.postsCount} Works</span> •
              <span>{dbStats.magazinesCount} Journals</span> •
              <span>{dbStats.reportsCount} Reports</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Flow Diagram Nodes Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
          Interactive Architecture Nodes (Click any node to inspect specification & test live)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ARCHITECTURE_NODES.map(node => {
            const Icon = node.icon;
            const isSelected = selectedNode.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-6 rounded-3xl glass-panel border cursor-pointer transition-all card-hover-effect flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? `bg-gradient-to-br ${node.color} ring-2 ring-white/20 shadow-xl`
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300">
                      Phase {node.step}
                    </span>
                    <Icon className="w-5 h-5 opacity-90" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-white">{node.title}</h3>
                  <p className="text-xs text-slate-300 font-literary italic leading-relaxed">{node.summary}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{node.flowSteps.length} Flow Sub-steps</span>
                  <span className="flex items-center space-x-1 text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Node Inspector & Live Test Console */}
      {selectedNode && (
        <div className="p-8 sm:p-10 rounded-3xl glass-panel-elevated bg-[#121824] border border-white/15 space-y-8 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase">Selected Architecture Component • Phase {selectedNode.step}</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">{selectedNode.title}</h2>
              <p className="text-xs text-slate-400 font-literary italic">{selectedNode.summary}</p>
            </div>

            <button
              onClick={() => handleRunFlowAction(selectedNode.actionTab)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/25 transition-all whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch & Test This Flow Live</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Step-by-Step User Flow Execution */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>User Flow Execution Pipeline</span>
              </h4>
              
              <div className="space-y-2">
                {selectedNode.flowSteps.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start space-x-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Database & API Specifications */}
            <div className="space-y-6">
              
              {/* Database Schema */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span>Database Entity Relational Model (sahyaa.db)</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.dbTables.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-emerald-300">
                      <code>{t}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* REST API Endpoints */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  <span>REST API Endpoints Active</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.apiEndpoints.map((ep, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-indigo-300">
                      <code>{ep}</code>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

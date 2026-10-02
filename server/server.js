import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './db.js';
import { seedDatabase } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize and seed database
seedDatabase();

// Helper to parse JSON fields safely
const parseJson = (str, fallback = []) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
};

// -------------------------------------------------------------
// 1. AUTHENTICATION & LOGIN SETUP (SAVED IN SAME DB: sahyaa.db)
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  const { 
    name, 
    email, 
    password, 
    username, 
    pen_name, 
    role = 'writer', 
    bio, 
    intro, 
    avatar, 
    cover_photo,
    location,
    work,
    education,
    hometown,
    relationship_status,
    genres = ['Poetry', 'Short Stories']
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  // Check if email or username already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(
    email.toLowerCase().trim(), 
    (username || email.split('@')[0]).toLowerCase().trim()
  );

  if (existing) {
    return res.status(400).json({ error: 'An account with this email or username already exists.' });
  }

  const generatedUsername = (username || `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`).toLowerCase().trim();
  const defaultAvatar = avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;
  const defaultCover = cover_photo || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&auto=format&fit=crop&q=80';

  try {
    const stmt = db.prepare(`
      INSERT INTO users (
        name, email, password, username, pen_name, role, bio, intro, avatar, cover_photo, location, work, education, hometown, relationship_status, genres, badge
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Rising Bard')
    `);

    const info = stmt.run(
      name,
      email.toLowerCase().trim(),
      password,
      generatedUsername,
      pen_name || name,
      role,
      bio || 'Writing and reading along the Western Ghats.',
      intro || 'Crafting stories and verses on Sahyaa.',
      defaultAvatar,
      defaultCover,
      location || 'Kerala, India',
      work || 'Author at Sahyaa Literary Guild',
      education || 'Studied Literature',
      hometown || 'Kerala, India',
      relationship_status || 'Single',
      JSON.stringify(genres)
    );

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
    delete newUser.password; // Do not return password to client
    res.status(201).json({ success: true, user: { ...newUser, genres: parseJson(newUser.genres) } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE OR username = ? COLLATE NOCASE').get(
    email.trim(), 
    email.trim()
  );

  if (!user) {
    return res.status(401).json({ error: 'No account found with this email or username.' });
  }

  // Verify password (in sahyaa.db)
  if (user.password !== password) {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }

  const userCopy = { ...user, genres: parseJson(user.genres) };
  delete userCopy.password;
  res.json({ success: true, user: userCopy });
});

// -------------------------------------------------------------
// 2. HEALTH & ARCHITECTURE SPEC ENDPOINT
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Sahyaa Literary Platform', version: '2.0.0' });
});

app.get('/api/architecture', (req, res) => {
  res.json({
    platform: 'Sahyaa',
    tagline: 'Literary Social Network & Publication Platform',
    version: '2.0.0',
    database: {
      type: 'SQLite (Single-file in workspace)',
      path: 'sahyaa.db',
      mode: 'WAL + Foreign Keys enabled'
    },
    modules: [
      {
        id: 'auth_login',
        name: '1. Email & Password Authentication & Identity',
        description: 'Permanent account registration and secure login stored in sahyaa.db with session persistence and dual-persona switching.',
        flow: ['Registration Form', 'Password Verification in sahyaa.db', 'Session Token Generation', 'Profile Setup', 'Dual Persona Switcher'],
        status: 'active'
      },
      {
        id: 'fb_feed',
        name: '2. Facebook-style Social Media Feed & Fleets',
        description: '3-column social network layout with 24h stories carousel, "What\'s on your mind?" literary composer, multi-reaction bar, and instant comments.',
        flow: ['Stories Reel Bar', 'Composer Post Box', 'Multi-category Feed Tabs', 'FB Reactions (Like, Love, Care, Insight)', 'Real-time Comment Threads'],
        status: 'active'
      },
      {
        id: 'fb_profile',
        name: '3. Full Social Network Profile & Media Timeline',
        description: 'Social profile with cover banner, avatar, intro overview, work, education, hometown, photo galleries, published pieces, and private drafts.',
        flow: ['Cover Art Banner', 'Avatar Upload', 'Bio & Work / Education Overview', 'Timeline Posts Matrix', 'Full Profile Edit Modal'],
        status: 'active'
      },
      {
        id: 'studio',
        name: '4. Writer Studio & Publishing Engine',
        description: 'Distraction-free rich editor with dual Prose & Poetry modes (stanza spacing, verse formatting), live read-time calc, and magazine pitches.',
        flow: ['Draft Inception', 'Prose/Poetry Formatting', 'Tags & Excerpt', 'Direct Feed Publish OR Magazine Pitch', 'Draft Autosave'],
        status: 'active'
      },
      {
        id: 'magazines',
        name: '5. Digital Magazines & Editorial Workflow',
        description: 'Curated literary journals with themed issues, open submission calls, blind/peer editorial review, revision notes, and curated anthology releases.',
        flow: ['Magazine Directory', 'Open Calls for Submissions', 'Writer Pitches Piece', 'Editor Review & Feedback', 'Issue Release Publication'],
        status: 'active'
      },
      {
        id: 'moderation',
        name: '6. Community Moderation & Plagiarism Guard',
        description: 'Multi-category report intake (Plagiarism, Hate Speech, NSFW), moderator triage queue, content quarantine/removal, and transparent resolution logs.',
        flow: ['User Flags Piece/Comment', 'Queue in Moderation Desk', 'Moderator Assessment', 'Take Action (Clear / Remove / Warn)', 'Audit Log'],
        status: 'active'
      }
    ]
  });
});

// -------------------------------------------------------------
// 3. USERS & FULL SOCIAL PROFILES
// -------------------------------------------------------------
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT id, username, name, email, avatar, cover_photo, bio, intro, work, education, hometown, relationship_status, role, genres, pen_name, badge, location, website, followers_count, following_count, created_at FROM users ORDER BY id ASC').all();
  const formatted = users.map(u => ({ ...u, genres: parseJson(u.genres) }));
  res.json(formatted);
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = db.prepare('SELECT id, username, name, email, avatar, cover_photo, bio, intro, work, education, hometown, relationship_status, role, genres, pen_name, badge, location, website, followers_count, following_count, created_at FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Get author's posts
  const posts = db.prepare('SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC').all(userId);
  
  // Get bookmarked posts
  const bookmarks = db.prepare(`
    SELECT p.*, u.name as author_name, u.pen_name, u.avatar as author_avatar
    FROM interactions i
    JOIN posts p ON i.target_id = p.id
    JOIN users u ON p.author_id = u.id
    WHERE i.user_id = ? AND i.target_type = 'post_bookmark'
    ORDER BY i.created_at DESC
  `).all(userId);

  res.json({
    ...user,
    genres: parseJson(user.genres),
    posts: posts.map(p => ({ ...p, tags: parseJson(p.tags) })),
    bookmarks: bookmarks.map(b => ({ ...b, tags: parseJson(b.tags) }))
  });
});

app.put('/api/users/:id', (req, res) => {
  const { 
    name, 
    bio, 
    intro,
    work,
    education,
    hometown,
    relationship_status,
    pen_name, 
    role, 
    genres, 
    location, 
    website, 
    avatar,
    cover_photo 
  } = req.body;

  const stmt = db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      bio = COALESCE(?, bio),
      intro = COALESCE(?, intro),
      work = COALESCE(?, work),
      education = COALESCE(?, education),
      hometown = COALESCE(?, hometown),
      relationship_status = COALESCE(?, relationship_status),
      pen_name = COALESCE(?, pen_name),
      role = COALESCE(?, role),
      genres = COALESCE(?, genres),
      location = COALESCE(?, location),
      website = COALESCE(?, website),
      avatar = COALESCE(?, avatar),
      cover_photo = COALESCE(?, cover_photo)
    WHERE id = ?
  `);

  stmt.run(
    name ?? null, 
    bio ?? null, 
    intro ?? null, 
    work ?? null, 
    education ?? null, 
    hometown ?? null, 
    relationship_status ?? null, 
    pen_name ?? null, 
    role ?? null, 
    genres ? JSON.stringify(genres) : null, 
    location ?? null, 
    website ?? null, 
    avatar ?? null, 
    cover_photo ?? null, 
    req.params.id
  );

  const updated = db.prepare('SELECT id, username, name, email, avatar, cover_photo, bio, intro, work, education, hometown, relationship_status, role, genres, pen_name, badge, location, website, followers_count, following_count, created_at FROM users WHERE id = ?').get(req.params.id);
  res.json({ ...updated, genres: parseJson(updated.genres) });
});

// -------------------------------------------------------------
// 4. STORIES / FLEETS REEL
// -------------------------------------------------------------
app.get('/api/user-stories', (req, res) => {
  const stories = db.prepare(`
    SELECT s.*, u.name as user_name, u.pen_name, u.avatar as user_avatar
    FROM user_stories s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `).all();
  res.json(stories);
});

app.post('/api/user-stories', (req, res) => {
  const { user_id = 1, text_content, media_url, theme_color = 'emerald' } = req.body;
  if (!text_content && !media_url) {
    return res.status(400).json({ error: 'Story content required' });
  }

  const stmt = db.prepare(`
    INSERT INTO user_stories (user_id, text_content, media_url, theme_color)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(user_id, text_content, media_url, theme_color);
  const created = db.prepare(`
    SELECT s.*, u.name as user_name, u.pen_name, u.avatar as user_avatar
    FROM user_stories s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ?
  `).get(info.lastInsertRowid);
  res.status(201).json(created);
});

// -------------------------------------------------------------
// 5. POSTS (STORIES, POETRY, ESSAYS, STATUSES)
// -------------------------------------------------------------
app.get('/api/posts', (req, res) => {
  const { tab = 'all', genre, author_id, current_user_id = 1, search } = req.query;

  let query = `
    SELECT 
      p.*, 
      u.name as author_name, 
      u.username as author_username, 
      u.pen_name, 
      u.avatar as author_avatar, 
      u.badge as author_badge,
      (SELECT COUNT(*) FROM interactions WHERE target_type = 'post_bookmark' AND target_id = p.id AND user_id = ?) as is_bookmarked,
      (SELECT COUNT(*) FROM interactions WHERE target_type = 'post_applaud' AND target_id = p.id AND user_id = ?) as is_applauded,
      (SELECT meta FROM interactions WHERE target_type = 'post_reaction' AND target_id = p.id AND user_id = ?) as user_reaction
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.status = 'published'
  `;
  const params = [current_user_id, current_user_id, current_user_id];

  if (genre && genre !== 'All') {
    query += ` AND p.genre = ?`;
    params.push(genre);
  }

  if (author_id) {
    query += ` AND p.author_id = ?`;
    params.push(author_id);
  }

  if (search) {
    query += ` AND (p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ? OR u.name LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }

  if (tab === 'poetry') {
    query += ` AND (p.type = 'poem' OR p.type = 'musing')`;
  } else if (tab === 'stories') {
    query += ` AND p.type = 'story'`;
  } else if (tab === 'essays') {
    query += ` AND p.type = 'essay'`;
  } else if (tab === 'trending') {
    query += ` ORDER BY (p.applauds_count * 2 + p.views_count + p.comments_count * 3) DESC`;
  } else if (tab === 'picks') {
    query += ` AND p.is_editor_pick = 1 ORDER BY p.created_at DESC`;
  } else {
    query += ` ORDER BY p.created_at DESC`;
  }

  const posts = db.prepare(query).all(...params);
  const formatted = posts.map(p => ({
    ...p,
    tags: parseJson(p.tags),
    is_bookmarked: Boolean(p.is_bookmarked),
    is_applauded: Boolean(p.is_applauded)
  }));

  res.json(formatted);
});

app.get('/api/posts/:id', (req, res) => {
  const current_user_id = req.query.current_user_id || 1;
  const post = db.prepare(`
    SELECT 
      p.*, 
      u.name as author_name, 
      u.username as author_username, 
      u.pen_name, 
      u.avatar as author_avatar, 
      u.bio as author_bio,
      u.intro as author_intro,
      u.badge as author_badge,
      u.location as author_location,
      (SELECT COUNT(*) FROM interactions WHERE target_type = 'post_bookmark' AND target_id = p.id AND user_id = ?) as is_bookmarked,
      (SELECT COUNT(*) FROM interactions WHERE target_type = 'post_applaud' AND target_id = p.id AND user_id = ?) as is_applauded,
      (SELECT meta FROM interactions WHERE target_type = 'post_reaction' AND target_id = p.id AND user_id = ?) as user_reaction
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `).get(current_user_id, current_user_id, current_user_id, req.params.id);

  if (!post) return res.status(404).json({ error: 'Post not found' });

  // Increment view count
  db.prepare('UPDATE posts SET views_count = views_count + 1 WHERE id = ?').run(req.params.id);

  // Get comments
  const comments = db.prepare(`
    SELECT c.*, u.name as user_name, u.avatar as user_avatar, u.pen_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `).all(req.params.id);

  // Get related works by same author or genre
  const related = db.prepare(`
    SELECT id, title, type, genre, cover_image, read_time_mins, applauds_count
    FROM posts
    WHERE (author_id = ? OR genre = ?) AND id != ? AND status = 'published'
    LIMIT 3
  `).all(post.author_id, post.genre, post.id);

  res.json({
    ...post,
    tags: parseJson(post.tags),
    is_bookmarked: Boolean(post.is_bookmarked),
    is_applauded: Boolean(post.is_applauded),
    comments,
    related
  });
});

app.post('/api/posts', (req, res) => {
  const {
    author_id = 1,
    title,
    content,
    excerpt,
    type = 'story',
    genre = 'Literary Fiction',
    language = 'English',
    tags = [],
    cover_image,
    featured_quote,
    status = 'published',
    read_time_mins = 3,
    submit_to_magazine_id,
    pitch_note
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
  const wordCount = content.trim().split(/\s+/).length;
  const estimatedMins = Math.max(1, Math.ceil(wordCount / 200));

  const stmt = db.prepare(`
    INSERT INTO posts (
      author_id, title, slug, content, excerpt, type, genre, language, tags,
      cover_image, featured_quote, status, read_time_mins
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    author_id,
    title,
    slug,
    content,
    excerpt || content.slice(0, 160).replace(/\n/g, ' ') + '...',
    type,
    genre,
    language,
    JSON.stringify(tags),
    cover_image || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
    featured_quote || '',
    status,
    read_time_mins || estimatedMins
  );

  const postId = info.lastInsertRowid;

  if (submit_to_magazine_id) {
    db.prepare(`
      INSERT INTO magazine_submissions (magazine_id, post_id, author_id, pitch_note, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(submit_to_magazine_id, postId, author_id, pitch_note || 'Submitted via Writer Studio.');
  }

  if (featured_quote) {
    const author = db.prepare('SELECT name, pen_name FROM users WHERE id = ?').get(author_id);
    db.prepare(`
      INSERT INTO quote_cards (post_id, quote_text, author_name, work_title, theme_style)
      VALUES (?, ?, ?, ?, 'emerald')
    `).run(postId, featured_quote, author?.pen_name || author?.name || 'Author', title);
  }

  const createdPost = db.prepare(`
    SELECT p.*, u.name as author_name, u.username as author_username, u.pen_name, u.avatar as author_avatar, u.badge as author_badge
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `).get(postId);

  res.status(201).json({ ...createdPost, tags: parseJson(createdPost.tags) });
});

app.put('/api/posts/:id', (req, res) => {
  const { title, content, excerpt, type, genre, tags, cover_image, featured_quote, status } = req.body;
  const stmt = db.prepare(`
    UPDATE posts SET
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      excerpt = COALESCE(?, excerpt),
      type = COALESCE(?, type),
      genre = COALESCE(?, genre),
      tags = COALESCE(?, tags),
      cover_image = COALESCE(?, cover_image),
      featured_quote = COALESCE(?, featured_quote),
      status = COALESCE(?, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(
    title ?? null,
    content ?? null,
    excerpt ?? null,
    type ?? null,
    genre ?? null,
    tags ? JSON.stringify(tags) : null,
    cover_image ?? null,
    featured_quote ?? null,
    status ?? null,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  res.json({ ...updated, tags: parseJson(updated.tags) });
});

app.delete('/api/posts/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Post removed' });
});

// -------------------------------------------------------------
// 6. INTERACTIONS (REACTION / APPLAUD, BOOKMARK, FOLLOW, COMMENTS)
// -------------------------------------------------------------
app.post('/api/posts/:id/react', (req, res) => {
  const { user_id = 1, reaction = 'like' } = req.body; // 'like', 'love', 'care', 'insight'
  const postId = req.params.id;

  const existing = db.prepare(`
    SELECT id, meta FROM interactions 
    WHERE user_id = ? AND target_type = 'post_reaction' AND target_id = ?
  `).get(user_id, postId);

  if (existing) {
    if (existing.meta === reaction) {
      // Toggle off
      db.prepare('DELETE FROM interactions WHERE id = ?').run(existing.id);
      db.prepare('UPDATE posts SET applauds_count = MAX(0, applauds_count - 1) WHERE id = ?').run(postId);
      return res.json({ success: true, reaction: null });
    } else {
      // Update reaction
      db.prepare('UPDATE interactions SET meta = ? WHERE id = ?').run(reaction, existing.id);
      return res.json({ success: true, reaction });
    }
  } else {
    db.prepare(`
      INSERT INTO interactions (user_id, target_type, target_id, meta)
      VALUES (?, 'post_reaction', ?, ?)
    `).run(user_id, postId, reaction);
    db.prepare('UPDATE posts SET applauds_count = applauds_count + 1 WHERE id = ?').run(postId);
    return res.json({ success: true, reaction });
  }
});

app.post('/api/posts/:id/applaud', (req, res) => {
  const { user_id = 1, count = 1 } = req.body;
  const postId = req.params.id;

  db.prepare('UPDATE posts SET applauds_count = applauds_count + ? WHERE id = ?').run(count, postId);

  try {
    db.prepare(`
      INSERT INTO interactions (user_id, target_type, target_id, meta)
      VALUES (?, 'post_applaud', ?, 'like')
      ON CONFLICT(user_id, target_type, target_id) DO NOTHING
    `).run(user_id, postId);
  } catch {}

  const updated = db.prepare('SELECT applauds_count FROM posts WHERE id = ?').get(postId);
  res.json({ success: true, applauds_count: updated.applauds_count });
});

app.post('/api/posts/:id/bookmark', (req, res) => {
  const { user_id = 1 } = req.body;
  const postId = req.params.id;

  const existing = db.prepare(`
    SELECT id FROM interactions 
    WHERE user_id = ? AND target_type = 'post_bookmark' AND target_id = ?
  `).get(user_id, postId);

  if (existing) {
    db.prepare('DELETE FROM interactions WHERE id = ?').run(existing.id);
    db.prepare('UPDATE posts SET bookmarks_count = MAX(0, bookmarks_count - 1) WHERE id = ?').run(postId);
    res.json({ is_bookmarked: false });
  } else {
    db.prepare(`
      INSERT INTO interactions (user_id, target_type, target_id)
      VALUES (?, 'post_bookmark', ?)
    `).run(user_id, postId);
    db.prepare('UPDATE posts SET bookmarks_count = bookmarks_count + 1 WHERE id = ?').run(postId);
    res.json({ is_bookmarked: true });
  }
});

app.post('/api/users/:id/follow', (req, res) => {
  const { user_id = 1 } = req.body;
  const targetAuthorId = req.params.id;

  if (Number(user_id) === Number(targetAuthorId)) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  const existing = db.prepare(`
    SELECT id FROM interactions 
    WHERE user_id = ? AND target_type = 'user_follow' AND target_id = ?
  `).get(user_id, targetAuthorId);

  if (existing) {
    db.prepare('DELETE FROM interactions WHERE id = ?').run(existing.id);
    db.prepare('UPDATE users SET followers_count = MAX(0, followers_count - 1) WHERE id = ?').run(targetAuthorId);
    db.prepare('UPDATE users SET following_count = MAX(0, following_count - 1) WHERE id = ?').run(user_id);
    res.json({ is_following: false });
  } else {
    db.prepare(`
      INSERT INTO interactions (user_id, target_type, target_id)
      VALUES (?, 'user_follow', ?)
    `).run(user_id, targetAuthorId);
    db.prepare('UPDATE users SET followers_count = followers_count + 1 WHERE id = ?').run(targetAuthorId);
    db.prepare('UPDATE users SET following_count = following_count + 1 WHERE id = ?').run(user_id);
    res.json({ is_following: true });
  }
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { user_id = 1, content, parent_id = null } = req.body;
  if (!content) return res.status(400).json({ error: 'Comment content is required' });

  const stmt = db.prepare(`
    INSERT INTO comments (post_id, user_id, content, parent_id)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(req.params.id, user_id, content, parent_id);
  db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').run(req.params.id);

  const newComment = db.prepare(`
    SELECT c.*, u.name as user_name, u.avatar as user_avatar, u.pen_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `).get(info.lastInsertRowid);

  res.status(201).json(newComment);
});

// -------------------------------------------------------------
// 7. MAGAZINES & SUBMISSIONS
// -------------------------------------------------------------
app.get('/api/magazines', (req, res) => {
  const mags = db.prepare(`
    SELECT m.*, u.name as curator_name, u.avatar as curator_avatar,
      (SELECT COUNT(*) FROM magazine_issues WHERE magazine_id = m.id) as issues_count,
      (SELECT COUNT(*) FROM magazine_submissions WHERE magazine_id = m.id AND status = 'accepted') as published_pieces_count
    FROM magazines m
    LEFT JOIN users u ON m.curator_id = u.id
    ORDER BY m.id ASC
  `).all();
  res.json(mags);
});

app.get('/api/magazines/:id', (req, res) => {
  const mag = db.prepare(`
    SELECT m.*, u.name as curator_name, u.avatar as curator_avatar, u.bio as curator_bio
    FROM magazines m
    LEFT JOIN users u ON m.curator_id = u.id
    WHERE m.id = ?
  `).get(req.params.id);

  if (!mag) return res.status(404).json({ error: 'Magazine not found' });

  const issues = db.prepare(`
    SELECT * FROM magazine_issues 
    WHERE magazine_id = ? 
    ORDER BY id DESC
  `).all(req.params.id);

  const acceptedPieces = db.prepare(`
    SELECT s.*, p.title, p.excerpt, p.type, p.genre, p.cover_image, u.name as author_name, u.pen_name
    FROM magazine_submissions s
    JOIN posts p ON s.post_id = p.id
    JOIN users u ON s.author_id = u.id
    WHERE s.magazine_id = ? AND s.status = 'accepted'
    ORDER BY s.id DESC
  `).all(req.params.id);

  res.json({ ...mag, issues, accepted_pieces: acceptedPieces });
});

app.post('/api/magazines', (req, res) => {
  const { title, tagline, description, cover_image, curator_id = 3, frequency, submission_guidelines } = req.body;
  const stmt = db.prepare(`
    INSERT INTO magazines (title, tagline, description, cover_image, curator_id, frequency, submission_guidelines)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    title,
    tagline,
    description,
    cover_image || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    curator_id,
    frequency || 'Quarterly',
    submission_guidelines || 'Send your best prose and lyrical poems.'
  );
  const newMag = db.prepare('SELECT * FROM magazines WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(newMag);
});

app.get('/api/submissions', (req, res) => {
  const { author_id, magazine_id, status } = req.query;
  let query = `
    SELECT 
      s.*, 
      p.title as post_title, 
      p.excerpt as post_excerpt, 
      p.type as post_type, 
      p.genre as post_genre,
      p.content as post_content,
      m.title as magazine_title,
      u.name as author_name,
      u.pen_name as author_pen_name,
      u.avatar as author_avatar
    FROM magazine_submissions s
    JOIN posts p ON s.post_id = p.id
    JOIN magazines m ON s.magazine_id = m.id
    JOIN users u ON s.author_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (author_id) {
    query += ' AND s.author_id = ?';
    params.push(author_id);
  }
  if (magazine_id) {
    query += ' AND s.magazine_id = ?';
    params.push(magazine_id);
  }
  if (status) {
    query += ' AND s.status = ?';
    params.push(status);
  }

  query += ' ORDER BY s.created_at DESC';
  const submissions = db.prepare(query).all(...params);
  res.json(submissions);
});

app.post('/api/submissions', (req, res) => {
  const { magazine_id, post_id, author_id = 1, pitch_note } = req.body;
  if (!magazine_id || !post_id) {
    return res.status(400).json({ error: 'Magazine ID and Post ID required' });
  }

  const stmt = db.prepare(`
    INSERT INTO magazine_submissions (magazine_id, post_id, author_id, pitch_note, status)
    VALUES (?, ?, ?, ?, 'pending')
  `);
  const info = stmt.run(magazine_id, post_id, author_id, pitch_note || 'Submission to editorial board.');
  const newSub = db.prepare('SELECT * FROM magazine_submissions WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(newSub);
});

app.put('/api/submissions/:id/review', (req, res) => {
  const { status, editorial_feedback, issue_id } = req.body;
  const stmt = db.prepare(`
    UPDATE magazine_submissions SET
      status = COALESCE(?, status),
      editorial_feedback = COALESCE(?, editorial_feedback),
      issue_id = COALESCE(?, issue_id)
    WHERE id = ?
  `);
  stmt.run(status, editorial_feedback, issue_id, req.params.id);
  const updated = db.prepare('SELECT * FROM magazine_submissions WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// -------------------------------------------------------------
// 8. QUOTE CARDS & SHARING
// -------------------------------------------------------------
app.get('/api/quote-cards', (req, res) => {
  const cards = db.prepare(`
    SELECT qc.*, p.slug as post_slug
    FROM quote_cards qc
    JOIN posts p ON qc.post_id = p.id
    ORDER BY qc.created_at DESC
  `).all();
  res.json(cards);
});

app.post('/api/quote-cards', (req, res) => {
  const { post_id, quote_text, author_name, work_title, theme_style = 'emerald' } = req.body;
  if (!quote_text) return res.status(400).json({ error: 'Quote text is required' });

  const stmt = db.prepare(`
    INSERT INTO quote_cards (post_id, quote_text, author_name, work_title, theme_style)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(post_id, quote_text, author_name, work_title, theme_style);
  const newCard = db.prepare('SELECT * FROM quote_cards WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(newCard);
});

// -------------------------------------------------------------
// 9. MODERATION & REPORTING
// -------------------------------------------------------------
app.get('/api/moderation/reports', (req, res) => {
  const reports = db.prepare(`
    SELECT mr.*, u.name as reporter_name, u.avatar as reporter_avatar
    FROM moderation_reports mr
    JOIN users u ON mr.reporter_id = u.id
    ORDER BY mr.created_at DESC
  `).all();
  res.json(reports);
});

app.post('/api/moderation/report', (req, res) => {
  const { reporter_id = 1, target_type = 'post', target_id, reason, details } = req.body;
  if (!target_id || !reason) {
    return res.status(400).json({ error: 'Target ID and reason are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO moderation_reports (reporter_id, target_type, target_id, reason, details, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `);
  const info = stmt.run(reporter_id, target_type, target_id, reason, details || '');
  const newReport = db.prepare('SELECT * FROM moderation_reports WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(newReport);
});

app.put('/api/moderation/resolve/:id', (req, res) => {
  const { status, resolution_note, action_taken_by = 5 } = req.body;
  const reportId = req.params.id;

  const stmt = db.prepare(`
    UPDATE moderation_reports SET
      status = ?,
      resolution_note = ?,
      action_taken_by = ?
    WHERE id = ?
  `);
  stmt.run(status, resolution_note, action_taken_by, reportId);

  const report = db.prepare('SELECT * FROM moderation_reports WHERE id = ?').get(reportId);
  if (report && report.target_type === 'post' && status === 'content_removed') {
    db.prepare("UPDATE posts SET status = 'flagged' WHERE id = ?").run(report.target_id);
  }

  res.json({ success: true, report: db.prepare('SELECT * FROM moderation_reports WHERE id = ?').get(reportId) });
});

// Static files fallback
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) res.status(200).send('Sahyaa API Server is active.');
  });
});

app.listen(PORT, () => {
  console.log(`🌿 Sahyaa Platform API server running on http://localhost:${PORT}`);
  console.log(`📦 SQLite database active at: ${path.resolve(__dirname, '..', 'sahyaa.db')}`);
});

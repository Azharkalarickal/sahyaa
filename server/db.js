import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file stored in the project root folder: sahyaa.db
const DB_PATH = path.resolve(__dirname, '..', 'sahyaa.db');
const db = new DatabaseSync(DB_PATH);

// Enable Foreign Keys & WAL mode for performance
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT DEFAULT 'password123',
      avatar TEXT,
      cover_photo TEXT,
      bio TEXT,
      intro TEXT,
      work TEXT,
      education TEXT,
      hometown TEXT,
      relationship_status TEXT,
      role TEXT DEFAULT 'writer', -- 'reader', 'writer', 'editor', 'moderator'
      genres TEXT DEFAULT '[]',   -- JSON array of literary genres
      pen_name TEXT,
      badge TEXT DEFAULT 'Rising Voice',
      location TEXT DEFAULT 'Kerala, India',
      website TEXT,
      followers_count INTEGER DEFAULT 0,
      following_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT,
      type TEXT DEFAULT 'story', -- 'poem', 'story', 'essay', 'musing', 'status'
      genre TEXT DEFAULT 'Literary Fiction',
      language TEXT DEFAULT 'English',
      tags TEXT DEFAULT '[]',    -- JSON array
      cover_image TEXT,
      featured_quote TEXT,
      status TEXT DEFAULT 'published', -- 'published', 'draft', 'flagged'
      read_time_mins INTEGER DEFAULT 3,
      applauds_count INTEGER DEFAULT 0,
      bookmarks_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      is_editor_pick INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      text_content TEXT,
      media_url TEXT,
      theme_color TEXT DEFAULT 'emerald',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS magazines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      cover_image TEXT,
      curator_id INTEGER,
      frequency TEXT DEFAULT 'Quarterly',
      status TEXT DEFAULT 'active',
      accepting_submissions INTEGER DEFAULT 1,
      submission_guidelines TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (curator_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS magazine_issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      magazine_id INTEGER NOT NULL,
      issue_number TEXT NOT NULL,
      theme TEXT NOT NULL,
      release_date TEXT,
      cover_art TEXT,
      status TEXT DEFAULT 'published', -- 'published', 'in_preparation'
      curator_editorial TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (magazine_id) REFERENCES magazines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS magazine_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      magazine_id INTEGER NOT NULL,
      issue_id INTEGER,
      post_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      pitch_note TEXT,
      status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'revision_requested'
      editorial_feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (magazine_id) REFERENCES magazines(id) ON DELETE CASCADE,
      FOREIGN KEY (issue_id) REFERENCES magazine_issues(id) ON DELETE SET NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      parent_id INTEGER DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      target_type TEXT NOT NULL, -- 'post_applaud', 'post_bookmark', 'user_follow', 'post_reaction'
      target_id INTEGER NOT NULL,
      meta TEXT,                 -- reaction type e.g. 'like', 'love', 'care', 'insight'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, target_type, target_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS moderation_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reporter_id INTEGER NOT NULL,
      target_type TEXT NOT NULL, -- 'post', 'comment', 'user'
      target_id INTEGER NOT NULL,
      reason TEXT NOT NULL,      -- 'Plagiarism', 'Hate Speech', 'NSFW', 'Harassment', 'Spam'
      details TEXT,
      status TEXT DEFAULT 'pending', -- 'pending', 'reviewed_cleared', 'content_removed', 'user_warned'
      action_taken_by INTEGER,
      resolution_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quote_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      quote_text TEXT NOT NULL,
      author_name TEXT NOT NULL,
      work_title TEXT NOT NULL,
      theme_style TEXT DEFAULT 'emerald',
      shares_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `);

  // Auto-migration check: add any newly added columns if users table pre-existed
  try {
    const tableInfo = db.prepare('PRAGMA table_info(users)').all();
    const cols = tableInfo.map(c => c.name);
    
    if (!cols.includes('password')) db.exec("ALTER TABLE users ADD COLUMN password TEXT DEFAULT 'password123';");
    if (!cols.includes('cover_photo')) db.exec("ALTER TABLE users ADD COLUMN cover_photo TEXT;");
    if (!cols.includes('intro')) db.exec("ALTER TABLE users ADD COLUMN intro TEXT;");
    if (!cols.includes('work')) db.exec("ALTER TABLE users ADD COLUMN work TEXT;");
    if (!cols.includes('education')) db.exec("ALTER TABLE users ADD COLUMN education TEXT;");
    if (!cols.includes('hometown')) db.exec("ALTER TABLE users ADD COLUMN hometown TEXT;");
    if (!cols.includes('relationship_status')) db.exec("ALTER TABLE users ADD COLUMN relationship_status TEXT;");
  } catch (err) {
    console.error('Migration notice:', err.message);
  }
}

export default db;

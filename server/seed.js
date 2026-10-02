import db, { initDatabase } from './db.js';

export function seedDatabase() {
  initDatabase();
  console.log('🌿 Sahyaa Database initialized cleanly for production.');
}

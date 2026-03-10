import pg from 'pg';
import { ENV } from './env.js';

const { Pool } = pg;

// Pool = multiple connections ready at once
// Much faster than opening a new connection per request
const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,        // Max 20 connections open at once
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // 10 seconds - realistic for cloud DBs
});

// Initialize database connection
// This should be called from server.js before starting the server
export async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err; // Prevent server startup if DB is unreachable
  }
}

// The query function every module will use
// Usage: db.query('SELECT * FROM users WHERE id = $1', [userId])
export const db = {
  query: (text, params) => pool.query(text, params),
};
// Run database migrations
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running migrations...');
    
    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    
    const migrationsDir = path.join(__dirname, '../database/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Run in order: 001, 002, 003, etc.
    
    for (const file of files) {
      // Check if migration already ran
      const { rows } = await client.query(
        'SELECT filename FROM migrations WHERE filename = $1',
        [file]
      );
      
      if (rows.length > 0) {
        console.log(`  ⏭️  Skipping ${file} (already executed)`);
        continue;
      }
      
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`  ✓ Running ${file}...`);
      await client.query(sql);
      
      // Record that this migration ran
      await client.query(
        'INSERT INTO migrations (filename) VALUES ($1)',
        [file]
      );
    }
    
    console.log('✅ All migrations completed successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(err => {
  console.error(err);
  process.exit(1);
});

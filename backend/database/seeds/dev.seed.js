import '../../src/config/env.js';
import { db } from '../../src/config/database.js';

const seed = async () => {
  // Insert default plans
  await db.query(`
    INSERT INTO plans (name, slug, price_monthly, limits) VALUES
    ('Free',       'free',       0.00,  '{"api_calls": 10000, "jobs": 50,    "logs": 1000}'),
    ('Pro',        'pro',        29.00, '{"api_calls": 500000,"jobs": 5000,  "logs": 100000}'),
    ('Enterprise', 'enterprise', 99.00, '{"api_calls": -1,    "jobs": -1,    "logs": -1}')
    ON CONFLICT (slug) DO NOTHING;
  `);

  console.log('✅ Plans seeded');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
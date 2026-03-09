// This is the first file Node runs
// It starts the server and connects everything

import './src/config/env.js'; // Validate env vars first
import app from './src/app.js';
import { ENV } from './src/config/env.js';
import { initDatabase } from './src/config/database.js';


const PORT = ENV.PORT;

// Initialize database connection before starting server
async function startServer() {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 EDRIX API running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Makao Realtors API is running',
      environment: process.env.NODE_ENV || 'development',
      database: process.env.VITE_SUPABASE_URL ? 'configured' : 'missing'
    });
  });

  // Example of a backend-only logic route
  app.get('/api/config', (req, res) => {
    res.json({
      google_analytics_id: process.env.VITE_GA_ID || null,
      support_email: 'support@makao.co.ke'
    });
  });

  // Proxy-like route for listings metadata (demonstrating backend capability)
  app.get('/api/stats', (req, res) => {
    res.json({
      active_listings: 120,
      verified_users: 450,
      neighborhoods: 47
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    if (!process.env.VITE_SUPABASE_URL) {
      console.warn('WARNING: VITE_SUPABASE_URL is not set in environment variables.');
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

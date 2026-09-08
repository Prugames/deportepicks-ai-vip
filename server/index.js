import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import parlayRoutes from './routes/parlayRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { startLiveFootballPoller } from './services/footballDataService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/parlays', parlayRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: CONFIG.APP_NAME,
    timestamp: new Date().toISOString(),
    aiProvider: 'OpenRouter.ai',
    primaryModel: CONFIG.DEFAULT_MODEL
  });
});

// Serve frontend static build if available
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback for SPA routing
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <body style="background:#0b0f19; color:#fff; font-family:sans-serif; text-align:center; padding:50px;">
            <h2>DEPORTEPICKS AI Server Online (Puerto ${CONFIG.PORT})</h2>
            <p>El backend está respondiendo a las llamadas de la API.</p>
          </body>
        </html>
      `);
    }
  });
});

// Start Server
app.listen(CONFIG.PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ${CONFIG.APP_NAME} Backend activo en http://localhost:${CONFIG.PORT}`);
  console.log(`🔑 Master Admin Code: "${CONFIG.MASTER_ADMIN_CODE}"`);
  console.log(`🤖 AI Engine: OpenRouter (${CONFIG.DEFAULT_MODEL})`);
  console.log(`⚽ 8 Ligas de Fútbol configuradas con soporte en tiempo real`);
  console.log(`====================================================`);

  // Start real-time background sports data poller
  startLiveFootballPoller();
});

import express from 'express';
import { CONFIG } from '../config.js';
import { storage } from '../storage.js';

const router = express.Router();

// Get active settings
router.get('/', (req, res) => {
  try {
    const settings = storage.getSettings();
    return res.json({
      success: true,
      settings: {
        selectedModel: settings.selectedModel || CONFIG.DEFAULT_MODEL,
        openRouterApiKeyMasked: (settings.openRouterApiKey || CONFIG.OPENROUTER_API_KEY).slice(0, 10) + '...',
        availableModels: [
          { id: 'z-ai/glm-5.2:free', name: 'GLM 5.2 (Z-AI Free - Recomendado)', isDefault: true },
          { id: 'minimax/minimax-m3:free', name: 'MiniMax M3 (Free - Ultra Rápido)' },
          { id: 'nvidia/nemotron-3.5-lightning:free', name: 'Nvidia Nemotron 3.5 Lightning (Free)' },
          { id: 'google/gemma-4-31b-it:free', name: 'Google Gemma 4 31B (Free)' }
        ]
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update settings (Admin only)
router.post('/update', (req, res) => {
  try {
    const { adminKey, selectedModel, openRouterApiKey } = req.body;
    if (adminKey !== CONFIG.MASTER_ADMIN_CODE) {
      return res.status(403).json({ success: false, message: 'Acceso no autorizado.' });
    }

    const updates = {};
    if (selectedModel) updates.selectedModel = selectedModel;
    if (openRouterApiKey && openRouterApiKey.trim().length > 10) updates.openRouterApiKey = openRouterApiKey.trim();

    const updated = storage.updateSettings(updates);
    return res.json({ success: true, settings: updated, message: 'Configuración guardada correctamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

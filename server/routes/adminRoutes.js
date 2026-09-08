import express from 'express';
import { CONFIG } from '../config.js';
import { storage } from '../storage.js';

const router = express.Router();

// Middleware to verify admin master code header or body
function requireAdmin(req, res, next) {
  const authHeader = req.headers['x-admin-key'] || req.query.adminKey || req.body.adminKey;
  if (authHeader !== CONFIG.MASTER_ADMIN_CODE) {
    return res.status(403).json({ success: false, message: 'Acceso no autorizado al panel de administración.' });
  }
  next();
}

// Get all codes and dashboard statistics
router.get('/codes', requireAdmin, (req, res) => {
  try {
    const rawCodes = storage.getCodes();
    const now = new Date();

    const formattedCodes = rawCodes.map(item => {
      let isExpired = false;
      let daysRemaining = null;

      if (item.isClaimed && item.expiresAt) {
        const expiresDate = new Date(item.expiresAt);
        if (now > expiresDate) {
          isExpired = true;
          daysRemaining = 0;
        } else {
          daysRemaining = Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24));
        }
      }

      return {
        ...item,
        isExpired,
        daysRemaining: item.isClaimed ? daysRemaining : item.durationDays,
        status: !item.isClaimed ? 'DISPONIBLE' : (isExpired ? 'EXPIRADO' : 'ACTIVO')
      };
    });

    const totalCount = formattedCodes.length;
    const claimedCount = formattedCodes.filter(c => c.isClaimed && !c.isExpired).length;
    const unclaimedCount = formattedCodes.filter(c => !c.isClaimed).length;
    const expiredCount = formattedCodes.filter(c => c.isExpired).length;

    return res.json({
      success: true,
      stats: {
        total: totalCount,
        active: claimedCount,
        available: unclaimedCount,
        expired: expiredCount,
        claimRate: totalCount > 0 ? Math.round(((claimedCount + expiredCount) / totalCount) * 100) : 0
      },
      codes: formattedCodes
    });
  } catch (error) {
    console.error('Error fetching admin codes:', error);
    return res.status(500).json({ success: false, message: 'Error al consultar códigos.' });
  }
});

// Create a single custom code
router.post('/codes/create', requireAdmin, (req, res) => {
  try {
    const { code, durationDays, label } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'El código es requerido.' });
    }

    const created = storage.createCode({
      code,
      durationDays: parseInt(durationDays, 10) || 30,
      label: label || 'Código Individual'
    });

    return res.json({ success: true, code: created, message: 'Código creado con éxito.' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// Generate batch of random non-repeating codes (10, 30, 50, 100, etc.)
router.post('/codes/batch', requireAdmin, (req, res) => {
  try {
    const { count = 30, durationDays = 30, prefix = 'VIP' } = req.body;
    const countNum = Math.min(200, Math.max(1, parseInt(count, 10) || 10));
    const durationNum = parseInt(durationDays, 10) || 30;

    const generated = storage.generateBatchCodes({
      count: countNum,
      durationDays: durationNum,
      prefix: prefix.trim() || 'VIP'
    });

    return res.json({
      success: true,
      count: generated.length,
      durationDays: durationNum,
      codes: generated,
      message: `¡Se han generado exitosamente ${generated.length} códigos VIP de ${durationNum} días!`
    });
  } catch (error) {
    console.error('Error generating batch codes:', error);
    return res.status(500).json({ success: false, message: 'Error al generar lote de códigos.' });
  }
});

// Delete code
router.delete('/codes/:code', requireAdmin, (req, res) => {
  try {
    const { code } = req.params;
    storage.deleteCode(code);
    return res.json({ success: true, message: `Código ${code} eliminado.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Revoke code immediately
router.post('/codes/:code/revoke', requireAdmin, (req, res) => {
  try {
    const { code } = req.params;
    storage.revokeCode(code);
    return res.json({ success: true, message: `Código ${code} revocado.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Clear AI analysis cache
router.post('/cache/clear', requireAdmin, (req, res) => {
  try {
    storage.clearAiCache();
    return res.json({ success: true, message: 'Caché de análisis de IA limpiada.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

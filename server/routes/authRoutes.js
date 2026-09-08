import express from 'express';
import { CONFIG } from '../config.js';
import { storage } from '../storage.js';

const router = express.Router();

// Verify user code or Master Admin code
router.post('/verify-code', (req, res) => {
  try {
    const { code, username } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Por favor ingresa un código de acceso.' });
    }

    const cleanCode = code.trim();
    const cleanUsername = (typeof username === 'string' && username.trim()) ? username.trim() : '';

    // 1. Check if Master Admin / Owner Code
    if (cleanCode === CONFIG.MASTER_ADMIN_CODE) {
      return res.json({
        success: true,
        isAdmin: true,
        role: 'owner',
        user: {
          code: CONFIG.MASTER_ADMIN_CODE,
          name: cleanUsername || 'Owner / Administrador VIP',
          username: cleanUsername || 'Owner',
          isOwner: true,
          expiresAt: null,
          daysRemaining: 9999,
          plan: 'Owner Master Access'
        },
        message: `¡Bienvenido al Panel Maestro${cleanUsername ? ', ' + cleanUsername : ''}!`
      });
    }

    // 2. Regular VIP Code Claim / Validation
    const result = storage.claimCode(cleanCode, cleanUsername);
    if (!result.success) {
      return res.status(401).json({
        success: false,
        isAdmin: false,
        message: result.message || 'Código VIP inválido o expirado.',
        expired: result.expired || false
      });
    }

    const userDisplayName = result.claimedBy || cleanUsername || 'Usuario VIP';

    return res.json({
      success: true,
      isAdmin: false,
      role: 'vip_user',
      user: {
        code: result.code,
        name: userDisplayName,
        username: userDisplayName,
        durationDays: result.durationDays,
        claimedAt: result.claimedAt,
        expiresAt: result.expiresAt,
        daysRemaining: result.daysRemaining,
        plan: `VIP Pass (${result.durationDays} Días)`
      },
      message: result.alreadyClaimed
        ? `¡Hola de nuevo, ${userDisplayName}! Te quedan ${result.daysRemaining} días.`
        : `¡Bienvenido, ${userDisplayName}! Tienes ${result.durationDays} días de acceso total.`
    });
  } catch (error) {
    console.error('Error in /verify-code:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor al verificar código.' });
  }
});

// Guest / Free Exploration Login
router.post('/guest-login', (req, res) => {
  try {
    const { username } = req.body;
    const cleanUsername = (typeof username === 'string' && username.trim()) ? username.trim() : 'Invitado';

    return res.json({
      success: true,
      isGuest: true,
      isAdmin: false,
      role: 'guest',
      user: {
        code: 'GUEST-FREE',
        name: cleanUsername,
        username: cleanUsername,
        isGuest: true,
        durationDays: 999,
        daysRemaining: 'Free',
        plan: 'Pase Invitado (Demo Gratuita)'
      },
      message: `¡Bienvenido como Invitado, ${cleanUsername}! Disfruta de la plataforma.`
    });
  } catch (error) {
    console.error('Error in /guest-login:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
});

// Check existing session status
router.post('/check-session', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ valid: false });

    if (code === CONFIG.MASTER_ADMIN_CODE) {
      return res.json({
        valid: true,
        isAdmin: true,
        role: 'owner',
        daysRemaining: 9999,
        plan: 'Owner Master Access'
      });
    }

    const codeObj = storage.getCode(code);
    if (!codeObj || !codeObj.isClaimed || !codeObj.expiresAt) {
      return res.json({ valid: false, message: 'Código no activado o inexistente.' });
    }

    const now = new Date();
    const expiresAt = new Date(codeObj.expiresAt);
    if (now > expiresAt) {
      return res.json({ valid: false, expired: true, message: 'Tu suscripción VIP ha vencido.' });
    }

    const daysRemaining = Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)));

    return res.json({
      valid: true,
      isAdmin: false,
      role: 'vip_user',
      daysRemaining,
      claimedAt: codeObj.claimedAt,
      expiresAt: codeObj.expiresAt,
      plan: `VIP Pass (${codeObj.durationDays} Días)`
    });
  } catch {
    return res.status(500).json({ valid: false });
  }
});

export default router;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Template
const INITIAL_DB = {
  codes: [
    {
      code: "VIP-PREMIUM-777",
      durationDays: 30,
      isClaimed: false,
      claimedAt: null,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      label: "Demo VIP Inicial"
    },
    {
      code: "PRO-SOCCER-2026",
      durationDays: 60,
      isClaimed: false,
      claimedAt: null,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      label: "Acceso Pro 60 Días"
    },
    {
      code: "PARLAY-GOLD-99",
      durationDays: 15,
      isClaimed: false,
      claimedAt: null,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      label: "Pase Quincenal"
    }
  ],
  aiCache: {},
  settings: {
    selectedModel: "z-ai/glm-5.2:free",
    openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
    autoAiSync: true,
    lastSync: new Date().toISOString()
  },
  customMatches: []
};

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.save(INITIAL_DB);
    }
  }

  load() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.save(INITIAL_DB);
        return INITIAL_DB;
      }
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading database file, returning default:', e);
      return INITIAL_DB;
    }
  }

  save(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('Error writing to database:', e);
      return false;
    }
  }

  // --- ACCESS CODES METHODS ---
  getCodes() {
    const db = this.load();
    return db.codes || [];
  }

  getCode(codeString) {
    const db = this.load();
    return (db.codes || []).find(c => c.code.toUpperCase() === codeString.trim().toUpperCase());
  }

  createCode({ code, durationDays = 30, label = 'VIP Code' }) {
    const db = this.load();
    const existing = db.codes.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (existing) {
      throw new Error('El código ya existe.');
    }
    const newEntry = {
      code: code.toUpperCase().trim(),
      durationDays: parseInt(durationDays, 10) || 30,
      isClaimed: false,
      claimedAt: null,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      label
    };
    db.codes.unshift(newEntry);
    this.save(db);
    return newEntry;
  }

  generateBatchCodes({ count = 10, durationDays = 30, prefix = 'VIP' }) {
    const db = this.load();
    const created = [];
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    for (let i = 0; i < count; i++) {
      let code;
      let attempts = 0;
      do {
        let randomPart = '';
        for (let j = 0; j < 8; j++) {
          randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        // Format: VIP-ABCD-1234
        code = `${prefix}-${randomPart.slice(0, 4)}-${randomPart.slice(4)}`.toUpperCase();
        attempts++;
      } while (db.codes.some(c => c.code === code) && attempts < 100);

      const entry = {
        code,
        durationDays: parseInt(durationDays, 10) || 30,
        isClaimed: false,
        claimedAt: null,
        expiresAt: null,
        createdAt: new Date().toISOString(),
        label: `Lote ${prefix} (${durationDays}d)`
      };

      db.codes.unshift(entry);
      created.push(entry);
    }

    this.save(db);
    return created;
  }

  claimCode(codeString, username = '') {
    const db = this.load();
    const clean = codeString.trim().toUpperCase();
    const index = db.codes.findIndex(c => c.code === clean);
    if (index === -1) return { success: false, message: 'Código no encontrado o inválido.' };

    const item = db.codes[index];

    // If already claimed, check if still valid
    if (item.isClaimed) {
      const expiresAtDate = new Date(item.expiresAt);
      const now = new Date();
      if (now > expiresAtDate) {
        return { success: false, message: 'Este código VIP ha expirado.', expired: true };
      }
      return {
        success: true,
        alreadyClaimed: true,
        code: item.code,
        durationDays: item.durationDays,
        claimedAt: item.claimedAt,
        expiresAt: item.expiresAt,
        claimedBy: item.claimedBy || username || 'Usuario VIP',
        daysRemaining: Math.ceil((expiresAtDate - now) / (1000 * 60 * 60 * 24))
      };
    }

    // First time claiming: activate duration
    const now = new Date();
    const expiresAt = new Date(now.getTime() + item.durationDays * 24 * 60 * 60 * 1000).toISOString();

    item.isClaimed = true;
    item.claimedAt = now.toISOString();
    item.expiresAt = expiresAt;
    item.claimedBy = username?.trim() || 'Usuario VIP';

    db.codes[index] = item;
    this.save(db);

    return {
      success: true,
      alreadyClaimed: false,
      code: item.code,
      durationDays: item.durationDays,
      claimedAt: item.claimedAt,
      expiresAt: item.expiresAt,
      claimedBy: item.claimedBy,
      daysRemaining: item.durationDays
    };
  }

  deleteCode(codeString) {
    const db = this.load();
    const clean = codeString.trim().toUpperCase();
    db.codes = db.codes.filter(c => c.code !== clean);
    this.save(db);
    return true;
  }

  revokeCode(codeString) {
    const db = this.load();
    const clean = codeString.trim().toUpperCase();
    const item = db.codes.find(c => c.code === clean);
    if (item) {
      item.isClaimed = true;
      item.expiresAt = new Date(Date.now() - 1000).toISOString(); // Expired now
      this.save(db);
      return true;
    }
    return false;
  }

  // --- AI CACHE METHODS ---
  getCachedAnalysis(matchId) {
    const db = this.load();
    return db.aiCache ? db.aiCache[matchId] : null;
  }

  saveCachedAnalysis(matchId, analysisData) {
    const db = this.load();
    if (!db.aiCache) db.aiCache = {};
    db.aiCache[matchId] = {
      ...analysisData,
      cachedAt: new Date().toISOString()
    };
    this.save(db);
  }

  clearAiCache() {
    const db = this.load();
    db.aiCache = {};
    this.save(db);
    return true;
  }

  // --- SETTINGS METHODS ---
  getSettings() {
    const db = this.load();
    return db.settings || {};
  }

  updateSettings(newSettings) {
    const db = this.load();
    db.settings = { ...db.settings, ...newSettings };
    this.save(db);
    return db.settings;
  }
}

export const storage = new StorageManager();

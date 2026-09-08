import express from 'express';
import { calculateParlay, getAiDailyParlay } from '../services/parlayEngine.js';
import { generateMatches } from '../services/footballDataService.js';

const router = express.Router();

// Get AI Daily curated Parlays (Banker & High Yield)
router.get('/daily-ai', (req, res) => {
  try {
    const matches = generateMatches();
    const parlays = getAiDailyParlay(matches);
    return res.json({ success: true, ...parlays });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Calculate custom parlay payout and odds
router.post('/calculate', (req, res) => {
  try {
    const { legs = [], stake = 100 } = req.body;
    const result = calculateParlay(legs, parseFloat(stake) || 100);
    return res.json({ success: true, calculation: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

export default router;

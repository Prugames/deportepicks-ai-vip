import express from 'express';
import { generateMatches, LEAGUES, getLeagueStandings, syncRealFootballData, enrichMatchWithRealData } from '../services/footballDataService.js';
import { generateAiMatchReport } from '../services/aiService.js';

const router = express.Router();

// Get list of supported leagues with match count
router.get('/leagues', (req, res) => {
  try {
    const matches = generateMatches();
    const leaguesWithCount = LEAGUES.map(league => {
      const matchCount = matches.filter(m => m.leagueId === league.id).length;
      return {
        ...league,
        matchCount
      };
    });
    return res.json({ success: true, leagues: leaguesWithCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Live Polling / Real-time status sync endpoint
router.get('/live-sync', (req, res) => {
  try {
    const matches = generateMatches();
    const liveMatches = matches.filter(m => m.status === 'LIVE');
    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      liveCount: liveMatches.length,
      matches: matches
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get matches with filters
router.get('/', (req, res) => {
  try {
    const { league, timeframe, status, search } = req.query;
    let matches = generateMatches();

    // Filter by league
    if (league && league !== 'all') {
      matches = matches.filter(m => m.leagueId.toLowerCase() === league.toLowerCase());
    }

    // Filter by timeframe: 'today' | 'tomorrow' | 'all' (dynamically evaluated against current execution date)
    if (timeframe && timeframe !== 'all') {
      const now = new Date();
      const todayY = now.getUTCFullYear();
      const todayM = now.getUTCMonth();
      const todayD = now.getUTCDate();

      const tom = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomY = tom.getUTCFullYear();
      const tomM = tom.getUTCMonth();
      const tomD = tom.getUTCDate();

      matches = matches.filter(m => {
        if (!m.kickoff) return false;
        const kd = new Date(m.kickoff);
        const ky = kd.getUTCFullYear();
        const km = kd.getUTCMonth();
        const kdDay = kd.getUTCDate();

        if (timeframe === 'today') {
          return ky === todayY && km === todayM && kdDay === todayD;
        }
        if (timeframe === 'tomorrow') {
          return ky === tomY && km === tomM && kdDay === tomD;
        }
        return true;
      });
    }

    // Filter by match status: 'LIVE' | 'SCHEDULED' | 'FINISHED'
    if (status && status !== 'all') {
      matches = matches.filter(m => m.status === status.toUpperCase());
    }

    // Filter by search query
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      matches = matches.filter(m =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.leagueName.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get real standings for a league or all leagues
router.get('/standings', (req, res) => {
  try {
    const { league } = req.query;
    const standings = getLeagueStandings(league);
    return res.json({ success: true, standings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Force sync with live sports APIs
router.post('/sync', async (req, res) => {
  try {
    const result = await syncRealFootballData(true);
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get single match by ID (enriched with real ESPN summary and live stats)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const matches = generateMatches();
    let match = matches.find(m => m.id === id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Partido no encontrado.' });
    }
    match = await enrichMatchWithRealData(match);
    return res.json({ success: true, match });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Generate or retrieve deep AI analysis for a match
router.post('/:id/ai-analysis', async (req, res) => {
  try {
    const { id } = req.params;
    const { forceRefresh = false } = req.body;
    const matches = generateMatches();
    let match = matches.find(m => m.id === id);

    if (!match) {
      return res.status(404).json({ success: false, message: 'Partido no encontrado.' });
    }

    match = await enrichMatchWithRealData(match);
    const aiReport = await generateAiMatchReport(match, forceRefresh);

    return res.json({
      success: true,
      matchId: id,
      report: aiReport
    });
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar pronóstico de IA.'
    });
  }
});

export default router;

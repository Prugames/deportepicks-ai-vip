const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'server', 'services', 'footballDataService.js');
let code = fs.readFileSync(targetPath, 'utf8');

const h2hMap = {
  "esp-01": [
    { date: "2025-09-29", competition: "LaLiga", home: "Atlético Madrid", away: "Real Madrid", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 11, yellowCards: 6, totalFouls: 26 },
    { date: "2025-02-04", competition: "LaLiga", home: "Real Madrid", away: "Atlético Madrid", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 9, yellowCards: 5, totalFouls: 22 },
    { date: "2025-01-18", competition: "Copa del Rey", home: "Atlético Madrid", away: "Real Madrid", score: "4 - 2", winner: "ATM", btts: true, totalCorners: 13, yellowCards: 8, totalFouls: 31 },
    { date: "2025-01-10", competition: "Supercopa", home: "Real Madrid", away: "Atlético Madrid", score: "5 - 3", winner: "RMA", btts: true, totalCorners: 10, yellowCards: 4, totalFouls: 20 },
    { date: "2024-09-24", competition: "LaLiga", home: "Atlético Madrid", away: "Real Madrid", score: "3 - 1", winner: "ATM", btts: true, totalCorners: 12, yellowCards: 6, totalFouls: 28 },
    { date: "2024-02-25", competition: "LaLiga", home: "Real Madrid", away: "Atlético Madrid", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 11, yellowCards: 5, totalFouls: 24 },
    { date: "2024-01-26", competition: "Copa del Rey", home: "Real Madrid", away: "Atlético Madrid", score: "3 - 1", winner: "RMA", btts: true, totalCorners: 14, yellowCards: 7, totalFouls: 29 },
    { date: "2023-09-18", competition: "LaLiga", home: "Atlético Madrid", away: "Real Madrid", score: "1 - 2", winner: "RMA", btts: true, totalCorners: 8, yellowCards: 6, totalFouls: 25 },
    { date: "2023-05-08", competition: "LaLiga", home: "Atlético Madrid", away: "Real Madrid", score: "1 - 0", winner: "ATM", btts: false, totalCorners: 10, yellowCards: 5, totalFouls: 21 },
    { date: "2022-12-12", competition: "LaLiga", home: "Real Madrid", away: "Atlético Madrid", score: "2 - 0", winner: "RMA", btts: false, totalCorners: 9, yellowCards: 4, totalFouls: 18 }
  ],
  "eng-01": [
    { date: "2025-11-10", competition: "Premier League", home: "Chelsea", away: "Arsenal", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 11, yellowCards: 7, totalFouls: 27 },
    { date: "2025-04-23", competition: "Premier League", home: "Arsenal", away: "Chelsea", score: "5 - 0", winner: "ARS", btts: false, totalCorners: 13, yellowCards: 3, totalFouls: 19 },
    { date: "2024-10-21", competition: "Premier League", home: "Chelsea", away: "Arsenal", score: "2 - 2", winner: "Draw", btts: true, totalCorners: 10, yellowCards: 6, totalFouls: 24 },
    { date: "2024-05-02", competition: "Premier League", home: "Arsenal", away: "Chelsea", score: "3 - 1", winner: "ARS", btts: true, totalCorners: 12, yellowCards: 4, totalFouls: 20 },
    { date: "2023-11-06", competition: "Premier League", home: "Chelsea", away: "Arsenal", score: "0 - 1", winner: "ARS", btts: false, totalCorners: 9, yellowCards: 5, totalFouls: 25 },
    { date: "2023-04-20", competition: "Premier League", home: "Chelsea", away: "Arsenal", score: "2 - 4", winner: "ARS", btts: true, totalCorners: 11, yellowCards: 4, totalFouls: 22 },
    { date: "2022-08-22", competition: "Premier League", home: "Arsenal", away: "Chelsea", score: "0 - 2", winner: "CHE", btts: false, totalCorners: 10, yellowCards: 3, totalFouls: 18 },
    { date: "2022-05-12", competition: "Premier League", home: "Chelsea", away: "Arsenal", score: "0 - 1", winner: "ARS", btts: false, totalCorners: 8, yellowCards: 2, totalFouls: 19 },
    { date: "2021-12-26", competition: "Premier League", home: "Arsenal", away: "Chelsea", score: "3 - 1", winner: "ARS", btts: true, totalCorners: 11, yellowCards: 4, totalFouls: 23 },
    { date: "2021-08-01", competition: "Friendly Cup", home: "Arsenal", away: "Chelsea", score: "1 - 2", winner: "CHE", btts: true, totalCorners: 10, yellowCards: 3, totalFouls: 17 }
  ],
  "mex-00": [
    { date: "2025-08-20", competition: "Liga MX", home: "Toluca", away: "Pachuca", score: "2 - 3", winner: "PAC", btts: true, totalCorners: 12, yellowCards: 5, totalFouls: 26 },
    { date: "2025-03-30", competition: "Liga MX", home: "Pachuca", away: "Toluca", score: "5 - 4", winner: "PAC", btts: true, totalCorners: 14, yellowCards: 6, totalFouls: 24 },
    { date: "2024-09-03", competition: "Liga MX", home: "Toluca", away: "Pachuca", score: "5 - 0", winner: "TOL", btts: false, totalCorners: 10, yellowCards: 4, totalFouls: 20 },
    { date: "2024-03-19", competition: "Liga MX", home: "Pachuca", away: "Toluca", score: "1 - 2", winner: "TOL", btts: true, totalCorners: 11, yellowCards: 5, totalFouls: 25 },
    { date: "2023-10-27", competition: "Liga MX", home: "Toluca", away: "Pachuca", score: "1 - 4", winner: "PAC", btts: true, totalCorners: 13, yellowCards: 6, totalFouls: 28 },
    { date: "2023-02-19", competition: "Liga MX", home: "Pachuca", away: "Toluca", score: "1 - 2", winner: "TOL", btts: true, totalCorners: 9, yellowCards: 4, totalFouls: 22 },
    { date: "2022-10-30", competition: "Liga MX Final", home: "Pachuca", away: "Toluca", score: "3 - 1", winner: "PAC", btts: true, totalCorners: 12, yellowCards: 7, totalFouls: 30 },
    { date: "2022-10-27", competition: "Liga MX Final", home: "Toluca", away: "Pachuca", score: "1 - 5", winner: "PAC", btts: true, totalCorners: 10, yellowCards: 5, totalFouls: 25 },
    { date: "2022-08-28", competition: "Liga MX", home: "Toluca", away: "Pachuca", score: "1 - 4", winner: "PAC", btts: true, totalCorners: 11, yellowCards: 6, totalFouls: 27 },
    { date: "2022-03-13", competition: "Liga MX", home: "Toluca", away: "Pachuca", score: "0 - 3", winner: "PAC", btts: false, totalCorners: 8, yellowCards: 3, totalFouls: 19 }
  ],
  "mex-01": [
    { date: "2025-09-14", competition: "Liga MX", home: "Club América", away: "Chivas", score: "1 - 0", winner: "AME", btts: false, totalCorners: 10, yellowCards: 7, totalFouls: 31 },
    { date: "2025-05-18", competition: "Liguilla Semis", home: "Club América", away: "Chivas", score: "1 - 0", winner: "AME", btts: false, totalCorners: 9, yellowCards: 6, totalFouls: 29 },
    { date: "2025-05-15", competition: "Liguilla Semis", home: "Chivas", away: "Club América", score: "0 - 0", winner: "Draw", btts: false, totalCorners: 8, yellowCards: 5, totalFouls: 26 },
    { date: "2025-03-16", competition: "Liga MX", home: "Chivas", away: "Club América", score: "0 - 0", winner: "Draw", btts: false, totalCorners: 11, yellowCards: 8, totalFouls: 34 },
    { date: "2025-03-13", competition: "Concacaf Champions", home: "Club América", away: "Chivas", score: "2 - 3", winner: "GDL", btts: true, totalCorners: 12, yellowCards: 7, totalFouls: 28 },
    { date: "2025-03-06", competition: "Concacaf Champions", home: "Chivas", away: "Club América", score: "0 - 3", winner: "AME", btts: false, totalCorners: 9, yellowCards: 6, totalFouls: 25 },
    { date: "2024-09-16", competition: "Liga MX", home: "Club América", away: "Chivas", score: "4 - 0", winner: "AME", btts: false, totalCorners: 13, yellowCards: 4, totalFouls: 22 },
    { date: "2024-05-21", competition: "Liguilla Semis", home: "Club América", away: "Chivas", score: "1 - 3", winner: "GDL", btts: true, totalCorners: 10, yellowCards: 5, totalFouls: 27 },
    { date: "2024-05-18", competition: "Liguilla Semis", home: "Chivas", away: "Club América", score: "0 - 1", winner: "AME", btts: false, totalCorners: 8, yellowCards: 6, totalFouls: 24 },
    { date: "2024-03-18", competition: "Liga MX", home: "Chivas", away: "Club América", score: "2 - 4", winner: "AME", btts: true, totalCorners: 12, yellowCards: 9, totalFouls: 33 }
  ],
  "mls-01": [
    { date: "2025-02-25", competition: "MLS", home: "LA Galaxy", away: "Inter Miami", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 12, yellowCards: 7, totalFouls: 24 },
    { date: "2024-08-11", competition: "Leagues Cup", home: "Inter Miami", away: "LA Galaxy", score: "3 - 2", winner: "MIA", btts: true, totalCorners: 14, yellowCards: 5, totalFouls: 22 },
    { date: "2024-02-26", competition: "MLS", home: "LA Galaxy", away: "Inter Miami", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 11, yellowCards: 6, totalFouls: 25 },
    { date: "2023-08-05", competition: "MLS", home: "Inter Miami", away: "LA Galaxy", score: "2 - 1", winner: "MIA", btts: true, totalCorners: 10, yellowCards: 4, totalFouls: 20 },
    { date: "2022-09-18", competition: "MLS", home: "LA Galaxy", away: "Inter Miami", score: "3 - 1", winner: "LAG", btts: true, totalCorners: 13, yellowCards: 5, totalFouls: 23 },
    { date: "2021-04-18", competition: "MLS", home: "Inter Miami", away: "LA Galaxy", score: "2 - 3", winner: "LAG", btts: true, totalCorners: 12, yellowCards: 4, totalFouls: 21 },
    { date: "2020-10-28", competition: "MLS", home: "LA Galaxy", away: "Inter Miami", score: "1 - 2", winner: "MIA", btts: true, totalCorners: 9, yellowCards: 5, totalFouls: 26 },
    { date: "2020-03-01", competition: "MLS", home: "LA Galaxy", away: "Inter Miami", score: "1 - 0", winner: "LAG", btts: false, totalCorners: 10, yellowCards: 3, totalFouls: 19 },
    { date: "2019-08-20", competition: "Exhibition", home: "LA Galaxy", away: "Inter Miami", score: "2 - 2", winner: "Draw", btts: true, totalCorners: 11, yellowCards: 2, totalFouls: 15 },
    { date: "2018-07-15", competition: "Club Friendly", home: "LA Galaxy", away: "Inter Miami Academy", score: "3 - 1", winner: "LAG", btts: true, totalCorners: 8, yellowCards: 2, totalFouls: 14 }
  ],
  "ita-01": [
    { date: "2025-10-27", competition: "Serie A", home: "Inter", away: "Juventus", score: "4 - 4", winner: "Draw", btts: true, totalCorners: 11, yellowCards: 4, totalFouls: 24 },
    { date: "2025-02-04", competition: "Serie A", home: "Inter", away: "Juventus", score: "1 - 0", winner: "INT", btts: false, totalCorners: 9, yellowCards: 5, totalFouls: 28 },
    { date: "2024-11-26", competition: "Serie A", home: "Juventus", away: "Inter", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 8, yellowCards: 6, totalFouls: 30 },
    { date: "2024-04-26", competition: "Coppa Italia", home: "Inter", away: "Juventus", score: "1 - 0", winner: "INT", btts: false, totalCorners: 10, yellowCards: 4, totalFouls: 26 },
    { date: "2024-04-04", competition: "Coppa Italia", home: "Juventus", away: "Inter", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 9, yellowCards: 8, totalFouls: 32 },
    { date: "2024-03-19", competition: "Serie A", home: "Inter", away: "Juventus", score: "0 - 1", winner: "JUV", btts: false, totalCorners: 12, yellowCards: 6, totalFouls: 29 },
    { date: "2023-11-06", competition: "Serie A", home: "Juventus", away: "Inter", score: "2 - 0", winner: "JUV", btts: false, totalCorners: 7, yellowCards: 5, totalFouls: 27 },
    { date: "2023-05-11", competition: "Coppa Italia Final", home: "Juventus", away: "Inter", score: "2 - 4", winner: "INT", btts: true, totalCorners: 13, yellowCards: 7, totalFouls: 35 },
    { date: "2023-04-03", competition: "Serie A", home: "Juventus", away: "Inter", score: "0 - 1", winner: "INT", btts: false, totalCorners: 11, yellowCards: 6, totalFouls: 31 },
    { date: "2022-10-24", competition: "Serie A", home: "Inter", away: "Juventus", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 10, yellowCards: 5, totalFouls: 28 }
  ],
  "fra-01": [
    { date: "2025-10-27", competition: "Ligue 1", home: "Marseille", away: "PSG", score: "0 - 3", winner: "PSG", btts: false, totalCorners: 10, yellowCards: 4, totalFouls: 23 },
    { date: "2025-03-31", competition: "Ligue 1", home: "Marseille", away: "PSG", score: "0 - 2", winner: "PSG", btts: false, totalCorners: 9, yellowCards: 6, totalFouls: 27 },
    { date: "2024-09-24", competition: "Ligue 1", home: "PSG", away: "Marseille", score: "4 - 0", winner: "PSG", btts: false, totalCorners: 12, yellowCards: 5, totalFouls: 24 },
    { date: "2024-02-26", competition: "Ligue 1", home: "Marseille", away: "PSG", score: "0 - 3", winner: "PSG", btts: false, totalCorners: 11, yellowCards: 3, totalFouls: 20 },
    { date: "2024-02-08", competition: "Coupe de France", home: "Marseille", away: "PSG", score: "2 - 1", winner: "OM", btts: true, totalCorners: 13, yellowCards: 7, totalFouls: 32 },
    { date: "2023-10-16", competition: "Ligue 1", home: "PSG", away: "Marseille", score: "1 - 0", winner: "PSG", btts: false, totalCorners: 10, yellowCards: 4, totalFouls: 25 },
    { date: "2023-04-17", competition: "Ligue 1", home: "PSG", away: "Marseille", score: "2 - 1", winner: "PSG", btts: true, totalCorners: 9, yellowCards: 6, totalFouls: 28 },
    { date: "2022-10-24", competition: "Ligue 1", home: "Marseille", away: "PSG", score: "0 - 0", winner: "Draw", btts: false, totalCorners: 8, yellowCards: 5, totalFouls: 26 },
    { date: "2022-02-07", competition: "Ligue 1", home: "Marseille", away: "PSG", score: "0 - 2", winner: "PSG", btts: false, totalCorners: 11, yellowCards: 7, totalFouls: 30 },
    { date: "2021-09-13", competition: "Ligue 1", home: "PSG", away: "Marseille", score: "0 - 1", winner: "OM", btts: false, totalCorners: 7, yellowCards: 12, totalFouls: 36 }
  ],
  "ucl-01": [
    { date: "2024-07-26", competition: "Club Friendly", home: "Bayern München", away: "Manchester City", score: "1 - 2", winner: "MCI", btts: true, totalCorners: 11, yellowCards: 3, totalFouls: 18 },
    { date: "2023-04-19", competition: "Champions League", home: "Bayern München", away: "Manchester City", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 10, yellowCards: 6, totalFouls: 24 },
    { date: "2023-04-11", competition: "Champions League", home: "Manchester City", away: "Bayern München", score: "3 - 0", winner: "MCI", btts: false, totalCorners: 12, yellowCards: 4, totalFouls: 20 },
    { date: "2022-07-24", competition: "Preseason Cup", home: "Bayern München", away: "Manchester City", score: "0 - 1", winner: "MCI", btts: false, totalCorners: 9, yellowCards: 2, totalFouls: 16 },
    { date: "2018-07-29", competition: "ICC", home: "Bayern München", away: "Manchester City", score: "2 - 3", winner: "MCI", btts: true, totalCorners: 11, yellowCards: 4, totalFouls: 22 },
    { date: "2016-07-20", competition: "Friendly", home: "Bayern München", away: "Manchester City", score: "1 - 0", winner: "BAY", btts: false, totalCorners: 8, yellowCards: 2, totalFouls: 15 },
    { date: "2014-11-25", competition: "Champions League", home: "Manchester City", away: "Bayern München", score: "3 - 2", winner: "MCI", btts: true, totalCorners: 10, yellowCards: 5, totalFouls: 23 },
    { date: "2014-09-17", competition: "Champions League", home: "Bayern München", away: "Manchester City", score: "1 - 0", winner: "BAY", btts: false, totalCorners: 13, yellowCards: 3, totalFouls: 19 },
    { date: "2013-12-10", competition: "Champions League", home: "Bayern München", away: "Manchester City", score: "2 - 3", winner: "MCI", btts: true, totalCorners: 11, yellowCards: 4, totalFouls: 21 },
    { date: "2013-10-02", competition: "Champions League", home: "Manchester City", away: "Bayern München", score: "1 - 3", winner: "BAY", btts: true, totalCorners: 12, yellowCards: 6, totalFouls: 25 }
  ],
  "esp-02": [
    { date: "2025-08-24", competition: "LaLiga", home: "Barcelona", away: "Athletic Club", score: "2 - 1", winner: "BAR", btts: true, totalCorners: 12, yellowCards: 5, totalFouls: 25 },
    { date: "2025-03-03", competition: "LaLiga", home: "Athletic Club", away: "Barcelona", score: "0 - 0", winner: "Draw", btts: false, totalCorners: 9, yellowCards: 4, totalFouls: 28 },
    { date: "2025-01-24", competition: "Copa del Rey", home: "Athletic Club", away: "Barcelona", score: "4 - 2", winner: "ATH", btts: true, totalCorners: 13, yellowCards: 7, totalFouls: 34 },
    { date: "2024-10-22", competition: "LaLiga", home: "Barcelona", away: "Athletic Club", score: "1 - 0", winner: "BAR", btts: false, totalCorners: 10, yellowCards: 3, totalFouls: 21 },
    { date: "2024-03-12", competition: "LaLiga", home: "Athletic Club", away: "Barcelona", score: "0 - 1", winner: "BAR", btts: false, totalCorners: 11, yellowCards: 5, totalFouls: 27 },
    { date: "2023-10-23", competition: "LaLiga", home: "Barcelona", away: "Athletic Club", score: "4 - 0", winner: "BAR", btts: false, totalCorners: 8, yellowCards: 4, totalFouls: 19 },
    { date: "2023-02-27", competition: "LaLiga", home: "Barcelona", away: "Athletic Club", score: "4 - 0", winner: "BAR", btts: false, totalCorners: 10, yellowCards: 2, totalFouls: 17 },
    { date: "2022-01-20", competition: "Copa del Rey", home: "Athletic Club", away: "Barcelona", score: "3 - 2", winner: "ATH", btts: true, totalCorners: 14, yellowCards: 6, totalFouls: 31 },
    { date: "2021-08-21", competition: "LaLiga", home: "Athletic Club", away: "Barcelona", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 11, yellowCards: 5, totalFouls: 26 },
    { date: "2021-04-17", competition: "Copa del Rey Final", home: "Athletic Club", away: "Barcelona", score: "0 - 4", winner: "BAR", btts: false, totalCorners: 9, yellowCards: 3, totalFouls: 20 }
  ],
  "eng-02": [
    { date: "2025-12-01", competition: "Premier League", home: "Liverpool", away: "Manchester City", score: "2 - 0", winner: "LIV", btts: false, totalCorners: 11, yellowCards: 4, totalFouls: 22 },
    { date: "2025-03-10", competition: "Premier League", home: "Liverpool", away: "Manchester City", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 12, yellowCards: 3, totalFouls: 20 },
    { date: "2024-11-25", competition: "Premier League", home: "Manchester City", away: "Liverpool", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 10, yellowCards: 5, totalFouls: 24 },
    { date: "2024-04-01", competition: "Premier League", home: "Manchester City", away: "Liverpool", score: "4 - 1", winner: "MCI", btts: true, totalCorners: 9, yellowCards: 4, totalFouls: 21 },
    { date: "2023-12-22", competition: "EFL Cup", home: "Manchester City", away: "Liverpool", score: "3 - 2", winner: "MCI", btts: true, totalCorners: 13, yellowCards: 5, totalFouls: 26 },
    { date: "2023-10-16", competition: "Premier League", home: "Liverpool", away: "Manchester City", score: "1 - 0", winner: "LIV", btts: false, totalCorners: 10, yellowCards: 6, totalFouls: 25 },
    { date: "2023-07-30", competition: "Community Shield", home: "Liverpool", away: "Manchester City", score: "3 - 1", winner: "LIV", btts: true, totalCorners: 11, yellowCards: 3, totalFouls: 18 },
    { date: "2023-04-16", competition: "FA Cup Semis", home: "Manchester City", away: "Liverpool", score: "2 - 3", winner: "LIV", btts: true, totalCorners: 12, yellowCards: 7, totalFouls: 28 },
    { date: "2023-04-10", competition: "Premier League", home: "Manchester City", away: "Liverpool", score: "2 - 2", winner: "Draw", btts: true, totalCorners: 14, yellowCards: 5, totalFouls: 23 },
    { date: "2022-10-03", competition: "Premier League", home: "Liverpool", away: "Manchester City", score: "2 - 2", winner: "Draw", btts: true, totalCorners: 10, yellowCards: 6, totalFouls: 27 }
  ],
  "lc-01": [
    { date: "2024-08-09", competition: "Leagues Cup", home: "Tigres", away: "Seattle Sounders", score: "2 - 1", winner: "TIG", btts: true, totalCorners: 10, yellowCards: 5, totalFouls: 26 },
    { date: "2021-08-10", competition: "Leagues Cup", home: "Seattle Sounders", away: "Tigres", score: "3 - 0", winner: "SEA", btts: false, totalCorners: 8, yellowCards: 4, totalFouls: 22 },
    { date: "2019-07-24", competition: "Club Friendly", home: "Tigres", away: "Seattle Sounders", score: "1 - 1", winner: "Draw", btts: true, totalCorners: 9, yellowCards: 3, totalFouls: 18 },
    { date: "2013-03-12", competition: "Concacaf Champions", home: "Seattle Sounders", away: "Tigres", score: "3 - 1", winner: "SEA", btts: true, totalCorners: 11, yellowCards: 6, totalFouls: 28 },
    { date: "2013-03-06", competition: "Concacaf Champions", home: "Tigres", away: "Seattle Sounders", score: "1 - 0", winner: "TIG", btts: false, totalCorners: 12, yellowCards: 4, totalFouls: 24 },
    { date: "2011-09-15", competition: "Friendly", home: "Seattle Sounders", away: "Tigres", score: "2 - 2", winner: "Draw", btts: true, totalCorners: 10, yellowCards: 3, totalFouls: 19 },
    { date: "2010-07-11", competition: "Summer Tour", home: "Tigres", away: "Seattle Sounders", score: "2 - 1", winner: "TIG", btts: true, totalCorners: 9, yellowCards: 2, totalFouls: 16 },
    { date: "2009-08-25", competition: "Exhibition", home: "Seattle Sounders", away: "Tigres", score: "1 - 2", winner: "TIG", btts: true, totalCorners: 10, yellowCards: 4, totalFouls: 20 },
    { date: "2008-07-18", competition: "Friendly", home: "Tigres", away: "Seattle Sounders", score: "3 - 1", winner: "TIG", btts: true, totalCorners: 11, yellowCards: 3, totalFouls: 17 },
    { date: "2007-06-20", competition: "Friendly", home: "Seattle Sounders", away: "Tigres", score: "0 - 1", winner: "TIG", btts: false, totalCorners: 8, yellowCards: 2, totalFouls: 15 }
  ]
};

for (const [matchId, h2hList] of Object.entries(h2hMap)) {
  const matchRegex = new RegExp(`(id:\\s*"${matchId}"[\\s\\S]*?)(h2h:\\s*\\[[\\s\\S]*?\\])`, 'm');
  const match = code.match(matchRegex);
  if (match) {
    const formatted = 'h2h: ' + JSON.stringify(h2hList, null, 8).replace(/\n/g, '\n      ');
    code = code.replace(match[0], match[1] + formatted);
    console.log(`Updated H2H for match: ${matchId}`);
  } else {
    console.warn(`Could not find regex match for matchId: ${matchId}`);
  }
}

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Done!');

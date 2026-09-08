import './server/index.js';

async function runTests() {
  console.log('--- RUNNING DEPORTEPICKS REAL-TIME TEST SUITE ---');
  await new Promise(r => setTimeout(r, 1200));

  try {
    // 1. Root HTML
    const htmlRes = await fetch('http://localhost:5000/');
    const htmlText = await htmlRes.text();
    console.log('1. Root HTML Status:', htmlRes.status, '| Contains Root Div:', htmlText.includes('root'));
    if (htmlRes.status !== 200 || !htmlText.includes('root')) {
      throw new Error('Root HTML verification failed');
    }

    // 2. Real-time Live Sync Endpoint
    const syncRes = await fetch('http://localhost:5000/api/matches/live-sync');
    const syncData = await syncRes.json();
    console.log('2. Live Sync Endpoint: Live Matches Count =', syncData.liveCount);

    // 3. Status Filtering: Live Matches
    const liveRes = await fetch('http://localhost:5000/api/matches?status=LIVE');
    const liveData = await liveRes.json();
    console.log('3. LIVE In-Play Matches Count:', liveData.matches.length);
    liveData.matches.forEach(m => {
      console.log(`   🔴 [${m.leagueName}] ${m.homeTeam.name} (${m.liveScore?.home}) vs ${m.awayTeam.name} (${m.liveScore?.away}) - Min: ${m.liveMinute}`);
    });

    // 4. Status Filtering: Finished Matches
    const finRes = await fetch('http://localhost:5000/api/matches?status=FINISHED');
    const finData = await finRes.json();
    console.log('4. FINISHED Matches Count:', finData.matches.length);
    finData.matches.slice(0, 3).forEach(m => {
      console.log(`   ✅ [${m.leagueName}] ${m.homeTeam.name} ${m.finalScore?.home}-${m.finalScore?.away} ${m.awayTeam.name} - Pick: ${m.aiPick?.settlement}`);
    });

    // 5. Status Filtering: Scheduled Matches
    const schedRes = await fetch('http://localhost:5000/api/matches?status=SCHEDULED');
    const schedData = await schedRes.json();
    console.log('5. SCHEDULED Upcoming Matches Count:', schedData.matches.length);

    // 6. Dynamic Timeframe Filtering (today vs tomorrow vs all)
    const todayRes = await fetch('http://localhost:5000/api/matches?timeframe=today');
    const todayData = await todayRes.json();
    const tomorrowRes = await fetch('http://localhost:5000/api/matches?timeframe=tomorrow');
    const tomorrowData = await tomorrowRes.json();
    const allRes = await fetch('http://localhost:5000/api/matches?timeframe=all');
    const allData = await allRes.json();
    console.log('6. Dynamic Timeframe: Today =', todayData.matches.length, '| Tomorrow =', tomorrowData.matches.length, '| All =', allData.matches.length);
    if (!Array.isArray(todayData.matches) || !Array.isArray(tomorrowData.matches)) {
      throw new Error('Dynamic timeframe returned non-array matches');
    }

    // 7. Real ESPN H2H Data Verification across matches
    const allMatches = allData.matches || [];
    const matchesWithH2H = allMatches.filter(m => m.h2h && m.h2h.length > 0);
    console.log('7. Matches with Real H2H Records:', matchesWithH2H.length, '/', allMatches.length);
    if (matchesWithH2H.length === 0) {
      throw new Error('No matches found with H2H records!');
    }
    const sampleH2H = matchesWithH2H[0].h2h;
    console.log('   Sample H2H Fixture for', matchesWithH2H[0].homeTeam.name, 'vs', matchesWithH2H[0].awayTeam.name, ':');
    sampleH2H.slice(0, 3).forEach((h, i) => {
      console.log(`      [${i+1}] ${h.date} | ${h.home} vs ${h.away} -> ${h.score} (${h.competition || 'ESPN'})`);
    });

    // Verify H2H dates and scores are diverse and realistic (not sinusoidal or mock constants)
    const distinctDates = new Set(matchesWithH2H.flatMap(m => (m.h2h || []).map(h => h.date)));
    console.log('   Total Distinct Historical H2H Match Dates in Database:', distinctDates.size);
    if (distinctDates.size < 5) {
      throw new Error('H2H dates lack diversity; suspected hardcoded mock data!');
    }

    // 8. Strict VIP Authentication & Security Tests
    console.log('8. Testing Strict VIP Gate Enforcement:');
    // 8a. Empty code rejection
    const emptyRes = await fetch('http://localhost:5000/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '', username: 'Tester' })
    });
    console.log('   8a. Empty code status (expect 400):', emptyRes.status);
    if (emptyRes.status !== 400) throw new Error('Expected 400 for empty code');

    // 8b. Invalid code rejection
    const fakeRes = await fetch('http://localhost:5000/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'INVALID-CODE-999', username: 'Tester' })
    });
    console.log('   8b. Invalid code status (expect 401):', fakeRes.status);
    if (fakeRes.status !== 401) throw new Error('Expected 401 for invalid code');

    // 8c. Master Owner Login ("DeportePicks")
    const ownerRes = await fetch('http://localhost:5000/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'DeportePicks', username: 'Master Admin' })
    });
    const ownerData = await ownerRes.json();
    console.log('   8c. Master Owner Verification:', ownerData.success, '| IsAdmin:', ownerData.isAdmin);
    if (!ownerData.success || !ownerData.isAdmin) {
      throw new Error('Master owner login failed');
    }

    // 9. Admin Batch Generator (30 days)
    const batchRes = await fetch('http://localhost:5000/api/admin/codes/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': 'DeportePicks'
      },
      body: JSON.stringify({ count: 5, durationDays: 30, prefix: 'VIP' })
    });
    const batchData = await batchRes.json();
    console.log('9. Admin Batch Generator:', batchData.count, 'codes created.');
    if (!batchData.success || !batchData.codes?.length) {
      throw new Error('Admin batch code generation failed');
    }

    // 10. Claim Newly Generated VIP Code
    const freshCode = batchData.codes[0].code;
    const claimRes = await fetch('http://localhost:5000/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: freshCode, username: 'Nuevo Miembro VIP' })
    });
    const claimData = await claimRes.json();
    console.log('10. Fresh Code Claimed:', claimData.success, '| Plan:', claimData.user?.plan, '| Days Left:', claimData.user?.daysRemaining);
    if (!claimData.success || claimData.user?.durationDays !== 30) {
      throw new Error('Claim fresh code failed');
    }

    // 11. Real Standings Endpoint Verification
    const stdRes = await fetch('http://localhost:5000/api/matches/standings?league=espana');
    const stdData = await stdRes.json();
    console.log('11. LaLiga Real Standings Count:', stdData.standings?.length, '| Leader:', stdData.standings?.[0]?.team, '| Pts:', stdData.standings?.[0]?.pts);
    if (!stdData.standings || stdData.standings.length < 5) {
      throw new Error('Standings data returned insufficient rows');
    }

    // 12. AI Daily Parlay Endpoint Verification
    const parlayRes = await fetch('http://localhost:5000/api/parlays/daily-ai');
    const parlayData = await parlayRes.json();
    console.log('12. AI Daily Banker Parlay Legs:', parlayData.bankerParlay?.legs?.length, '| Cuota:', parlayData.bankerParlay?.totalDecimalOdds);
    if (!parlayData.bankerParlay?.legs?.length) {
      throw new Error('AI daily parlay generation failed');
    }

    // 13. Deep AI Match Analysis Verification on real fixture
    const sampleMatch = schedData.matches[0] || finData.matches[0];
    const aiRes = await fetch(`http://localhost:5000/api/matches/${sampleMatch.id}/ai-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forceRefresh: false })
    });
    const aiData = await aiRes.json();
    console.log('13. AI Match Analysis:', aiData.success, '| Model:', aiData.report?.modelUsed, '| Pick:', aiData.report?.topPick?.selection);
    if (!aiData.success || !aiData.report) {
      throw new Error('AI Match Analysis failed');
    }

    console.log('\n========================================================================');
    console.log('🎯 ALL 13 REAL-TIME DATA, STATUSES, VIP & AI VERIFICATIONS PASSED 100%!');
    console.log('========================================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();

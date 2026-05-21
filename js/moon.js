// --- Moon Calculations ---
function getMoonSignAndDegree(date) {
  // Reference: Jan 1, 2020, Moon at 15° Pisces = 345° ecliptic longitude
  const ref = new Date(2020, 0, 1, 0, 0, 0);
  const ms = date.getTime() - ref.getTime();
  const days = ms / 86400000;
  // Moon moves ~13.2° per day through the zodiac (sidereal month approximation)
  const degreesTraveled = days * 13.2;
  const totalDeg = ((345 + degreesTraveled) % 360 + 360) % 360;
  const signIndex = Math.floor(totalDeg / 30);
  const degree = totalDeg % 30;
  return { sign: ZODIAC[signIndex], degree: degree, signIndex: signIndex };
}

function getMoonPhase(date) {
  // Known new moon: January 6, 2000 18:14 UTC
  const ref = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const ms = date.getTime() - ref.getTime();
  const days = ms / 86400000;
  const lunarMonth = 29.530587;
  const age = ((days % lunarMonth) + lunarMonth) % lunarMonth;
  const fraction = age / lunarMonth;
  if (fraction < 0.025 || fraction >= 0.975) return 'New Moon';
  if (fraction < 0.24) return 'Waxing Crescent';
  if (fraction < 0.26) return 'First Quarter';
  if (fraction < 0.49) return 'Waxing Gibbous';
  if (fraction < 0.52) return 'Full Moon';
  if (fraction < 0.74) return 'Waning Gibbous';
  if (fraction < 0.76) return 'Last Quarter';
  return 'Waning Crescent';
}

function getAlchemicalPhase(date) {
  const phase = getMoonPhase(date);
  return PHASE_MAP[phase] || 'Nigredo';
}

function getHouseNumber(risingSign, moonSign) {
  const risingIdx = ZODIAC.indexOf(risingSign);
  const moonIdx = ZODIAC.indexOf(moonSign);
  if (risingIdx === -1 || moonIdx === -1) return 1;
  return ((moonIdx - risingIdx + 12) % 12) + 1;
}

function reduceToSingleDigit(n) {
  while (n > 9) { n = String(n).split('').reduce((a,b) => a + parseInt(b), 0); }
  return n;
}

function getSignature(houseNum, lawName, phaseName) {
  const d1 = reduceToSingleDigit(houseNum);
  const d2 = LAW_INDEX[lawName] || 1;
  const d3 = PHASE_INDEX[phaseName] || 1;
  return `${d1}${d2}${d3}`;
}

function getHermeticLaw(moonSign) {
  return HERMETIC_LAWS[moonSign] || 'Vibration';
}


// --- Prompt Generation ---
function generatePrompt(moonSign, houseNum, lawName, phaseName) {
  const moonSigil = SIGIL[moonSign] || '';
  const houseTheme = HOUSE_THEMES[houseNum - 1] || 'Life';
  const pool = PROMPT_TEMPLATES;
  // Use today's date as seed for consistent daily prompt
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) { seed = ((seed << 5) - seed) + dateStr.charCodeAt(i); seed = seed & seed; }
  const idx = Math.abs(seed) % pool.length;
  
  let prompt = pool[idx];
  prompt = prompt.replace(/\{moon_sigil\}/g, moonSigil);
  prompt = prompt.replace(/\{moon_sign\}/g, moonSign);
  prompt = prompt.replace(/\{house_num\}/g, houseNum);
  prompt = prompt.replace(/\{house_theme\}/g, houseTheme);
  prompt = prompt.replace(/\{law\}/g, lawName);
  prompt = prompt.replace(/\{phase\}/g, phaseName);
  return prompt;
}


// --- Today's Data ---
function computeToday() {
  const chart = loadData('alchemize_chart', null);
  if (!chart) return null;
  const now = new Date();
  const moon = getMoonSignAndDegree(now);
  const phase = getMoonPhase(now);
  const alchemicalPhase = getAlchemicalPhase(now);
  const house = getHouseNumber(chart.rising, moon.sign);
  const law = getHermeticLaw(moon.sign);
  const sig = getSignature(house, law, alchemicalPhase);
  const prompt = generatePrompt(moon.sign, house, law, alchemicalPhase);
  
  return {
    moonSign: moon.sign,
    moonDegree: moon.degree,
    moonPhase: phase,
    alchemicalPhase: alchemicalPhase,
    house: house,
    law: law,
    signature: sig,
    prompt: prompt,
    date: now.toISOString().split('T')[0]
  };
}




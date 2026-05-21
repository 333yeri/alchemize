// --- Practice Rendering ---

// Track selected body region
let selectedBodyRegion = null;
let selectedArchetype = null;
let selectedThreadTags = [];

// Archetype definitions
const ARCHETYPES = [
  { id: 'persona', name: 'The Persona', symbol: '◈', desc: 'The mask you show the world. The face that fits.' },
  { id: 'shadow', name: 'The Shadow', symbol: '◐', desc: 'What you hide. The denied, the repressed, the unclaimed.' },
  { id: 'anima', name: 'The Anima/Animus', symbol: '◇', desc: 'The inner other. The opposite gender within.' },
  { id: 'self', name: 'The Self', symbol: '◎', desc: 'The whole. The integration of all parts.' }
];

// Body regions for The Body practice
const BODY_REGIONS = [
  { id: 'head', label: 'Head & Crown', path: 'M 70,10 Q 70,2 50,2 Q 30,2 30,10 Q 30,22 40,28 Q 50,32 60,28 Q 70,22 70,10 Z' },
  { id: 'face', label: 'Face & Jaw', path: 'M 35,30 Q 40,26 50,26 Q 60,26 65,30 Q 68,38 60,44 Q 50,48 40,44 Q 32,38 35,30 Z' },
  { id: 'throat', label: 'Throat & Neck', path: 'M 40,46 Q 40,42 50,42 Q 60,42 60,46 L 65,58 Q 50,62 35,58 Z' },
  { id: 'chest', label: 'Chest & Heart', path: 'M 20,60 Q 20,52 50,52 Q 80,52 80,60 L 82,80 Q 82,86 50,86 Q 18,86 18,80 Z' },
  { id: 'stomach', label: 'Stomach & Solar Plexus', path: 'M 22,88 Q 22,82 50,82 Q 78,82 78,88 L 76,100 Q 76,106 50,106 Q 24,106 24,100 Z' },
  { id: 'pelvis', label: 'Pelvis & Hips', path: 'M 24,108 Q 20,102 50,102 Q 80,102 76,108 L 78,118 Q 78,122 50,122 Q 22,122 22,118 Z' },
  { id: 'hands', label: 'Hands & Arms', path: 'M 12,66 Q 8,62 10,56 Q 14,50 20,54 L 24,70 Q 22,74 12,66 Z M 88,66 Q 92,62 90,56 Q 86,50 80,54 L 76,70 Q 78,74 88,66 Z' },
  { id: 'legs', label: 'Legs & Feet', path: 'M 30,124 Q 28,118 50,118 Q 72,118 70,124 L 72,150 Q 72,158 62,158 Q 52,158 50,148 Q 48,158 38,158 Q 28,158 28,150 Z' }
];

function renderPracticeHeader(practice) {
  return `
    <div class="practice-header">
      <div class="practice-symbol" style="border-color:${practice.color}40; color:${practice.color}">${practice.symbol}</div>
      <span class="practice-name">${practice.name}</span>
      <span class="practice-element-tag">${practice.element}</span>
    </div>
  `;
}

function renderPracticeGuidance(practice, isFirstTime) {
  // Store whether this practice has been seen before
  const seenKey = 'alchemize_seen_practice_' + practice.id;
  const hasSeen = localStorage.getItem(seenKey) === 'true';
  const initialOpen = isFirstTime || !hasSeen;

  return `
    <div class="practice-guidance">
      <div class="practice-guidance-header" onclick="toggleGuidance(this)">
        <span>◈ Guidance</span>
        <span class="guidance-toggle ${initialOpen ? 'open' : ''}">▾</span>
      </div>
      <div class="practice-guidance-body ${initialOpen ? 'open' : ''}">
        ${practice.guidance}
      </div>
    </div>
  `;
}

function renderSplitJournal(practice) {
  return `
    <div class="split-journal practice-ui">
      <div class="split-journal-col">
        <div class="split-journal-label me">Me — The Voice</div>
        <textarea id="practice-field-me" placeholder="Your voice. What do you notice? What do you feel?" style="min-height:160px;"></textarea>
      </div>
      <div class="split-journal-col">
        <div class="split-journal-label shadow">The Shadow — The Response</div>
        <textarea id="practice-field-shadow" placeholder="Let the shadow speak. Don't edit. Don't censor." style="min-height:160px;"></textarea>
      </div>
    </div>
  `;
}

function renderDualColumn(practice) {
  return `
    <div class="dual-column practice-ui">
      <div class="dual-column-col">
        <div class="dual-column-label inner">Inner Pattern I Notice</div>
        <textarea id="practice-field-inner" placeholder="The pattern inside you... what do you see?" style="min-height:140px;"></textarea>
      </div>
      <div class="dual-column-col">
        <div class="dual-column-label outer">How It Shows Up In My Life</div>
        <textarea id="practice-field-outer" placeholder="Where does this play out in your relationships, work, body?" style="min-height:140px;"></textarea>
      </div>
    </div>
  `;
}

function renderBodyScan(practice) {
  // Build SVG body with clickable regions
  let regionsHtml = BODY_REGIONS.map((r, i) => `
    <path class="body-region" id="body-region-${r.id}" d="${r.path}" data-region="${r.id}" onclick="selectBodyRegion('${r.id}')"/>
  `).join('');

  return `
    <div class="body-scan practice-ui">
      <div class="body-scan-layout">
        <div class="body-svg-container">
          <svg viewBox="0 0 100 162" xmlns="http://www.w3.org/2000/svg">
            ${regionsHtml}
          </svg>
        </div>
        <div class="body-scan-sidebar">
          <div class="body-region-name" id="body-region-label">Tap a body region</div>
          <textarea id="practice-field-body" placeholder="Describe the sensation here..." style="min-height:100px;"></textarea>
        </div>
      </div>
    </div>
  `;
}

function renderSigil369(practice) {
  return `
    <div class="sigil-369 practice-ui">
      <div class="sigil-steps">
        <div class="sigil-step">
          <div class="sigil-step-header">
            <span class="sigil-step-label">3 · Essence</span>
            <span class="sigil-step-hint">The insight in 3 words</span>
          </div>
          <input type="text" id="practice-sigil-3" placeholder="three precise words" oninput="updateSigilWordCount(3)">
          <div class="sigil-word-count" id="sigil-count-3">0 / 3 words</div>
        </div>
        <div class="sigil-step">
          <div class="sigil-step-header">
            <span class="sigil-step-label">6 · Reflection</span>
            <span class="sigil-step-hint">The truth in 6 words</span>
          </div>
          <input type="text" id="practice-sigil-6" placeholder="six words of reflection" oninput="updateSigilWordCount(6)">
          <div class="sigil-word-count" id="sigil-count-6">0 / 6 words</div>
        </div>
        <div class="sigil-step">
          <div class="sigil-step-header">
            <span class="sigil-step-label">9 · Release</span>
            <span class="sigil-step-hint">The letting go in 9 words</span>
          </div>
          <input type="text" id="practice-sigil-9" placeholder="nine words to set it free" oninput="updateSigilWordCount(9)">
          <div class="sigil-word-count" id="sigil-count-9">0 / 9 words</div>
        </div>
      </div>
    </div>
  `;
}

function renderArchetypeSelect(practice) {
  let cardsHtml = ARCHETYPES.map(a => `
    <div class="archetype-card" id="archetype-card-${a.id}" onclick="selectArchetype('${a.id}')" data-archetype="${a.id}">
      <div class="archetype-card-symbol">${a.symbol}</div>
      <div class="archetype-card-name">${a.name}</div>
      <div class="archetype-card-desc">${a.desc}</div>
    </div>
  `).join('');

  return `
    <div class="archetype-select practice-ui">
      <div class="archetype-grid">
        ${cardsHtml}
      </div>
      <div style="display:${selectedArchetype ? 'block' : 'none'};" id="archetype-reflection">
        <textarea id="practice-field-archetype" placeholder="${selectedArchetype ? 'How is this archetype moving through you today?' : 'Select an archetype first...'}" style="min-height:100px;"></textarea>
      </div>
    </div>
  `;
}

function renderOpenField(practice) {
  const tags = ['Dream', 'Coincidence', 'Déjà Vu', 'Symbol', 'Number Pattern', 'Synchronicity'];
  let tagsHtml = tags.map(t => `
    <span class="thread-tag" onclick="toggleThreadTag(this, '${t}')">${t}</span>
  `).join('');

  return `
    <div class="open-field practice-ui">
      <div class="thread-tags">
        ${tagsHtml}
      </div>
      <textarea id="practice-field-thread" placeholder="What strange thread is the universe weaving through your day?" style="min-height:120px;"></textarea>
    </div>
  `;
}

// Main render function
function renderPracticeUI(practice, isFirstTime) {
  const container = document.getElementById('practice-container');
  if (!container || !practice) return;

  let practiceHtml = '';
  
  switch (practice.uiType) {
    case 'split-journal':
      practiceHtml = renderSplitJournal(practice);
      break;
    case 'dual-column':
      practiceHtml = renderDualColumn(practice);
      break;
    case 'body-scan':
      practiceHtml = renderBodyScan(practice);
      break;
    case 'sigil-369':
      practiceHtml = renderSigil369(practice);
      break;
    case 'archetype-select':
      practiceHtml = renderArchetypeSelect(practice);
      break;
    case 'open-field':
      practiceHtml = renderOpenField(practice);
      break;
    default:
      practiceHtml = `<textarea id="practice-field-default" placeholder="Write your reflections here..." style="width:100%; min-height:120px; font-family:'EB Garamond',serif; background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:10px; padding:12px; color:var(--text-primary); font-size:15px; line-height:1.6;"></textarea>`;
  }

  container.innerHTML = `
    <hr class="practice-divider">
    ${renderPracticeHeader(practice)}
    ${renderPracticeGuidance(practice, isFirstTime)}
    ${practiceHtml}
  `;

  // Save that user has seen this practice
  localStorage.setItem('alchemize_seen_practice_' + practice.id, 'true');
  selectedBodyRegion = null;
  selectedArchetype = null;
  selectedThreadTags = [];
}

// Helper: get practice data from active UI
function getPracticeText(practice) {
  if (!practice) return '';
  
  switch (practice.uiType) {
    case 'split-journal':
      const me = document.getElementById('practice-field-me')?.value || '';
      const shadow = document.getElementById('practice-field-shadow')?.value || '';
      return me || shadow ? `[Me]\n${me}\n\n[The Shadow]\n${shadow}` : '';
    
    case 'dual-column':
      const inner = document.getElementById('practice-field-inner')?.value || '';
      const outer = document.getElementById('practice-field-outer')?.value || '';
      return inner || outer ? `[Inner Pattern]\n${inner}\n\n[Outer Mirror]\n${outer}` : '';
    
    case 'body-scan':
      const region = document.getElementById('body-region-label')?.textContent || '';
      const sensation = document.getElementById('practice-field-body')?.value || '';
      return region !== 'Tap a body region' || sensation ? `${region}\n${sensation}` : '';
    
    case 'sigil-369':
      const s3 = document.getElementById('practice-sigil-3')?.value || '';
      const s6 = document.getElementById('practice-sigil-6')?.value || '';
      const s9 = document.getElementById('practice-sigil-9')?.value || '';
      return s3 || s6 || s9 ? `3: ${s3}\n6: ${s6}\n9: ${s9}` : '';
    
    case 'archetype-select':
      const arch = document.getElementById('practice-field-archetype')?.value || '';
      return `Archetype: ${selectedArchetype || 'none'}\n\n${arch}`;
    
    case 'open-field':
      const thread = document.getElementById('practice-field-thread')?.value || '';
      const tags = selectedThreadTags.length > 0 ? `Tags: ${selectedThreadTags.join(', ')}` : '';
      return thread ? `${thread}${tags ? '\n\n' + tags : ''}` : '';
    
    default:
      const def = document.getElementById('practice-field-default')?.value || '';
      return def;
  }
}

// Body region selection
function selectBodyRegion(regionId) {
  document.querySelectorAll('.body-region').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById('body-region-' + regionId);
  if (el) {
    el.classList.add('selected');
    selectedBodyRegion = regionId;
    const region = BODY_REGIONS.find(r => r.id === regionId);
    document.getElementById('body-region-label').textContent = region ? region.label : 'Unknown';
  }
}

// Archetype selection
function selectArchetype(archId) {
  document.querySelectorAll('.archetype-card').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById('archetype-card-' + archId);
  if (el) {
    el.classList.add('selected');
    selectedArchetype = archId;
    const arch = ARCHETYPES.find(a => a.id === archId);
    if (arch) {
      const reflDiv = document.getElementById('archetype-reflection');
      if (reflDiv) {
        reflDiv.style.display = 'block';
        const ta = document.getElementById('practice-field-archetype');
        if (ta) ta.placeholder = `How is ${arch.name} moving through you today?`;
      }
    }
  }
}

// Thread tag toggle
function toggleThreadTag(el, tagName) {
  el.classList.toggle('active');
  const idx = selectedThreadTags.indexOf(tagName);
  if (idx >= 0) {
    selectedThreadTags.splice(idx, 1);
  } else {
    selectedThreadTags.push(tagName);
  }
}

// Sigil word count
function updateSigilWordCount(maxWords) {
  for (const n of [3, 6, 9]) {
    const input = document.getElementById('practice-sigil-' + n);
    const counter = document.getElementById('sigil-count-' + n);
    if (input && counter) {
      const words = input.value.trim() ? input.value.trim().split(/\s+/).length : 0;
      const status = words <= n ? 'text-dim' : 'color: #D44A4A';
      counter.innerHTML = `${words} / ${n} words`;
      counter.style.cssText = words <= n ? '' : 'color: #D44A4A;';
    }
  }
}

// Guidance toggle
function toggleGuidance(headerEl) {
  const body = headerEl.nextElementSibling;
  const toggle = headerEl.querySelector('.guidance-toggle');
  if (body) {
    body.classList.toggle('open');
    if (toggle) toggle.classList.toggle('open');
  }
}

// Expose functions globally for onclick handlers
window.selectBodyRegion = selectBodyRegion;
window.selectArchetype = selectArchetype;
window.toggleThreadTag = toggleThreadTag;
window.updateSigilWordCount = updateSigilWordCount;
window.toggleGuidance = toggleGuidance;

// --- UI Rendering ---
function renderPhaseHeader(today) {
  if (!today) return;
  const phase = today.alchemicalPhase;
  document.getElementById('phase-symbol-header').textContent = PHASE_SYMBOL[phase] || '⚫';
  document.getElementById('phase-name-header').textContent = phase;
  document.getElementById('moon-info-header').textContent = `Moon in ${today.moonSign} ${SIGIL[today.moonSign] || ''} · ${today.moonPhase}`;
}

let _prevPhase = null;

function applyTheme(today) {
  if (!today) return;
  const phase = today.alchemicalPhase;
  const theme = PHASE_THEME[phase] || PHASE_THEME['Nigredo'];
  document.body.className = theme.body;
  // Update CSS variables for dynamic elements
  document.documentElement.style.setProperty('--void', theme.bg);
  document.documentElement.style.setProperty('--void-surface', theme.surface);
  document.documentElement.style.setProperty('--accent', theme.accent);
  
  // Chemical reaction animation on phase change
  if (_prevPhase && _prevPhase !== phase) {
    const symbol = document.getElementById('phase-symbol-header');
    if (symbol) {
      symbol.classList.remove('transmuting');
      void symbol.offsetWidth;
      symbol.classList.add('transmuting');
    }
  }
  _prevPhase = phase;
}

function renderDailyView(today) {
  if (!today) {
    document.getElementById('journal-prompt').textContent = 'Please set up your birth chart first.';
    document.getElementById('sig-digits').textContent = '—';
    document.getElementById('journal-meta').innerHTML = '';
    return;
  }
  document.getElementById('journal-prompt').textContent = today.prompt;
  document.getElementById('sig-digits').textContent = today.signature;
  document.getElementById('prompt-moon-sign').textContent = `🌙 ${today.moonSign} ${SIGIL[today.moonSign] || ''}`;
  document.getElementById('prompt-house').textContent = `🏠 House ${today.house}`;
  document.getElementById('prompt-law').textContent = `⚖️ ${today.law}`;
}

function renderSessionCounter() {
  const sessions = loadData('alchemize_sessions', []);
  const cycle = loadData('alchemize_cycle', 1);
  const count = sessions.length;
  const progress = ((count % 9) / 9) * 100;
  document.getElementById('session-counter').textContent = `${count} sessions completed`;
  document.getElementById('cycle-label').textContent = `Cycle ${cycle}`;
  document.getElementById('cycle-bar').style.width = `${progress}%`;
}

function renderEntriesList() {
  const container = document.getElementById('entries-list');
  const sessions = loadData('alchemize_sessions', []);
  if (sessions.length === 0) {
    container.innerHTML = '<div class="card"><div class="empty-state">No journal entries yet.<br>Start your practice today.</div></div>';
    return;
  }
  let html = '';
  // Show most recent first
  const reversed = [...sessions].reverse();
  for (const entry of reversed) {
    const preview = entry.writing ? entry.writing.substring(0, 80) + (entry.writing.length > 80 ? '...' : '') : '(empty)';
    const practiceSym = entry.practiceSymbol || '✍️';
    const practiceName = entry.practiceName || '';
    html += `
      <div class="entry-item" data-idx="${sessions.indexOf(entry)}">
        <div class="entry-date">${entry.date || 'Unknown'} · ${entry.phase || ''} · ${practiceSym} ${practiceName}</div>
        <div class="entry-preview">${preview}</div>
        <span class="sig-badge entry-sig"><span>3·6·9</span><span class="sig-digits">${entry.signature || '—'}</span></span>
      </div>
    `;
  }
  container.innerHTML = html;
  
  // Click handler
  container.querySelectorAll('.entry-item').forEach(el => {
    el.addEventListener('click', function() {
      const idx = parseInt(this.dataset.idx);
      showEntryModal(idx);
    });
  });
}

function renderSynthesis() {
  const container = document.getElementById('synthesis-content');
  const sessions = loadData('alchemize_sessions', []);
  const cycle = loadData('alchemize_cycle', 1);
  
  if (sessions.length < 9) {
    const remaining = 9 - (sessions.length % 9);
    container.innerHTML = `
      <div class="card text-center">
        <p style="font-size:40px; margin-bottom:12px;">🌀</p>
        <p style="font-size:15px;">You need ${remaining} more session${remaining > 1 ? 's' : ''} to complete Cycle ${cycle}.</p>
        <p class="text-sm text-dim mt-8">Every 9 sessions unlocks a full synthesis.</p>
      </div>
    `;
    // Still show stats for current cycle
    const cycleSessions = sessions.slice(-9);
    if (cycleSessions.length > 0) {
      container.innerHTML += renderSynthStats(cycleSessions, cycle);
    }
    return;
  }
  
  // Show full synthesis for each complete cycle
  const cycles = Math.floor(sessions.length / 9);
  let html = '';
  for (let c = 1; c <= cycles; c++) {
    const start = (c - 1) * 9;
    const cycleSessions = sessions.slice(start, start + 9);
    html += renderSynthStats(cycleSessions, c);
  }
  // Also show current partial cycle
  const remaining = sessions.length % 9;
  if (remaining > 0) {
    html += renderSynthStats(sessions.slice(-remaining), cycles + 1, true);
  }
  container.innerHTML = html;
}

function renderSynthStats(sessions, cycleNum, partial) {
  if (sessions.length === 0) return '';
  
  const totalSessions = sessions.length;
  // Law frequency
  const lawCounts = {};
  const phaseCounts = {};
  const practiceCounts = {};
  for (const s of sessions) {
    if (s.law) lawCounts[s.law] = (lawCounts[s.law] || 0) + 1;
    if (s.phase) phaseCounts[s.phase] = (phaseCounts[s.phase] || 0) + 1;
    if (s.practice) {
      const name = s.practiceName || s.practice;
      practiceCounts[name] = (practiceCounts[name] || 0) + 1;
    }
  }
  
  const obsIndex = (cycleNum - 1) % SYNERGY_OBSERVATIONS.length;
  const observation = SYNERGY_OBSERVATIONS[obsIndex];
  
  const lawNames = Object.keys(HERMETIC_LAWS).map(k => HERMETIC_LAWS[k]);
  const uniqueLaws = [...new Set(lawNames)];
  
  let html = `
    <div class="card fade-in">
      <h3 style="font-size:18px; margin-bottom:4px;">${partial ? 'Current Cycle' : 'Cycle ' + cycleNum}</h3>
      <p class="text-sm text-dim" style="margin-bottom:16px;">${totalSessions} session${totalSessions > 1 ? 's' : ''} in this cycle</p>
      
      <div class="synth-grid">
        <div class="synth-stat">
          <div class="number">${totalSessions}</div>
          <div class="label">Sessions</div>
        </div>
        <div class="synth-stat">
          <div class="number">${Object.keys(phaseCounts).length}</div>
          <div class="label">Phases Seen</div>
        </div>
      </div>
      
      <div style="margin-top:16px;">
        <p class="text-xs" style="margin-bottom:8px;">Hermetic Laws Encountered</p>
  `;
  
  for (const law of uniqueLaws) {
    const count = lawCounts[law] || 0;
    const pct = totalSessions > 0 ? (count / totalSessions) * 100 : 0;
    html += `
      <div class="synth-law-bar">
        <span class="law-name">${law}</span>
        <div style="flex:1; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
          <div class="bar-fill" style="width:${pct}%"></div>
        </div>
        <span class="law-count">${count}</span>
      </div>
    `;
  }
  
  html += `
      </div>
      <div style="margin-top:16px;">
        <p class="text-xs" style="margin-bottom:8px;">Phase Distribution</p>
        <div class="flex flex-wrap">
  `;
  
  for (const [phase, count] of Object.entries(phaseCounts)) {
    html += `<span class="synth-phase-dot">${PHASE_SYMBOL[phase] || '•'} ${phase}: ${count}</span>`;
  }
  
  html += `
        </div>
      </div>
  `;

  // Practice distribution
  if (Object.keys(practiceCounts).length > 0) {
    html += `
      <div style="margin-top:16px;">
        <p class="text-xs" style="margin-bottom:8px;">Practice Distribution</p>
        <div class="synth-grid">
    `;
    for (const [name, count] of Object.entries(practiceCounts)) {
      const p = PRACTICES.find(pc => pc.name === name || pc.id === name);
      const sym = p ? p.symbol : '•';
      html += `
        <div class="synth-stat">
          <div class="number">${sym} ${count}</div>
          <div class="label">${name}</div>
        </div>
      `;
    }
    html += `</div></div>`;
  }
  
  html += `
      <div class="synth-observation mt-16">
        ${observation}
      </div>
    </div>
  `;
  
  return html;
}

function renderOffer() {
  const spots = loadData('alchemize_spots', 50);
  document.getElementById('spots-display').innerHTML = `<span class="spots-num">${spots}</span> spots remaining`;
  document.getElementById('btn-claim').disabled = spots <= 0;
}

function showEntryModal(idx) {
  const sessions = loadData('alchemize_sessions', []);
  const entry = sessions[idx];
  if (!entry) return;
  
  const practiceInfo = entry.practiceName ? ` · ${entry.practiceSymbol || ''} ${entry.practiceName}` : '';
  
  document.getElementById('modal-body').innerHTML = `
    <p class="text-xs text-dim">${entry.date || 'Unknown date'} · ${entry.phase || ''}${practiceInfo}</p>
    <span class="sig-badge mt-8"><span>3·6·9</span><span class="sig-digits">${entry.signature || '—'}</span></span>
    <div style="margin-top:16px; padding:16px; background:rgba(255,255,255,0.04); border-radius:12px; border-left:3px solid var(--filigree);">
      <p style="font-family:'Instrument Serif',serif; font-style:italic; line-height:1.6; font-size:15px;">
        ${entry.prompt || 'No prompt recorded'}
      </p>
    </div>
    ${entry.writing ? `
      <div style="margin-top:16px;">
        <p class="text-xs" style="margin-bottom:8px;">Your Writing</p>
        <p style="line-height:1.7; font-size:14px; white-space:pre-wrap;">${entry.writing}</p>
      </div>
    ` : '<p class="text-sm text-dim mt-16">No writing recorded for this entry.</p>'}
  `;
  document.getElementById('modal').classList.add('open');
}



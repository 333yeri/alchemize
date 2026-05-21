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
    html += `
      <div class="entry-item" data-idx="${sessions.indexOf(entry)}">
        <div class="entry-date">${entry.date || 'Unknown'} · ${entry.phase || ''}</div>
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
  for (const s of sessions) {
    if (s.law) lawCounts[s.law] = (lawCounts[s.law] || 0) + 1;
    if (s.phase) phaseCounts[s.phase] = (phaseCounts[s.phase] || 0) + 1;
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
  
  document.getElementById('modal-body').innerHTML = `
    <p class="text-xs text-dim">${entry.date || 'Unknown date'} · ${entry.phase || ''}</p>
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



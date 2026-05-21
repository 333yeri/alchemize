// --- Navigation ---
function showView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + viewName).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-view="${viewName}"]`).classList.add('active');
  
  // Refresh content when switching to certain views
  if (viewName === 'daily') {
    refreshDaily();
  } else if (viewName === 'history') {
    renderEntriesList();
  } else if (viewName === 'synthesis') {
    renderSynthesis();
  } else if (viewName === 'offer') {
    renderOffer();
  }
}

function refreshDaily() {
  const today = computeToday();
  if (today) {
    renderPhaseHeader(today);
    applyTheme(today);
    renderDailyView(today);
    
    // Render today's practice
    const sessions = loadData('alchemize_sessions', []);
    const practice = getTodaysPractice(sessions.length);
    // First session ever? Show guidance expanded
    const isFirstSession = sessions.length === 0;
    renderPracticeUI(practice, isFirstSession);
  } else {
    // No chart saved - show setup
    showView('setup');
    return;
  }
  renderSessionCounter();
}

// --- Initialization ---
function init() {
  const chart = loadData('alchemize_chart', null);
  
  // Setup view event
  document.getElementById('btn-save-chart').addEventListener('click', function() {
    const sun = document.getElementById('input-sun').value;
    const moon = document.getElementById('input-moon').value;
    const rising = document.getElementById('input-rising').value;
    if (!sun || !moon || !rising) {
      alert('Please select all three signs to begin.');
      return;
    }
    saveData('alchemize_chart', { sun, moon, rising });
    // Initialize spots if not set
    if (loadData('alchemize_spots', null) === null) {
      saveData('alchemize_spots', 50);
    }
    if (loadData('alchemize_cycle', null) === null) {
      saveData('alchemize_cycle', 1);
    }
    refreshDaily();
    showView('daily');
  });
  
  // Nav events
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      showView(this.dataset.view);
    });
  });
  
  // Save journal
  document.getElementById('btn-save-journal').addEventListener('click', function() {
    const today = computeToday();
    if (!today) return;
    
    const sessions = loadData('alchemize_sessions', []);
    const practice = getTodaysPractice(sessions.length);
    
    // Get practice-specific text
    const practiceText = getPracticeText(practice);
    // Also grab any fallback journal text
    const journalText = document.getElementById('journal-text')?.value || '';
    const text = practiceText || journalText;
    
    if (!text.trim()) {
      alert('Write something before saving.');
      return;
    }
    
    sessions.push({
      date: today.date,
      prompt: today.prompt,
      writing: text,
      practice: practice.id,
      practiceName: practice.name,
      practiceSymbol: practice.symbol,
      signature: today.signature,
      phase: today.alchemicalPhase,
      law: today.law,
      moonSign: today.moonSign,
      house: today.house
    });
    saveData('alchemize_sessions', sessions);
    
    // Reveal 369 badge on save - earned reveal
    const sigBadge = document.getElementById('sig-badge');
    if (sigBadge) {
      sigBadge.classList.add('revealed');
      setTimeout(() => sigBadge.classList.remove('revealed'), 4000);
    }
    
    // Check cycle completion
    const count = sessions.length;
    const cycle = loadData('alchemize_cycle', 1);
    if (count % 9 === 0) {
      saveData('alchemize_cycle', cycle + 1);
      alert(`🌀 Cycle ${cycle} complete! Your synthesis is ready in the Cycle view.`);
    }
    
    document.getElementById('journal-text').value = '';
    renderSessionCounter();
    renderEntriesList();
    alert('✓ Entry saved.');
  });
  
  // Claim button
  document.getElementById('btn-claim').addEventListener('click', function() {
    let spots = loadData('alchemize_spots', 50);
    if (spots <= 0) {
      alert('All founding spots have been claimed.');
      return;
    }
    spots--;
    saveData('alchemize_spots', spots);
    renderOffer();
    alert(`⚗️ You've claimed a founding spot! ${spots} remaining.`);
  });
  
  // Modal close
  document.getElementById('modal-close').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('open');
  });
  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
  
  // Keyboard shortcut
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') document.getElementById('modal').classList.remove('open');
  });
  
  // Init spots
  if (loadData('alchemize_spots', null) === null) {
    saveData('alchemize_spots', 50);
  }
  if (loadData('alchemize_cycle', null) === null) {
    saveData('alchemize_cycle', 1);
  }
  
  // If chart exists, go to daily
  if (chart) {
    // Pre-fill setup in case they want to edit
    document.getElementById('input-sun').value = chart.sun || '';
    document.getElementById('input-moon').value = chart.moon || '';
    document.getElementById('input-rising').value = chart.rising || '';
    refreshDaily();
    showView('daily');
  } else {
    showView('setup');
  }
}

// --- Start ---
document.addEventListener('DOMContentLoaded', init);


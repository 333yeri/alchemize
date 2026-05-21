// --- Storage ---
function loadData(key, def) { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; } catch(e) { return def; } }
function saveData(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }



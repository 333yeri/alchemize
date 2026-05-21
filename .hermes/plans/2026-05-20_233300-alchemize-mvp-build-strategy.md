# Alchemize — Full MVP Build Strategy

> **For Hermes:** Use subagent-driven-development to implement this plan task-by-task.
> **Deadline:** June 5, 2026 (16 days from today, May 20)
> **Revenue target:** €1,200 (rent) through 50 founding seats at €59

**Goal:** Transform the existing prompt-journaling shell into a complete, earnable, cinematic shadow work application — then launch.

**Guiding design principle:** The 3-6-9 architecture is not visual decoration. It is the operating system.

| Element | What it is | Status |
|---------|-----------|--------|
| **3** | Triple input (birth chart × daily transit × alchemical phase) | ✅ Built |
| **6** | Six shadow work practices — the actual method | ❌ Design needed → Build |
| **9** | Nine-session cycle → synthesis → transformation | ✅ Built (shell) |

---

## Phase 1: The 6 Practices (Days 1–4)

### The Six Practices Design

Each day, the app assigns one of six practices (rotating through the 9-session cycle). The daily prompt already exists — the practice is HOW the user engages with that prompt.

**Practice 1: The Mirror** (Jungian Active Imagination)
- User reads the prompt, then writes a dialogue with the shadow figure emerging from the house/transit
- UI: split-screen journal — left side "me", right side "the shadow" — write back and forth
- Guidance: 2-3 sentences to seed the dialogue, then freeform

**Practice 2: The Map** (Hermetic Correspondence)
- User maps the inner pattern to its outer manifestation: "As above (my internal state), so below (my external life)"
- UI: two-column input — left "Inner Pattern I Notice", right "How It Shows Up In My Life"
- Guidance: "What in your external reality mirrors what you see inside?"

**Practice 3: The Body** (Alchemical Somatic Scan)
- User scans their body for where the shadow energy is held — tension, numbness, heat, cold
- UI: body diagram (simple SVG outline) — click to select body region + describe the sensation
- Guidance: "Where in your physical form does this shadow reside?"

**Practice 4: The Sigil** (369 Distillation)
- User distills the session insight into a 3-word essence, 6-word reflection, 9-word release
- The 3-6-9 signature is their charged symbol for the day
- UI: three sequential input fields — 3 words, 6 words, 9 words — each with a character/word counter
- Guidance: "The lightbulb in 3 words. The truth in 6. The letting go in 9."

**Practice 5: The Archetype** (Jungian Pattern Recognition)
- User identifies which archetype is active today: Persona, Shadow, Anima/Animus, or the Self
- Each archetype has a short descriptor + a question
- UI: select an archetype card → guided reflection field appears
- Guidance: "Which face are you wearing? And which is wearing you?"

**Practice 6: The Thread** (Synchronicity Log)
- User records any meaningful coincidences, synchronicities, or dreams from the past 24h
- These accumulate across the 9-session cycle and resurface in the synthesis view
- UI: open field + tags for categories (dream, coincidence, déjà vu, symbol, number pattern)
- Guidance: "What strange thread is the universe weaving through your days?"

### Daily sequence

1. User opens app → sees the daily prompt (already built, powered by moon transit)
2. The prompt is tagged with one of the 6 practices, indicating the method
3. User engages with the practice's specific UI + writes their reflection
4. Session saves with practice type, allowing synthesis to show practice distribution

### Practice rotation across 9 sessions

```
Session 1: The Mirror
Session 2: The Map
Session 3: The Body
Session 4: The Sigil
Session 5: The Archetype
Session 6: The Thread
Session 7: The Mirror (deeper — revisits with new transit data)
Session 8: The Map (deeper)
Session 9: The Sigil (cycle-closing — distills the whole cycle)
```

### Implementation tasks

#### Task 1: Practice data model

**Objective:** Define the 6 practices as structured data in JavaScript

**Files:**
- Modify: `index.html` (add PRACTICE data + rotation logic)

Add a PRACTICES array and a rotation function that picks today's practice based on session count.

```javascript
const PRACTICES = [
  {
    id: 'mirror',
    name: 'The Mirror',
    symbol: '🪞',
    element: 'Water',
    shortDesc: 'Dialogue with your shadow',
    guidance: 'The shadow never speaks directly — it whispers through projection. Read today\'s prompt, then write a dialogue. You ask. It answers. Do not edit. Do not censor.',
    uiType: 'split-journal'
  },
  {
    id: 'map',
    name: 'The Map',
    symbol: '🗺️',
    element: 'Earth',
    shortDesc: 'As above, so below',
    guidance: 'Every inner pattern has an outer mirror. Look at what you\'ve just read. Now look at your life. Where is this pattern playing out in your relationships, your work, your body?',
    uiType: 'dual-column'
  },
  {
    id: 'body',
    name: 'The Body',
    symbol: '🫀',
    element: 'Earth',
    shortDesc: 'Somatic shadow scan',
    guidance: 'The shadow is stored in tissue before it reaches thought. Close your eyes. Scan from crown to root. Where does today\'s theme resonate physically? A weight in the chest? A knot in the throat?',
    uiType: 'body-scan'
  },
  {
    id: 'sigil',
    name: 'The Sigil',
    symbol: '🔯',
    element: 'Fire',
    shortDesc: '3·6·9 distillation',
    guidance: 'The truth is simpler than you think. Distill today\'s insight into three layers: The insight in 3 words. The reflection in 6. The release in 9. This is your charged symbol.',
    uiType: 'sigil-369'
  },
  {
    id: 'archetype',
    name: 'The Archetype',
    symbol: '🎭',
    element: 'Air',
    shortDesc: 'Which face wears you?',
    guidance: 'Jung said archetypes are the ancient patterns of the collective unconscious. Today, one is speaking through you. Is it the Persona (the mask)? The Shadow (what you hide)? The Anima/Animus (the inner other)? Or the Self (the whole)?',
    uiType: 'archetype-select'
  },
  {
    id: 'thread',
    name: 'The Thread',
    symbol: '🧵',
    element: 'Air',
    shortDesc: 'Track the synchronicities',
    guidance: 'The universe speaks in symbols. What strange coincidence crossed your path today? A number pattern? A chance encounter? A dream fragment that lingers? Record it — threads weave into meaning over the cycle.',
    uiType: 'open-field'
  }
];

function getTodaysPractice(sessionCount) {
  const rotation = [0, 1, 2, 3, 4, 5, 0, 1, 3]; // 9 slots
  const idx = rotation[sessionCount % 9];
  return PRACTICES[idx];
}
```

**Verification:** After adding this, `getTodaysPractice(0)` returns The Mirror, `getTodaysPractice(8)` returns The Sigil.

#### Task 2: Practice UI rendering

**Objective:** Render the practice-specific UI beneath the prompt

**Files:**
- Modify: `index.html` (add practice UI templates and render function)

Add a `renderPracticeUI(practice)` function that renders the appropriate UI based on `practice.uiType`:

- `split-journal`: Two textareas side by side (mobile: stacked)
- `dual-column`: Two textareas, labeled "Inner Pattern" and "Outer Mirror"
- `body-scan`: SVG body outline + clickable regions + one reflection textarea
- `sigil-369`: Three word-count-limited inputs (3, 6, 9 words)
- `archetype-select`: Four cards for Persona/Shadow/Anima/Animus + Self + reflection textarea
- `open-field`: One large textarea with tag selector

**Mobile-first layout:** All variants stack vertically on screens < 480px.

#### Task 3: Practice guidance + onboarding

**Objective:** Show practice guidance text before the user writes

**Files:**
- Modify: `index.html`

Add a collapsible guidance section above the practice UI:
- First time a user sees a practice: expanded by default with gentle fade-in
- Subsequent times: collapsed with a "Show guidance" toggle
- Guidance includes the element association + the practice's archetypal meaning

#### Task 4: Save practice type to session data

**Objective:** Each saved entry records which practice was used

**Files:**
- Modify: `index.html`

Extend the save-journal handler to include `practice: todayPractice.id` in the session entry object.

Update synthesis view to show practice distribution (which practices were most used in this cycle).

---

## Phase 2: Payment Integration (Days 5–6)

### Task 5: Stripe payment flow

**Objective:** Replace the demo claim button with real payment processing

**Files:**
- Create: `stripe-config.js` (Stripe publishable key + price ID)
- Modify: `index.html`

Approach (client-side only for MVP — no backend needed):
- Stripe Checkout redirect: clicking "Claim Your Spot" creates a Stripe Checkout session via a small serverless function, OR
- Simpler: Use a Stripe Payment Link — the button just redirects to `checkout.stripe.com/.../c/pay_...`
- After successful payment: redirect back to `?claim_success=true` → local decrements spots and stores `alchemize_paid = true`

**Because we have no server yet:**
Option A: Deploy a minimal Cloudflare Worker or Vercel function that creates Stripe Checkout sessions
Option B: Use Stripe Payment Links (simplest, no code needed on payment side)

Recommendation: Option A — a small worker that validates the session count, creates a checkout session, and handles the webhook to prevent double-claiming.

#### Task 6: Post-purchase experience

**Objective:** After payment, show a thank-you flow and unlock full features

**Files:**
- Modify: `index.html`

- Success page with user's personal 3-6-9 accession number (derived from their chart hash)
- "Your spot is locked" confirmation with countdown to first session
- Email capture for launch updates (optional — can do in Phase 4)

---

## Phase 3: Three.js Cinematic Experience (Days 7–9)

### Task 7: Three.js background

**Objective:** Replace the SVG sacred geometry with an immersive Three.js scene

**Files:**
- Create: `three-bg.js` (Three.js module)
- Modify: `index.html` (load Three.js from CDN + initialize)

Scene design:
- Dark particle field with 369 particles arranged in a spiral (Fibonacci/phi ratio)
- A central geometric form that morphs based on alchemical phase:
  - Nigredo: dark, dense, slow-rotating cube
  - Albedo: luminous, translucent dodecahedron with soft glow
  - Citrinitas: golden icosahedron with light rays
  - Rubedo: red, warm, pulsing torus
- Subtle mouse parallax
- Performance: mobile-friendly with reduced particle count on touch devices
- Must NOT interfere with app usability — fixed position, z-index -1, pointer-events none

### Task 8: Phase transition animation

**Objective:** Animate the phase header and accent color transitions

**Files:**
- Modify: `index.html` (CSS transitions + JS animation triggers)

When phase changes (automatic based on moon):
- The new phase symbol animates in (scale-up + fade)
- Background color transitions smoothly (CSS already handles this — enhance with phase-specific particle color changes)
- A subtle phase announcement banner slides up and fades out after 3 seconds
- Sound: optional — a single resonant tone per phase transition (disabled by default)

---

## Phase 4: Launch & Distribution (Days 10–13)

### Task 9: PWA registration

**Objective:** True offline-first with service worker

**Files:**
- Create: `sw.js` (service worker with cache-first strategy)
- Create: `manifest.json` (PWA manifest with phase icons)
- Modify: `index.html` (register SW + add manifest link)

Users should be able to add Alchemize to their home screen and use it offline.

### Task 10: X posting automation

**Objective:** Automated faceless marketing threads

**Files:**
- Create: `scripts/distribute.py` (Python script that posts to X via xurl CLI)
- Create: `scripts/draft-content.md` (content templates)

Content pipeline:
- Daily shadow work prompt (same as app generates) posted as an X thread
- Weekly "Cycle in Review" post with a synthesis observation
- Spot countdown posts when seats drop below 20, 10, 5

Set up via cron:
```bash
hermes cron create --schedule "0 8 * * *" --skills "xurl" --prompt "..."
```

### Task 11: Reddit presence

**Objective:** Authentic community building in r/Jung, r/astrology, r/ShadowWork, r/Hermeticism

Yeri writes the first 3-5 posts himself (Venus 3H — this is his gift). Then automate sharing of high-value app insights.

---

## Phase 5: Polish & Launch (Days 14–16)

### Task 12: Pre-launch QA

- Test on Chrome, Safari, Firefox (mobile + desktop)
- Test offline mode
- Test payment flow end-to-end
- Verify all 6 practice UIs on mobile (320px+)
- Check phase transitions in all 4 phases (set system date to force each phase)
- Performance audit (Lighthouse)
- Accessibility basics (keyboard nav, screen reader labels)

### Task 13: Launch

- Deploy final version to GitHub Pages
- Announce on X
- Post to Reddit communities
- Send to Yeri's immediate network

---

## Architecture & File Map

```
alchemize/
├── index.html              # All current code — to be refactored
├── manifest.json           # NEW: PWA manifest
├── sw.js                   # NEW: Service worker
├── three-bg.js             # NEW: Three.js background scene
├── stripe-config.js        # NEW: Stripe configuration
├── .hermes/plans/
│   └── 2026-05-20_233300-alchemize-mvp-build-strategy.md  # THIS PLAN
└── scripts/
    ├── distribute.py       # NEW: X posting automation
    └── draft-content.md    # NEW: Content templates
```

While the single-file `index.html` works for the MVP shell, Phase 1 adds complexity. The recommended split:

```
alchemize/
├── index.html              # HTML structure (lean)
├── css/
│   ├── base.css            # Variables, reset, typography
│   ├── phases.css          # Phase theme overrides
│   ├── practices.css       # 6 practice UIs
│   └── components.css      # Cards, buttons, nav, modal
├── js/
│   ├── app.js              # Init, navigation, event handlers
│   ├── data.js             # Constants (ZODIAC, HERMETIC_LAWS, PHASE_MAP, PROMPT_TEMPLATES)
│   ├── moon.js             # Moon calculations
│   ├── practices.js        # 6 practices data + rotation
│   ├── storage.js          # localStorage helpers
│   ├── ui-daily.js         # Daily view rendering
│   ├── ui-history.js       # History view + modal
│   ├── ui-synthesis.js     # Cycle synthesis rendering
│   └── ui-offer.js         # Offer view rendering
├── manifest.json
├── sw.js
└── three-bg.js
```

Alternative: Keep single-file for simplicity but add clear section dividers. Recommend the multi-file split for maintainability.

---

## Build Order Decision

Given the June 5 deadline, **recommended order is:**

**Priority 1 (Days 1–4): The 6 Practices** — This IS the product. Without it, you have a prompt generator. With it, you have a shadow work system that justifies €59.

**Priority 2 (Days 5–6): Payment Integration** — The app can earn money. Without this, it's a free demo forever.

**Priority 3 (Days 7–9): Three.js Experience** — This is the cinematic premium feel that justifies the price point and differentiates from generic journal apps.

**Priority 4 (Days 10–13): Distribution** — But you can start posting manually during days 1-9 to build momentum.

**Priority 5 (Days 14–16): Polish + Launch**

---

## Open Questions for Yeri

1. **The 6 practices design** — Does the above set feel right? Any you'd replace?
2. **File structure** — Split into multiple files or keep monolithic? Multi-file is cleaner for maintenance.
3. **Payment approach** — Stripe Checkout via a lightweight worker, or Stripe Payment Links (simplest)?
4. **Launch timing** — June 1 soft launch to test payment flow with first 5 buyers before the full push?
5. **Brand name** — "Alchemize" is confirmed. The current tagline is "Shadow Work · Daily Practice" — does that hold?

---

## Verification

- Each task produces a working, testable increment
- The full app runs entirely offline (Phase 4 adds PWA)
- Payment flow tested end-to-end before going live
- All practice UIs tested on actual mobile device
- Phase transitions verified across all 4 alchemical stages

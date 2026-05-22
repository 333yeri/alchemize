// --- Constants ---
const ZODIAC = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

// --- 6 Practices ---
const PRACTICES = [
  {
    id: 'mirror',
    name: 'The Mirror',
    symbol: '⊞',
    element: 'Water',
    color: '#2D6B8A',
    shortDesc: 'Dialogue with your shadow',
    guidance: 'The shadow never speaks directly — it whispers through projection. Read today\'s prompt, then write a dialogue. You ask. It answers. Do not edit. Do not censor.',
    uiType: 'split-journal'
  },
  {
    id: 'map',
    name: 'The Map',
    symbol: '⌗',
    element: 'Earth',
    color: '#6B8A2D',
    shortDesc: 'As above, so below',
    guidance: 'Every inner pattern has an outer mirror. Look at what you\'ve just read. Now look at your life. Where is this pattern playing out in your relationships, your work, your body?',
    uiType: 'dual-column'
  },
  {
    id: 'body',
    name: 'The Body',
    symbol: '⊕',
    element: 'Earth',
    color: '#8A5A2D',
    shortDesc: 'Somatic shadow scan',
    guidance: 'The shadow is stored in tissue before it reaches thought. Close your eyes. Scan from crown to root. Where does today\'s theme resonate physically? A weight in the chest? A knot in the throat?',
    uiType: 'body-scan'
  },
  {
    id: 'sigil',
    name: 'The Sigil',
    symbol: '✦',
    element: 'Fire',
    color: '#C9A84C',
    shortDesc: '3·6·9 distillation',
    guidance: 'The truth is simpler than you think. Distill today\'s insight into three layers: The insight in 3 words. The reflection in 6. The release in 9. This is your charged symbol.',
    uiType: 'sigil-369'
  },
  {
    id: 'archetype',
    name: 'The Archetype',
    symbol: '◇',
    element: 'Air',
    color: '#8A6DB5',
    shortDesc: 'Which face wears you?',
    guidance: 'Jung said archetypes are the ancient patterns of the collective unconscious. Today, one is speaking through you. Is it the Persona (the mask)? The Shadow (what you hide)? The Anima/Animus (the inner other)? Or the Self (the whole)?',
    uiType: 'archetype-select'
  },
  {
    id: 'thread',
    name: 'The Thread',
    symbol: '∞',
    element: 'Air',
    color: '#B56D8A',
    shortDesc: 'Track the synchronicities',
    guidance: 'The universe speaks in symbols. What strange coincidence crossed your path today? A number pattern? A chance encounter? A dream fragment that lingers? Record it — threads weave into meaning over the cycle.',
    uiType: 'open-field'
  }
];

function getTodaysPractice(sessionCount) {
  const rotation = [0, 1, 2, 3, 4, 5, 0, 1, 3]; // 9 slots: Mirror, Map, Body, Sigil, Archetype, Thread, Mirror, Map, Sigil
  const idx = rotation[sessionCount % 9];
  return PRACTICES[idx];
}
const SIGIL = { 'Aries':'♈','Taurus':'♉','Gemini':'♊','Cancer':'♋','Leo':'♌','Virgo':'♍','Libra':'♎','Scorpio':'♏','Sagittarius':'♐','Capricorn':'♑','Aquarius':'♒','Pisces':'♓' };

const HERMETIC_LAWS = {
  Aries: 'Vibration', Taurus: 'Correspondence', Gemini: 'Mentalism',
  Cancer: 'Polarity', Leo: 'Vibration', Virgo: 'Cause & Effect',
  Libra: 'Polarity', Scorpio: 'Gender', Sagittarius: 'Rhythm',
  Capricorn: 'Cause & Effect', Aquarius: 'Correspondence', Pisces: 'Rhythm'
};
const LAW_INDEX = { 'Mentalism':1, 'Correspondence':2, 'Vibration':3, 'Polarity':4, 'Rhythm':5, 'Cause & Effect':6, 'Gender':7 };

const PHASE_MAP = {
  'New Moon':'Nigredo','Waxing Crescent':'Nigredo',
  'First Quarter':'Albedo','Waxing Gibbous':'Albedo',
  'Full Moon':'Citrinitas','Waning Gibbous':'Citrinitas',
  'Last Quarter':'Rubedo','Waning Crescent':'Rubedo'
};
const PHASE_INDEX = { 'Nigredo':1, 'Albedo':2, 'Citrinitas':3, 'Rubedo':4 };
const PHASE_SYMBOL = { 'Nigredo':'●','Albedo':'○','Citrinitas':'◉','Rubedo':'⊛' };
const PHASE_THEME = {
  'Nigredo': { body: 'theme-nigredo', bg: '#060A1A', surface: '#0D1530', accent: '#2D1B3D' },
  'Albedo': { body: 'theme-albedo', bg: '#0D1530', surface: '#182545', accent: '#8FA4B8' },
  'Citrinitas': { body: 'theme-citrinitas', bg: '#0F1420', surface: '#1A1F30', accent: '#C9A84C' },
  'Rubedo': { body: 'theme-rubedo', bg: '#1A0D0D', surface: '#2A1515', accent: '#8B3A3A' }
};

const HOUSE_THEMES = [
  'Self & Identity',
  'Values & Resources',
  'Communication & Learning',
  'Home & Family',
  'Creativity & Romance',
  'Health & Service',
  'Partnerships',
  'Transformation & Shared Resources',
  'Philosophy & Travel',
  'Career & Public Life',
  'Community & Friendships',
  'Subconscious & Spirituality'
];

const SYNERGY_OBSERVATIONS = [
  'Each cycle deepens the mirror. The shadows you face today are the light you become tomorrow.',
  'The alchemical process is not linear — it spirals. With each cycle, you return to familiar ground at a higher elevation.',
  'What resists persists. What is witnessed transforms. Your journal is the vessel of this witnessing.',
  'The seven Hermetic laws are not abstract principles — they are the operating system of your inner world.',
  'Nigredo blackens to make fertile. Albedo whitens to make clear. Citrinitas dawns with insight. Rubedo reddens into embodiment.',
  'Every session is a threshold. The 3-6-9 signature is the key that unlocks the next door.',
  'Nine sessions, one cycle. The decimal system mirrors the nine months of gestation — you are birthing yourself.',
  'The Moon moves through all twelve signs in 27 days. In that time, you journey through every house of your inner chart.'
];

const MOON_PHASES = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
];

// --- Prompt Templates (20+) ---
const PROMPT_TEMPLATES = [
  "Your {moon_sigil} {moon_sign} Moon passes through House {house_num} — the house of {house_theme}. Under the {phase} phase, the law of {law} is active. What is the shadow you've been shielding from your own sight in this area?",
  "The {law} principle speaks through your {moon_sign} Moon today in House {house_num}. {phase} phase asks: Which part of your relationship to {house_theme} are you ready to let dissolve?",
  "In the {phase} phase, with the Moon in {moon_sign} (House {house_num}), the Hermetic law of {law} is your guide. Write about a {house_theme} pattern you've outgrown but still carry.",
  "House {house_num} ({house_theme}) receives the {moon_sign} Moon. {law} is the law in session. The {phase} phase deepens the inquiry: What fear lives in this house that you've never named aloud?",
  "Your {moon_sign} Moon transits House {house_num}, invoking {law}. During {phase}, shadow work is about excavation. What buried truth about {house_theme} wants to surface?",
  "The {phase} phase illuminates the {law} energy of your {moon_sign} Moon in House {house_num}. What story about {house_theme} do you tell yourself that may no longer be true?",
  "Today the {moon_sign} Moon occupies House {house_num} ({house_theme}). The principle of {law} governs. Under {phase}, the question arises: What are you protecting that actually imprisons you?",
  "House {house_num} — the realm of {house_theme} — is where the {moon_sign} Moon casts its shadow today. With the {law} law active and {phase} descending: Where are you performing instead of being?",
  "In the crucible of {phase}, your {moon_sign} Moon in House {house_num} activates the law of {law}. The work: examine a recurring {house_theme} conflict and trace it to its root.",
  "The {moon_sign} Moon crosses House {house_num}, vibrating with {law}. {phase} phase whispers: What are you not saying about {house_theme} that needs to be spoken?",
  "Under {phase}, the {law} law shapes how your {moon_sign} Moon expresses through House {house_num}. Journal about a {house_theme} wound that has quietly shaped your choices.",
  "Your {moon_sign} Moon in House {house_num} calls the law of {law} into action. The {phase} phase strips away pretense. What about {house_theme} have you been pretending is fine?",
  "The {phase} phase and the {moon_sign} Moon in House {house_num} create an alchemical container governed by {law}. What needs to be alchemized in your {house_theme} today?",
  "House {house_num} ({house_theme}) is activated by the {moon_sign} Moon. The Hermetic law of {law} is the lens. {phase} phase asks: What inheritance (karmic or familial) around {house_theme} are you ready to transform?",
  "With the Moon in {moon_sign} at House {house_num}, {law} is the presiding principle. In this {phase} phase, examine the gap between what you want for {house_theme} and what you allow.",
  "The {moon_sign} Moon's transit through House {house_num} brings the law of {law} into focus. {phase} phase invites shadow integration. Where in {house_theme} do you abandon yourself?",
  "Today's {phase} phase intensifies the {moon_sign} Moon's passage through House {house_num}. The law of {law} is your compass. What resentment about {house_theme} are you ready to release?",
  "Your {moon_sign} Moon in House {house_num} meets the {phase} phase under the law of {law}. Journal: What is the lie you've told yourself about {house_theme} that keeps you small?",
  "The alchemical stage is {phase}, the Moon is in {moon_sign}, House {house_num} is activated, and {law} governs. What in {house_theme} is calling for your attention — not your fixing?",
  "House {house_num} ({house_theme}) is where your {moon_sign} Moon does its shadow work today. {phase} + {law} = the formula. What pattern in {house_theme} repeats because you haven't witnessed it fully?",
  "The {moon_sign} Moon in House {house_num} invokes {law}. Under {phase}, the shadow speaks in symbols. What dream, image, or memory about {house_theme} arose recently? What is it saying?",
  "Today: {moon_sign} Moon · House {house_num} ({house_theme}) · {law} · {phase}. The intersection creates a specific alchemical signature. What one small truth about {house_theme} are you ready to admit to yourself?",
  "The {phase} phase amplifies the {law} resonance of your {moon_sign} Moon in House {house_num}. What is the gift hidden inside your most defended {house_theme} pattern?",
  "Your {moon_sign} Moon transits House {house_num}, the domain of {house_theme}. With the law of {law} active and {phase} as the atmosphere: What would you do differently in {house_theme} if fear were not a factor?",
  "The {phase} phase casts a specific light on the {moon_sign} Moon's journey through House {house_num}. The governing law is {law}. Where in {house_theme} are you betraying your own values to keep the peace?"
];



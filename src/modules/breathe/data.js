const inhale = (seconds, from = .55, to = 1) => ["Breathe in", seconds, from, to];
const exhale = (seconds, from = 1, to = .55) => ["Breathe out", seconds, from, to];
const hold = (seconds, scale = 1) => ["Rest softly", seconds, scale, scale];
const bellows = [];
const pumps = [];

for (let count = 1; count <= 20; count += 1) {
  bellows.push([`Quick inhale · ${count}`, .5, .7, 1, count]);
  bellows.push([`Quick exhale · ${count}`, .5, 1, .7, count]);
}
bellows.push(["Deep breath in", 4, .6, 1], ["Soft hold", 6, 1, 1], ["Slow breath out", 6, 1, .6]);

for (let count = 1; count <= 30; count += 1) {
  pumps.push([`Gentle pump · ${count}`, .3, .9, .62, count]);
  pumps.push([`Release · ${count}`, .3, .62, .9, count]);
}
pumps.push(["Rest · breathe naturally", 15, .9, .7]);

export const BREATH_PATTERNS = [
  { id: "calm", name: "Calm 4 · 4", steps: [inhale(4), exhale(4)], note: "An even, unforced rhythm. Keep the breath comfortable." },
  { id: "long-exhale", name: "4 · 6", steps: [inhale(4), exhale(6)], note: "Let the exhale lengthen only as far as feels easy." },
  { id: "box", name: "Box", steps: [inhale(4), hold(4), exhale(4), hold(4, .55)], note: "Four even parts. Skip either pause whenever you prefer." },
  { id: "478", name: "4 · 7 · 8", steps: [inhale(4), hold(7), exhale(8)], note: "A longer pattern. Shorten or skip the hold; never strain." },
  { id: "alternate", name: "Alternate nostril", steps: [["Inhale left", 4, .55, 1], ["Exhale right", 4, 1, .55], ["Inhale right", 4, .55, 1], ["Exhale left", 4, 1, .55]], note: "Without holding the breath, alternate sides at a comfortable pace: inhale left, exhale right, inhale right, exhale left. After each two-minute block the guide gently lengthens both sides from 4 to 5 to 6 seconds, then stays at 6. Use a light touch; skip nostril closing or breathe naturally if uncomfortable." },
  { id: "mindful", name: "Mindful natural breath", steps: [["Notice the breath", 6, .78, 1], ["Let the breath go", 6, 1, .78]], note: "Let breathing happen naturally. The gentle visual is only a reminder to notice; there is no target to match or change." },
  { id: "belly", name: "Easy belly breathing", steps: [inhale(4, .78, 1), exhale(6, 1, .78)], note: "If comfortable, notice the belly moving softly with the breath. Keep the chest and shoulders relaxed; do not push the belly or take unusually deep breaths." },
  { id: "ujjayi", name: "Gentle throat breath", steps: [inhale(4), exhale(6)], note: "A soft, quiet breath through the nose. If familiar, allow a very subtle whisper-like texture at the back of the throat; do not constrict, strain, or make the breath loud. Otherwise breathe normally." },
  { id: "shitali", name: "Shitali · cooling breath", steps: [["Breathe in gently", 4, .55, 1], ["Breathe out through the nose", 6, 1, .55]], note: "If comfortable, inhale through a softly curled tongue, then exhale through the nose. If you cannot curl your tongue, purse the lips gently instead. Skip this if cool air irritates you; never force or hold the breath." },
  { id: "vase", name: "Vase-like breath awareness", steps: [["Imagine space filling", 4, .72, 1], ["Imagine space settling", 6, 1, .72]], note: "Use a simple image of a vessel gently filling and emptying as the natural breath moves. This is visualization only: no breath retention, abdominal bracing, or pressure." },
  { id: "bhramari", name: "Bhramari · humming exhale", sound: "bhramari", steps: [["Breathe in gently", 4, .55, 1], ["Hum softly on the exhale", 6, 1, .62]], note: "Inhale comfortably through the nose, then make a soft, easy hum while exhaling. The site adds a quiet synthesized humming tone on the exhale; you may hum along or switch the sound off. No breath holds or pressure." },
  { id: "om", name: "Om · voiced exhale", sound: "om", steps: [["Breathe in gently", 4, .55, 1], ["Chant Om · A", 2, 1, .9], ["Chant Om · U", 2, .9, .78], ["Chant Om · M", 4, .78, .55]], note: "Inhale comfortably, then chant Om softly across an easy exhale, or listen to the site's quiet synthesized Om tone. Let the sound end naturally; do not extend or strain the breath. The sound is local and does not start YouTube." },
  { id: "bellows", name: "Bhastrika", steps: bellows, note: "Advanced breathwork. Choose a seated, stable position; keep every breath gentle. Stop immediately for dizziness, pain, or breathlessness. Avoid forceful breathing and holds if pregnant or if you have heart, blood-pressure, respiratory, or eye concerns; consult a qualified clinician first." },
  { id: "pumps", name: "Kapalbhati", steps: pumps, note: "Advanced breathwork, not a medical treatment. Skip during pregnancy and seek clinical guidance for heart, blood-pressure, respiratory, abdominal, or eye concerns. Keep effort mild and stop for any discomfort." }
];

export const SIT_DURATIONS = [5, 10, 15, 20, 30, 45];

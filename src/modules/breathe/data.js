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
  { id: "alternate", name: "Alternate nostril", steps: [["Inhale left", 4, .55, 1], ["Exhale right", 4, 1, .55], ["Inhale right", 4, .55, 1], ["Exhale left", 4, 1, .55]], note: "Inhale through the left side, exhale through the right; inhale right, then exhale left. Use a light touch, or breathe naturally if this is unfamiliar or uncomfortable." },
  { id: "bellows", name: "Bhastrika", steps: bellows, note: "Advanced breathwork. Choose a seated, stable position; keep every breath gentle. Stop immediately for dizziness, pain, or breathlessness. Avoid forceful breathing and holds if pregnant or if you have heart, blood-pressure, respiratory, or eye concerns; consult a qualified clinician first." },
  { id: "pumps", name: "Kapalbhati", steps: pumps, note: "Advanced breathwork, not a medical treatment. Skip during pregnancy and seek clinical guidance for heart, blood-pressure, respiratory, abdominal, or eye concerns. Keep effort mild and stop for any discomfort." }
];

export const SIT_DURATIONS = [5, 10, 15, 20, 30, 45];

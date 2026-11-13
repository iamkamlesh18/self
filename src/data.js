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

export const DATA = {
    tips: [
      "A pause can be the beginning of a different response.",
      "Let attention rest here; the next step can wait.",
      "Meet this moment with the kindness you would offer a friend.",
      "You can make room for a feeling without becoming the feeling.",
      "Let the breath be natural. Nothing needs to be earned in this moment.",
      "Clarity often arrives when you stop rushing the answer."
    ],
    paths: [
      { number: "01", name: "Clear", detail: "A short, careful breath practice", tab: "breathe", pattern: "bellows" },
      { number: "02", name: "Witness", detail: "Rest as the one who notices", tab: "advaita", set: "advaita" },
      { number: "03", name: "Bind", detail: "A loving, contemplative Kriya", tab: "kriya", set: "kriya" },
      { number: "04", name: "Reprogram", detail: "Choose words that meet you kindly", tab: "affirm", set: "affirm" },
      { number: "05", name: "Rest", detail: "Make time for stillness", tab: "sit" },
      { number: "06", name: "Create", detail: "Name an intention; meet it with action", tab: "affirm", set: "manifest" },
      { number: "07", name: "Ground", detail: "Explore the seven symbolic centres", tab: "chakras" },
      { number: "08", name: "Listen", detail: "Settle with nature sounds", tab: "nature" }
    ],
    breathPatterns: [
      { id: "calm", name: "Calm 4 · 4", steps: [inhale(4), exhale(4)], note: "An even, unforced rhythm. Keep the breath comfortable." },
      { id: "long-exhale", name: "4 · 6", steps: [inhale(4), exhale(6)], note: "Let the exhale lengthen only as far as feels easy." },
      { id: "box", name: "Box", steps: [inhale(4), hold(4), exhale(4), hold(4, .55)], note: "Four even parts. Skip either pause whenever you prefer." },
      { id: "478", name: "4 · 7 · 8", steps: [inhale(4), hold(7), exhale(8)], note: "A longer pattern. Shorten or skip the hold; never strain." },
      { id: "alternate", name: "Alternate nostril", steps: [["Inhale left", 4, .55, 1], ["Exhale right", 4, 1, .55], ["Inhale right", 4, .55, 1], ["Exhale left", 4, 1, .55]], note: "Inhale through the left side, exhale through the right; inhale right, then exhale left. Use a light touch, or breathe naturally if this is unfamiliar or uncomfortable." },
      { id: "bellows", name: "Bhastrika", steps: bellows, note: "Advanced breathwork. Choose a seated, stable position; keep every breath gentle. Stop immediately for dizziness, pain, or breathlessness. Avoid forceful breathing and holds if pregnant or if you have heart, blood-pressure, respiratory, or eye concerns; consult a qualified clinician first." },
      { id: "pumps", name: "Kapalbhati", steps: pumps, note: "Advanced breathwork, not a medical treatment. Skip during pregnancy and seek clinical guidance for heart, blood-pressure, respiratory, abdominal, or eye concerns. Keep effort mild and stop for any discomfort." }
    ],
    sitDurations: [5, 10, 15, 20, 30, 45],
    phraseSets: {
      affirm: {
        title: "Affirm",
        duration: 8,
        note: "Offer each sentence as a possibility, not a promise or a measure of your worth.",
        lines: [
          "I am grateful and thankful to the universe that I am earning lakhs of rupees every month.",
          "I am Paramshiva.",
          "I live as Paramshiva, manifesting health and wealth through this body.",
          "I care for my body with patience and respect.",
          "I welcome opportunities and meet them with clear action.",
          "I can learn, adapt, and build confidence one step at a time.",
          "I am open to receiving support and sharing what I can.",
          "I make steady choices that support the life I want."
        ]
      },
      manifest: {
        title: "Manifest",
        duration: 8,
        note: "A reflective intention can guide attention and action; it cannot guarantee money, health, or a particular outcome.",
        lines: [
          "I am grateful for the care and support present in my life today.",
          "I welcome meaningful work and take practical steps toward it.",
          "I am Paramshiva.",
          "I live as Paramshiva, manifesting health and wealth through this body.",
          "I meet opportunity with preparation, courage, and an open mind.",
          "I am grateful for the progress I make, one honest step at a time.",
          "I choose an intention and give it a thoughtful action today."
        ]
      },
      hooponopono: {
        title: "Ho'oponopono",
        duration: 5,
        note: "A Hawaiian practice with varied contemporary adaptations. These four familiar phrases are offered as a personal reflection, not a substitute for cultural context.",
        lines: ["I'm sorry.", "Please forgive me.", "Thank you.", "I love you."]
      },
      kriya: {
        title: "Soul Binding Kriya",
        duration: 18,
        note: "A contemplative sequence. Use it as visualization; you may pause, adapt, or stop at any point.",
        lines: [
          "Sit comfortably with a tall, easy spine. Let your eyes rest softly.",
          "I am a peaceful soul, a point of light shining on my forehead.",
          "My original nature is peace, love and purity.",
          "I am a child of the Supreme Soul, the ocean of peace and light.",
          "I connect my mind to the Supreme and receive rays of peace.",
          "I am bound in love to the One, and old patterns melt in this light.",
          "I fill with power, light and love.",
          "I send peaceful vibrations to the world.",
          "I rest in silence, light and content."
        ]
      },
      advaita: {
        title: "Advaita · Oneness",
        duration: 14,
        note: "A non-dual contemplation. Let the language be an invitation to inquire, rather than a belief you must adopt.",
        lines: [
          "There is One without a second.",
          "I am the awareness behind every thought.",
          "The body is my instrument.",
          "The mind is my tool.",
          "I am the soul, whole and free.",
          "Body, mind and soul are one team heading to one goal with no conflict.",
          "Thoughts are clouds; I am the sky."
        ]
      },
      pattern: {
        title: "Pattern Break",
        duration: 10,
        note: "Notice a familiar response with compassion, then choose one small action that reflects your values.",
        lines: [
          "I notice this familiar pattern with care, and I breathe.",
          "Each comfortable breath helps me return to this moment.",
          "I meet myself with compassion and begin again.",
          "I choose a response that is kind, steady, and wise.",
          "Awareness gives me room to choose a new pattern.",
          "I create from peace, love, and gratitude.",
          "First I clear, then I create."
        ]
      }
    },
    chakras: [
      { name: "Root", sanskrit: "Muladhara", color: "#b84d58", element: "Earth", location: "Base of the spine", petals: "4", seed: "LAM · लं", frequency: 396, focus: "Grounding, steadiness, and belonging", affirmation: "I meet this moment with steadiness and care.", practice: "Feel the support beneath your feet. Let your posture be easy and notice the ground holding you." },
      { name: "Sacral", sanskrit: "Svadhisthana", color: "#d67b45", element: "Water", location: "Lower abdomen", petals: "6", seed: "VAM · वं", frequency: 417, focus: "Creativity, feeling, and flow", affirmation: "I welcome creativity and allow room for change.", practice: "Try a gentle seated stretch or a slow sway. Notice sensation without needing to name it as good or bad." },
      { name: "Solar plexus", sanskrit: "Manipura", color: "#c5a447", element: "Fire", location: "Upper abdomen", petals: "10", seed: "RAM · रं", frequency: 528, focus: "Purpose, discernment, and confidence", affirmation: "I can take one clear and thoughtful step.", practice: "Sit comfortably and feel the movement of your natural breath around the abdomen. Let effort remain gentle." },
      { name: "Heart", sanskrit: "Anahata", color: "#57906a", element: "Air", location: "Centre of the chest", petals: "12", seed: "YAM · यं", frequency: 639, focus: "Compassion, care, and connection", affirmation: "I offer myself the patience I would offer a friend.", practice: "Rest a hand near the chest if comfortable. Notice the contact and let the shoulders soften." },
      { name: "Throat", sanskrit: "Vishuddha", color: "#528db0", element: "Space", location: "Throat", petals: "16", seed: "HAM · हं", frequency: 741, focus: "Expression, listening, and clarity", affirmation: "I can speak honestly and listen with care.", practice: "Notice your jaw and neck. If it feels comfortable, hum softly on an easy exhale or simply rest in silence." },
      { name: "Third eye", sanskrit: "Ajna", color: "#7168a8", element: "Light", location: "Between the eyebrows", petals: "2", seed: "OM · ॐ", frequency: 852, focus: "Attention, insight, and imagination", affirmation: "I make space to see this moment clearly.", practice: "Let your gaze soften or close your eyes if that feels safe. Notice sounds and sensations without following them." },
      { name: "Crown", sanskrit: "Sahasrara", color: "#9878ae", element: "Awareness", location: "Top of the head", petals: "Traditionally described as a thousand", seed: "OM · ॐ", frequency: 963, focus: "Stillness, awareness, and connection", affirmation: "I rest for a moment in quiet awareness.", practice: "Sit or lie in a comfortable position. Let the breath be natural and allow the room around you to be as it is." }
    ],
    wisdom: [
      {
        title: "Witnessing",
        source: "Osho · meditation and awareness",
        text: "A useful contemplative pointer is to notice a thought as an event in awareness. Let it be seen without immediately following or suppressing it. This is original summary, not a quotation or a claim that one method fits everyone."
      },
      {
        title: "Self-inquiry",
        source: "Ramana Maharshi · Advaita Vedanta",
        text: "When a thought appears, gently ask what is aware of it. Follow the inquiry toward direct experience rather than trying to answer with another concept. Pause if the question feels unsettling."
      },
      {
        title: "Recognition",
        source: "Siddharameshwar Maharaj · non-dual inquiry",
        text: "Use discrimination to distinguish passing experiences from the awareness in which they are known. Treat this as a contemplative lens, not as a reason to neglect the body's needs or relationships."
      },
      {
        title: "112 doorways",
        source: "Vigyan Bhairav Tantra · contemplative tradition",
        text: "The text is known for many meditation doorways involving breath, sensation, sound, and space. This app offers a few gentle themes in original wording; translations and interpretations vary. Skip breath retention and any technique that feels uncomfortable."
      },
      {
        title: "Samyama",
        source: "Patanjali's Yoga Sutras · Sivananda's commentary",
        text: "In the traditional model, concentration, meditation, and absorption are brought together around one chosen focus. The supplied commentaries describe extraordinary attainments; those are spiritual claims, not verified abilities or promised outcomes. Let steadiness and humility matter more than powers."
      },
      {
        title: "Create with care",
        source: "Intention and daily action",
        text: "An intention can help organize attention and behavior. Pair a phrase with a specific, realistic next step, and let changing circumstances inform your choices. Reflection is not a substitute for medical, financial, or mental-health support."
      }
    ],
    natureSounds: [
      { id: "rain", name: "Rain", icon: "🌧", type: "white" },
      { id: "ocean", name: "Ocean", icon: "🌊", type: "brown" },
      { id: "wind", name: "Wind", icon: "🍃", type: "brown" },
      { id: "stream", name: "Stream", icon: "💧", type: "white" },
      { id: "birds", name: "Birds", icon: "🐦", type: "chirps" },
      { id: "crickets", name: "Crickets", icon: "🌙", type: "tone" },
      { id: "fire", name: "Fire", icon: "🔥", type: "crackle" }
    ],
    tones: [
      { frequency: 174, label: "Ease" }, { frequency: 285, label: "Renewal" },
      { frequency: 396, label: "Release" }, { frequency: 417, label: "Change" },
      { frequency: 432, label: "Calm" }, { frequency: 528, label: "Harmony" },
      { frequency: 639, label: "Connection" }, { frequency: 741, label: "Clarity" },
      { frequency: 852, label: "Insight" }, { frequency: 963, label: "Crown" },
      { frequency: 136.1, label: "Om" }
    ],
    binaural: [{ label: "Delta", beat: 2 }, { label: "Theta", beat: 6 }, { label: "Alpha", beat: 10 }],
    journeyDurations: [10, 20, 30, 60]
};

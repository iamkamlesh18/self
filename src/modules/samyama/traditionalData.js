const topic = (id, name, section, traditionalClaim, focus, caution = "") => ({
  id,
  name,
  section,
  traditionalClaim,
  focus,
  caution
});

export const SAMYAMA_SOURCES = [
  {
    id: "external",
    title: "Samyama on External Objects",
    topics: [
      topic(
        "sun",
        "Sun and the worlds",
        "External Objects · On the Sun",
        "The commentary says Samyama on the Sun brings knowledge of the worlds. It describes seven higher lokas—Bhu, Bhuvar, Swar, Mahar, Jana, Tapo, Satya—and seven lower lokas—Sutala, Vitala, Talatala, Mahatala, Rasatala, Atala, Patala.",
        "Use a remembered or pictured Sun as the single object. Notice its light, warmth, and steady radiance as contemplative qualities; do not look directly at the Sun.",
        "Never stare at the Sun. This is a traditional claim, not a promise of cosmic knowledge."
      ),
      topic(
        "moon",
        "Moon and star regions",
        "External Objects · On the Moon",
        "The source attributes knowledge of star regions to Samyama on the Moon.",
        "Use the Moon as a remembered or pictured symbol and keep attention with that one image.",
        "Do not treat this as an astronomy method or a promise of unseen knowledge."
      ),
      topic(
        "pole-star",
        "Pole Star and celestial motion",
        "External Objects · On the Pole Star",
        "The commentary says Samyama on the Pole Star reveals the movements of the stars.",
        "Hold the idea or image of the Pole Star steadily; notice the difference between the symbol and your thoughts about it.",
        "This is a traditional spiritual claim, not a substitute for astronomy."
      ),
      topic(
        "exemplars",
        "Elephant, Hanuman, and Vāyu",
        "External Objects · Strength of an elephant",
        "The source says Samyama on an elephant's strength brings that strength, and names Hanuman and Vāyu as further exemplars whose powers a yogi may receive.",
        "Contemplate one exemplar—elephant, Hanuman, or Vāyu—and the quality of strength or service associated with it.",
        "Contemplation does not grant physical or supernatural powers."
      ),
      topic(
        "body-form",
        "Form of the body",
        "External Objects · Form of the body",
        "The commentary describes disappearance of the body when its perceptibility and connection with seeing are overcome through Samyama.",
        "Use the ordinary outline of your own body as the focus. Notice seeing and bodily sensation while staying grounded.",
        "Do not attempt to impair vision, dissociate, or make the body disappear; the text's claim is not a verified effect."
      ),
      topic(
        "sense-objects",
        "Sound, touch, taste, and smell",
        "External Objects · Sense-organs",
        "The source extends its account of altered perception to sound, touch, taste, and smell, describing them as becoming imperceptible when their sensory connections are severed.",
        "Choose one comfortable sensation and observe how it is noticed. Let all senses remain available and functioning normally.",
        "Do not block, injure, or deliberately deprive yourself of sensory input."
      ),
      topic(
        "signs",
        "Observable signs in others",
        "External Objects · Signs",
        "The commentary claims that Samyama on another person's signs—such as complexion or voice—can reveal the nature of that person's mind.",
        "Notice one observable cue in a neutral interaction, then separate the cue from your interpretation. Prefer asking over guessing.",
        "This is not a way to read minds or infer private thoughts."
      ),
      topic(
        "mind-contents",
        "Signs are not mind-contents",
        "External Objects · Samyama on Mind",
        "The next passage limits the previous claim: signs may suggest a general nature, but do not disclose the specific contents of another person's mind.",
        "Use the distinction itself as the focus: what you observe, what you infer, and what you cannot know without asking.",
        "Respect other people's privacy; do not present guesses as knowledge."
      ),
      topic(
        "ksana",
        "A small point of time",
        "External Objects · Samyama on Time",
        "The source says attending to a kṣaṇa, the smallest point of time, and the sequence of moments yields discriminative knowledge.",
        "Choose one simple event and attend to its beginning, change, and ending, one moment at a time.",
        "This contemplation does not predict the future or reveal hidden facts."
      ),
      topic(
        "distinction",
        "Class, qualities, and place",
        "External Objects · Distinguishing similar things",
        "The commentary says sequence in time distinguishes things that seem alike by class, characteristics, or location—for example, animals of different kinds, colors, or positions.",
        "Compare two ordinary objects: what category they share, what quality differs, and where each is placed.",
        "Treat this as careful observation, not supernatural discernment."
      ),
      topic(
        "ear-ether",
        "Ear and ether",
        "External Objects · Ear and ether",
        "The source attributes divine or distant hearing to Samyama on the relation between the ear and ether.",
        "Attend to ordinary nearby sound, then include pauses and quiet without straining to hear more.",
        "Do not expect clairaudience or force listening."
      ),
      topic(
        "body-ether",
        "Body and ether",
        "External Objects · Ether and body",
        "The commentary claims that Samyama on the relation of body and ether, or on lightness like cotton, gives a yogi lightness and passage through air, including movement like a bird.",
        "Contemplate the felt space around the body while remaining safely seated or standing.",
        "Do not attempt jumping, flying, falling, or any unsafe bodily test."
      )
    ]
  },
  {
    id: "internal",
    title: "Samyama on Internal Centres",
    topics: [
      topic(
        "mind-changes",
        "Changes of the mind",
        "Internal Centres · Modifications of Mind",
        "The source says direct Samyama on the three modifications of mind yields knowledge of past and future.",
        "Observe one thought arising, changing, and fading in the present. Notice sequence without making predictions.",
        "This practice does not recover the past or foretell the future."
      ),
      topic(
        "maha-videha",
        "Mahā-videha and the light of awareness",
        "Internal Centres · Videha",
        "The commentary describes a 'great bodiless' state in which the mind functions apart from the body, the veil over knowledge is removed, and Sattva is no longer obscured by Rajas and Tamas.",
        "Treat the idea as a contemplative teaching. Keep awareness of body contact and the room while reflecting on it.",
        "No out-of-body practice is guided or implied. Stop and ground yourself if you feel detached or unsettled."
      ),
      topic(
        "samskaras",
        "Saṃskāras and impressions",
        "Internal Centres · Samskaras",
        "The text describes saṃskāras as impressions left by actions and experiences, and traditionally links Samyama on them with knowledge of previous births.",
        "Choose a mild, present-day habit. Notice its cue, thought, and response without searching memory or trying to retrieve a past life.",
        "This is reflection on habits, not memory recovery or proof of past lives."
      ),
      topic(
        "indriyas",
        "The five sense faculties",
        "Internal Centres · Indriya",
        "The commentary describes five aspects of the senses: their power of cognition, their particular nature, egoism, the three qualities, and their purpose; Samyama is said to bring mastery of the senses.",
        "Notice one sense experience and the mind's response to it, then return to your chosen object without suppressing the sense.",
        "Do not use deprivation or force to control the senses."
      ),
      topic(
        "indriya-siddhis",
        "Powers attributed to sense-mastery",
        "Internal Centres · Siddhis for Samyama on Indriyas",
        "The source attributes quick movement like the mind, perception without the ordinary senses, and mastery over nature to this practice.",
        "Contemplate the claim as a traditional account. For practice, remain with an ordinary sense experience and the idea of attention itself.",
        "These powers are not verified outcomes and are not attempted in this guide."
      ),
      topic(
        "udana",
        "Udāna Vāyu",
        "Internal Centres · Udana Vayu",
        "The commentary links mastery of Udāna Vāyu with freedom from contact with water, mud, and thorns, lightness, and choosing the time of death.",
        "Read or hold the term Udāna as the single object; notice natural breathing without controlling it.",
        "No breath retention, exposure, fasting, or death-related exercise is part of this practice."
      ),
      topic(
        "samana",
        "Samāna Vāyu and radiance",
        "Internal Centres · Samana Vayu",
        "The source attributes bodily radiance and the ability to create fire from the body to mastery of Samāna Vāyu, and tells the story of sage Sarabhanga and Rāma.",
        "Contemplate the traditional story or the idea of warmth as a symbol while staying physically comfortable.",
        "Do not attempt to create heat, fire, or endure extreme temperatures."
      )
    ]
  },
  {
    id: "in-depth",
    title: "Samyama In-Depth",
    topics: [
      topic(
        "virtues",
        "Friendliness and other virtues",
        "In-Depth · Samyama on Virtues",
        "The commentary says Samyama on friendliness and virtues such as compassion and appreciative joy deepens those qualities and may radiate them to others.",
        "Choose friendliness, compassion, appreciative joy, or another virtue; hold one quality and a simple wish for wellbeing.",
        "Treat the effect on others as a traditional belief, not a guaranteed transmission."
      ),
      topic(
        "sattva-purusha",
        "Sattva and Puruṣa",
        "In-Depth · Samyama on Discrimination",
        "The text describes discriminating Sattva from Puruṣa as bringing omnipotence, omniscience, and a state called Visoka, or freedom from sorrow.",
        "Reflect on the difference between a changing mental state and the awareness that notices it.",
        "This is a philosophical contemplation; it does not promise omniscience or freedom from grief."
      ),
      topic(
        "sabda-artha",
        "Śabda, artha, and knowledge",
        "In-Depth · Word, Meaning, and Knowledge",
        "The source says separating word, meaning, and the knowledge they evoke can reveal the sounds of living beings, including animal calls and nature's music.",
        "Choose one familiar word or natural sound. Notice its sound, the meaning you attach, and the knowing of it as three aspects of one focus.",
        "Do not claim to translate animal speech or hidden sounds."
      ),
      topic(
        "karma",
        "Karma and consequences",
        "In-Depth · Samyama on Karma",
        "The commentary distinguishes actions said to bear fruit quickly or later and claims Samyama or portents can reveal the time of death. It also recounts Pattinattu Swami compressing a period associated with Saturn from seven and a half years to about three hours.",
        "Reflect on one ordinary action, its immediate effects, and what may follow from it. Keep attention on choices available now.",
        "This is not fortune-telling or a method for predicting death."
      ),
      topic(
        "nabhi",
        "Nābhi / Maṇipūra",
        "In-Depth · Chakras and Nadis · Navel",
        "The source identifies the navel centre with Maṇipūra and says Samyama there gives knowledge of the body's structure, including its seven dhātus (tissue constituents).",
        "Use the navel as a symbolic point on a traditional body map; notice ordinary sensation without manipulating the breath.",
        "Chakra descriptions are spiritual traditions, not medical anatomy or diagnosis."
      ),
      topic(
        "vishuddha",
        "Viśuddha / throat",
        "In-Depth · Chakras and Nadis · Throat",
        "The commentary says Samyama at the throat centre removes hunger and thirst.",
        "Use the throat as a symbolic point of attention and notice natural sensations such as swallowing.",
        "Never use this claim to restrict food or water or delay care."
      ),
      topic(
        "sahasrara",
        "Sahasrāra / crown",
        "In-Depth · Chakras and Nadis · Crown",
        "The text associates Samyama on the light at the crown with seeing Siddhas, described there as spiritual beings.",
        "Contemplate the crown as a point in the traditional map, or imagine a soft light without trying to produce a vision.",
        "Visions are not promised or treated as evidence of spiritual attainment."
      ),
      topic(
        "anahata",
        "Anāhata / heart",
        "In-Depth · Chakras and Nadis · Heart",
        "The source says Samyama on the heart centre reveals the contents of the mind.",
        "Use the heart area as a symbolic focus for observing your own thoughts and feelings with care.",
        "This does not reveal another person's private thoughts."
      ),
      topic(
        "kurma-nadi",
        "Kūrma Nāḍī",
        "In-Depth · Chakras and Nadis · Kurma Nadi",
        "The commentary associates the Kūrma Nāḍī, described as being in the chest below the throat, with steadiness of the body.",
        "Choose a comfortable posture and notice support through the torso. Let the eyes blink and the body move if needed.",
        "Do not fix the gaze, hold a posture through pain, or attempt to control a subtle channel."
      ),
      topic(
        "inner-light",
        "Inner light",
        "In-Depth · Chakras and Nadis · Inner Light",
        "The text says Samyama on an inner light in the heart reveals subtle, obscured, or distant things; its examples include hidden objects, remote places, atoms, and writing inside a sealed envelope.",
        "Use a remembered gentle light or the ordinary sense of awareness as a symbolic focus.",
        "Do not expect clairvoyance or treat imagery as proof of hidden facts."
      ),
      topic(
        "purusha-self",
        "One's own Self",
        "In-Depth · Samyama on One's Own Self",
        "The commentary says reflection on the distinction between Sattva and Puruṣa can bring knowledge of Puruṣa, the witnessing principle in this philosophy.",
        "Notice an experience—sound, thought, or sensation—and the fact that it is being noticed, without forcing a metaphysical conclusion.",
        "This is a philosophical teaching, not a test of identity or mental health."
      ),
      topic(
        "pratibha-senses",
        "Intuition and the five senses",
        "In-Depth · Benefits of Samyama on One's Self",
        "The source attributes remote hearing, touch, sight, taste, and smell through intuition to this practice.",
        "Notice the ordinary information available through one sense, and distinguish it from imagination or inference.",
        "No extrasensory perception is promised or trained."
      ),
      topic(
        "pratibha",
        "Pratibhā",
        "In-Depth · Fruits of Pratibha",
        "The commentary describes Pratibhā as spontaneous intuition that yields comprehensive knowledge.",
        "If an insight appears, hold it as a thought, then check it against ordinary evidence and experience.",
        "Do not treat intuition as infallible or as a prediction."
      ),
      topic(
        "taraka",
        "Tāraka knowledge",
        "In-Depth · What is Taraka",
        "The text describes discriminative knowledge as Tāraka, extending across all objects and their conditions without ordinary succession, and associates it with comprehensive or all-knowing insight.",
        "Choose one changing object and distinguish its qualities, context, and changes in sequence.",
        "This exercise trains careful observation; it does not yield all-knowing insight."
      ),
      topic(
        "parakaya",
        "Parakāya Praveśa",
        "In-Depth · Mind entering another body",
        "The source recounts the traditional claim that a yogi's mind may enter another body, with stories about Śaṅkara and other figures.",
        "Contemplate the story as a teaching about identity and attention while staying aware of your own body and boundaries.",
        "No out-of-body or body-entry method is provided or should be attempted."
      ),
      topic(
        "created-minds",
        "Nirmāṇa Cittāni",
        "In-Depth · Source of Created Minds",
        "The commentary says created minds arise from egoism when a yogi creates multiple bodies for simultaneous experience.",
        "Use the concept as a metaphor for the many roles and thoughts that appear in one mind; notice what coordinates them.",
        "This is a traditional metaphysical claim, not a technique for creating minds."
      ),
      topic(
        "director-mind",
        "The directing mind",
        "In-Depth · Original Mind is the Director",
        "The source says one original mind directs the different functions of created minds.",
        "Notice how attention shifts among tasks and gently choose one task to return to.",
        "No claim of controlling multiple minds is made here."
      ),
      topic(
        "prakriti",
        "Prakṛti and transformation",
        "In-Depth · The Play of Prakriti",
        "The commentary attributes transformation from one form or class to another to the flow of Prakṛti, or nature.",
        "Observe a natural change—light, a leaf, or a sensation—as a single object changing over time.",
        "Do not interpret ordinary change as a promised bodily transformation."
      ),
      topic(
        "removing-obstacles",
        "Removing obstacles",
        "In-Depth · Causes in the Action of Prakriti",
        "The source compares supportive causes to a farmer clearing obstructions so water can flow, and says virtue removes barriers to development. It describes hidden potential unfolding through nature—from minerals and plants to animals and people—and knowledge and peace flowing when ignorance and egoism are removed.",
        "Choose one practical obstacle to a quality you value and one small way to make that action easier.",
        "Treat the passage as a metaphor for practice, not a guarantee of spiritual transformation."
      ),
      topic(
        "elements",
        "The elements and their forms",
        "In-Depth · Samyama on Forms",
        "The text discusses gross and subtle forms of the elements, their qualities and the three guṇas, naming sound, touch, form, taste, and smell; it claims mastery permits command of nature and creation.",
        "Choose one sensory quality—sound, touch, color, taste, or smell—and attend to how it is experienced.",
        "This is sensory contemplation, not control of physical elements."
      ),
      topic(
        "eight-siddhis",
        "The eight Siddhis",
        "In-Depth · Eight Siddhis",
        "The commentary lists Aṇimā (minute size), Mahimā (great size), Laghimā (lightness), Garimā (heaviness), Prāpti (reach), Prākāmya (fulfilled desire), Īśatva (creation), and Vaśitva (command), while saying a yogi should not disrupt the world's order.",
        "Choose one name from the list as an idea to contemplate, then notice the wish for power or certainty that may accompany it.",
        "These are traditional supernatural claims, not outcomes this practice can deliver."
      ),
      topic(
        "body-perfection",
        "Kāya-sampat / body perfection",
        "In-Depth · Perfection of Body",
        "The source describes bodily perfection through beauty, grace, strength, and adamantine hardness; it also claims yogis may withstand heat and cold or live without food or water by drawing on the Sun, cosmic prāṇa, will, air, or nectar.",
        "Reflect on care, comfort, and respect for the body as it is today.",
        "Do not attempt fasting, dehydration, heat or cold exposure, pain, or breath restriction."
      ),
      topic(
        "means-siddhis",
        "Traditional means attributed to Siddhis",
        "In-Depth · Other Means for Siddhis",
        "The text attributes Siddhis to birth, drugs, mantras, tapas, or Samadhi. Its examples include Kapila, Ashtavakra, Vāmadeva, Mandavya, Visvamitra, mercury preparations, Nux-Vomica, Neem and other herbs; it claims some herbs remove hunger or thirst, some once spoke, and Rasayana preparations may prolong life.",
        "Read the list as a record of traditional beliefs; make the single focus the difference between reading a claim and testing it safely.",
        "Do not ingest substances, use unknown herbs or metals, fast, or perform severe austerities."
      ),
      topic(
        "gradual-practice",
        "Practice by gradual steps",
        "In-Depth · Instruction on Samyama · Gradual Practice",
        "The commentary says practice proceeds by stages, from an image with all its parts toward subtler and less differentiated contemplation, and compares progress to passing through intermediate stations on a journey. It also describes four traditional stages of yogi.",
        "Choose one accessible object and stay with it. Let continuity, not intensity, be the measure of this session.",
        "Do not force advanced states or continue through distress."
      ),
      topic(
        "siddhis-obstacles",
        "Siddhis as obstacles",
        "In-Depth · Siddhis are Obstacles",
        "The source warns that extraordinary powers may distract an outwardly directed mind from the highest aim.",
        "Notice any wish to gain a special experience. Let it be present without letting it replace your chosen object.",
        "The session is not a test of powers or attainment."
      ),
      topic(
        "renunciation",
        "Letting go of attainments",
        "In-Depth · Give Up Siddhis",
        "The commentary says relinquishing attachment to Siddhis removes a seed of bondage and points toward Kaivalya, or independence.",
        "Use non-attachment as the object: notice a result you want, then return to the present focus.",
        "Do not judge yourself for having hopes or spiritual ambitions."
      ),
      topic(
        "deva-temptations",
        "Devas, temptation, and pride",
        "In-Depth · Avoid Temptations",
        "The text warns of celestial invitations, pride, and false satisfaction as obstacles. Its examples include promises of a celestial vehicle, wish-granting objects, celestial attendants, visions, and an ageless body, and it recalls Viśvāmitra's story as a caution.",
        "Contemplate the story as a reminder to notice pride, distraction, or desire and return to what matters.",
        "The story is presented as traditional teaching, not as a claim that celestial beings will appear."
      )
    ]
  }
];
export const SAMYAMA_TOPICS = SAMYAMA_SOURCES.flatMap(source =>
  source.topics.map(item => ({ ...item, sourceTitle: source.title, sourceId: source.id }))
);

export const SAMYAMA_LIMBS = [
  {
    name: "Dhāraṇā · attention",
    description: "Keep the selected object in view. When attention wanders, return to that same object."
  },
  {
    name: "Dhyāna · continuity",
    description: "Let attention flow steadily toward the object. Notice its details without switching to another topic."
  },
  {
    name: "Samādhi · absorption",
    description: "Let the object fill awareness as far as it naturally can; do not force blankness or claim an attainment."
  }
];

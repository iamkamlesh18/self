(() => {
  "use strict";

  const DATA = window.ROOTED_CONTENT;
  const $ = id => document.getElementById(id);
  const q = (selector, root = document) => [...root.querySelectorAll(selector)];
  const TABS = [
    ["home", "Home"], ["breathe", "Breathe"], ["sit", "Sit"], ["chakras", "Chakras"], ["affirm", "Affirm"],
    ["kriya", "Kriya"], ["advaita", "Advaita"], ["nature", "Nature"], ["tones", "Tones"],
    ["music", "Music"], ["wisdom", "Wisdom"], ["journey", "Journey"]
  ];
  const state = {
    tab: "home",
    theme: storageGet("come-home-theme", ""),
    chimes: storageGet("come-home-chimes", true),
    customIntentions: storageGet("come-home-intentions", []),
    history: storageGet("come-home-history", { sessions: 0, days: {} }),
    breathId: "calm",
    sitMinutes: 10,
    chakraIndex: 0,
    session: null,
    phrase: {
      affirm: { set: "affirm", index: 0, auto: false, read: false, timer: 0 },
      kriya: { set: "kriya", index: 0, auto: false, read: false, timer: 0 },
      advaita: { set: "advaita", index: 0, auto: false, read: false, timer: 0 }
    },
    nature: new Map(),
    noiseBuffers: new Map(),
    tone: null,
    journey: { active: false, index: 0, seconds: 20, timer: 0 },
    speakerMode: false,
    audioPaused: false,
    audioContext: null,
    output: null,
    compressor: null,
    boost: null,
    natureBus: null,
    streamDestination: null,
    directOutput: false,
    audioFallback: null,
    youtube: {
      host: "https://www.youtube-nocookie.com",
      video: "9THx_-Y1YJg",
      playlist: "",
      ready: false,
      playing: false,
      wantPlay: false,
      sessionLinked: false,
      timeout: 0,
      retries: 0,
      externalUrl: "https://youtu.be/9THx_-Y1YJg"
    }
  };

  if (!state.history || typeof state.history !== "object" || !state.history.days) state.history = { sessions: 0, days: {} };
  if (!Array.isArray(state.customIntentions)) state.customIntentions = [];
  document.documentElement.dataset.theme = state.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  $("chimeToggle").setAttribute("aria-pressed", String(state.chimes));

  function storageGet(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn(`Could not read ${key} from local storage.`, error);
      return fallback;
    }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { console.warn(`Could not save ${key} to local storage.`, error); }
  }

  function todayKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function streakDays() {
    const days = new Set(Object.keys(state.history.days));
    const cursor = new Date();
    if (!days.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let count = 0;
    while (days.has(todayKey(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
  }

  function recordPractice(seconds, completed) {
    const amount = Math.max(0, Math.floor(seconds));
    if (amount < 1) return;
    const key = todayKey();
    state.history.days[key] = (state.history.days[key] || 0) + amount;
    if (completed) state.history.sessions = (state.history.sessions || 0) + 1;
    storageSet("come-home-history", state.history);
    renderHomeStats();
    renderJourney();
  }

  function renderHomeStats() {
    const seconds = state.history.days[todayKey()] || 0;
    $("minutesToday").textContent = String(Math.floor(seconds / 60));
    $("dayStreak").textContent = String(streakDays());
  }

  function renderJourney() {
    const dayEntries = Object.entries(state.history.days).sort((a, b) => b[0].localeCompare(a[0]));
    $("journeySessions").textContent = String(state.history.sessions || 0);
    $("journeyMinutes").textContent = String(Math.floor(dayEntries.reduce((sum, [, seconds]) => sum + seconds, 0) / 60));
    $("journeyStreak").textContent = String(streakDays());
    const recent = dayEntries.slice(0, 7);
    $("practiceHistory").replaceChildren(...(recent.length ? recent.map(([day, seconds]) => {
      const row = document.createElement("div");
      row.className = "history-row";
      const date = document.createElement("span");
      const value = document.createElement("strong");
      const parsed = new Date(`${day}T12:00:00`);
      date.textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(parsed);
      value.textContent = `${Math.floor(seconds / 60)} min`;
      row.append(date, value);
      return row;
    }) : [Object.assign(document.createElement("p"), { className: "practice-note", textContent: "Your practice days will appear here." })]));
  }

  function renderWisdom(container) {
    container.replaceChildren(...DATA.wisdom.map(item => {
      const card = document.createElement("article");
      card.className = "wisdom-card";
      const source = document.createElement("p");
      const title = document.createElement("h3");
      const text = document.createElement("p");
      source.className = "eyebrow";
      source.textContent = item.source;
      title.textContent = item.title;
      text.textContent = item.text;
      card.append(source, title, text);
      return card;
    }));
  }

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    $("themeToggle").setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    storageSet("come-home-theme", theme);
  }

  function renderTabs() {
    $("tabs").replaceChildren(...TABS.map(([id, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.id = `tab-${id}`;
      button.dataset.tab = id;
      button.className = "tab";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", `t-${id}`);
      button.setAttribute("aria-selected", String(id === state.tab));
      button.tabIndex = id === state.tab ? 0 : -1;
      button.textContent = label;
      button.addEventListener("click", () => selectTab(id));
      button.addEventListener("keydown", event => {
        const index = TABS.findIndex(([tab]) => tab === id);
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = TABS.length - 1;
        else return;
        event.preventDefault();
        const [target] = TABS[next];
        selectTab(target);
        $(`tab-${target}`).focus();
      });
      return button;
    }));
  }

  function selectTab(tab) {
    if (!TAB_LABELS[tab]) return;
    state.tab = tab;
    TABS.forEach(([id]) => {
      const section = $(`t-${id}`);
      const music = id === "music";
      if (music) {
        section.classList.toggle("offscreen", tab !== "music");
        section.setAttribute("aria-hidden", String(tab !== "music"));
        section.inert = tab !== "music";
      } else {
        section.hidden = tab !== id;
      }
      const button = $(`tab-${id}`);
      button.setAttribute("aria-selected", String(tab === id));
      button.tabIndex = tab === id ? 0 : -1;
    });
    if (tab === "journey") renderJourney();
    $("tabs").querySelector(`[data-tab="${tab}"]`)?.scrollIntoView?.({ block: "nearest", inline: "center" });
    stopPhraseTimers();
  }

  function renderHome() {
    const thought = DATA.tips[Math.floor(Math.random() * DATA.tips.length)];
    $("dailyThought").textContent = thought;
    $("pathGrid").replaceChildren(...DATA.paths.map(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "path-card";
      button.innerHTML = `<span class="path-number">${item.number}</span><span><strong>${item.name}</strong><small>${item.detail}</small></span>`;
      button.addEventListener("click", () => {
        if (item.set) switchPhrase(item.tab, item.set);
        if (item.pattern) selectBreathPattern(item.pattern);
        if (item.tab === "sit") renderSitChoices();
        selectTab(item.tab);
      });
      return button;
    }));
  }

  function renderChakra(index = state.chakraIndex) {
    const chakra = DATA.chakras[index];
    state.chakraIndex = index;
    $("chakraChoices").querySelectorAll(".chakra-choice").forEach((button, choiceIndex) => {
      button.setAttribute("aria-pressed", String(choiceIndex === index));
    });
    $("chakraMark").style.setProperty("--chakra-color", chakra.color);
    $("chakraSeed").textContent = chakra.seed;
    $("chakraName").textContent = `${chakra.name} · ${chakra.sanskrit}`;
    $("chakraFocus").textContent = chakra.focus;
    $("chakraLocation").textContent = chakra.location;
    $("chakraElement").textContent = chakra.element;
    $("chakraPetals").textContent = chakra.petals;
    $("chakraFrequency").textContent = `${chakra.frequency} Hz`;
    $("chakraAffirmation").textContent = chakra.affirmation;
    $("chakraPractice").textContent = chakra.practice;
  }

  function renderChakraChoices() {
    $("chakraChoices").replaceChildren(...DATA.chakras.map((chakra, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chip chakra-choice";
      button.textContent = chakra.name;
      button.dataset.chakra = String(index);
      button.style.setProperty("--chakra-color", chakra.color);
      button.setAttribute("aria-pressed", String(index === state.chakraIndex));
      button.addEventListener("click", () => renderChakra(index));
      return button;
    }));
  }

  function setPracticeButton(button, running, startText) {
    button.textContent = running ? "Pause" : startText;
    button.setAttribute("aria-label", running ? "Pause practice" : startText);
  }

  function currentElapsed(session) {
    return session.elapsed + (session.running ? (performance.now() - session.startedAt) / 1000 : 0);
  }

  function ensureAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      $("youtubeNotice").textContent = "Web Audio is unavailable in this browser. You can still use the YouTube player.";
      return null;
    }
    if (state.audioContext) {
      state.audioPaused = false;
      if (state.audioContext.state === "suspended") state.audioContext.resume().catch(error => console.warn("Audio could not resume.", error));
      return state.audioContext;
    }

    const context = new AudioContext();
    const output = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const boost = context.createGain();
    const natureBus = context.createGain();
    compressor.threshold.value = -18;
    compressor.ratio.value = 6;
    boost.gain.value = state.speakerMode ? 2.4 : 1;
    natureBus.gain.value = Number($("natureVolume").value) / 100;
    output.connect(compressor);
    compressor.connect(boost);
    natureBus.connect(output);
    state.audioContext = context;
    state.output = output;
    state.compressor = compressor;
    state.boost = boost;
    state.natureBus = natureBus;
    context.addEventListener("statechange", updateMiniPlayer);

    try {
      const destination = context.createMediaStreamDestination();
      const audio = $("audioOutput");
      boost.connect(destination);
      audio.srcObject = destination.stream;
      state.streamDestination = destination;
      const play = audio.play();
      if (play?.catch) play.catch(error => {
        console.warn("Background audio output was unavailable; using the browser audio output.", error);
        connectDirectAudio();
      });
      try {
        if ("mediaSession" in navigator && "MediaMetadata" in window) {
          navigator.mediaSession.metadata = new MediaMetadata({ title: "Come Home", artist: "A practice of presence" });
          navigator.mediaSession.setActionHandler("play", resumeAllAudio);
          navigator.mediaSession.setActionHandler("pause", pauseAllAudio);
        }
      } catch (error) {
        console.warn("Media Session controls are unavailable.", error);
      }
    } catch (error) {
      console.warn("Background audio routing is unavailable; using the browser audio output.", error);
      connectDirectAudio();
    }
    context.resume().catch(error => console.warn("Audio could not start.", error));
    return context;
  }

  function connectDirectAudio() {
    if (!state.audioContext || state.directOutput) return;
    if (state.streamDestination) {
      try { state.boost.disconnect(state.streamDestination); } catch {}
    }
    state.boost.connect(state.audioContext.destination);
    state.directOutput = true;
  }

  function resumeAllAudio() {
    state.audioPaused = false;
    if (state.audioContext?.state === "suspended") state.audioContext.resume().catch(error => console.warn("Audio could not resume.", error));
    if (state.youtube.pausedByMini) {
      state.youtube.pausedByMini = false;
      sendYoutubeCommand("playVideo");
    }
    updateMiniPlayer();
  }

  function pauseAllAudio() {
    state.audioPaused = true;
    const hadYoutube = state.youtube.playing || state.youtube.wantPlay;
    if (state.audioContext?.state === "running") state.audioContext.suspend().catch(error => console.warn("Audio could not pause.", error));
    if (hadYoutube) {
      state.youtube.pausedByMini = true;
      state.youtube.wantPlay = false;
      sendYoutubeCommand("pauseVideo");
    }
    updateMiniPlayer();
  }

  function toggleAllAudio() {
    const paused = state.audioPaused || state.audioContext?.state === "suspended";
    if (paused) resumeAllAudio();
    else pauseAllAudio();
  }

  function chime(kind = "middle", duration = 1.1) {
    if (!state.chimes || state.audioPaused) return;
    const context = ensureAudio();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const frequency = kind === "high" ? 523.25 : kind === "low" ? 392 : 440;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.001, context.currentTime);
    gain.gain.linearRampToValueAtTime(.12, context.currentTime + .025);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(state.output);
    oscillator.start();
    oscillator.stop(context.currentTime + duration + .05);
  }

  function vibrate() {
    if ("vibrate" in navigator) navigator.vibrate(24);
  }

  function practiceNote(kind) {
    if (state.session && state.session.musicLinked) sendYoutubeCommand(kind === "pause" ? "pauseVideo" : "playVideo");
  }

  function stopSessionTimers(session) {
    if (session.raf) cancelAnimationFrame(session.raf);
    if (session.interval) clearInterval(session.interval);
    session.raf = 0;
    session.interval = 0;
  }

  function startSession(kind) {
    if (state.session && state.session.kind === kind) {
      if (state.session.running) pauseSession();
      else resumeSession();
      return;
    }
    if (state.session) finishSession(false);
    const session = {
      kind,
      running: true,
      elapsed: 0,
      startedAt: performance.now(),
      lastStep: -1,
      raf: 0,
      interval: 0,
      duration: kind === "sit" ? state.sitMinutes * 60 : Infinity,
      pattern: state.breathId,
      musicLinked: $("musicWithSessions").checked
    };
    state.session = session;
    if (kind === "breathe") setPracticeButton($("breathStart"), true, "Start");
    else setPracticeButton($("sitStart"), true, "Begin sitting");
    ensureAudio();
    if (kind === "sit") chime("middle", 2);
    if (session.musicLinked) {
      state.youtube.sessionLinked = true;
      playYoutube();
    }
    session.raf = requestAnimationFrame(() => animateSession(session));
    session.interval = window.setInterval(() => renderSession(session), 250);
    renderSession(session);
    updateMiniPlayer();
  }

  function pauseSession() {
    const session = state.session;
    if (!session || !session.running) return;
    session.elapsed = currentElapsed(session);
    session.running = false;
    stopSessionTimers(session);
    practiceNote("pause");
    if (session.kind === "breathe") setPracticeButton($("breathStart"), false, "Resume");
    else setPracticeButton($("sitStart"), false, "Resume sitting");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function resumeSession() {
    const session = state.session;
    if (!session || session.running) return;
    session.startedAt = performance.now();
    session.running = true;
    ensureAudio();
    practiceNote("resume");
    if (session.kind === "breathe") setPracticeButton($("breathStart"), true, "Start");
    else setPracticeButton($("sitStart"), true, "Begin sitting");
    session.raf = requestAnimationFrame(() => animateSession(session));
    session.interval = window.setInterval(() => renderSession(session), 250);
  }

  function animateSession(session) {
    if (state.session !== session || !session.running) return;
    renderSession(session);
    session.raf = requestAnimationFrame(() => animateSession(session));
  }

  function activePattern() {
    return DATA.breathPatterns.find(pattern => pattern.id === state.session?.pattern) || DATA.breathPatterns[0];
  }

  function renderSession(session) {
    if (state.session !== session || !session.running) return;
    const elapsed = currentElapsed(session);
    if (session.kind === "sit") {
      const remaining = Math.max(0, session.duration - elapsed);
      $("sitOrb").style.transform = `scale(${(.82 + .07 * Math.sin(elapsed * Math.PI / 5)).toFixed(4)})`;
      $("sitLabel").textContent = "Just sit";
      $("sitCountdown").textContent = formatTime(remaining);
      $("sitElapsed").textContent = `${formatTime(elapsed)} elapsed · be here as you are`;
      if (remaining <= 0) finishSession(true);
      return;
    }
    const pattern = activePattern();
    const cycleLength = pattern.steps.reduce((sum, step) => sum + step[1], 0);
    const cycleTime = elapsed % cycleLength;
    let stepIndex = 0;
    let stepStart = 0;
    while (stepIndex < pattern.steps.length - 1 && cycleTime >= stepStart + pattern.steps[stepIndex][1]) {
      stepStart += pattern.steps[stepIndex][1];
      stepIndex += 1;
    }
    const step = pattern.steps[stepIndex];
    const withinStep = Math.max(0, cycleTime - stepStart);
    const progress = Math.min(1, withinStep / step[1]);
    const eased = .5 - .5 * Math.cos(Math.PI * progress);
    const scale = step[2] + (step[3] - step[2]) * eased;
    $("breathOrb").style.transform = `scale(${scale.toFixed(5)})`;
    $("breathPhase").textContent = step[0].replace(/ · \d+$/, "");
    $("breathCount").textContent = step[1] < 1 ? "Breathe" : String(Math.max(1, Math.ceil(step[1] - withinStep)));
    $("breathPump").textContent = step[4]
      ? session.pattern === "bellows" ? `Breath ${step[4]} of 20` : `Pump ${step[4]} of 30`
      : "";
    if (stepIndex !== session.lastStep) {
      session.lastStep = stepIndex;
      if (/\b(inhale|breathe in|deep breath in)\b/i.test(step[0])) chime("high", .65);
      else if (step[0].includes("Hold") || step[0].includes("Rest")) chime("middle", .65);
      else chime("low", .65);
      vibrate();
    }
    $("breathRounds").textContent = String(Math.floor(elapsed / cycleLength));
    $("breathElapsed").textContent = formatTime(elapsed);
  }

  function finishSession(completed) {
    const session = state.session;
    if (!session) return;
    const elapsed = completed ? session.duration : currentElapsed(session);
    stopSessionTimers(session);
    state.session = null;
    if (session.kind === "breathe") {
      setPracticeButton($("breathStart"), false, "Start");
      $("breathStart").textContent = completed ? "Start again" : "Start";
      $("breathPhase").textContent = completed ? "Complete" : "Ready";
      $("breathCount").textContent = "—";
      $("breathPump").textContent = "";
      $("breathOrb").style.transform = "scale(.55)";
    } else {
      setPracticeButton($("sitStart"), false, "Begin sitting");
      $("sitStart").textContent = completed ? "Sit again" : "Begin sitting";
      $("sitLabel").textContent = completed ? "Complete" : "Ready";
      $("sitCountdown").textContent = formatTime(state.sitMinutes * 60);
      $("sitElapsed").textContent = "A quiet moment is waiting";
      $("sitOrb").style.transform = "scale(.85)";
    }
    practiceNote("pause");
    if (session.musicLinked) {
      state.youtube.sessionLinked = false;
      state.youtube.wantPlay = false;
      sendYoutubeCommand("pauseVideo");
    }
    if (completed && session.kind === "sit") {
      chime("middle", 2.5);
      window.setTimeout(() => chime("middle", 2.5), 1700);
    }
    if (elapsed >= 1) recordPractice(elapsed, completed);
    updateMiniPlayer();
  }

  function selectBreathPattern(id) {
    const pattern = DATA.breathPatterns.find(item => item.id === id);
    if (!pattern) return;
    if (state.session?.kind === "breathe") finishSession(false);
    state.breathId = id;
    $("breathNote").textContent = pattern.note;
    $("breathChoices").querySelectorAll(".chip").forEach(button => {
      const selected = button.dataset.pattern === id;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("selected", selected);
    });
    $("breathPhase").textContent = "Ready";
    $("breathCount").textContent = String(pattern.steps[0][1] >= 1 ? pattern.steps[0][1] : "—");
    $("breathPump").textContent = "";
    $("breathRounds").textContent = "0";
    $("breathElapsed").textContent = "0:00";
    $("breathOrb").style.transform = `scale(${pattern.steps[0][2]})`;
    $("breathSafety").textContent = ["bellows", "pumps"].includes(id) ? pattern.note : "If you feel light-headed, anxious, or uncomfortable, stop and breathe naturally.";
  }

  function renderBreathChoices() {
    $("breathChoices").replaceChildren(...DATA.breathPatterns.map(pattern => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `chip${pattern.id === state.breathId ? " selected" : ""}`;
      button.dataset.pattern = pattern.id;
      button.setAttribute("aria-pressed", String(pattern.id === state.breathId));
      button.textContent = pattern.name;
      button.addEventListener("click", () => selectBreathPattern(pattern.id));
      return button;
    }));
    selectBreathPattern(state.breathId);
  }

  function renderSitChoices() {
    $("sitChoices").replaceChildren(...DATA.sitDurations.map(minutes => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `chip${minutes === state.sitMinutes ? " selected" : ""}`;
      button.setAttribute("aria-pressed", String(minutes === state.sitMinutes));
      button.textContent = `${minutes} min`;
      button.addEventListener("click", () => {
        if (state.session?.kind === "sit") finishSession(false);
        state.sitMinutes = minutes;
        $("sitCountdown").textContent = formatTime(minutes * 60);
        $("sitChoices").querySelectorAll(".chip").forEach(item => {
          const selected = item === button;
          item.classList.toggle("selected", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
      });
      return button;
    }));
    $("sitCountdown").textContent = formatTime(state.sitMinutes * 60);
  }

  function phraseList(group) {
    const set = state.phrase[group].set;
    const base = DATA.phraseSets[set]?.lines || [];
    return group === "affirm" && set === "manifest" ? [...base, ...state.customIntentions] : base;
  }

  function stopPhraseTimer(group) {
    const item = state.phrase[group];
    if (!item) return;
    clearInterval(item.timer);
    item.timer = 0;
    item.auto = false;
    const button = $(phraseElementId(group, "Auto"));
    button.setAttribute("aria-pressed", "false");
    button.textContent = group === "kriya" ? "Begin guided practice" : "Auto";
  }

  function stopPhraseTimers() {
    Object.keys(state.phrase).forEach(stopPhraseTimer);
  }

  function cancelSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    Object.values(state.phrase).forEach(item => { item.read = false; });
  }

  function displayPhrase(group) {
    const item = state.phrase[group];
    const phrases = phraseList(group);
    if (!phrases.length) return;
    item.index = (item.index + phrases.length) % phrases.length;
    $(phraseElementId(group, "Text")).textContent = phrases[item.index];
    $(phraseElementId(group, "Count")).textContent = `${item.index + 1} / ${phrases.length}`;
  }

  function movePhrase(group, amount) {
    const item = state.phrase[group];
    item.index = (item.index + amount + phraseList(group).length) % phraseList(group).length;
    displayPhrase(group);
    if (item.read) readPhrase(group);
  }

  function readPhrase(group) {
    if (!("speechSynthesis" in window)) {
      $(phraseElementId(group, "Note")).textContent = "Spoken reading is not available in this browser.";
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phraseList(group)[state.phrase[group].index]);
    utterance.rate = .85;
    utterance.onend = () => {
      state.phrase[group].read = false;
      $(phraseElementId(group, "Speak")).setAttribute("aria-pressed", "false");
    };
    window.speechSynthesis.speak(utterance);
  }

  function phraseElementId(group, suffix) {
    return `${group === "affirm" ? "phrase" : group}${suffix}`;
  }

  function setPhrase(group, setName) {
    const item = state.phrase[group];
    if (!DATA.phraseSets[setName]) return;
    stopPhraseTimer(group);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    item.read = false;
    item.set = setName;
    item.index = 0;
    renderPhraseGroup(group);
  }

  function renderPhraseChoices(group) {
    const sets = group === "affirm" ? ["affirm", "manifest", "hooponopono"] : group === "kriya" ? ["kriya"] : ["advaita", "pattern"];
    const container = $(group === "affirm" ? "phraseChoices" : `${group}Choices`);
    if (!container) return;
    container.replaceChildren(...sets.map(name => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chip";
      button.dataset.set = name;
      button.setAttribute("aria-pressed", String(name === state.phrase[group].set));
      button.textContent = DATA.phraseSets[name].title;
      button.addEventListener("click", () => setPhrase(group, name));
      return button;
    }));
  }

  function renderPhraseGroup(group) {
    const item = state.phrase[group];
    const set = DATA.phraseSets[item.set];
    $(`${group === "affirm" ? "phrase" : group}GroupTitle`).textContent = set.title.toUpperCase();
    $(`${group === "affirm" ? "phrase" : group}Description`).textContent = set.note;
    $(phraseElementId(group, "Note")).textContent = set.note;
    renderPhraseChoices(group);
    displayPhrase(group);
    if (group === "affirm") {
      $("intentionBox").hidden = item.set !== "manifest";
      renderIntentions();
    }
  }

  function switchPhrase(group, set) {
    if (!state.phrase[group]) return;
    setPhrase(group, set);
  }

  function togglePhraseAuto(group) {
    const item = state.phrase[group];
    if (item.auto) {
      stopPhraseTimer(group);
      return;
    }
    item.auto = true;
    const button = $(phraseElementId(group, "Auto"));
    button.setAttribute("aria-pressed", "true");
    button.textContent = group === "kriya" ? "Pause guided practice" : "Stop auto";
    const seconds = DATA.phraseSets[item.set].duration;
    item.timer = window.setInterval(() => movePhrase(group, 1), seconds * 1000);
    if (group === "kriya" && state.phrase[group].index === 0) chime("middle", 1.4);
  }

  function renderIntentions() {
    $("intentionsList").replaceChildren(...state.customIntentions.map((text, index) => {
      const row = document.createElement("li");
      row.className = "intention-item";
      const phrase = document.createElement("span");
      const remove = document.createElement("button");
      phrase.textContent = text;
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Remove intention: ${text}`);
      remove.addEventListener("click", () => {
        state.customIntentions.splice(index, 1);
        storageSet("come-home-intentions", state.customIntentions);
        renderPhraseGroup("affirm");
      });
      row.append(phrase, remove);
      return row;
    }));
    if (!state.customIntentions.length) {
      const empty = document.createElement("li");
      empty.className = "practice-note";
      empty.textContent = "Your intentions stay on this device.";
      $("intentionsList").append(empty);
    }
  }

  function addIntention() {
    const input = $("intentionInput");
    const text = input.value.trim();
    if (!text) {
      $("intentionHelp").textContent = "Write a short intention before saving.";
      input.focus();
      return;
    }
    if (/\b(?:not|never|no|don't|doesn't|can't|cannot|won't|without|isn't|aren't)\b/i.test(text)) {
      $("intentionHelp").textContent = "Try expressing what you want to welcome, in present-tense wording.";
      input.focus();
      return;
    }
    state.customIntentions.push(text);
    storageSet("come-home-intentions", state.customIntentions);
    input.value = "";
    $("intentionHelp").textContent = "Saved on this device.";
    renderPhraseGroup("affirm");
    state.phrase.affirm.index = phraseList("affirm").length - 1;
    displayPhrase("affirm");
  }

  function renderNatureChoices() {
    $("natureChoices").replaceChildren(...DATA.natureSounds.map(sound => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sound-button";
      button.dataset.sound = sound.id;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `<span class="sound-icon" aria-hidden="true">${sound.icon}</span><span><strong>${sound.name}</strong><small>Synthesized sound</small></span>`;
      button.addEventListener("click", () => toggleNature(sound.id));
      return button;
    }));
  }

  function noiseBuffer(kind) {
    if (state.noiseBuffers?.has(kind)) return state.noiseBuffers.get(kind);
    const context = state.audioContext;
    const length = context.sampleRate * 3;
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const samples = buffer.getChannelData(0);
    let brown = 0;
    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      if (kind === "brown") {
        brown = (brown + .025 * white) / 1.025;
        samples[index] = brown * 3.5;
      } else samples[index] = white * .7;
    }
    if (!state.noiseBuffers) state.noiseBuffers = new Map();
    state.noiseBuffers.set(kind, buffer);
    return buffer;
  }

  function makeNoise(kind) {
    const source = state.audioContext.createBufferSource();
    source.buffer = noiseBuffer(kind);
    source.loop = true;
    source.start();
    return source;
  }

  function makeGain(value = 1) {
    const gain = state.audioContext.createGain();
    gain.gain.value = value;
    return gain;
  }

  function releaseTransientNodes(layer, nodes) {
    nodes.forEach(node => {
      const index = layer.nodes.indexOf(node);
      if (index >= 0) layer.nodes.splice(index, 1);
      try { node.disconnect(); } catch {}
    });
  }

  function connectChain(nodes) {
    for (let index = 0; index < nodes.length - 1; index += 1) nodes[index].connect(nodes[index + 1]);
  }

  function addLfo(layer, frequency, depth, parameter, type = "sine") {
    const oscillator = state.audioContext.createOscillator();
    const amount = makeGain(depth);
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(amount);
    amount.connect(parameter);
    oscillator.start();
    layer.nodes.push(oscillator, amount);
  }

  function startCrackle(layer, target) {
    const create = () => {
      if (!state.nature.has("fire") || state.nature.get("fire") !== layer) return;
      const context = state.audioContext;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = makeGain(.001);
      source.buffer = noiseBuffer("white");
      filter.type = "bandpass";
      filter.frequency.value = 1700 + Math.random() * 3300;
      filter.Q.value = 2;
      connectChain([source, filter, gain, target]);
      const now = context.currentTime;
      gain.gain.setValueAtTime(.001, now);
      gain.gain.linearRampToValueAtTime(.12 + Math.random() * .1, now + .006);
      gain.gain.exponentialRampToValueAtTime(.001, now + .07);
      source.start(now, Math.random() * 2, .085);
      source.stop(now + .1);
      layer.nodes.push(source, filter, gain);
      source.onended = () => releaseTransientNodes(layer, [source, filter, gain]);
      layer.timers.push(window.setTimeout(create, 120 + Math.random() * 520));
    };
    layer.timers.push(window.setTimeout(create, 160));
  }

  function startBirds(layer, target) {
    const chirp = () => {
      if (!state.nature.has("birds") || state.nature.get("birds") !== layer) return;
      const context = state.audioContext;
      const now = context.currentTime;
      const count = 2 + Math.floor(Math.random() * 4);
      const base = 1900 + Math.random() * 2300;
      for (let index = 0; index < count; index += 1) {
        const delay = index * (.11 + Math.random() * .1);
        const oscillator = context.createOscillator();
        const gain = makeGain(.001);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(base * (1 + index * .07), now + delay);
        oscillator.frequency.exponentialRampToValueAtTime(base * (.72 + Math.random() * .12), now + delay + .12);
        gain.gain.setValueAtTime(.001, now + delay);
        gain.gain.linearRampToValueAtTime(.045, now + delay + .015);
        gain.gain.exponentialRampToValueAtTime(.001, now + delay + .18);
        oscillator.connect(gain);
        gain.connect(target);
        oscillator.start(now + delay);
        oscillator.stop(now + delay + .2);
        layer.nodes.push(oscillator, gain);
        oscillator.onended = () => releaseTransientNodes(layer, [oscillator, gain]);
      }
      layer.timers.push(window.setTimeout(chirp, 900 + Math.random() * 2600));
    };
    chirp();
  }

  function buildNatureLayer(sound) {
    const context = ensureAudio();
    if (!context) return null;
    const layer = { nodes: [], timers: [], gain: makeGain(.8) };
    layer.gain.connect(state.natureBus);
    const source = makeNoise(sound.type === "brown" ? "brown" : "white");
    layer.nodes.push(source);
    if (sound.id === "rain") {
      const high = context.createBiquadFilter();
      const low = context.createBiquadFilter();
      high.type = "highpass"; high.frequency.value = 1100;
      low.type = "lowpass"; low.frequency.value = 9000;
      connectChain([source, high, low, layer.gain]);
      layer.nodes.push(high, low);
    } else if (sound.id === "ocean") {
      const filter = context.createBiquadFilter();
      const swell = makeGain(.55);
      filter.type = "lowpass"; filter.frequency.value = 700;
      connectChain([source, filter, swell, layer.gain]);
      layer.nodes.push(filter, swell);
      addLfo(layer, .09, .25, swell.gain);
    } else if (sound.id === "wind") {
      const filter = context.createBiquadFilter();
      const swell = makeGain(.5);
      filter.type = "bandpass"; filter.frequency.value = 500; filter.Q.value = .7;
      connectChain([source, filter, swell, layer.gain]);
      layer.nodes.push(filter, swell);
      addLfo(layer, .12, 170, filter.frequency);
      addLfo(layer, .07, .27, swell.gain);
    } else if (sound.id === "stream") {
      const filter = context.createBiquadFilter();
      filter.type = "bandpass"; filter.frequency.value = 1800; filter.Q.value = .6;
      connectChain([source, filter, layer.gain]);
      layer.nodes.push(filter);
      addLfo(layer, .7, 420, filter.frequency);
      addLfo(layer, 1.9, 190, filter.frequency);
    } else if (sound.id === "birds") {
      source.stop();
      layer.nodes = layer.nodes.filter(node => node !== source);
    } else if (sound.id === "crickets") {
      source.stop();
      layer.nodes = [];
      const oscillator = context.createOscillator();
      const amplitude = makeGain(.025);
      oscillator.frequency.value = 4400;
      connectChain([oscillator, amplitude, layer.gain]);
      oscillator.start();
      layer.nodes.push(oscillator, amplitude);
      addLfo(layer, 36, .024, amplitude.gain, "square");
      addLfo(layer, .4, .014, amplitude.gain);
    } else if (sound.id === "fire") {
      const filter = context.createBiquadFilter();
      filter.type = "lowpass"; filter.frequency.value = 230;
      connectChain([source, filter, layer.gain]);
      layer.nodes.push(filter);
    }
    return layer;
  }

  function stopNatureLayer(id) {
    const layer = state.nature.get(id);
    if (!layer) return;
    state.nature.delete(id);
    layer.timers.forEach(clearTimeout);
    const context = state.audioContext;
    if (context) layer.gain.gain.setTargetAtTime(.001, context.currentTime, .12);
    window.setTimeout(() => [...layer.nodes].forEach(node => {
      try { if (typeof node.stop === "function") node.stop(); } catch {}
      try { node.disconnect(); } catch {}
    }), 500);
    const button = $(`natureChoices`).querySelector(`[data-sound="${id}"]`);
    if (button) button.setAttribute("aria-pressed", "false");
    updateMiniPlayer();
  }

  function toggleNature(id) {
    if (state.nature.has(id)) {
      stopNatureLayer(id);
      return;
    }
    const sound = DATA.natureSounds.find(item => item.id === id);
    const layer = sound && buildNatureLayer(sound);
    if (!layer) return;
    state.nature.set(id, layer);
    $(`natureChoices`).querySelector(`[data-sound="${id}"]`).setAttribute("aria-pressed", "true");
    if (id === "birds") startBirds(layer, layer.gain);
    if (id === "fire") startCrackle(layer, layer.gain);
    state.audioPaused = false;
    updateMiniPlayer();
  }

  function stopAllNature() {
    [...state.nature.keys()].forEach(stopNatureLayer);
  }

  function setNatureVolume(value) {
    $("natureVolumeValue").value = `${value}%`;
    $("natureVolumeValue").textContent = `${value}%`;
    if (state.natureBus && state.audioContext) state.natureBus.gain.setTargetAtTime(Number(value) / 100, state.audioContext.currentTime, .12);
  }

  function removeTone() {
    const active = state.tone;
    if (!active) return;
    state.tone = null;
    const context = state.audioContext;
    active.gain.gain.setTargetAtTime(.001, context.currentTime, .08);
    window.setTimeout(() => active.nodes.forEach(node => {
      try { if (typeof node.stop === "function") node.stop(); } catch {}
      try { node.disconnect(); } catch {}
    }), 450);
    q(".tone-button,.beat-button").forEach(button => button.setAttribute("aria-pressed", "false"));
    updateMiniPlayer();
  }

  function createTone(frequency, beat, label) {
    const context = ensureAudio();
    if (!context) return;
    const root = makeGain(.001);
    root.connect(state.output);
    const nodes = [];
    const partials = state.speakerMode ? [[1, 1], [2, .7], [3, .5], [4, .35], [6, .2]] : [[1, 1]];
    const addVoice = (base, pan, destination) => partials.forEach(([multiple, level]) => {
      const oscillator = context.createOscillator();
      const partialGain = makeGain(level);
      oscillator.frequency.value = base * multiple;
      oscillator.connect(partialGain);
      let output = partialGain;
      if (context.createStereoPanner) {
        const panner = context.createStereoPanner();
        panner.pan.value = pan;
        partialGain.connect(panner);
        output = panner;
        nodes.push(panner);
      }
      output.connect(destination);
      oscillator.start();
      nodes.push(oscillator, partialGain);
    });
    if (beat && !state.speakerMode) {
      const left = makeGain(.5);
      const right = makeGain(.5);
      left.connect(root); right.connect(root);
      addVoice(frequency, -1, left);
      addVoice(frequency + beat, 1, right);
    } else {
      if (beat) {
        const pulse = makeGain(.5);
        pulse.connect(root);
        const lfo = context.createOscillator();
        lfo.type = "square";
        lfo.frequency.value = beat;
        const amount = makeGain(.5);
        lfo.connect(amount);
        amount.connect(pulse.gain);
        lfo.start();
        addVoice(frequency, 0, pulse);
        nodes.push(lfo, amount, pulse);
      } else addVoice(frequency, 0, root);
    }
    root.gain.setTargetAtTime(Number($("toneVolume").value) / 100 * .32, context.currentTime, .1);
    state.tone = { frequency, beat, label, gain: root, nodes };
    const activeButton = [...q(".tone-button,.beat-button")].find(button => button.dataset.label === label);
    if (activeButton) activeButton.setAttribute("aria-pressed", "true");
    state.audioPaused = false;
    updateMiniPlayer();
  }

  function playSingleTone(frequency, beat, label, fromJourney = false) {
    if (!fromJourney && state.journey.active) stopJourney();
    if (state.tone?.frequency === frequency && state.tone?.beat === beat && !fromJourney) {
      removeTone();
      return;
    }
    removeTone();
    createTone(frequency, beat, label);
    const button = [...q(".tone-button,.beat-button")].find(item => item.dataset.label === label);
    if (button) button.setAttribute("aria-pressed", "true");
  }

  function renderToneButtons() {
    $("toneChoices").replaceChildren(...DATA.tones.map(tone => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sound-button tone-button";
      button.dataset.label = `${tone.frequency} Hz`;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `<span><strong>${tone.frequency} Hz</strong><small>${tone.label}</small></span>`;
      button.addEventListener("click", () => playSingleTone(tone.frequency, 0, button.dataset.label));
      return button;
    }));
    $("beatChoices").replaceChildren(...DATA.binaural.map(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sound-button beat-button";
      button.dataset.label = `${item.label} ${item.beat} Hz`;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `<span><strong>${item.label}</strong><small>${item.beat} Hz beat</small></span>`;
      button.addEventListener("click", () => playSingleTone(200, item.beat, button.dataset.label));
      return button;
    }));
    $("journeyDurations").replaceChildren(...DATA.journeyDurations.map(seconds => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `chip${seconds === state.journey.seconds ? " selected" : ""}`;
      button.setAttribute("aria-pressed", String(seconds === state.journey.seconds));
      button.textContent = `${seconds}s each`;
      button.addEventListener("click", () => {
        state.journey.seconds = seconds;
        $("journeyDurations").querySelectorAll(".chip").forEach(item => {
          item.classList.toggle("selected", item === button);
          item.setAttribute("aria-pressed", String(item === button));
        });
      });
      return button;
    }));
  }

  function stopJourney() {
    state.journey.active = false;
    clearTimeout(state.journey.timer);
    state.journey.timer = 0;
    $("journeyToggle").setAttribute("aria-pressed", "false");
    $("journeyToggle").textContent = "▶ Start journey";
  }

  function journeyStep() {
    if (!state.journey.active) return;
    const tone = DATA.tones[state.journey.index % DATA.tones.length];
    playSingleTone(tone.frequency, 0, `${tone.frequency} Hz`, true);
    state.journey.index = (state.journey.index + 1) % DATA.tones.length;
    state.journey.timer = window.setTimeout(journeyStep, state.journey.seconds * 1000);
  }

  function toggleJourney() {
    if (state.journey.active) {
      stopJourney();
      removeTone();
      return;
    }
    state.journey.active = true;
    state.journey.index = 0;
    $("journeyToggle").setAttribute("aria-pressed", "true");
    $("journeyToggle").textContent = "■ Stop journey";
    journeyStep();
  }

  function setSpeakerMode(enabled) {
    if (state.speakerMode === enabled) return;
    const active = state.tone && { ...state.tone };
    state.speakerMode = enabled;
    $("headphoneMode").setAttribute("aria-pressed", String(!enabled));
    $("speakerMode").setAttribute("aria-pressed", String(enabled));
    $("beatHeading").textContent = enabled ? "Isochronic pulses · speaker friendly" : "Binaural beats · headphones recommended";
    if (state.boost && state.audioContext) state.boost.gain.setTargetAtTime(enabled ? 2.4 : 1, state.audioContext.currentTime, .12);
    if (active) {
      removeTone();
      createTone(active.frequency, active.beat, active.label);
    }
  }

  function setToneVolume(value) {
    $("toneVolumeValue").value = `${value}%`;
    $("toneVolumeValue").textContent = `${value}%`;
    if (state.tone && state.audioContext) state.tone.gain.gain.setTargetAtTime(Number(value) / 100 * .32, state.audioContext.currentTime, .1);
  }

  function validYoutubeAddress(input) {
    let url;
    try { url = new URL(input); } catch { return null; }
    const host = url.hostname.toLowerCase();
    if (!["youtu.be", "www.youtu.be", "youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) return null;
    const video = host.includes("youtu.be") ? url.pathname.split("/").filter(Boolean)[0] : url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1] || "";
    const playlist = url.searchParams.get("list") || "";
    if ((video && !/^[\w-]{11}$/.test(video)) || (!video && !playlist)) return null;
    return { video, playlist, url: input };
  }

  function youtubeEmbedUrl() {
    const target = state.youtube.playlist
      ? `${state.youtube.host}/embed/videoseries?list=${encodeURIComponent(state.youtube.playlist)}`
      : `${state.youtube.host}/embed/${encodeURIComponent(state.youtube.video)}`;
    const params = new URLSearchParams({ enablejsapi: "1", playsinline: "1", rel: "0" });
    if (state.youtube.wantPlay) params.set("autoplay", "1");
    if (location.origin && location.origin !== "null") params.set("origin", location.origin);
    return `${target}${target.includes("?") ? "&" : "?"}${params.toString()}`;
  }

  function loadYoutube(autoplay = false) {
    const yt = state.youtube;
    clearTimeout(yt.timeout);
    yt.ready = false;
    yt.playing = false;
    yt.wantPlay = autoplay;
    $("youtubeError").hidden = true;
    $("youtubeFrame").src = youtubeEmbedUrl();
    $("youtubeExternal").href = yt.playlist
      ? `https://www.youtube.com/playlist?list=${encodeURIComponent(yt.playlist)}`
      : `https://www.youtube.com/watch?v=${encodeURIComponent(yt.video)}`;
    yt.externalUrl = $("youtubeExternal").href;
    yt.timeout = window.setTimeout(() => {
      yt.timeout = 0;
      if (yt.ready) return;
      if (yt.retries === 0) {
        yt.retries = 1;
        yt.host = "https://www.youtube.com";
        loadYoutube(yt.wantPlay);
      } else {
        $("youtubeError").hidden = false;
      }
    }, 7000);
    updateMiniPlayer();
  }

  function sendYoutubeCommand(command) {
    const frame = $("youtubeFrame");
    if (!frame.contentWindow || !frame.src) return;
    try {
      const target = new URL(frame.src).origin;
      frame.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), target);
    } catch (error) {
      console.warn(`Could not send YouTube ${command} command.`, error);
    }
  }

  function playYoutube() {
    if (state.audioPaused) state.audioPaused = false;
    state.youtube.wantPlay = true;
    if (state.youtube.ready) sendYoutubeCommand("playVideo");
    else if (!state.youtube.timeout) loadYoutube(true);
    updateMiniPlayer();
  }

  function youtubeFallback() {
    if (state.youtube.host.includes("youtube-nocookie") && state.youtube.retries === 0) {
      state.youtube.retries = 1;
      state.youtube.host = "https://www.youtube.com";
      loadYoutube(state.youtube.wantPlay);
    } else {
      $("youtubeError").hidden = false;
    }
  }

  function handleYoutubeMessage(event) {
    if (event.source !== $("youtubeFrame").contentWindow) return;
    let originHost;
    try { originHost = new URL(event.origin).hostname; } catch { return; }
    if (!/youtube(?:-nocookie)?\.com$/i.test(originHost)) return;
    let message = event.data;
    try { if (typeof message === "string") message = JSON.parse(message); } catch { return; }
    if (!message || typeof message !== "object") return;
    if (message.event === "onReady" || message.event === "infoDelivery" || message.event === "onStateChange") {
      state.youtube.ready = true;
      clearTimeout(state.youtube.timeout);
      state.youtube.timeout = 0;
      $("youtubeError").hidden = true;
      if (state.youtube.wantPlay) sendYoutubeCommand("playVideo");
    }
    if (message.event === "onError" && Number(message.info) === 153) {
      youtubeFallback();
      return;
    }
    const playerState = message.event === "onStateChange" ? message.info : message.info?.playerState;
    if (typeof playerState === "number") {
      state.youtube.playing = playerState === 1;
      if (playerState === 2 || playerState === 0) state.youtube.wantPlay = false;
      updateMiniPlayer();
    }
  }

  function updateMiniPlayer() {
    const items = [];
    if (state.tone) items.push(state.tone.label);
    state.nature.forEach((_, id) => items.push(DATA.natureSounds.find(sound => sound.id === id)?.name || id));
    if (state.youtube.playing || state.youtube.wantPlay) items.push("YouTube");
    const hasAudio = items.length > 0;
    $("miniPlayer").hidden = !hasAudio;
    $("miniLabel").textContent = items.join(" · ") || "Audio paused";
    const paused = state.audioPaused || (state.audioContext && state.audioContext.state !== "running");
    $("miniToggle").textContent = paused ? "▶" : "Ⅱ";
    $("miniToggle").setAttribute("aria-label", paused ? "Resume all audio" : "Pause all audio");
  }

  function stopAllAudio() {
    stopAllNature();
    stopJourney();
    removeTone();
    const youtubeActive = state.youtube.playing || state.youtube.wantPlay;
    state.youtube.wantPlay = false;
    state.youtube.sessionLinked = false;
    if (youtubeActive) sendYoutubeCommand("pauseVideo");
    updateMiniPlayer();
  }

  function renderWisdomPages() {
    renderWisdom($("wisdomPage"));
    renderWisdom($("wisdomCards"));
  }

  function renderInitialPhrases() {
    ["affirm", "kriya", "advaita"].forEach(renderPhraseGroup);
  }

  function initializeYoutube() {
    const frame = $("youtubeFrame");
    frame.addEventListener("load", () => {
      const origin = new URL(frame.src).origin;
      try { frame.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "come-home" }), origin); }
      catch (error) { console.warn("YouTube player handshake could not be sent.", error); }
    });
    window.addEventListener("message", handleYoutubeMessage);
    const defaultLink = validYoutubeAddress($("youtubeUrl").value);
    if (defaultLink) {
      state.youtube.video = defaultLink.video || state.youtube.video;
      state.youtube.playlist = defaultLink.playlist;
      state.youtube.externalUrl = defaultLink.url;
    }
    loadYoutube(false);
  }

  $("themeToggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "light" : "dark");
  });
  $("chimeToggle").addEventListener("click", () => {
    state.chimes = !state.chimes;
    $("chimeToggle").setAttribute("aria-pressed", String(state.chimes));
    storageSet("come-home-chimes", state.chimes);
  });
  q("[data-open-tab]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    selectTab(link.dataset.openTab);
  }));
  $("breathStart").addEventListener("click", () => startSession("breathe"));
  $("breathReset").addEventListener("click", () => {
    if (state.session?.kind === "breathe") finishSession(false);
    selectBreathPattern(state.breathId);
  });
  $("sitStart").addEventListener("click", () => startSession("sit"));
  $("sitReset").addEventListener("click", () => {
    if (state.session?.kind === "sit") finishSession(false);
    $("sitCountdown").textContent = formatTime(state.sitMinutes * 60);
    $("sitElapsed").textContent = "A quiet moment is waiting";
    $("sitLabel").textContent = "Ready";
    $("sitOrb").style.transform = "scale(.85)";
  });
  $("chakraPrevious").addEventListener("click", () => renderChakra((state.chakraIndex - 1 + DATA.chakras.length) % DATA.chakras.length));
  $("chakraNext").addEventListener("click", () => renderChakra((state.chakraIndex + 1) % DATA.chakras.length));
  $("phrasePrevious").addEventListener("click", () => movePhrase("affirm", -1));
  $("phraseNext").addEventListener("click", () => movePhrase("affirm", 1));
  $("phraseAuto").addEventListener("click", () => togglePhraseAuto("affirm"));
  $("phraseSpeak").addEventListener("click", () => {
    const phrase = state.phrase.affirm;
    phrase.read = !phrase.read;
    $("phraseSpeak").setAttribute("aria-pressed", String(phrase.read));
    if (phrase.read) readPhrase("affirm");
    else if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  });
  $("intentionAdd").addEventListener("click", addIntention);
  $("intentionInput").addEventListener("keydown", event => { if (event.key === "Enter") addIntention(); });
  ["kriya", "advaita"].forEach(group => {
    $(`${group}Previous`).addEventListener("click", () => movePhrase(group, -1));
    $(`${group}Next`).addEventListener("click", () => movePhrase(group, 1));
    $(`${group}Auto`).addEventListener("click", () => togglePhraseAuto(group));
    $(`${group}Speak`).addEventListener("click", () => {
      const item = state.phrase[group];
      item.read = !item.read;
      $(`${group}Speak`).setAttribute("aria-pressed", String(item.read));
      if (item.read) readPhrase(group);
      else if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    });
  });
  $("natureVolume").addEventListener("input", event => setNatureVolume(event.target.value));
  $("natureStop").addEventListener("click", stopAllNature);
  $("headphoneMode").addEventListener("click", () => setSpeakerMode(false));
  $("speakerMode").addEventListener("click", () => setSpeakerMode(true));
  $("toneVolume").addEventListener("input", event => setToneVolume(event.target.value));
  $("journeyToggle").addEventListener("click", toggleJourney);
  $("youtubeLoad").addEventListener("click", () => {
    const parsed = validYoutubeAddress($("youtubeUrl").value.trim());
    if (!parsed) {
      $("youtubeError").textContent = "Enter a YouTube video, short, embed, or playlist link.";
      $("youtubeError").hidden = false;
      return;
    }
    state.youtube.video = parsed.video || "";
    state.youtube.playlist = parsed.playlist;
    state.youtube.externalUrl = parsed.url;
    state.youtube.host = "https://www.youtube-nocookie.com";
    state.youtube.retries = 0;
    loadYoutube(true);
  });
  $("musicWithSessions").addEventListener("change", () => {
    if (!state.session) return;
    if ($("musicWithSessions").checked) {
      state.session.musicLinked = true;
      state.youtube.sessionLinked = true;
      if (state.session.running) playYoutube();
    } else {
      state.session.musicLinked = false;
      state.youtube.sessionLinked = false;
      state.youtube.wantPlay = false;
      sendYoutubeCommand("pauseVideo");
    }
  });
  $("miniToggle").addEventListener("click", toggleAllAudio);
  $("miniStop").addEventListener("click", stopAllAudio);
  $("clearJourney").addEventListener("click", () => {
    if (!window.confirm("Reset your saved practice history on this device?")) return;
    state.history = { sessions: 0, days: {} };
    storageSet("come-home-history", state.history);
    renderHomeStats();
    renderJourney();
  });
  window.addEventListener("beforeunload", () => {
    if (state.session) finishSession(false);
    stopAllNature();
    removeTone();
    stopPhraseTimers();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (state.audioContext?.state !== "closed") state.audioContext?.close();
  });

  const defaultDate = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  $("dailyThought").textContent = DATA.tips[Math.floor(Math.random() * DATA.tips.length)];
  document.title = `Come Home · ${defaultDate}`;
  renderTabs();
  renderHome();
  renderHomeStats();
  renderBreathChoices();
  renderSitChoices();
  renderChakraChoices();
  renderChakra();
  renderInitialPhrases();
  renderNatureChoices();
  renderToneButtons();
  renderWisdomPages();
  initializeYoutube();
  selectTab("home");
})();

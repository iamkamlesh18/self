import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "../shared/components/Header.jsx";
import Navigation, { TABS } from "../shared/components/Navigation.jsx";
import Footer from "../shared/components/Footer.jsx";
import PersistentPlayer from "../shared/components/PersistentPlayer.jsx";
import { DATA } from "../data.js";
import HomePage from "../modules/home/HomePage.jsx";
import BreathPage from "../modules/breathe/BreathPage.jsx";
import SitPage from "../modules/sit/SitPage.jsx";
import ChakrasPage from "../modules/chakras/ChakrasPage.jsx";
import AffirmPage from "../modules/affirm/AffirmPage.jsx";
import KriyaPage from "../modules/kriya/KriyaPage.jsx";
import AdvaitaPage from "../modules/advaita/AdvaitaPage.jsx";
import NaturePage from "../modules/nature/NaturePage.jsx";
import TonesPage from "../modules/tones/TonesPage.jsx";
import MusicPage from "../modules/music/MusicPage.jsx";
import WisdomPage from "../modules/wisdom/WisdomPage.jsx";
import LibraryPage from "../modules/library/LibraryPage.jsx";
import SamyamaPage from "../modules/samyama/SamyamaPage.jsx";
import JourneyPage from "../modules/journey/JourneyPage.jsx";
import "../shared/components/player.css";
import "../shared/components/layout.css";

const GROUPS = ["affirm", "kriya", "advaita"];
const DEFAULT_YOUTUBE_URL = "https://youtu.be/9THx_-Y1YJg";

function storageGet(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    console.warn(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function streakDays(days) {
  const practicedDays = new Set(Object.keys(days));
  const cursor = new Date();
  if (!practicedDays.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (practicedDays.has(todayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function formatTime(seconds) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

function defaultPhrases() {
  return {
    affirm: { set: "affirm", index: 0, auto: false, read: false, note: "" },
    kriya: { set: "kriya", index: 0, auto: false, read: false, note: "" },
    advaita: { set: "advaita", index: 0, auto: false, read: false, note: "" }
  };
}

function validYoutubeAddress(input) {
  let url;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (!["youtu.be", "www.youtu.be", "youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) return null;
  const video = host.includes("youtu.be")
    ? url.pathname.split("/").filter(Boolean)[0]
    : url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1] || "";
  const playlist = url.searchParams.get("list") || "";
  if ((video && !/^[\w-]{11}$/.test(video)) || (!video && !playlist)) return null;
  return { video, playlist, url: input };
}

function youtubeEmbedUrl(host, video, playlist, autoplay) {
  const target = playlist
    ? `${host}/embed/videoseries?list=${encodeURIComponent(playlist)}`
    : `${host}/embed/${encodeURIComponent(video)}`;
  const params = new URLSearchParams({ enablejsapi: "1", playsinline: "1", rel: "0" });
  if (autoplay) params.set("autoplay", "1");
  if (location.origin && location.origin !== "null") params.set("origin", location.origin);
  return `${target}${target.includes("?") ? "&" : "?"}${params.toString()}`;
}

function getExternalYoutubeUrl(video, playlist) {
  return playlist
    ? `https://www.youtube.com/playlist?list=${encodeURIComponent(playlist)}`
    : `https://www.youtube.com/watch?v=${encodeURIComponent(video)}`;
}

export default function AppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = pathname.replace(/^\/+|\/+$/g, "") || "home";
  const [theme, setTheme] = useState(() => storageGet("come-home-theme", "") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  const [chimes, setChimes] = useState(() => storageGet("come-home-chimes", true));
  const [history, setHistory] = useState(() => {
    const saved = storageGet("come-home-history", { sessions: 0, days: {} });
    return saved && typeof saved === "object" && saved.days ? saved : { sessions: 0, days: {} };
  });
  const [intentions, setIntentions] = useState(() => {
    const saved = storageGet("come-home-intentions", []);
    return Array.isArray(saved) ? saved : [];
  });
  const [dailyThought] = useState(() => DATA.tips[Math.floor(Math.random() * DATA.tips.length)]);
  const [patternId, setPatternId] = useState("calm");
  const [sitMinutes, setSitMinutes] = useState(10);
  const [chakraIndex, setChakraIndex] = useState(0);
  const [phrases, setPhrases] = useState(defaultPhrases);
  const [intentionInput, setIntentionInput] = useState("");
  const [intentionHelp, setIntentionHelp] = useState("");
  const [session, setSession] = useState(null);
  const [backgroundBreathUntil, setBackgroundBreathUntil] = useState(null);
  const [now, setNow] = useState(() => performance.now());
  const [natureVolume, setNatureVolume] = useState(35);
  const [toneVolume, setToneVolume] = useState(35);
  const [activeSounds, setActiveSounds] = useState([]);
  const [tone, setTone] = useState(null);
  const [speakerMode, setSpeakerMode] = useState(false);
  const [journey, setJourney] = useState({ active: false, index: 0, seconds: 20 });
  const [audioPaused, setAudioPaused] = useState(false);
  const [audioVersion, setAudioVersion] = useState(0);
  const [youtubeVolume, setYoutubeVolume] = useState(() => {
    const saved = storageGet("come-home-youtube-volume", 60);
    return Number.isFinite(saved) ? Math.min(100, Math.max(0, saved)) : 60;
  });
  const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_YOUTUBE_URL);
  const [youtube, setYoutube] = useState({
    video: "9THx_-Y1YJg", playlist: "", host: "https://www.youtube-nocookie.com",
    src: "", externalUrl: DEFAULT_YOUTUBE_URL, ready: false, playing: false, wantPlay: false, error: "", retries: 0
  });
  const [withSessions, setWithSessions] = useState(true);
  const audioOutputRef = useRef(null);
  const intentionInputRef = useRef(null);
  const iframeRef = useRef(null);
  const journeyTimerRef = useRef(0);
  const youtubeTimerRef = useRef(0);
  const audioPausedRef = useRef(false);
  const previousBreathStepRef = useRef(-1);
  const journeyRef = useRef(journey);
  journeyRef.current = journey;
  const playSingleToneRef = useRef(null);
  const engineRef = useRef({
    context: null, output: null, compressor: null, boost: null, natureBus: null,
    streamDestination: null, directOutput: false, buffers: new Map(), layers: new Map(),
    tone: null
  });
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const historyRef = useRef(history);
  historyRef.current = history;
  audioPausedRef.current = audioPaused;

  const elapsedSeconds = session
    ? session.elapsed + (session.running ? Math.max(0, (now - session.startedAt) / 1000) : 0)
    : 0;
  const formattedElapsed = formatTime(elapsedSeconds);
  const sitRemaining = session?.kind === "sit" ? formatTime(session.duration - elapsedSeconds) : formatTime(sitMinutes * 60);
  const sitScale = .82 + .07 * Math.sin(elapsedSeconds * Math.PI / 5);
  const streak = useMemo(() => streakDays(history.days), [history.days]);
  const todayMinutes = Math.floor((history.days[todayKey()] || 0) / 60);
  const externalYoutubeUrl = youtube.externalUrl || getExternalYoutubeUrl(youtube.video, youtube.playlist);

  useEffect(() => {
    const label = TABS.find(([id]) => id === active)?.[1] || "Home";
    document.title = `Come Home · ${label}`;
  }, [active]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("come-home-theme", JSON.stringify(theme));
    } catch (error) {
      console.warn("Could not save come-home-theme to local storage.", error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("come-home-chimes", JSON.stringify(chimes));
    } catch (error) {
      console.warn("Could not save come-home-chimes to local storage.", error);
    }
  }, [chimes]);

  useEffect(() => {
    try {
      localStorage.setItem("come-home-history", JSON.stringify(history));
    } catch (error) {
      console.warn("Could not save come-home-history to local storage.", error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem("come-home-intentions", JSON.stringify(intentions));
    } catch (error) {
      console.warn("Could not save come-home-intentions to local storage.", error);
    }
  }, [intentions]);

  useEffect(() => {
    try {
      localStorage.setItem("come-home-youtube-volume", JSON.stringify(youtubeVolume));
    } catch (error) {
      console.warn("Could not save YouTube volume to local storage.", error);
    }
  }, [youtubeVolume]);

  useEffect(() => {
    const date = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
    document.title = `Come Home · ${date}`;
  }, []);

  useEffect(() => {
    if (!session?.running) return undefined;
    const timer = window.setInterval(() => setNow(performance.now()), 250);
    return () => window.clearInterval(timer);
  }, [session?.running, session?.kind]);

  const emitAudioChange = useCallback(() => setAudioVersion(value => value + 1), []);

  const ensureAudio = useCallback(() => {
    const engine = engineRef.current;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (engine.context) {
      setAudioPaused(false);
      if (engine.context.state === "suspended") engine.context.resume().catch(error => console.warn("Audio could not resume.", error));
      return engine.context;
    }

    const context = new AudioContext();
    const output = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const boost = context.createGain();
    const natureBus = context.createGain();
    compressor.threshold.value = -18;
    compressor.ratio.value = 6;
    boost.gain.value = speakerMode ? 2.4 : 1;
    natureBus.gain.value = natureVolume / 100;
    output.connect(compressor);
    compressor.connect(boost);
    natureBus.connect(output);
    Object.assign(engine, { context, output, compressor, boost, natureBus });
    context.addEventListener("statechange", emitAudioChange);
    try {
      if ("mediaSession" in navigator && "MediaMetadata" in window) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: "Come Home", artist: "A practice of presence" });
        navigator.mediaSession.setActionHandler("play", () => {
          setAudioPaused(false);
          context.resume().catch(error => console.warn("Audio could not resume.", error));
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          setAudioPaused(true);
          context.suspend().catch(error => console.warn("Audio could not pause.", error));
        });
      }
    } catch (error) {
      console.warn("Media Session controls are unavailable.", error);
    }

    try {
      const destination = context.createMediaStreamDestination();
      const audio = audioOutputRef.current;
      boost.connect(destination);
      audio.srcObject = destination.stream;
      engine.streamDestination = destination;
      audio.play().catch(error => {
        console.warn("Background audio output was unavailable; using the browser audio output.", error);
        if (!engine.directOutput) {
          try { boost.disconnect(destination); } catch {}
          boost.connect(context.destination);
          engine.directOutput = true;
        }
      });
    } catch (error) {
      console.warn("Background audio routing is unavailable; using the browser audio output.", error);
      boost.connect(context.destination);
      engine.directOutput = true;
    }
    context.resume().catch(error => console.warn("Audio could not start.", error));
    return context;
  }, [emitAudioChange, natureVolume, speakerMode]);

  const playChime = useCallback((kind = "middle", duration = 1.1) => {
    if (!chimes || audioPausedRef.current) return;
    const context = ensureAudio();
    const engine = engineRef.current;
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = kind === "high" ? 523.25 : kind === "low" ? 392 : 440;
    gain.gain.setValueAtTime(.001, context.currentTime);
    gain.gain.linearRampToValueAtTime(.12, context.currentTime + .025);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(engine.output);
    oscillator.start();
    oscillator.stop(context.currentTime + duration + .05);
  }, [chimes, ensureAudio]);

  const sendYoutubeCommand = useCallback((command, args = []) => {
    const frame = iframeRef.current;
    if (!frame?.contentWindow || !frame.src) return;
    try {
      frame.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args }), new URL(frame.src).origin);
    } catch (error) {
      console.warn(`Could not send YouTube ${command} command.`, error);
    }
  }, []);

  const changeYoutubeVolume = useCallback(value => {
    const volume = Math.min(100, Math.max(0, Math.round(Number(value) || 0)));
    setYoutubeVolume(volume);
  }, []);

  const stepYoutubeVolume = useCallback(amount => {
    setYoutubeVolume(current => Math.min(100, Math.max(0, current + amount)));
  }, []);

  const loadYoutube = useCallback((details, autoplay = false) => {
    window.clearTimeout(youtubeTimerRef.current);
    const src = youtubeEmbedUrl(details.host, details.video, details.playlist, autoplay);
    setYoutube({ ...details, src, ready: false, playing: false, wantPlay: autoplay, error: "", retries: details.retries || 0 });
  }, []);

  const playYoutube = useCallback(() => {
    setAudioPaused(false);
    setYoutube(current => ({ ...current, wantPlay: true }));
    if (youtube.ready) sendYoutubeCommand("playVideo");
    else if (!youtube.src) loadYoutube(youtube, true);
    emitAudioChange();
  }, [emitAudioChange, loadYoutube, sendYoutubeCommand, youtube]);

  const pauseYoutube = useCallback(() => {
    setYoutube(current => ({ ...current, wantPlay: false }));
    sendYoutubeCommand("pauseVideo");
  }, [sendYoutubeCommand]);

  const toggleYoutubePlayback = useCallback(() => {
    if (youtube.playing || youtube.wantPlay) pauseYoutube();
    else playYoutube();
  }, [pauseYoutube, playYoutube, youtube.playing, youtube.wantPlay]);

  const finishSession = useCallback((completed = false) => {
    const current = sessionRef.current;
    if (!current) return;
    const elapsed = completed ? current.duration : current.elapsed + (current.running ? (performance.now() - current.startedAt) / 1000 : 0);
    setSession(null);
    if (elapsed >= 1) {
      const amount = Math.max(0, Math.floor(elapsed));
      const key = todayKey();
      setHistory(previous => ({
        sessions: (previous.sessions || 0) + (completed ? 1 : 0),
        days: { ...previous.days, [key]: (previous.days[key] || 0) + amount }
      }));
    }
    if (current.musicLinked) {
      setYoutube(state => ({ ...state, wantPlay: false }));
      sendYoutubeCommand("pauseVideo");
    }
    if (completed && current.kind === "sit") {
      playChime("middle", 2.5);
      window.setTimeout(() => playChime("middle", 2.5), 1700);
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    previousBreathStepRef.current = -1;
    emitAudioChange();
  }, [emitAudioChange, playChime, sendYoutubeCommand]);

  const finishSessionRef = useRef(finishSession);
  finishSessionRef.current = finishSession;

  useEffect(() => {
    if (session?.kind === "sit" && session.running && elapsedSeconds >= session.duration) finishSessionRef.current(true);
  }, [elapsedSeconds, session]);

  const setBreathPattern = useCallback(id => {
    if (!DATA.breathPatterns.some(item => item.id === id)) return;
    if (sessionRef.current?.kind === "breathe") finishSessionRef.current(false);
    setPatternId(id);
    previousBreathStepRef.current = -1;
  }, []);

  const chooseSitDuration = useCallback(minutes => {
    if (sessionRef.current?.kind === "sit") finishSessionRef.current(false);
    setSitMinutes(minutes);
  }, []);

  const breathDisplay = useMemo(() => {
    if (session?.kind !== "breathe") {
      const selected = DATA.breathPatterns.find(item => item.id === patternId) || DATA.breathPatterns[0];
      return { phase: "Ready", count: selected.steps[0][1] >= 1 ? selected.steps[0][1] : "—", pump: "", rounds: "0", scale: selected.steps[0][2] };
    }
    const pattern = DATA.breathPatterns.find(item => item.id === session.pattern) || DATA.breathPatterns[0];
    const cycleLength = pattern.steps.reduce((sum, step) => sum + step[1], 0);
    const cycleTime = elapsedSeconds % cycleLength;
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
    return {
      phase: step[0].replace(/ · \d+$/, ""),
      count: step[1] < 1 ? "Breathe" : String(Math.max(1, Math.ceil(step[1] - withinStep))),
      pump: step[4] ? session.pattern === "bellows" ? `Breath ${step[4]} of 20` : `Pump ${step[4]} of 30` : "",
      rounds: String(Math.floor(elapsedSeconds / cycleLength)),
      scale: (step[2] + (step[3] - step[2]) * eased).toFixed(5),
      stepIndex
    };
  }, [elapsedSeconds, patternId, session]);

  useEffect(() => {
    if (session?.kind !== "breathe" || !session.running || breathDisplay.stepIndex === undefined || breathDisplay.stepIndex === previousBreathStepRef.current) return;
    previousBreathStepRef.current = breathDisplay.stepIndex;
    const step = (DATA.breathPatterns.find(item => item.id === session.pattern) || DATA.breathPatterns[0]).steps[breathDisplay.stepIndex];
    if (/\b(inhale|breathe in|deep breath in)\b/i.test(step[0])) playChime("high", .65);
    else if (step[0].includes("Hold") || step[0].includes("Rest")) playChime("middle", .65);
    else playChime("low", .65);
    if ("vibrate" in navigator) navigator.vibrate(24);
  }, [breathDisplay, playChime, session]);

  const pauseBreathSession = useCallback(() => {
    const current = sessionRef.current;
    if (current?.kind !== "breathe" || !current.running) return;
    const elapsed = current.elapsed + (performance.now() - current.startedAt) / 1000;
    setSession({ ...current, running: false, elapsed });
    if (current.musicLinked) pauseYoutube();
  }, [pauseYoutube]);

  const toggleSession = useCallback(kind => {
    const current = sessionRef.current;
    if (current?.kind === kind) {
      if (current.running) {
        if (kind === "breathe") pauseBreathSession();
        else {
          const elapsed = current.elapsed + (performance.now() - current.startedAt) / 1000;
          setSession({ ...current, running: false, elapsed });
          if (current.musicLinked) pauseYoutube();
        }
      } else {
        ensureAudio();
        setSession({ ...current, running: true, startedAt: performance.now() });
        if (current.musicLinked) playYoutube();
      }
      return;
    }
    if (current) finishSessionRef.current(false);
    const next = {
      kind, running: true, elapsed: 0, startedAt: performance.now(),
      duration: kind === "sit" ? sitMinutes * 60 : Infinity,
      pattern: patternId, musicLinked: withSessions
    };
    setSession(next);
    ensureAudio();
    if (kind === "sit") playChime("middle", 2);
    if (next.musicLinked) playYoutube();
  }, [ensureAudio, patternId, pauseBreathSession, pauseYoutube, playChime, playYoutube, sitMinutes, withSessions]);

  const resetSession = useCallback(kind => {
    if (sessionRef.current?.kind === kind) finishSessionRef.current(false);
  }, []);

  const breathingAway = session?.kind === "breathe" && active !== "breathe";

  useEffect(() => {
    if (!breathingAway || !session?.running) {
      setBackgroundBreathUntil(null);
      return undefined;
    }

    const deadline = performance.now() + 60_000;
    setBackgroundBreathUntil(deadline);
    const timer = window.setTimeout(pauseBreathSession, 60_000);
    return () => window.clearTimeout(timer);
  }, [breathingAway, pauseBreathSession, session?.running]);

  const phraseLines = useCallback((group, phrase = phrases[group]) => {
    const base = DATA.phraseSets[phrase.set]?.lines || [];
    return group === "affirm" && phrase.set === "manifest" ? [...base, ...intentions] : base;
  }, [intentions, phrases]);

  const updatePhrase = useCallback((group, update) => {
    setPhrases(current => ({ ...current, [group]: { ...current[group], ...update } }));
  }, []);

  const changePhrase = useCallback((group, amount) => {
    const lines = phraseLines(group);
    const next = (phrases[group].index + amount + lines.length) % lines.length;
    updatePhrase(group, { index: next });
    if (phrases[group].read && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lines[next]);
      utterance.rate = .85;
      window.speechSynthesis.speak(utterance);
    }
  }, [phraseLines, phrases, updatePhrase]);

  const choosePhraseSet = useCallback((group, set) => {
    if (!DATA.phraseSets[set]) return;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    updatePhrase(group, { set, index: 0, auto: false, read: false, note: "" });
  }, [updatePhrase]);

  const togglePhraseAuto = useCallback(group => {
    const phrase = phrases[group];
    const auto = !phrase.auto;
    updatePhrase(group, { auto });
    if (auto && group === "kriya" && phrase.index === 0) playChime("middle", 1.4);
  }, [phrases, playChime, updatePhrase]);

  const toggleReadPhrase = useCallback(group => {
    if (!("speechSynthesis" in window)) {
      updatePhrase(group, { note: "Spoken reading is not available in this browser." });
      return;
    }
    if (phrases[group].read) {
      window.speechSynthesis.cancel();
      updatePhrase(group, { read: false });
      return;
    }
    const text = phraseLines(group)[phrases[group].index];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = .85;
    utterance.onend = () => updatePhrase(group, { read: false });
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    updatePhrase(group, { read: true, note: "" });
  }, [phraseLines, phrases, updatePhrase]);

  useEffect(() => {
    const timers = [];
    GROUPS.forEach(group => {
      const { auto, set } = phrases[group];
      if (!auto) return;
      const seconds = DATA.phraseSets[set].duration;
      timers.push(window.setInterval(() => {
        setPhrases(current => {
          const currentLines = DATA.phraseSets[current[group].set].lines;
          const lines = group === "affirm" && current[group].set === "manifest" ? [...currentLines, ...intentions] : currentLines;
          return { ...current, [group]: { ...current[group], index: (current[group].index + 1) % lines.length } };
        });
      }, seconds * 1000));
    });
    return () => timers.forEach(timer => window.clearInterval(timer));
  }, [
    intentions,
    phrases.affirm.auto, phrases.affirm.set,
    phrases.kriya.auto, phrases.kriya.set,
    phrases.advaita.auto, phrases.advaita.set
  ]);

  const addIntention = useCallback(() => {
    const text = intentionInput.trim();
    if (!text) {
      setIntentionHelp("Write a short intention before saving.");
      intentionInputRef.current?.focus();
      return;
    }
    if (/\b(?:not|never|no|don't|doesn't|can't|cannot|won't|without|isn't|aren't)\b/i.test(text)) {
      setIntentionHelp("Try expressing what you want to welcome, in present-tense wording.");
      intentionInputRef.current?.focus();
      return;
    }
    setIntentions(current => [...current, text]);
    setIntentionInput("");
    setIntentionHelp("Saved on this device.");
    setPhrases(current => ({ ...current, affirm: { ...current.affirm, index: DATA.phraseSets[current.affirm.set].lines.length + intentions.length } }));
  }, [intentionInput, intentions.length]);

  const ensureAudioNodes = useCallback(() => {
    const engine = engineRef.current;
    const context = ensureAudio();
    if (!context) return null;
    return { engine, context };
  }, [ensureAudio]);

  const makeGain = useCallback((value = 1) => {
    const context = engineRef.current.context;
    const gain = context.createGain();
    gain.gain.value = value;
    return gain;
  }, []);

  const noiseBuffer = useCallback(kind => {
    const engine = engineRef.current;
    if (engine.buffers.has(kind)) return engine.buffers.get(kind);
    const context = engine.context;
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
    engine.buffers.set(kind, buffer);
    return buffer;
  }, []);

  const connectChain = useCallback(nodes => {
    for (let index = 0; index < nodes.length - 1; index += 1) nodes[index].connect(nodes[index + 1]);
  }, []);

  const addLfo = useCallback((layer, frequency, depth, parameter, type = "sine") => {
    const context = engineRef.current.context;
    const oscillator = context.createOscillator();
    const amount = makeGain(depth);
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(amount);
    amount.connect(parameter);
    oscillator.start();
    layer.nodes.push(oscillator, amount);
  }, [makeGain]);

  const buildNatureLayer = useCallback(sound => {
    const { engine, context } = ensureAudioNodes() || {};
    if (!engine || !context) return null;
    const layer = { nodes: [], timers: [], gain: makeGain(.8) };
    layer.gain.connect(engine.natureBus);
    const source = context.createBufferSource();
    source.buffer = noiseBuffer(sound.type === "brown" ? "brown" : "white");
    source.loop = true;
    source.start();
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
      const chirp = () => {
        if (!engine.layers.has("birds") || engine.layers.get("birds") !== layer) return;
        const now = context.currentTime;
        const count = 2 + Math.floor(Math.random() * 4);
        const base = 1900 + Math.random() * 2300;
        for (let index = 0; index < count; index += 1) {
          const delay = index * (.11 + Math.random() * .1);
          const oscillator = context.createOscillator();
          const gain = makeGain(.001);
          oscillator.frequency.setValueAtTime(base * (1 + index * .07), now + delay);
          oscillator.frequency.exponentialRampToValueAtTime(base * (.72 + Math.random() * .12), now + delay + .12);
          gain.gain.setValueAtTime(.001, now + delay);
          gain.gain.linearRampToValueAtTime(.045, now + delay + .015);
          gain.gain.exponentialRampToValueAtTime(.001, now + delay + .18);
          oscillator.connect(gain);
          gain.connect(layer.gain);
          oscillator.start(now + delay);
          oscillator.stop(now + delay + .2);
          layer.nodes.push(oscillator, gain);
          oscillator.onended = () => {
            layer.nodes = layer.nodes.filter(node => node !== oscillator && node !== gain);
            try { oscillator.disconnect(); gain.disconnect(); } catch {}
          };
        }
        layer.timers.push(window.setTimeout(chirp, 900 + Math.random() * 2600));
      };
      layer.timers.push(window.setTimeout(chirp, 0));
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
      const crackle = () => {
        if (!engine.layers.has("fire") || engine.layers.get("fire") !== layer) return;
        const crack = context.createBufferSource();
        const band = context.createBiquadFilter();
        const gain = makeGain(.001);
        crack.buffer = noiseBuffer("white");
        band.type = "bandpass";
        band.frequency.value = 1700 + Math.random() * 3300;
        band.Q.value = 2;
        connectChain([crack, band, gain, layer.gain]);
        const time = context.currentTime;
        gain.gain.setValueAtTime(.001, time);
        gain.gain.linearRampToValueAtTime(.12 + Math.random() * .1, time + .006);
        gain.gain.exponentialRampToValueAtTime(.001, time + .07);
        crack.start(time, Math.random() * 2, .085);
        crack.stop(time + .1);
        layer.nodes.push(crack, band, gain);
        crack.onended = () => {
          layer.nodes = layer.nodes.filter(node => node !== crack && node !== band && node !== gain);
          try { crack.disconnect(); band.disconnect(); gain.disconnect(); } catch {}
        };
        layer.timers.push(window.setTimeout(crackle, 120 + Math.random() * 520));
      };
      layer.timers.push(window.setTimeout(crackle, 160));
    }
    return layer;
  }, [addLfo, connectChain, ensureAudioNodes, makeGain, noiseBuffer]);

  const stopNatureLayer = useCallback(id => {
    const engine = engineRef.current;
    const layer = engine.layers.get(id);
    if (!layer) return;
    engine.layers.delete(id);
    layer.timers.forEach(window.clearTimeout);
    if (engine.context) layer.gain.gain.setTargetAtTime(.001, engine.context.currentTime, .12);
    window.setTimeout(() => layer.nodes.forEach(node => {
      try { if (typeof node.stop === "function") node.stop(); } catch {}
      try { node.disconnect(); } catch {}
    }), 500);
    setActiveSounds([...engine.layers.keys()]);
    emitAudioChange();
  }, [emitAudioChange]);

  const toggleNature = useCallback(id => {
    const engine = engineRef.current;
    if (engine.layers.has(id)) {
      stopNatureLayer(id);
      return;
    }
    const sound = DATA.natureSounds.find(item => item.id === id);
    const layer = sound && buildNatureLayer(sound);
    if (!layer) return;
    engine.layers.set(id, layer);
    setActiveSounds([...engine.layers.keys()]);
    setAudioPaused(false);
    emitAudioChange();
  }, [buildNatureLayer, emitAudioChange, stopNatureLayer]);

  const stopAllNature = useCallback(() => {
    [...engineRef.current.layers.keys()].forEach(stopNatureLayer);
  }, [stopNatureLayer]);

  useEffect(() => {
    const engine = engineRef.current;
    if (engine.natureBus && engine.context) engine.natureBus.gain.setTargetAtTime(natureVolume / 100, engine.context.currentTime, .12);
  }, [natureVolume]);

  const removeTone = useCallback(() => {
    const engine = engineRef.current;
    const current = engine.tone;
    if (!current) return;
    engine.tone = null;
    current.gain.gain.setTargetAtTime(.001, engine.context.currentTime, .08);
    window.setTimeout(() => current.nodes.forEach(node => {
      try { if (typeof node.stop === "function") node.stop(); } catch {}
      try { node.disconnect(); } catch {}
    }), 450);
    setTone(null);
    emitAudioChange();
  }, [emitAudioChange]);

  const createTone = useCallback((frequency, beat, label) => {
    const context = ensureAudio();
    const engine = engineRef.current;
    if (!context) return;
    const root = makeGain(.001);
    root.connect(engine.output);
    const nodes = [];
    const partials = speakerMode ? [[1, 1], [2, .7], [3, .5], [4, .35], [6, .2]] : [[1, 1]];
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
    if (beat && !speakerMode) {
      const left = makeGain(.5);
      const right = makeGain(.5);
      left.connect(root); right.connect(root);
      addVoice(frequency, -1, left);
      addVoice(frequency + beat, 1, right);
    } else if (beat) {
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
    } else {
      addVoice(frequency, 0, root);
    }
    root.gain.setTargetAtTime(toneVolume / 100 * .32, context.currentTime, .1);
    engine.tone = { frequency, beat, label, gain: root, nodes };
    setTone({ frequency, beat, label });
    setAudioPaused(false);
    emitAudioChange();
  }, [emitAudioChange, ensureAudio, makeGain, speakerMode, toneVolume]);

  const playSingleTone = useCallback((frequency, beat, label, fromJourney = false) => {
    const current = engineRef.current.tone;
    if (!fromJourney && journey.active) {
      window.clearTimeout(journeyTimerRef.current);
      setJourney(previous => ({ ...previous, active: false }));
    }
    if (current?.frequency === frequency && current?.beat === beat && !fromJourney) {
      removeTone();
      return;
    }
    removeTone();
    createTone(frequency, beat, label);
  }, [createTone, journey.active, removeTone]);
  playSingleToneRef.current = playSingleTone;

  useEffect(() => {
    const current = engineRef.current.tone;
    if (current && engineRef.current.context) current.gain.gain.setTargetAtTime(toneVolume / 100 * .32, engineRef.current.context.currentTime, .1);
  }, [toneVolume]);

  const changeSpeakerMode = useCallback(enabled => {
    if (speakerMode === enabled) return;
    const activeTone = engineRef.current.tone;
    setSpeakerMode(enabled);
    const engine = engineRef.current;
    if (engine.boost && engine.context) engine.boost.gain.setTargetAtTime(enabled ? 2.4 : 1, engine.context.currentTime, .12);
    if (activeTone) {
      const { frequency, beat, label } = activeTone;
      removeTone();
      window.setTimeout(() => createTone(frequency, beat, label), 0);
    }
  }, [createTone, removeTone, speakerMode]);

  useEffect(() => {
    if (!journey.active) return undefined;
    const playNext = () => {
      const current = journeyRef.current;
      const item = DATA.tones[current.index % DATA.tones.length];
      playSingleToneRef.current?.(item.frequency, 0, `${item.frequency} Hz`, true);
      setJourney(previous => ({ ...previous, index: (previous.index + 1) % DATA.tones.length }));
      journeyTimerRef.current = window.setTimeout(playNext, current.seconds * 1000);
    };
    playNext();
    return () => window.clearTimeout(journeyTimerRef.current);
  }, [journey.active, journey.seconds]);

  const toggleJourney = useCallback(() => {
    if (journey.active) {
      window.clearTimeout(journeyTimerRef.current);
      setJourney(current => ({ ...current, active: false }));
      removeTone();
    } else {
      setJourney(current => ({ ...current, active: true, index: 0 }));
    }
  }, [journey.active, removeTone]);

  const toggleAllAudio = useCallback(() => {
    const engine = engineRef.current;
    const paused = audioPaused || engine.context?.state === "suspended";
    if (paused) {
      setAudioPaused(false);
      if (engine.context?.state === "suspended") engine.context.resume().catch(error => console.warn("Audio could not resume.", error));
    } else {
      setAudioPaused(true);
      if (engine.context?.state === "running") engine.context.suspend().catch(error => console.warn("Audio could not pause.", error));
    }
    emitAudioChange();
  }, [audioPaused, emitAudioChange]);

  const stopAllAudio = useCallback(() => {
    stopAllNature();
    window.clearTimeout(journeyTimerRef.current);
    setJourney(current => ({ ...current, active: false }));
    removeTone();
    setYoutube(current => ({ ...current, wantPlay: false }));
    sendYoutubeCommand("pauseVideo");
    emitAudioChange();
  }, [emitAudioChange, removeTone, sendYoutubeCommand, stopAllNature]);

  const handleYoutubeLoad = useCallback(() => {
    const parsed = validYoutubeAddress(youtubeUrl.trim());
    if (!parsed) {
      setYoutube(current => ({ ...current, error: "Enter a YouTube video, short, embed, or playlist link." }));
      return;
    }
    loadYoutube({
      video: parsed.video || "",
      playlist: parsed.playlist,
      externalUrl: parsed.url,
      host: "https://www.youtube-nocookie.com",
      retries: 0
    }, true);
  }, [loadYoutube, youtubeUrl]);

  useEffect(() => {
    const parsed = validYoutubeAddress(DEFAULT_YOUTUBE_URL);
    if (!parsed) return;
    loadYoutube({
      video: parsed.video || "9THx_-Y1YJg",
      playlist: parsed.playlist,
      externalUrl: parsed.url,
      host: "https://www.youtube-nocookie.com",
      retries: 0
    });
  }, [loadYoutube]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame || !youtube.src) return undefined;
    const handleLoad = () => {
      try {
        frame.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "come-home" }), new URL(frame.src).origin);
      } catch (error) {
        console.warn("YouTube player handshake could not be sent.", error);
      }
    };
    frame.addEventListener("load", handleLoad);
    return () => frame.removeEventListener("load", handleLoad);
  }, [youtube.src]);

  useEffect(() => {
    if (youtube.ready) sendYoutubeCommand("setVolume", [youtubeVolume]);
  }, [sendYoutubeCommand, youtube.ready, youtubeVolume]);

  useEffect(() => {
    const onMessage = event => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      let originHost;
      try { originHost = new URL(event.origin).hostname; } catch { return; }
      if (!/youtube(?:-nocookie)?\.com$/i.test(originHost)) return;
      let message = event.data;
      try { if (typeof message === "string") message = JSON.parse(message); } catch { return; }
      if (!message || typeof message !== "object") return;
      if (message.event === "onReady" || message.event === "infoDelivery" || message.event === "onStateChange") {
        window.clearTimeout(youtubeTimerRef.current);
        setYoutube(current => ({ ...current, ready: true, error: "" }));
        if (youtube.wantPlay) sendYoutubeCommand("playVideo");
      }
      if (message.event === "onError" && Number(message.info) === 153) {
        setYoutube(current => {
          if (current.host.includes("youtube-nocookie") && current.retries === 0) {
            const next = { ...current, host: "https://www.youtube.com", retries: 1 };
            window.setTimeout(() => loadYoutube(next, current.wantPlay), 0);
            return current;
          }
          return { ...current, error: "Embedding did not respond. Open this selection in YouTube or try another link." };
        });
        return;
      }
      const playerState = message.event === "onStateChange" ? message.info : message.info?.playerState;
      if (typeof playerState === "number") {
        setYoutube(current => ({ ...current, playing: playerState === 1, wantPlay: playerState === 2 || playerState === 0 ? false : current.wantPlay }));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [loadYoutube, sendYoutubeCommand, youtube.wantPlay]);

  useEffect(() => {
    if (!youtube.src || youtube.ready) return undefined;
    youtubeTimerRef.current = window.setTimeout(() => {
      setYoutube(current => {
        if (current.ready) return current;
        if (current.retries === 0) {
          const next = { ...current, host: "https://www.youtube.com", retries: 1 };
          window.setTimeout(() => loadYoutube(next, current.wantPlay), 0);
          return current;
        }
        return { ...current, error: "Embedding did not respond. Open this selection in YouTube or try another link." };
      });
    }, 7000);
    return () => window.clearTimeout(youtubeTimerRef.current);
  }, [loadYoutube, youtube.ready, youtube.src]);

  useEffect(() => {
    if (!session) return;
    if (!withSessions && session.musicLinked) {
      setSession(current => current ? { ...current, musicLinked: false } : current);
      setYoutube(current => ({ ...current, wantPlay: false }));
      sendYoutubeCommand("pauseVideo");
    } else if (withSessions && !session.musicLinked) {
      setSession(current => current ? { ...current, musicLinked: true } : current);
      if (session.running) playYoutube();
    }
  }, [playYoutube, sendYoutubeCommand, session, withSessions]);

  useEffect(() => {
    if (!active) return;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPhrases(current => Object.fromEntries(Object.entries(current).map(([group, phrase]) => [group, { ...phrase, auto: false, read: false }])));
  }, [active]);

  useEffect(() => {
    const engine = engineRef.current;
    const handleBeforeUnload = () => {
      const current = sessionRef.current;
      if (!current) return;
      const elapsed = current.elapsed + (current.running ? (performance.now() - current.startedAt) / 1000 : 0);
      if (elapsed < 1) return;
      const key = todayKey();
      const previous = historyRef.current;
      const updated = {
        sessions: previous.sessions || 0,
        days: { ...previous.days, [key]: (previous.days[key] || 0) + Math.max(0, Math.floor(elapsed)) }
      };
      try {
        localStorage.setItem("come-home-history", JSON.stringify(updated));
      } catch (error) {
        console.warn("Could not save come-home-history to local storage.", error);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.clearInterval(journeyTimerRef.current);
      window.clearTimeout(youtubeTimerRef.current);
      engine.layers.forEach(layer => {
        layer.timers.forEach(window.clearTimeout);
        layer.nodes.forEach(node => {
          try { if (typeof node.stop === "function") node.stop(); } catch {}
          try { node.disconnect(); } catch {}
        });
      });
      engine.tone?.nodes.forEach(node => {
        try { if (typeof node.stop === "function") node.stop(); } catch {}
        try { node.disconnect(); } catch {}
      });
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (engine.context?.state !== "closed") engine.context?.close();
    };
  }, []);

  const audioItems = [
    ...(tone ? [tone.label] : []),
    ...activeSounds.map(id => DATA.natureSounds.find(sound => sound.id === id)?.name || id),
    ...(youtube.playing || youtube.wantPlay ? ["YouTube"] : [])
  ];
  const hasAudio = useMemo(() => audioItems.length > 0, [audioVersion, activeSounds, tone, youtube.playing, youtube.wantPlay]);
  const audioIsPaused = useMemo(() => audioPaused || Boolean(engineRef.current.context && engineRef.current.context.state !== "running"), [audioPaused, audioVersion]);
  const youtubeActive = youtube.playing || youtube.wantPlay;
  const localAudioActive = Boolean(tone || activeSounds.length || journey.active);
  const backgroundBreathSeconds = backgroundBreathUntil === null
    ? 60
    : Math.min(60, Math.max(0, Math.ceil((backgroundBreathUntil - now) / 1000)));

  function handlePath(item) {
    if (item.set) choosePhraseSet(item.tab, item.set);
    if (item.pattern) setBreathPattern(item.pattern);
    navigate(`/${item.tab}`);
  }

  function handleClearHistory() {
    if (!window.confirm("Reset your saved practice history on this device?")) return;
    setHistory({ sessions: 0, days: {} });
  }

  const musicSrc = youtube.src || youtubeEmbedUrl(youtube.host, youtube.video, youtube.playlist, false);

  return (
    <div className="page">
      <Header chimes={chimes} onToggleChimes={() => setChimes(value => !value)} onToggleTheme={() => setTheme(value => value === "dark" ? "light" : "dark")} theme={theme} />
      <Navigation active={active} onSelect={id => navigate(`/${id}`)} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage minutesToday={todayMinutes} streak={streak} dailyThought={dailyThought} onPath={handlePath} />} />
          <Route path="/home" element={<HomePage minutesToday={todayMinutes} streak={streak} dailyThought={dailyThought} onPath={handlePath} />} />
          <Route path="/breathe" element={<BreathPage patternId={patternId} session={session} elapsed={formattedElapsed} breathDisplay={breathDisplay} onChoosePattern={setBreathPattern} onToggle={() => toggleSession("breathe")} onReset={() => resetSession("breathe")} />} />
          <Route path="/sit" element={<SitPage minutes={sitMinutes} session={session} elapsed={formattedElapsed} remaining={sitRemaining} scale={sitScale} onChoose={chooseSitDuration} onToggle={() => toggleSession("sit")} onReset={() => resetSession("sit")} />} />
          <Route path="/chakras" element={<ChakrasPage index={chakraIndex} onChoose={setChakraIndex} onMove={amount => setChakraIndex(value => (value + amount + DATA.chakras.length) % DATA.chakras.length)} />} />
          <Route path="/affirm" element={<AffirmPage phrase={phrases.affirm} intentions={intentions} input={intentionInput} help={intentionHelp} inputRef={intentionInputRef} onInput={value => { setIntentionInput(value); setIntentionHelp(""); }} onAdd={addIntention} onRemove={index => setIntentions(value => value.filter((_, itemIndex) => itemIndex !== index))} onMove={changePhrase} onAuto={togglePhraseAuto} onSpeak={toggleReadPhrase} onChoose={choosePhraseSet} />} />
          <Route path="/kriya" element={<KriyaPage phrase={phrases.kriya} intentions={intentions} input={intentionInput} help={intentionHelp} inputRef={intentionInputRef} onInput={setIntentionInput} onAdd={addIntention} onRemove={() => {}} onMove={changePhrase} onAuto={togglePhraseAuto} onSpeak={toggleReadPhrase} onChoose={choosePhraseSet} />} />
          <Route path="/advaita" element={<AdvaitaPage phrase={phrases.advaita} intentions={intentions} input={intentionInput} help={intentionHelp} inputRef={intentionInputRef} onInput={setIntentionInput} onAdd={addIntention} onRemove={() => {}} onMove={changePhrase} onAuto={togglePhraseAuto} onSpeak={toggleReadPhrase} onChoose={choosePhraseSet} />} />
          <Route path="/nature" element={<NaturePage activeSounds={activeSounds} volume={natureVolume} onToggle={toggleNature} onVolume={setNatureVolume} onStop={stopAllNature} />} />
          <Route path="/tones" element={<TonesPage speakerMode={speakerMode} tone={tone} journey={journey} toneVolume={toneVolume} onMode={changeSpeakerMode} onPlay={playSingleTone} onJourneyDuration={seconds => setJourney(current => ({ ...current, seconds }))} onJourneyToggle={toggleJourney} onVolume={setToneVolume} />} />
          <Route path="/samyama" element={<SamyamaPage />} />
          <Route path="/music" element={null} />
          <Route path="/wisdom" element={<WisdomPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/journey" element={<JourneyPage history={history} streak={streak} onClear={handleClearHistory} />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <MusicPage active={active} url={youtubeUrl} externalUrl={externalYoutubeUrl} iframeRef={iframeRef} src={musicSrc} withSessions={withSessions} error={youtube.error} playing={youtube.playing || youtube.wantPlay} volume={youtubeVolume} onUrl={setYoutubeUrl} onLoad={handleYoutubeLoad} onWithSessions={setWithSessions} onTogglePlayback={toggleYoutubePlayback} onVolumeChange={changeYoutubeVolume} onVolumeStep={stepYoutubeVolume} />
      </main>
      <Footer />
      <PersistentPlayer
        audioItems={audioItems}
        hasAudio={hasAudio}
        localAudioActive={localAudioActive}
        audioIsPaused={audioIsPaused}
        onToggleAudio={toggleAllAudio}
        onStopAudio={stopAllAudio}
        youtubeActive={youtubeActive}
        youtubePlaying={youtube.playing || youtube.wantPlay}
        onToggleYoutube={toggleYoutubePlayback}
        youtubeVolume={youtubeVolume}
        onYoutubeVolumeStep={stepYoutubeVolume}
        breathSession={breathingAway ? session : null}
        breathDisplay={breathDisplay}
        elapsed={formattedElapsed}
        awaySeconds={backgroundBreathSeconds}
        onToggleBreath={() => toggleSession("breathe")}
        onResetBreath={() => resetSession("breathe")}
        onOpenBreath={() => navigate("/breathe")}
      />
      <audio id="audioOutput" ref={audioOutputRef} autoPlay playsInline aria-hidden="true" tabIndex={-1} />
    </div>
  );
}

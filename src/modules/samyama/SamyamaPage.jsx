import { useEffect, useState } from "react";
import { SAMYAMA_DURATIONS, SAMYAMA_LIMBS, SAMYAMA_SOURCES, SAMYAMA_TOPICS } from "./traditionalData.js";
import "./samyama.css";

const COMPLETIONS_KEY = "come-home-integrated-samyama-completions";

function readCompletions() {
  try {
    const saved = Number(localStorage.getItem(COMPLETIONS_KEY));
    return Number.isFinite(saved) && saved > 0 ? saved : 0;
  } catch (error) {
    console.warn("Could not read Samyama progress from local storage.", error);
    return 0;
  }
}

function displayTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function SamyamaPage() {
  const [topicId, setTopicId] = useState("virtues");
  const [minutes, setMinutes] = useState(SAMYAMA_DURATIONS[0]);
  const [secondsLeft, setSecondsLeft] = useState(SAMYAMA_DURATIONS[0] * 60);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [completions, setCompletions] = useState(readCompletions);
  const topic = SAMYAMA_TOPICS.find(item => item.id === topicId) || SAMYAMA_TOPICS[0];

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSecondsLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || secondsLeft > 0) return;
    setRunning(false);
    setComplete(true);
    setCompletions(value => value + 1);
  }, [running, secondsLeft]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETIONS_KEY, String(completions));
    } catch (error) {
      console.warn("Could not save Samyama progress to local storage.", error);
    }
  }, [completions]);

  function resetPractice() {
    setRunning(false);
    setHasStarted(false);
    setComplete(false);
    setSecondsLeft(minutes * 60);
  }

  function chooseTopic(id) {
    if (running) return;
    setTopicId(id);
    resetPractice();
  }

  function chooseDuration(value) {
    if (running) return;
    setMinutes(value);
    setSecondsLeft(value * 60);
    setHasStarted(false);
    setComplete(false);
  }

  function beginPractice() {
    if (complete) setSecondsLeft(minutes * 60);
    setHasStarted(true);
    setComplete(false);
    setRunning(true);
  }

  return (
    <section className="section integrated-samyama" aria-label="Integrated Samyama practice">
      <header className="integrated-samyama-hero">
        <p className="eyebrow">SAMYAMA · PATAÑJALI'S YOGA SUTRAS III.1–4</p>
        <h1>One object. <em>All three together.</em></h1>
        <p className="sub">In Patañjali's Yoga Sutras III.4, Samyama is the three limbs—dhāraṇā, dhyāna, and samādhi—applied together to one object, not three timed stages. Select a teaching from any supplied commentary; the source group only helps you find it.</p>
      </header>

      <article className="card integrated-samyama-card">
        <p className="eyebrow">1 · CHOOSE THE OBJECT FOR THIS SAMYAMA</p>
        <label className="integrated-samyama-select" htmlFor="samyamaTopic">One object or teaching
          <select id="samyamaTopic" value={topicId} disabled={running} onChange={event => chooseTopic(event.target.value)}>
            {SAMYAMA_SOURCES.map(source => (
              <optgroup key={source.id} label={source.title}>
                {source.topics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <p className="integrated-samyama-catalog-note">{SAMYAMA_TOPICS.length} selectable topics across all three texts. Source groups are only for browsing; every choice uses the same integrated Samyama practice.</p>

        <div className="integrated-samyama-object">
          <p className="eyebrow">{topic.sourceTitle} · {topic.section}</p>
          <h2>{topic.name}</h2>
          <p className="integrated-samyama-claim"><strong>Traditional claim in the text:</strong> {topic.traditionalClaim}</p>
          <p className="integrated-samyama-focus"><strong>Use this as the focus:</strong> {topic.focus}</p>
          {topic.caution && <p className="integrated-samyama-caution" role="note">{topic.caution}</p>}
        </div>

        <div className="integrated-samyama-duration">
          <span className="eyebrow">2 · CHOOSE ONE SESSION LENGTH</span>
          <div className="chip-row" role="group" aria-label="Samyama session duration">
            {SAMYAMA_DURATIONS.map(value => (
              <button key={value} className="chip" type="button" aria-pressed={minutes === value} disabled={running} onClick={() => chooseDuration(value)}>{value} min</button>
            ))}
          </div>
        </div>
      </article>

      <article className="card integrated-samyama-session">
        <div className="integrated-samyama-session-heading">
          <div>
            <p className="eyebrow">3 · PRACTICE SAMYAMA</p>
            <h2>Keep all three limbs with this one object</h2>
          </div>
          <span className="integrated-samyama-clock" aria-live="polite">{displayTime(secondsLeft)}</span>
        </div>
        <p className="integrated-samyama-unity">These are not three timed stages. Keep the same object and let all three aspects work together for the entire session.</p>
        <div className="integrated-samyama-limbs">
          {SAMYAMA_LIMBS.map(item => (
            <section className="integrated-samyama-limb" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </section>
          ))}
        </div>
        <div className="center-row">
          <button className="button button-primary" type="button" onClick={running ? () => setRunning(false) : beginPractice}>
            {running ? "Pause Samyama" : complete ? "Practice again" : hasStarted ? "Continue Samyama" : "Begin Samyama"}
          </button>
          <button className="button button-soft" type="button" onClick={resetPractice}>Reset</button>
        </div>
        <p className="integrated-samyama-completions">{completions} {completions === 1 ? "practice" : "practices"} completed on this device</p>
      </article>

      <aside className="safety-note">The traditional claims are presented as claims of the supplied commentaries by Swami Sivananda, not verified outcomes. For topics involving the Sun, breath, food, bodily limits, death, or supernatural powers, contemplate the teaching only—do not attempt physical tests or extreme practices. Stop whenever you wish.</aside>
    </section>
  );
}

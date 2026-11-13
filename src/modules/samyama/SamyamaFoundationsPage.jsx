import { useEffect, useState } from "react";
import { SAMYAMA_DURATIONS, SAMYAMA_PATHS, SAMYAMA_STAGES } from "./foundationsData.js";
import { SAMYAMA_LIMBS, SAMYAMA_SOURCES, SAMYAMA_TOPICS } from "./traditionalData.js";
import "./foundations.css";

function readCompletions() {
  try {
    const saved = Number(localStorage.getItem("come-home-samyama-completions"));
    return Number.isFinite(saved) && saved > 0 ? saved : 0;
  } catch (error) {
    console.warn("Could not read Samyama practice progress from local storage.", error);
    return 0;
  }
}

function displayTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function SamyamaFoundationsPage() {
  const [pathId, setPathId] = useState(SAMYAMA_PATHS[0].id);
  const [practiceId, setPracticeId] = useState(SAMYAMA_PATHS[0].practices[0].id);
  const [minutesPerStage, setMinutesPerStage] = useState(SAMYAMA_DURATIONS[0]);
  const [stageIndex, setStageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SAMYAMA_DURATIONS[0] * 60);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [completions, setCompletions] = useState(readCompletions);
  const [studyTopicId, setStudyTopicId] = useState(SAMYAMA_TOPICS[0].id);
  const path = SAMYAMA_PATHS.find(item => item.id === pathId) || SAMYAMA_PATHS[0];
  const practice = path.practices.find(item => item.id === practiceId) || path.practices[0];
  const stage = SAMYAMA_STAGES[stageIndex];
  const studyTopic = SAMYAMA_TOPICS.find(item => item.id === studyTopicId) || SAMYAMA_TOPICS[0];

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSecondsLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || secondsLeft > 0) return;
    if (stageIndex < SAMYAMA_STAGES.length - 1) {
      setStageIndex(value => value + 1);
      setSecondsLeft(minutesPerStage * 60);
      return;
    }
    setRunning(false);
    setComplete(true);
    setCompletions(value => value + 1);
  }, [minutesPerStage, running, secondsLeft, stageIndex]);

  useEffect(() => {
    try {
      localStorage.setItem("come-home-samyama-completions", String(completions));
    } catch (error) {
      console.warn("Could not save Samyama practice progress to local storage.", error);
    }
  }, [completions]);

  function chooseDuration(value) {
    if (running) return;
    setMinutesPerStage(value);
    setSecondsLeft(value * 60);
    setStageIndex(0);
    setHasStarted(false);
    setComplete(false);
  }

  function choosePath(id) {
    const nextPath = SAMYAMA_PATHS.find(item => item.id === id);
    if (!nextPath) return;
    setPathId(id);
    setPracticeId(nextPath.practices[0].id);
    resetPractice();
  }

  function choosePractice(id) {
    if (running) return;
    setPracticeId(id);
    resetPractice();
  }

  function startPractice() {
    if (complete) {
      setStageIndex(0);
      setSecondsLeft(minutesPerStage * 60);
      setComplete(false);
    }
    setHasStarted(true);
    setRunning(true);
  }

  function resetPractice() {
    setRunning(false);
    setStageIndex(0);
    setSecondsLeft(minutesPerStage * 60);
    setHasStarted(false);
    setComplete(false);
  }

  return (
    <section className="section samyama-page" aria-label="Samyama foundations">
      <div className="samyama-hero">
        <div className="samyama-mandala" aria-hidden="true"><span></span><span></span><span></span></div>
        <p className="eyebrow">SAMYAMA FOUNDATIONS · EXPLORATORY PRACTICES</p>
        <h1>Explore one doorway. <em>Step by step.</em></h1>
        <p className="sub">Use these gentle preparatory exercises to become familiar with attention before trying the unified Samyama practice.</p>
      </div>

      <article className="card samyama-reference">
        <div className="section-title">
          <div>
            <p className="eyebrow">PREPARATION · THREE REFERENCE COLLECTIONS</p>
            <h2>Choose a study collection</h2>
          </div>
        </div>
        <div className="samyama-reference-grid">
          {SAMYAMA_PATHS.map((item, index) => (
            <button key={item.id} className="samyama-reference-card" type="button" aria-pressed={pathId === item.id} disabled={running} onClick={() => choosePath(item.id)}>
              <span>TEXT 0{index + 1}</span>
              <strong>{item.sourceTitle}</strong>
              <small>{item.summary}</small>
            </button>
          ))}
        </div>
      </article>

      <article className="card samyama-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">1 · CHOOSE A PREPARATORY EXERCISE</p>
            <h2>{path.name}: what would you like to explore?</h2>
          </div>
        </div>
        <div className="samyama-focus-grid" role="group" aria-label={`Practices from ${path.sourceTitle}`}>
          {path.practices.map(item => (
            <button key={item.id} className="samyama-focus" type="button" aria-pressed={practiceId === item.id} disabled={running} onClick={() => choosePractice(item.id)}>
              <span className="focus-orbit" aria-hidden="true"></span><strong>{item.name}</strong><small>{item.summary}</small>
            </button>
          ))}
        </div>
        <div className="samyama-prompt" aria-live="polite">
          <p className="eyebrow">{path.sourceTitle} · {practice.sourceSection}</p>
          <p>{practice.summary}</p>
        </div>
        <div className="samyama-duration">
          <span className="eyebrow">2 · SET A COMFORTABLE PACE · MINUTES PER STAGE</span>
          <div className="chip-row" role="group" aria-label="Minutes for each stage">
            {SAMYAMA_DURATIONS.map(value => <button key={value} className="chip" type="button" aria-pressed={minutesPerStage === value} disabled={running} onClick={() => chooseDuration(value)}>{value} min each</button>)}
          </div>
        </div>
        <p className="samyama-reference-note">Adapted from Swami Sivananda's traditional commentary. Spiritual powers described in the sources are not promised or treated as measurable results here.</p>
      </article>

      <article className="card samyama-session">
        <div className="samyama-stage-list" aria-label="Practice stages">
          {SAMYAMA_STAGES.map((item, index) => (
            <div className={`samyama-stage${stageIndex === index && !complete ? " current" : ""}${complete || stageIndex > index ? " passed" : ""}`} key={item.name}>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name}</strong>
            </div>
          ))}
        </div>
        <div className="samyama-clock" aria-live="polite">
          <div className="samyama-clock-ring"><span>{complete ? "Complete" : running ? stage.name.split(" · ")[0] : "Ready"}</span><strong>{displayTime(secondsLeft)}</strong></div>
          <p>{complete ? "You made space for practice. Let the next moment be ordinary." : practice.stages[stageIndex]}</p>
        </div>
        <div className="center-row">
          <button className="button button-primary" type="button" onClick={running ? () => setRunning(false) : startPractice}>{running ? "Pause" : complete ? "Practice again" : hasStarted ? "Continue" : "Begin gently"}</button>
          <button className="button button-soft" type="button" onClick={resetPractice}>Reset</button>
        </div>
        <p className="samyama-completions">{completions} {completions === 1 ? "practice" : "practices"} completed on this device</p>
      </article>

      <article className="card samyama-reference samyama-source-study">
        <div className="section-title">
          <div>
            <p className="eyebrow">STUDY · THE THREE SOURCE COLLECTIONS</p>
            <h2>Explore the traditional focus topics</h2>
          </div>
        </div>
        <label className="samyama-study-select" htmlFor="foundationSourceTopic">Choose a source topic
          <select id="foundationSourceTopic" value={studyTopicId} onChange={event => setStudyTopicId(event.target.value)}>
            {SAMYAMA_SOURCES.map(source => (
              <optgroup key={source.id} label={source.title}>
                {source.topics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="samyama-source-entry" aria-live="polite">
          <p className="eyebrow">{studyTopic.sourceTitle} · {studyTopic.section}</p>
          <h3>{studyTopic.name}</h3>
          <p><strong>Traditional account:</strong> {studyTopic.traditionalClaim}</p>
          <p><strong>Reflective focus:</strong> {studyTopic.focus}</p>
          {studyTopic.caution && <p className="samyama-source-caution" role="note">{studyTopic.caution}</p>}
        </div>
        <p className="samyama-reference-note">These are source-attributed traditional claims, not verified outcomes. Use the practical, symbolic focus; never attempt risky bodily or supernatural tests.</p>
      </article>

      <article className="card samyama-reference samyama-integrated-teaching">
        <p className="eyebrow">PRACTICE SAMYAMA · PATAÑJALI'S YOGA SUTRAS III.1–4</p>
        <h2>Keep all three limbs with this one object</h2>
        <p className="samyama-teaching-time">3:00 · a short guided example</p>
        <p>These are not three timed stages. Keep the same object and let all three aspects work together for the entire session.</p>
        <div className="samyama-teaching-limbs">
          {SAMYAMA_LIMBS.map(item => (
            <section className="samyama-teaching-limb" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </section>
          ))}
        </div>
        <p className="samyama-reference-note">Before formal Samyama, complete the breathing and sitting preparation in the Samyama tab. The short interval there is a gentle cue to bring the object to mind, then release it into stillness.</p>
      </article>

      <aside className="safety-note">These are preparatory exercises, not the unified Samyama described by Patañjali. Traditional commentaries make spiritual claims that are not presented as verified outcomes here. Keep your eyes open if that feels safer, and stop whenever you wish.</aside>
    </section>
  );
}

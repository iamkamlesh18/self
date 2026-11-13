import { useEffect, useState } from "react";
import { SAMYAMA_DURATIONS, SAMYAMA_PATHS, SAMYAMA_STAGES } from "./data.js";
import "./samyama.css";

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

export default function SamyamaPage() {
  const [pathId, setPathId] = useState(SAMYAMA_PATHS[0].id);
  const [practiceId, setPracticeId] = useState(SAMYAMA_PATHS[0].practices[0].id);
  const [minutesPerStage, setMinutesPerStage] = useState(SAMYAMA_DURATIONS[0]);
  const [stageIndex, setStageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SAMYAMA_DURATIONS[0] * 60);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [completions, setCompletions] = useState(readCompletions);
  const path = SAMYAMA_PATHS.find(item => item.id === pathId) || SAMYAMA_PATHS[0];
  const practice = path.practices.find(item => item.id === practiceId) || path.practices[0];
  const stage = SAMYAMA_STAGES[stageIndex];

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
    <section className="section samyama-page" aria-label="Samyama practice">
      <div className="samyama-hero">
        <div className="samyama-mandala" aria-hidden="true"><span></span><span></span><span></span></div>
        <p className="eyebrow">SAMYAMA · A PRACTICE OF ATTENTION</p>
        <h1>One focus. <em>Three movements.</em></h1>
        <p className="sub">A gentle, modern introduction to concentration, meditation, and resting with experience. There is nothing to force or attain.</p>
      </div>

      <article className="card samyama-reference">
        <div className="section-title">
          <div>
            <p className="eyebrow">PRACTICE LIBRARY · BUILT FROM YOUR THREE TEXTS</p>
            <h2>Choose a source path</h2>
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
            <p className="eyebrow">1 · CHOOSE A GUIDED EXERCISE</p>
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

      <aside className="safety-note">These are original, beginner-friendly adaptations of themes in the supplied commentaries by Swami Sivananda, not a complete traditional Samyama method. Teachers interpret the texts differently. No special powers or results are promised. Keep your eyes open if that feels safer, and stop whenever you wish.</aside>
    </section>
  );
}

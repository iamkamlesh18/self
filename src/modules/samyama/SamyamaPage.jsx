import { useEffect, useState } from "react";
import { SAMYAMA_DURATIONS, SAMYAMA_FOCI, SAMYAMA_STAGES } from "./data.js";
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
  const [focusId, setFocusId] = useState(SAMYAMA_FOCI[0].id);
  const [minutesPerStage, setMinutesPerStage] = useState(SAMYAMA_DURATIONS[0]);
  const [stageIndex, setStageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SAMYAMA_DURATIONS[0] * 60);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [completions, setCompletions] = useState(readCompletions);
  const focus = SAMYAMA_FOCI.find(item => item.id === focusId) || SAMYAMA_FOCI[0];
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
    setComplete(false);
  }

  function startPractice() {
    if (complete) {
      setStageIndex(0);
      setSecondsLeft(minutesPerStage * 60);
      setComplete(false);
    }
    setRunning(true);
  }

  function resetPractice() {
    setRunning(false);
    setStageIndex(0);
    setSecondsLeft(minutesPerStage * 60);
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

      <article className="card samyama-card">
        <div className="section-title"><div><p className="eyebrow">1 · CHOOSE A DOORWAY</p><h2>What would you like to notice?</h2></div></div>
        <div className="samyama-focus-grid" role="group" aria-label="Choose a meditation focus">
          {SAMYAMA_FOCI.map(item => (
            <button key={item.id} className="samyama-focus" type="button" aria-pressed={focusId === item.id} disabled={running} onClick={() => setFocusId(item.id)}>
              <span className="focus-orbit" aria-hidden="true"></span><strong>{item.name}</strong>
            </button>
          ))}
        </div>
        <div className="samyama-prompt" aria-live="polite">
          <p className="eyebrow">{focus.reference}</p>
          <p>{focus.prompt}</p>
        </div>
        <div className="samyama-duration">
          <span className="eyebrow">2 · SET A COMFORTABLE PACE</span>
          <div className="chip-row" role="group" aria-label="Minutes for each stage">
            {SAMYAMA_DURATIONS.map(value => <button key={value} className="chip" type="button" aria-pressed={minutesPerStage === value} disabled={running} onClick={() => chooseDuration(value)}>{value} min each</button>)}
          </div>
        </div>
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
          <p>{complete ? "You made space for practice. Let the next moment be ordinary." : stage.instruction}</p>
        </div>
        <div className="center-row">
          <button className="button button-primary" type="button" onClick={running ? () => setRunning(false) : startPractice}>{running ? "Pause" : complete ? "Practice again" : stageIndex > 0 || secondsLeft < minutesPerStage * 60 ? "Continue" : "Begin gently"}</button>
          <button className="button button-soft" type="button" onClick={resetPractice}>Reset</button>
        </div>
        <p className="samyama-completions">{completions} {completions === 1 ? "practice" : "practices"} completed on this device</p>
      </article>

      <aside className="safety-note">The three terms describe a traditional framework in Patañjali's Yoga Sutras (III.1–6); teachers interpret them in different ways. This guided reflection is not a claim of samādhi, special powers, or a particular result. Keep your eyes open if that feels safer, and stop whenever you wish. The supplied commentaries also caution against making extraordinary attainments the goal.</aside>
    </section>
  );
}

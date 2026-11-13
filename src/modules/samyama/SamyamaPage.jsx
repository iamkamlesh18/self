import { useEffect, useState } from "react";
import { SAMYAMA_SOURCES, SAMYAMA_TOPICS } from "./traditionalData.js";
import "./samyama.css";

const COMPLETIONS_KEY = "come-home-integrated-samyama-completions";
const PREPARATION_KEY = "come-home-samyama-preparation";
const FOCUS_INTERVALS = [15, 30, 60];

function readCompletions() {
  try {
    const saved = Number(localStorage.getItem(COMPLETIONS_KEY));
    return Number.isFinite(saved) && saved > 0 ? saved : 0;
  } catch (error) {
    console.warn("Could not read Samyama progress from local storage.", error);
    return 0;
  }
}

function readPreparation() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREPARATION_KEY) || "{}");
    return { breathing: saved.breathing === true, sitting: saved.sitting === true };
  } catch (error) {
    console.warn("Could not read Samyama preparation from local storage.", error);
    return { breathing: false, sitting: false };
  }
}

function displayTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function SamyamaPage() {
  const [topicId, setTopicId] = useState("virtues");
  const [focusSeconds, setFocusSeconds] = useState(FOCUS_INTERVALS[0]);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_INTERVALS[0]);
  const [phase, setPhase] = useState("ready");
  const [running, setRunning] = useState(false);
  const [completedIntervals, setCompletedIntervals] = useState(0);
  const [completions, setCompletions] = useState(readCompletions);
  const [preparation, setPreparation] = useState(readPreparation);
  const [breathPattern, setBreathPattern] = useState("4:4");
  const [sittingMinutes, setSittingMinutes] = useState(5);
  const [activePreparation, setActivePreparation] = useState(null);
  const [preparationRunning, setPreparationRunning] = useState(false);
  const [preparationSecondsLeft, setPreparationSecondsLeft] = useState(0);
  const [preparationDuration, setPreparationDuration] = useState(0);
  const topic = SAMYAMA_TOPICS.find(item => item.id === topicId) || SAMYAMA_TOPICS[0];
  const isReady = preparation.breathing && preparation.sitting;
  const isSunFocus = topic.id === "sun";

  useEffect(() => {
    if (!preparationRunning) return undefined;
    const timer = window.setInterval(() => setPreparationSecondsLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [preparationRunning]);

  useEffect(() => {
    if (!preparationRunning || preparationSecondsLeft > 0 || !activePreparation) return;
    setPreparationRunning(false);
    setPreparation(value => ({ ...value, [activePreparation]: true }));
    setActivePreparation(null);
  }, [activePreparation, preparationRunning, preparationSecondsLeft]);

  useEffect(() => {
    if (!running || phase !== "focus") return undefined;
    const timer = window.setInterval(() => setSecondsLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [phase, running]);

  useEffect(() => {
    if (!running || phase !== "focus" || secondsLeft > 0) return;
    setRunning(false);
    setPhase("stillness");
    setCompletedIntervals(value => value + 1);
  }, [phase, running, secondsLeft]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETIONS_KEY, String(completions));
    } catch (error) {
      console.warn("Could not save Samyama progress to local storage.", error);
    }
  }, [completions]);

  useEffect(() => {
    try {
      localStorage.setItem(PREPARATION_KEY, JSON.stringify(preparation));
    } catch (error) {
      console.warn("Could not save Samyama preparation to local storage.", error);
    }
  }, [preparation]);

  function startPreparation(type, seconds) {
    if (preparation[type] || activePreparation !== null) return;
    if (type === "sitting" && !preparation.breathing) return;
    setActivePreparation(type);
    setPreparationDuration(seconds);
    setPreparationSecondsLeft(seconds);
    setPreparationRunning(true);
  }

  function stopPreparation() {
    setPreparationRunning(false);
    setActivePreparation(null);
    setPreparationSecondsLeft(0);
    setPreparationDuration(0);
  }

  function resetPreparation() {
    stopPreparation();
    setPreparation({ breathing: false, sitting: false });
  }

  function chooseTopic(id) {
    if (running || phase === "focus" || phase === "stillness" || phase === "self-guided") return;
    setTopicId(id);
    setPhase("ready");
    setCompletedIntervals(0);
    setSecondsLeft(focusSeconds);
  }

  function chooseFocusInterval(value) {
    if (running || phase === "focus" || phase === "stillness" || phase === "self-guided") return;
    setFocusSeconds(value);
    setSecondsLeft(value);
    setPhase("ready");
    setCompletedIntervals(0);
  }

  function beginFocusInterval() {
    if (!isReady) return;
    setPhase("focus");
    setSecondsLeft(focusSeconds);
    setRunning(true);
  }

  function beginWithoutTimer() {
    if (!isReady) return;
    setCompletedIntervals(1);
    setPhase("self-guided");
  }

  function finishPractice() {
    setRunning(false);
    if (completedIntervals > 0) {
      setCompletions(value => value + 1);
      setPhase("complete");
    } else {
      setPhase("ready");
    }
    setCompletedIntervals(0);
  }

  const breathCycleSeconds = breathPattern === "4:4" ? 8 : 10;
  const breathElapsed = preparationDuration - preparationSecondsLeft;
  const breathPhasePosition = breathElapsed % breathCycleSeconds;
  const isBreathingIn = breathPhasePosition < 4;
  const breathPhaseRemaining = isBreathingIn
    ? 4 - breathPhasePosition
    : breathCycleSeconds - breathPhasePosition;

  return (
    <section className="section integrated-samyama" aria-label="Integrated Samyama practice">
      <header className="integrated-samyama-hero">
        <p className="eyebrow">SAMYAMA · A QUIET, PERSONAL PRACTICE</p>
        <h1>Arrive in stillness. <em>Hold one focus gently.</em></h1>
        <p className="sub">Complete the two preparation practices first. Choose one object, bring it to mind briefly, then release it into stillness. The short timer is only a guide; continue in your own rhythm when ready.</p>
      </header>

      <article className="card integrated-samyama-card integrated-samyama-preparation">
        <div className="integrated-samyama-prep-heading">
          <div>
            <p className="eyebrow">FIRST · PREPARE THE BODY AND MIND</p>
            <h2>Complete both before beginning</h2>
          </div>
          <span className={`integrated-samyama-ready${isReady ? " is-ready" : ""}`} aria-live="polite">
            {isReady ? "2 of 2 ready" : `${Number(preparation.breathing) + Number(preparation.sitting)} of 2 ready`}
          </span>
        </div>
        <div className="integrated-samyama-prep-list">
          <section className={`integrated-samyama-prep-row${preparation.breathing ? " is-complete" : ""}`} aria-label="Breathing preparation">
            <span className="integrated-samyama-prep-status" aria-label={preparation.breathing ? "Completed" : "Not completed"}>
              {preparation.breathing ? "✓" : "1"}
            </span>
            <div className="integrated-samyama-prep-copy">
              <h3>Easy rhythmic breathing · at least 5 minutes</h3>
              <p>Choose 4:4 or 4:6. Breathe in and out smoothly, with no holds or forcing. If uncomfortable, stop the pattern and breathe naturally.</p>
              <div className="chip-row" role="group" aria-label="Breathing rhythm" >
                {["4:4", "4:6"].map(pattern => (
                  <button
                    key={pattern}
                    className="chip"
                    type="button"
                    aria-pressed={breathPattern === pattern}
                    disabled={preparation.breathing || activePreparation !== null}
                    onClick={() => setBreathPattern(pattern)}
                  >{pattern}</button>
                ))}
              </div>
            </div>
            <div className="integrated-samyama-prep-action">
              {preparation.breathing ? <strong className="integrated-samyama-done">Done</strong> : activePreparation === "breathing" ? (
                <>
                  <strong className="integrated-samyama-prep-time" aria-live="polite">{displayTime(preparationSecondsLeft)}</strong>
                  <span className="integrated-samyama-breath-cue">{isBreathingIn ? "Breathe in" : "Breathe out"} · {breathPhaseRemaining}</span>
                  <button className="button button-soft" type="button" onClick={() => setPreparationRunning(value => !value)}>{preparationRunning ? "Pause" : "Continue"}</button>
                  <button className="button button-soft" type="button" onClick={stopPreparation}>Stop</button>
                </>
              ) : (
                <button className="button button-primary" type="button" disabled={activePreparation !== null} onClick={() => startPreparation("breathing", 5 * 60)}>Begin 5 minutes</button>
              )}
            </div>
          </section>

          <section className={`integrated-samyama-prep-row${preparation.sitting ? " is-complete" : ""}`} aria-label="Seated stillness preparation">
            <span className="integrated-samyama-prep-status" aria-label={preparation.sitting ? "Completed" : "Not completed"}>
              {preparation.sitting ? "✓" : "2"}
            </span>
            <div className="integrated-samyama-prep-copy">
              <h3>Sit quietly · at least 5 minutes</h3>
              <p>Choose 5 or 10 minutes. Sit comfortably in Sukhasana or on a chair; let the breath move naturally. Close your eyes only if comfortable.</p>
              <div className="chip-row" role="group" aria-label="Seated stillness duration">
                {[5, 10].map(value => (
                  <button
                    key={value}
                    className="chip"
                    type="button"
                    aria-pressed={sittingMinutes === value}
                    disabled={preparation.sitting || activePreparation !== null}
                    onClick={() => setSittingMinutes(value)}
                  >{value} min</button>
                ))}
              </div>
            </div>
            <div className="integrated-samyama-prep-action">
              {preparation.sitting ? <strong className="integrated-samyama-done">Done</strong> : activePreparation === "sitting" ? (
                <>
                  <strong className="integrated-samyama-prep-time" aria-live="polite">{displayTime(preparationSecondsLeft)}</strong>
                  <span className="integrated-samyama-breath-cue">Rest comfortably</span>
                  <button className="button button-soft" type="button" onClick={() => setPreparationRunning(value => !value)}>{preparationRunning ? "Pause" : "Continue"}</button>
                  <button className="button button-soft" type="button" onClick={stopPreparation}>Stop</button>
                </>
              ) : (
                <button className="button button-primary" type="button" disabled={!preparation.breathing || activePreparation !== null} onClick={() => startPreparation("sitting", sittingMinutes * 60)}>
                  {preparation.breathing ? `Begin ${sittingMinutes} minutes` : "Complete breathing first"}
                </button>
              )}
            </div>
          </section>
        </div>
        <p className="integrated-samyama-prep-footnote">Preparation completion is saved on this device. These are gentle options, not a medical instruction; stop or return to natural breathing at any time.</p>
        {(preparation.breathing || preparation.sitting) && (
          <button className="button button-soft integrated-samyama-reset-prep" type="button" disabled={["focus", "stillness", "self-guided"].includes(phase)} onClick={resetPreparation}>Reset preparation checklist</button>
        )}
      </article>

      <article className="card integrated-samyama-card">
        <p className="eyebrow">THEN · CHOOSE ONE OBJECT</p>
        <label className="integrated-samyama-select" htmlFor="samyamaTopic">Focus for this practice
          <select id="samyamaTopic" value={topicId} disabled={running || phase === "focus" || phase === "stillness" || phase === "self-guided"} onChange={event => chooseTopic(event.target.value)}>
            {SAMYAMA_SOURCES.map(source => (
              <optgroup key={source.id} label={source.title}>
                {source.topics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>

        <div className={`integrated-samyama-object${isSunFocus ? " is-sun-focus" : ""}`}>
          {isSunFocus && (
            <figure className="integrated-samyama-sun">
              <img src={`${import.meta.env.BASE_URL}images/sun-sdo-193.jpg`} alt="The Sun imaged by NASA's Solar Dynamics Observatory in ultraviolet 193 angstrom light, shown in false color." />
              <figcaption>NASA/SDO · AIA 193 Å ultraviolet image (false color)</figcaption>
            </figure>
          )}
          <div>
            <p className="eyebrow">YOUR FOCUS</p>
            <h2>{topic.name}</h2>
            <p className="integrated-samyama-focus">
              {isSunFocus
                ? "Notice the Sun's light, warmth, and steady radiance as qualities. Look at the image briefly, then close your eyes or lower your gaze and hold the idea gently. Never look directly at the real Sun."
                : topic.focus}
            </p>
          </div>
        </div>
      </article>

      <article className={`card integrated-samyama-session${!isReady ? " is-locked" : ""}`}>
        <div className="integrated-samyama-session-heading">
          <div>
            <p className="eyebrow">PRACTICE · FOCUS, THEN RELEASE</p>
            <h2>{phase === "stillness" ? "Let the object dissolve into stillness" : phase === "self-guided" ? "Your own rhythm" : phase === "complete" ? "Practice complete" : "Bring the chosen object to mind"}</h2>
          </div>
          <span className="integrated-samyama-clock" aria-live="polite">
            {phase === "focus" ? displayTime(secondsLeft) : phase === "stillness" ? "Rest" : phase === "self-guided" ? "No timer" : displayTime(focusSeconds)}
          </span>
        </div>
        <p className="integrated-samyama-unity">
          {phase === "stillness"
            ? "Release effort and let the image, word, or thought recede. Rest in open stillness; there is nothing to force or achieve."
            : phase === "self-guided"
              ? "At your own pace, bring the selected object to mind for a few seconds, then release it into stillness. Stay as long as feels comfortable and finish when ready."
            : phase === "complete"
              ? "You can leave the quiet here, or begin another brief focus interval in your own time."
              : "When ready, let the selected object flow into awareness for a few seconds. As the interval ends, release it into stillness. Close your eyes or keep a soft gaze, and use a comfortable chair or Sukhasana."}
        </p>
        <div className="integrated-samyama-duration">
          <span className="eyebrow">GUIDANCE INTERVAL · OPTIONAL TIMER</span>
          <div className="chip-row" role="group" aria-label="Brief focus interval">
            {FOCUS_INTERVALS.map(value => (
              <button key={value} className="chip" type="button" aria-pressed={focusSeconds === value} disabled={running || phase === "focus" || phase === "stillness" || phase === "self-guided"} onClick={() => chooseFocusInterval(value)}>{value} sec</button>
            ))}
          </div>
        </div>
        <div className="center-row">
          {phase === "ready" && (
            <>
              <button className="button button-primary" type="button" disabled={!isReady} onClick={beginFocusInterval}>Begin guided focus</button>
              <button className="button button-soft" type="button" disabled={!isReady} onClick={beginWithoutTimer}>Practice without timer</button>
            </>
          )}
          {phase === "focus" && (
            <>
              <button className="button button-primary" type="button" onClick={() => setRunning(value => !value)}>{running ? "Pause timer" : "Continue focus"}</button>
              <button className="button button-soft" type="button" onClick={finishPractice}>Finish gently</button>
            </>
          )}
          {phase === "stillness" && (
            <>
              <button className="button button-primary" type="button" onClick={beginFocusInterval}>Return to focus</button>
              <button className="button button-soft" type="button" onClick={finishPractice}>Finish in stillness</button>
            </>
          )}
          {phase === "self-guided" && (
            <button className="button button-primary" type="button" onClick={finishPractice}>Finish in stillness</button>
          )}
          {phase === "complete" && (
            <button className="button button-primary" type="button" onClick={() => setPhase("ready")}>Close practice</button>
          )}
        </div>
        {!isReady && <p className="integrated-samyama-gate" role="status">Complete both preparation practices above to unlock Samyama.</p>}
        <p className="integrated-samyama-completions">{completions} {completions === 1 ? "practice" : "practices"} completed on this device</p>
      </article>

      <aside className="safety-note">The interval is only a reminder, not a target. Let attention and posture be comfortable, and stop if you feel unwell. The traditional material and claims can be explored in Samyama Foundations.</aside>
    </section>
  );
}

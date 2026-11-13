import { SIT_DURATIONS } from "../breathe/data.js";
import "./sit.css";

export default function SitPage({ minutes, session, elapsed, remaining, scale, onChoose, onToggle, onReset }) {
  const running = session?.kind === "sit" && session.running;
  return (
    <section className="section" aria-label="Sitting practice">
      <div className="page-heading"><p className="eyebrow">SIT · NOTHING TO ACHIEVE</p><h1>Give stillness <em>a little room.</em></h1><p className="sub">Choose a length that feels kind. You can finish early whenever you need.</p></div>
      <div className="card sit-card">
        <div className="section-title"><div><p className="eyebrow">SET YOUR TIME</p><h2>Just sit</h2></div></div>
        <div className="chip-row" role="group" aria-label="Meditation duration">
          {SIT_DURATIONS.map(value => <button key={value} type="button" className={`chip${minutes === value ? " selected" : ""}`} aria-pressed={minutes === value} onClick={() => onChoose(value)}>{value} min</button>)}
        </div>
        <div className="sit-orb-wrap"><div className="sit-orb" style={{ transform: `scale(${session?.kind === "sit" ? scale : ".85"})` }}></div><div className="sit-clock"><span>{session?.kind === "sit" ? "Just sit" : "Ready"}</span><strong>{remaining}</strong><small>{session?.kind === "sit" ? `${elapsed} elapsed · be here as you are` : "A quiet moment is waiting"}</small></div></div>
        <div className="center-row"><button className="button button-primary" type="button" onClick={onToggle}>{running ? "Pause" : session?.kind === "sit" ? "Resume sitting" : "Begin sitting"}</button><button className="button button-soft" type="button" onClick={onReset}>Reset</button></div>
        <p className="practice-note">A soft bell marks the beginning and the end. Let your posture be comfortable, and your breath unforced.</p>
        <p className="practice-note">After a 5-minute 4:4 or 4:6 breathing session, completing this 5-minute-or-longer sit marks the second Samyama preparation step. Samyama readiness lasts one hour and resets when you leave the site.</p>
      </div>
    </section>
  );
}

import { BREATH_PATTERNS } from "./data.js";
import "./breathe.css";

export default function BreathPage({ patternId, session, elapsed, breathDisplay, breathSoundEnabled, onToggleBreathSound, onChoosePattern, onToggle, onReset }) {
  const selected = BREATH_PATTERNS.find(item => item.id === patternId) || BREATH_PATTERNS[0];
  const running = session?.kind === "breathe" && session.running;
  const phase = session?.kind === "breathe" ? breathDisplay.phase : "Ready";
  const count = session?.kind === "breathe" ? breathDisplay.count : (selected.steps[0][1] >= 1 ? selected.steps[0][1] : "—");

  return (
    <section className="section" aria-label="Breathing practice">
      <div className="page-heading"><p className="eyebrow">BREATH · AT YOUR OWN PACE</p><h1>Let the breath <em>lead.</em></h1><p className="sub">Choose a rhythm. Keep it gentle, and return to your natural breath whenever you wish.</p></div>
      <div className="card">
        <div className="section-title"><div><p className="eyebrow">CHOOSE A PATTERN</p><h2>Breathing practice</h2></div></div>
        <div className="chip-grid" role="group" aria-label="Breathing patterns">
          {BREATH_PATTERNS.map(pattern => <button key={pattern.id} type="button" className={`chip${patternId === pattern.id ? " selected" : ""}`} aria-pressed={patternId === pattern.id} onClick={() => onChoosePattern(pattern.id)}>{pattern.name}</button>)}
        </div>
        <p className="practice-note">{selected.note}</p>
        {["calm", "long-exhale"].includes(patternId) && (
          <p className="practice-note">To prepare for Samyama, complete at least five minutes of this gentle 4:4 or 4:6 rhythm, then complete a seated 5–10 minute Sit practice. The Samyama checklist updates automatically; readiness lasts one hour and resets when you leave the site.</p>
        )}
        <div className="breath-stage">
          <div className="breath-halo"></div><div className="breath-orb" style={{ transform: `scale(${breathDisplay.scale})` }}></div>
          <div className="breath-center"><span>{phase}</span><strong>{count}</strong><small>{session?.kind === "breathe" ? breathDisplay.pump : ""}</small></div>
        </div>
        <div className="session-stats"><div><strong>{session?.kind === "breathe" ? breathDisplay.rounds : "0"}</strong><span>Rounds</span></div><div><strong>{session?.kind === "breathe" ? elapsed : "0:00"}</strong><span>Time</span></div></div>
        <div className="breath-actions">
          {selected.sound && (
            <div className="breath-sound-control">
              <span>{selected.sound === "bhramari" ? "Soft humming tone" : "Soft synthesized Om tone"} · local sound, no YouTube</span>
              <button className="button button-soft" type="button" aria-pressed={breathSoundEnabled} onClick={onToggleBreathSound}>
                Sound {breathSoundEnabled ? "on" : "off"}
              </button>
            </div>
          )}
          <div className="center-row"><button className="button button-primary" type="button" onClick={onToggle}>{running ? "Pause" : session?.kind === "breathe" ? "Resume" : "Start"}</button><button className="button button-soft" type="button" onClick={onReset}>Reset</button></div>
          <p className="safety-note">{["bellows", "pumps"].includes(patternId) ? selected.note : "If you feel light-headed, anxious, or uncomfortable, stop and breathe naturally."}</p>
        </div>
      </div>
    </section>
  );
}

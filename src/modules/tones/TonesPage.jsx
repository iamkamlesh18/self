import { BINAURAL_BEATS, JOURNEY_DURATIONS, TONES } from "./data.js";
import "./tones.css";
import "../../shared/components/sound.css";

export default function TonesPage({ speakerMode, tone, journey, toneVolume, onMode, onPlay, onJourneyDuration, onJourneyToggle, onVolume }) {
  return (
    <section className="section" aria-label="Tones and listening">
      <div className="page-heading"><p className="eyebrow">TONES · FOR RELAXATION AND FOCUS</p><h1>Let a tone <em>hold your attention.</em></h1><p className="sub">These frequencies are sound choices, not established healing treatments.</p></div>
      <div className="card sound-card">
        <div className="section-title"><div><p className="eyebrow">OUTPUT MODE</p><h2>Choose your listening setup</h2></div></div>
        <div className="chip-row"><button className="chip mode-chip" type="button" aria-pressed={!speakerMode} onClick={() => onMode(false)}>Headphones · binaural</button><button className="chip mode-chip" type="button" aria-pressed={speakerMode} onClick={() => onMode(true)}>Speaker · harmonics</button></div>
        <div className="section-title small-title"><div><p className="eyebrow">SINGLE FREQUENCIES</p><h2>Choose a tone</h2></div></div>
        <div className="sound-grid tone-grid">{TONES.map(item => <button key={item.frequency} className="sound-button tone-button" type="button" data-label={`${item.frequency} Hz`} aria-pressed={tone?.frequency === item.frequency && tone.beat === 0} onClick={() => onPlay(item.frequency, 0, `${item.frequency} Hz`)}><span><strong>{item.frequency} Hz</strong><small>{item.label}</small></span></button>)}</div>
        <div className="section-title small-title"><div><p className="eyebrow">BEAT FREQUENCIES</p><h2>{speakerMode ? "Isochronic pulses · speaker friendly" : "Binaural beats · headphones recommended"}</h2></div></div>
        <div className="sound-grid beat-grid">{BINAURAL_BEATS.map(item => <button key={item.label} className="sound-button beat-button" type="button" data-label={`${item.label} ${item.beat} Hz`} aria-pressed={tone?.beat === item.beat} onClick={() => onPlay(200, item.beat, `${item.label} ${item.beat} Hz`)}><span><strong>{item.label}</strong><small>{item.beat} Hz beat</small></span></button>)}</div>
        <div className="journey-box"><div><p className="eyebrow">AUTO JOURNEY</p><p className="sub">Play each frequency in order, then loop.</p></div><div className="chip-row">{JOURNEY_DURATIONS.map(seconds => <button key={seconds} type="button" className={`chip${journey.seconds === seconds ? " selected" : ""}`} aria-pressed={journey.seconds === seconds} onClick={() => onJourneyDuration(seconds)}>{seconds}s each</button>)}</div><button className="button button-soft" type="button" aria-pressed={journey.active} onClick={onJourneyToggle}>{journey.active ? "■ Stop journey" : "▶ Start journey"}</button></div>
        <div className="volume-row"><label htmlFor="toneVolume">Tone volume</label><input type="range" id="toneVolume" min="0" max="100" value={toneVolume} onChange={event => onVolume(Number(event.target.value))} /><output htmlFor="toneVolume">{toneVolume}%</output></div>
        <p className="practice-note">Start quietly, especially with headphones. Stop if a tone feels uncomfortable. Frequency labels do not imply medical or spiritual effects.</p>
      </div>
    </section>
  );
}

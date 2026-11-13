import { NATURE_SOUNDS } from "./data.js";
import "../../shared/components/sound.css";

export default function NaturePage({ activeSounds, volume, onToggle, onVolume, onStop }) {
  return (
    <section className="section" aria-label="Nature soundscape">
      <div className="page-heading"><p className="eyebrow">NATURE · MADE HERE, IN YOUR BROWSER</p><h1>Find a softer <em>soundscape.</em></h1><p className="sub">Layer gentle synthesized sounds. They can continue as you move between sections.</p></div>
      <div className="card sound-card">
        <div className="section-title"><div><p className="eyebrow">SEVEN SOUND LAYERS</p><h2>Build your own quiet</h2></div></div>
        <div className="sound-grid">{NATURE_SOUNDS.map(sound => <button className="sound-button" type="button" key={sound.id} aria-pressed={activeSounds.includes(sound.id)} onClick={() => onToggle(sound.id)}><span className="sound-icon" aria-hidden="true">{sound.icon}</span><span><strong>{sound.name}</strong><small>Synthesized sound</small></span></button>)}</div>
        <div className="volume-row"><label htmlFor="natureVolume">Nature volume</label><input type="range" id="natureVolume" min="0" max="100" value={volume} onChange={event => onVolume(Number(event.target.value))} /><output htmlFor="natureVolume">{volume}%</output></div>
        <div className="center-row"><button className="button button-soft" type="button" onClick={onStop}>Stop all nature</button></div>
        <p className="practice-note">Sound is synthesized live; no audio files are downloaded. Keep volume comfortable and take breaks from headphones.</p>
      </div>
    </section>
  );
}

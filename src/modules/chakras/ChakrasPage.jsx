import { CHAKRAS } from "./data.js";
import "./chakras.css";

export default function ChakrasPage({ index, onChoose, onMove }) {
  const chakra = CHAKRAS[index];
  return (
    <section className="section" aria-label="Chakra reflections">
      <div className="page-heading"><p className="eyebrow">CHAKRAS · A TRADITIONAL MAP</p><h1>Explore seven <em>centres.</em></h1><p className="sub">Use these symbols as prompts for reflection, not as medical facts or a measure of your wellbeing.</p></div>
      <div className="card">
        <div className="chip-row" role="group" aria-label="Choose a symbolic centre">
          {CHAKRAS.map((item, itemIndex) => <button key={item.name} type="button" className="chip chakra-choice" style={{ "--chakra-color": item.color }} aria-pressed={itemIndex === index} onClick={() => onChoose(itemIndex)}>{item.name}</button>)}
        </div>
        <article className="chakra-card" aria-live="polite">
          <div className="chakra-mark" style={{ "--chakra-color": chakra.color }} aria-hidden="true">✿</div>
          <p className="eyebrow">{chakra.seed}</p><h2>{chakra.name} · {chakra.sanskrit}</h2><p className="sub">{chakra.focus}</p>
          <dl className="chakra-facts">
            <div><dt>Location</dt><dd>{chakra.location}</dd></div><div><dt>Element</dt><dd>{chakra.element}</dd></div>
            <div><dt>Traditional petals</dt><dd>{chakra.petals}</dd></div><div><dt>Modern frequency association</dt><dd>{chakra.frequency} Hz</dd></div>
          </dl>
          <blockquote>{chakra.affirmation}</blockquote><p className="practice-note">{chakra.practice}</p>
          <div className="center-row"><button className="button button-soft" type="button" onClick={() => onMove(-1)}>← Previous</button><button className="button button-soft" type="button" onClick={() => onMove(1)}>Next →</button></div>
        </article>
        <p className="safety-note">Chakra descriptions belong to spiritual traditions; interpretations differ. Frequency numbers are contemporary associations, not established healing effects. Keep movement and breath comfortable.</p>
      </div>
    </section>
  );
}

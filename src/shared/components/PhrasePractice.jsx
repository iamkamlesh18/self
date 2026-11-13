import { PHRASE_SETS } from "../../modules/phrases/data.js";
import { WISDOM_REFLECTIONS } from "../../modules/wisdom/data.js";
import WisdomCards from "./WisdomCards.jsx";
import "../../modules/phrases/phrases.css";

export default function PhrasePractice({ group, phrase, intentions, input, help, inputRef, onInput, onAdd, onRemove, onMove, onAuto, onSpeak, onChoose }) {
  const set = PHRASE_SETS[phrase.set];
  const lines = group === "affirm" && phrase.set === "manifest" ? [...set.lines, ...intentions] : set.lines;
  const choices = group === "affirm" ? ["affirm", "manifest", "hooponopono"] : group === "kriya" ? ["kriya"] : ["advaita", "pattern"];
  const controls = (
    <div className="phrase-controls">
      <button className="button button-soft" type="button" aria-label="Previous phrase" onClick={() => onMove(group, -1)}>← Previous</button>
      <button className="button button-soft" type="button" aria-pressed={phrase.auto} onClick={() => onAuto(group)}>{phrase.auto ? group === "kriya" ? "Pause guided practice" : "Stop auto" : group === "kriya" ? "Begin guided practice" : "Auto"}</button>
      <button className="button button-soft" type="button" aria-label="Next phrase" onClick={() => onMove(group, 1)}>Next →</button>
      <button className="button button-soft" type="button" aria-pressed={phrase.read} onClick={() => onSpeak(group)}>Read aloud</button>
    </div>
  );
  const heading = {
    affirm: ["WORDS · INTENTION · KINDNESS", <>Choose words that <em>support you.</em></>, "Take each phrase as an invitation, not a promise or a measure of your worth."],
    kriya: ["KRIYA · PEACE · CONNECTION", <>A practice of <em>loving attention.</em></>, "A contemplative sequence inspired by Raja Yoga language in the supplied references. Follow it gently or simply read."],
    advaita: ["ADVAITA · INQUIRY · WITNESSING", <>Turn toward the <em>one who notices.</em></>, "A shared phrase viewer for inquiry, non-dual contemplation, and noticing habitual responses."]
  }[group];

  return (
    <section className="section" aria-label={`${group} practice`}>
      <div className="page-heading"><p className="eyebrow">{heading[0]}</p><h1>{heading[1]}</h1><p className="sub">{heading[2]}</p></div>
      <div className="card phrase-card">
        <div className="phrase-header"><div><p className="eyebrow">{set.title.toUpperCase()}</p><p className="sub">{set.note}</p></div></div>
        {group !== "kriya" && <div className="chip-row phrase-sets" role="group" aria-label={group === "affirm" ? "Phrase sets" : "Inquiry practices"}>
          {choices.map(name => <button key={name} type="button" className="chip" aria-pressed={phrase.set === name} onClick={() => onChoose(group, name)}>{PHRASE_SETS[name].title}</button>)}
        </div>}
        <div className="phrase-display"><span className="quote-mark" aria-hidden="true">“</span><p aria-live="polite">{lines[phrase.index] || ""}</p><span className="phrase-count">{lines.length ? `${phrase.index + 1} / ${lines.length}` : ""}</span></div>
        {controls}
        <p className="practice-note">{phrase.note || set.note}</p>
        {group === "affirm" && phrase.set === "manifest" && <div className="intention-box">
          <label htmlFor="intentionInput">Add a personal intention</label>
          <div className="input-row"><input ref={inputRef} id="intentionInput" type="text" maxLength="180" placeholder="I take one clear step toward…" value={input} onChange={event => onInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter") onAdd(); }} /><button className="button button-primary" type="button" onClick={onAdd}>Save</button></div>
          <p className="input-help">{help || "Use a present-tense phrase that feels supportive and realistic."}</p>
          <ul className="intentions-list">{intentions.length ? intentions.map((text, index) => <li className="intention-item" key={`${text}-${index}`}><span>{text}</span><button type="button" aria-label={`Remove intention: ${text}`} onClick={() => onRemove(index)}>×</button></li>) : <li className="practice-note">Your intentions stay on this device.</li>}</ul>
        </div>}
        {group === "advaita" && <WisdomCards wisdom={WISDOM_REFLECTIONS} />}
      </div>
    </section>
  );
}

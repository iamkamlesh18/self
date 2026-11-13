import { HOME_PATHS } from "./data.js";
import "./home.css";

export default function HomePage({ minutesToday, streak, dailyThought, onPath }) {
  return (
    <section className="section home-page" aria-label="Home">
      <div className="hero card">
        <p className="eyebrow">A GENTLE PLACE TO BEGIN</p>
        <h1>Come home to <em>yourself.</em></h1>
        <p className="sub">Make room for old patterns to soften. Create your next step from a little more peace.</p>
        <div className="hero-glow" aria-hidden="true"><span>✳</span></div>
      </div>
      <div className="stats">
        <div className="stat"><strong>{minutesToday}</strong><span>Minutes today</span></div>
        <div className="stat"><strong>{streak}</strong><span>Day practice streak</span></div>
      </div>
      <article className="card daily-card"><p className="eyebrow">A THOUGHT FOR THIS MOMENT</p><p className="daily-thought">{dailyThought}</p></article>
      <div className="section-title"><div><p className="eyebrow">A PATH YOU CAN TAKE IN ANY ORDER</p><h2>Choose what meets you</h2></div></div>
      <div className="path-grid">
        {HOME_PATHS.map(item => (
          <button className="path-card" type="button" key={item.number} onClick={() => onPath(item)}>
            <span className="path-number">{item.number}</span>
            <span><strong>{item.name}</strong><small>{item.detail}</small></span>
          </button>
        ))}
      </div>
      <p className="closing-note">Familiar responses can take shape over time. Begin by noticing them with care. Then choose a small, grounded action that reflects the life you want to build.</p>
    </section>
  );
}

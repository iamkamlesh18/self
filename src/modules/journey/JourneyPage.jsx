import "./journey.css";

export default function JourneyPage({ history, streak, onClear }) {
  const entries = Object.entries(history.days).sort((a, b) => b[0].localeCompare(a[0]));
  const minutes = Math.floor(entries.reduce((sum, [, seconds]) => sum + seconds, 0) / 60);
  return (
    <section className="section" aria-label="Your practice history">
      <div className="page-heading"><p className="eyebrow">YOUR PRACTICE · SAVED ON THIS DEVICE</p><h1>Notice the time you <em>made.</em></h1><p className="sub">A gentle record of minutes spent breathing, sitting, or reflecting.</p></div>
      <div className="card journey-card">
        <div className="stats"><div className="stat"><strong>{history.sessions || 0}</strong><span>Practices</span></div><div className="stat"><strong>{minutes}</strong><span>Minutes</span></div><div className="stat"><strong>{streak}</strong><span>Day streak</span></div></div>
        <h2>Practice by day</h2>
        <div className="history-list">{entries.length ? entries.slice(0, 7).map(([day, seconds]) => <div className="history-row" key={day}><span>{new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${day}T12:00:00`))}</span><strong>{Math.floor(seconds / 60)} min</strong></div>) : <p className="practice-note">Your practice days will appear here.</p>}</div>
        <button className="button button-soft" type="button" onClick={onClear}>Reset saved progress</button>
      </div>
    </section>
  );
}

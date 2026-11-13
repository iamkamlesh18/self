export default function Header({ chimes, onToggleChimes, onToggleTheme, onHome, theme }) {
  return (
    <header className="topbar">
      <a className="brand" href="#home" onClick={event => { event.preventDefault(); onHome(); }}>
        <span className="brand-mark" aria-hidden="true">✳</span>
        <span>Come Home<small>A PRACTICE OF PRESENCE</small></span>
      </a>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Toggle practice chimes" aria-pressed={chimes} title="Toggle chimes" onClick={onToggleChimes}>♬</button>
        <button className="icon-button" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Switch color theme" onClick={onToggleTheme}>◐</button>
      </div>
    </header>
  );
}

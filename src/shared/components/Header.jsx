import { Link } from "react-router-dom";

export default function Header({ chimes, doNotDisturb, onToggleChimes, onToggleDoNotDisturb, onToggleTheme, theme }) {
  return (
    <header className="topbar">
      <Link className="brand" to="/home">
        <span className="brand-mark" aria-hidden="true">✳</span>
        <span>Come Home<small>A PRACTICE OF PRESENCE</small></span>
      </Link>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label={`Practice chimes ${chimes ? "on" : "off"}; soft cues mark breathing phases and sitting practice`} aria-pressed={chimes} title="Soft cues mark breathing phases and sitting practice." onClick={onToggleChimes}>♬</button>
        <button className="icon-button" type="button" aria-label={`Do Not Disturb ${doNotDisturb ? "on" : "off"}; quiet this site's cues only`} aria-pressed={doNotDisturb} title="Quiet this site's practice cues. Device and browser notifications are controlled by your device." onClick={onToggleDoNotDisturb}>☾</button>
        <button className="icon-button" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Switch color theme" onClick={onToggleTheme}>◐</button>
      </div>
    </header>
  );
}

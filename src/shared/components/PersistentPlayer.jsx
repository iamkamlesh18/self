function formatTime(seconds) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

export default function PersistentPlayer({
  audioItems,
  hasAudio,
  audioIsPaused,
  onToggleAudio,
  onStopAudio,
  youtubeActive,
  youtubeVolume,
  onYoutubeVolumeStep,
  breathSession,
  breathDisplay,
  elapsed,
  awaySeconds,
  onToggleBreath,
  onResetBreath,
  onOpenBreath
}) {
  if (!hasAudio && !breathSession) return null;

  return (
    <aside className={`mini-player${breathSession ? " has-breath-session" : ""}`} aria-label="Active practice and audio controls">
      {breathSession && (
        <div className="mini-breath">
          <span className="mini-pulse" aria-hidden="true"></span>
          <div className="mini-breath-copy">
            <span className="mini-label">Breathing · {breathDisplay.phase} {breathDisplay.count}</span>
            <small>{breathSession.running ? `Pauses in ${formatTime(awaySeconds)} · ${elapsed}` : `Paused · ${elapsed}`}</small>
          </div>
          <button type="button" aria-label={breathSession.running ? "Pause breathing practice" : "Resume breathing practice"} onClick={onToggleBreath}>
            {breathSession.running ? "Ⅱ" : "▶"}
          </button>
          <button type="button" className="mini-secondary" aria-label="Return to breathing practice" onClick={onOpenBreath}>↗</button>
          <button type="button" className="mini-secondary" aria-label="End breathing practice" onClick={onResetBreath}>×</button>
        </div>
      )}
      {hasAudio && (
        <div className="mini-audio">
          <span className="mini-pulse" aria-hidden="true"></span>
          <span className="mini-label">{audioItems.join(" · ") || "Audio paused"}</span>
          {youtubeActive && (
            <div className="mini-volume" aria-label={`YouTube volume ${youtubeVolume}%`}>
              <button type="button" aria-label="Lower YouTube volume" disabled={youtubeVolume === 0} onClick={() => onYoutubeVolumeStep(-10)}>−</button>
              <button type="button" aria-label="Raise YouTube volume" disabled={youtubeVolume === 100} onClick={() => onYoutubeVolumeStep(10)}>＋</button>
            </div>
          )}
          <button type="button" aria-label={audioIsPaused ? "Resume all audio" : "Pause all audio"} onClick={onToggleAudio}>{audioIsPaused ? "▶" : "Ⅱ"}</button>
          <button type="button" className="mini-secondary" aria-label="Stop all audio" onClick={onStopAudio}>×</button>
        </div>
      )}
    </aside>
  );
}

import "./music.css";

export default function MusicPage({ active, url, externalUrl, iframeRef, src, withSessions, error, playing, volume, onUrl, onLoad, onWithSessions, onTogglePlayback, onVolumeChange, onVolumeStep }) {
  return (
    <section className={`section${active === "music" ? "" : " offscreen"}`} id="persistent-music" aria-label="Music player" aria-hidden={active !== "music"} inert={active !== "music"}>
      <div className="page-heading"><p className="eyebrow">MUSIC · YOUR YOUTUBE PLAYER</p><h1>Bring a sound you <em>love.</em></h1><p className="sub">Paste a YouTube video or playlist link. Music can stay active while you explore other sections.</p></div>
      <div className="card music-card">
        <div className={`video-frame${playing ? " is-playing" : ""}`}><iframe ref={iframeRef} src={src} title="YouTube audio player" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
        <div className="youtube-controls">
          <button className="button button-primary youtube-play" type="button" aria-label={playing ? "Pause YouTube audio" : "Play YouTube audio"} aria-pressed={playing} onClick={onTogglePlayback}>{playing ? "Ⅱ Pause" : "▶ Play"}</button>
          <div className="youtube-volume">
            <button type="button" aria-label="Lower YouTube volume" disabled={volume === 0} onClick={() => onVolumeStep(-10)}>−</button>
            <label htmlFor="youtubeVolume">Volume</label>
            <input id="youtubeVolume" type="range" min="0" max="100" step="1" value={volume} onChange={event => onVolumeChange(event.target.value)} />
            <output htmlFor="youtubeVolume">{volume}%</output>
            <button type="button" aria-label="Raise YouTube volume" disabled={volume === 100} onClick={() => onVolumeStep(10)}>＋</button>
          </div>
        </div>
        <label htmlFor="youtubeUrl">Video or playlist URL</label>
        <div className="input-row"><input id="youtubeUrl" type="url" value={url} autoComplete="url" onChange={event => onUrl(event.target.value)} /><button className="button button-primary" type="button" onClick={onLoad}>Load &amp; play</button></div>
        <div className="music-actions"><label className="inline-toggle"><input type="checkbox" checked={withSessions} onChange={event => onWithSessions(event.target.checked)} /><span>Music with breathing and sitting</span></label><a className="button button-soft" href={externalUrl} target="_blank" rel="noopener noreferrer">Open in YouTube ↗</a></div>
        <p className="practice-note">If an embed cannot play here, open it in YouTube. Locked-screen playback is not guaranteed by browsers; the YouTube app is the reliable route.</p>
        {error && <p className="practice-note">{error}</p>}
      </div>
    </section>
  );
}

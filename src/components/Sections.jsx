import { DATA } from "../data.js";

function WisdomCards({ wisdom, className = "" }) {
  return (
    <div className={`wisdom-grid ${className}`.trim()}>
      {wisdom.map(item => (
        <article className="wisdom-card" key={item.title}>
          <p className="eyebrow">{item.source}</p>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function HomeSection({ active, minutesToday, streak, dailyThought, onPath }) {
  return (
    <section className="section" id="t-home" role="tabpanel" aria-labelledby="tab-home" hidden={active !== "home"}>
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
        {DATA.paths.map(item => (
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

function BreathSection({ active, patternId, session, elapsed, breathDisplay, onChoosePattern, onToggle, onReset }) {
  const selected = DATA.breathPatterns.find(item => item.id === patternId) || DATA.breathPatterns[0];
  const running = session?.kind === "breathe" && session.running;
  const phase = session?.kind === "breathe" ? breathDisplay.phase : "Ready";
  const count = session?.kind === "breathe" ? breathDisplay.count : (selected.steps[0][1] >= 1 ? selected.steps[0][1] : "—");
  return (
    <section className="section" id="t-breathe" role="tabpanel" aria-labelledby="tab-breathe" hidden={active !== "breathe"}>
      <div className="page-heading"><p className="eyebrow">BREATH · AT YOUR OWN PACE</p><h1>Let the breath <em>lead.</em></h1><p className="sub">Choose a rhythm. Keep it gentle, and return to your natural breath whenever you wish.</p></div>
      <div className="card">
        <div className="section-title"><div><p className="eyebrow">CHOOSE A PATTERN</p><h2>Breathing practice</h2></div></div>
        <div className="chip-grid" role="group" aria-label="Breathing patterns">
          {DATA.breathPatterns.map(pattern => <button key={pattern.id} type="button" className={`chip${patternId === pattern.id ? " selected" : ""}`} aria-pressed={patternId === pattern.id} onClick={() => onChoosePattern(pattern.id)}>{pattern.name}</button>)}
        </div>
        <p className="practice-note">{selected.note}</p>
        <div className="breath-stage">
          <div className="breath-halo"></div><div className="breath-orb" style={{ transform: `scale(${breathDisplay.scale})` }}></div>
          <div className="breath-center"><span>{phase}</span><strong>{count}</strong><small>{session?.kind === "breathe" ? breathDisplay.pump : ""}</small></div>
        </div>
        <div className="session-stats"><div><strong>{session?.kind === "breathe" ? breathDisplay.rounds : "0"}</strong><span>Rounds</span></div><div><strong>{session?.kind === "breathe" ? elapsed : "0:00"}</strong><span>Time</span></div></div>
        <div className="center-row"><button className="button button-primary" type="button" onClick={onToggle}>{running ? "Pause" : session?.kind === "breathe" ? "Resume" : "Start"}</button><button className="button button-soft" type="button" onClick={onReset}>Reset</button></div>
        <p className="safety-note">{["bellows", "pumps"].includes(patternId) ? selected.note : "If you feel light-headed, anxious, or uncomfortable, stop and breathe naturally."}</p>
      </div>
    </section>
  );
}

function SitSection({ active, minutes, session, elapsed, remaining, scale, onChoose, onToggle, onReset }) {
  const running = session?.kind === "sit" && session.running;
  return (
    <section className="section" id="t-sit" role="tabpanel" aria-labelledby="tab-sit" hidden={active !== "sit"}>
      <div className="page-heading"><p className="eyebrow">SIT · NOTHING TO ACHIEVE</p><h1>Give stillness <em>a little room.</em></h1><p className="sub">Choose a length that feels kind. You can finish early whenever you need.</p></div>
      <div className="card sit-card">
        <div className="section-title"><div><p className="eyebrow">SET YOUR TIME</p><h2>Just sit</h2></div></div>
        <div className="chip-row" role="group" aria-label="Meditation duration">
          {DATA.sitDurations.map(value => <button key={value} type="button" className={`chip${minutes === value ? " selected" : ""}`} aria-pressed={minutes === value} onClick={() => onChoose(value)}>{value} min</button>)}
        </div>
        <div className="sit-orb-wrap"><div className="sit-orb" style={{ transform: `scale(${session?.kind === "sit" ? scale : ".85"})` }}></div><div className="sit-clock"><span>{session?.kind === "sit" ? "Just sit" : "Ready"}</span><strong>{remaining}</strong><small>{session?.kind === "sit" ? `${elapsed} elapsed · be here as you are` : "A quiet moment is waiting"}</small></div></div>
        <div className="center-row"><button className="button button-primary" type="button" onClick={onToggle}>{running ? "Pause" : session?.kind === "sit" ? "Resume sitting" : "Begin sitting"}</button><button className="button button-soft" type="button" onClick={onReset}>Reset</button></div>
        <p className="practice-note">A soft bell marks the beginning and the end. Let your posture be comfortable, and your breath unforced.</p>
      </div>
    </section>
  );
}

function ChakraSection({ active, index, onChoose, onMove }) {
  const chakra = DATA.chakras[index];
  return (
    <section className="section" id="t-chakras" role="tabpanel" aria-labelledby="tab-chakras" hidden={active !== "chakras"}>
      <div className="page-heading"><p className="eyebrow">CHAKRAS · A TRADITIONAL MAP</p><h1>Explore seven <em>centres.</em></h1><p className="sub">Use these symbols as prompts for reflection, not as medical facts or a measure of your wellbeing.</p></div>
      <div className="card">
        <div className="chip-row" role="group" aria-label="Choose a symbolic centre">
          {DATA.chakras.map((item, itemIndex) => <button key={item.name} type="button" className="chip chakra-choice" style={{ "--chakra-color": item.color }} aria-pressed={itemIndex === index} onClick={() => onChoose(itemIndex)}>{item.name}</button>)}
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

function PhraseSection({ active, group, phrase, intentions, input, help, inputRef, onInput, onAdd, onRemove, onMove, onAuto, onSpeak, onChoose }) {
  const set = DATA.phraseSets[phrase.set];
  const lines = group === "affirm" && phrase.set === "manifest" ? [...set.lines, ...intentions] : set.lines;
  const choices = group === "affirm" ? ["affirm", "manifest", "hooponopono"] : group === "kriya" ? ["kriya"] : ["advaita", "pattern"];
  const controls = group === "affirm" ? (
    <div className="phrase-controls">
      <button className="button button-soft" type="button" aria-label="Previous phrase" onClick={() => onMove(group, -1)}>← Previous</button>
      <button className="button button-soft" type="button" aria-pressed={phrase.auto} onClick={() => onAuto(group)}>{phrase.auto ? "Stop auto" : "Auto"}</button>
      <button className="button button-soft" type="button" aria-label="Next phrase" onClick={() => onMove(group, 1)}>Next →</button>
      <button className="button button-soft" type="button" aria-pressed={phrase.read} onClick={() => onSpeak(group)}>Read aloud</button>
    </div>
  ) : (
    <div className="phrase-controls">
      <button className="button button-soft" type="button" onClick={() => onMove(group, -1)}>← Previous</button>
      <button className="button button-soft" type="button" aria-pressed={phrase.auto} onClick={() => onAuto(group)}>{phrase.auto ? group === "kriya" ? "Pause guided practice" : "Stop auto" : group === "kriya" ? "Begin guided practice" : "Auto"}</button>
      <button className="button button-soft" type="button" onClick={() => onMove(group, 1)}>Next →</button>
      <button className="button button-soft" type="button" aria-pressed={phrase.read} onClick={() => onSpeak(group)}>Read aloud</button>
    </div>
  );
  return (
    <section className="section" id={`t-${group}`} role="tabpanel" aria-labelledby={`tab-${group}`} hidden={active !== group}>
      {group === "affirm" ? (
        <div className="page-heading"><p className="eyebrow">WORDS · INTENTION · KINDNESS</p><h1>Choose words that <em>support you.</em></h1><p className="sub">Take each phrase as an invitation, not a promise or a measure of your worth.</p></div>
      ) : group === "kriya" ? (
        <div className="page-heading"><p className="eyebrow">KRIYA · PEACE · CONNECTION</p><h1>A practice of <em>loving attention.</em></h1><p className="sub">A contemplative sequence inspired by Raja Yoga language in the supplied references. Follow it gently or simply read.</p></div>
      ) : (
        <div className="page-heading"><p className="eyebrow">ADVaita · INQUIRY · WITNESSING</p><h1>Turn toward the <em>one who notices.</em></h1><p className="sub">A shared phrase viewer for inquiry, non-dual contemplation, and noticing habitual responses.</p></div>
      )}
      <div className="card phrase-card">
        <div className="phrase-header"><div><p className="eyebrow">{set.title.toUpperCase()}</p><p className="sub">{set.note}</p></div></div>
        {group !== "kriya" && <div className="chip-row phrase-sets" role="group" aria-label={group === "affirm" ? "Phrase sets" : "Inquiry practices"}>
          {choices.map(name => <button key={name} type="button" className="chip" aria-pressed={phrase.set === name} onClick={() => onChoose(group, name)}>{DATA.phraseSets[name].title}</button>)}
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
        {group === "advaita" && <WisdomCards wisdom={DATA.wisdom} />}
      </div>
    </section>
  );
}

function NatureSection({ active, activeSounds, volume, onToggle, onVolume, onStop }) {
  return (
    <section className="section" id="t-nature" role="tabpanel" aria-labelledby="tab-nature" hidden={active !== "nature"}>
      <div className="page-heading"><p className="eyebrow">NATURE · MADE HERE, IN YOUR BROWSER</p><h1>Find a softer <em>soundscape.</em></h1><p className="sub">Layer gentle synthesized sounds. They can continue as you move between sections.</p></div>
      <div className="card sound-card">
        <div className="section-title"><div><p className="eyebrow">SEVEN SOUND LAYERS</p><h2>Build your own quiet</h2></div></div>
        <div className="sound-grid">{DATA.natureSounds.map(sound => <button className="sound-button" type="button" key={sound.id} aria-pressed={activeSounds.includes(sound.id)} onClick={() => onToggle(sound.id)}><span className="sound-icon" aria-hidden="true">{sound.icon}</span><span><strong>{sound.name}</strong><small>Synthesized sound</small></span></button>)}</div>
        <div className="volume-row"><label htmlFor="natureVolume">Nature volume</label><input type="range" id="natureVolume" min="0" max="100" value={volume} onChange={event => onVolume(Number(event.target.value))} /><output htmlFor="natureVolume">{volume}%</output></div>
        <div className="center-row"><button className="button button-soft" type="button" onClick={onStop}>Stop all nature</button></div>
        <p className="practice-note">Sound is synthesized live; no audio files are downloaded. Keep volume comfortable and take breaks from headphones.</p>
      </div>
    </section>
  );
}

function TonesSection({ active, speakerMode, tone, journey, toneVolume, onMode, onPlay, onJourneyDuration, onJourneyToggle, onVolume }) {
  return (
    <section className="section" id="t-tones" role="tabpanel" aria-labelledby="tab-tones" hidden={active !== "tones"}>
      <div className="page-heading"><p className="eyebrow">TONES · FOR RELAXATION AND FOCUS</p><h1>Let a tone <em>hold your attention.</em></h1><p className="sub">These frequencies are sound choices, not established healing treatments.</p></div>
      <div className="card sound-card">
        <div className="section-title"><div><p className="eyebrow">OUTPUT MODE</p><h2>Choose your listening setup</h2></div></div>
        <div className="chip-row"><button className="chip mode-chip" type="button" aria-pressed={!speakerMode} onClick={() => onMode(false)}>Headphones · binaural</button><button className="chip mode-chip" type="button" aria-pressed={speakerMode} onClick={() => onMode(true)}>Speaker · harmonics</button></div>
        <div className="section-title small-title"><div><p className="eyebrow">SINGLE FREQUENCIES</p><h2>Choose a tone</h2></div></div>
        <div className="sound-grid tone-grid">{DATA.tones.map(item => <button key={item.frequency} className="sound-button tone-button" type="button" data-label={`${item.frequency} Hz`} aria-pressed={tone?.frequency === item.frequency && tone.beat === 0} onClick={() => onPlay(item.frequency, 0, `${item.frequency} Hz`)}><span><strong>{item.frequency} Hz</strong><small>{item.label}</small></span></button>)}</div>
        <div className="section-title small-title"><div><p className="eyebrow">BEAT FREQUENCIES</p><h2>{speakerMode ? "Isochronic pulses · speaker friendly" : "Binaural beats · headphones recommended"}</h2></div></div>
        <div className="sound-grid beat-grid">{DATA.binaural.map(item => <button key={item.label} className="sound-button beat-button" type="button" data-label={`${item.label} ${item.beat} Hz`} aria-pressed={tone?.beat === item.beat} onClick={() => onPlay(200, item.beat, `${item.label} ${item.beat} Hz`)}><span><strong>{item.label}</strong><small>{item.beat} Hz beat</small></span></button>)}</div>
        <div className="journey-box"><div><p className="eyebrow">AUTO JOURNEY</p><p className="sub">Play each frequency in order, then loop.</p></div><div className="chip-row">{DATA.journeyDurations.map(seconds => <button key={seconds} type="button" className={`chip${journey.seconds === seconds ? " selected" : ""}`} aria-pressed={journey.seconds === seconds} onClick={() => onJourneyDuration(seconds)}>{seconds}s each</button>)}</div><button className="button button-soft" type="button" aria-pressed={journey.active} onClick={onJourneyToggle}>{journey.active ? "■ Stop journey" : "▶ Start journey"}</button></div>
        <div className="volume-row"><label htmlFor="toneVolume">Tone volume</label><input type="range" id="toneVolume" min="0" max="100" value={toneVolume} onChange={event => onVolume(Number(event.target.value))} /><output htmlFor="toneVolume">{toneVolume}%</output></div>
        <p className="practice-note">Start quietly, especially with headphones. Stop if a tone feels uncomfortable. Frequency labels do not imply medical or spiritual effects.</p>
      </div>
    </section>
  );
}

function MusicSection({ active, url, externalUrl, iframeRef, src, withSessions, error, onUrl, onLoad, onWithSessions }) {
  return (
    <section className={`section${active === "music" ? "" : " offscreen"}`} id="t-music" role="tabpanel" aria-labelledby="tab-music" aria-hidden={active !== "music"} inert={active !== "music"}>
      <div className="page-heading"><p className="eyebrow">MUSIC · YOUR YOUTUBE PLAYER</p><h1>Bring a sound you <em>love.</em></h1><p className="sub">Paste a YouTube video or playlist link. Music can stay active while you explore other sections.</p></div>
      <div className="card music-card">
        <div className="video-frame"><iframe ref={iframeRef} src={src} title="YouTube audio player" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
        <label htmlFor="youtubeUrl">Video or playlist URL</label>
        <div className="input-row"><input id="youtubeUrl" type="url" value={url} autoComplete="url" onChange={event => onUrl(event.target.value)} /><button className="button button-primary" type="button" onClick={onLoad}>Load &amp; play</button></div>
        <div className="music-actions"><label className="inline-toggle"><input type="checkbox" checked={withSessions} onChange={event => onWithSessions(event.target.checked)} /><span>Music with breathing and sitting</span></label><a className="button button-soft" href={externalUrl} target="_blank" rel="noopener noreferrer">Open in YouTube ↗</a></div>
        <p className="practice-note">If an embed cannot play here, open it in YouTube. Locked-screen playback is not guaranteed by browsers; the YouTube app is the reliable route.</p>
        {error && <p className="practice-note">{error}</p>}
      </div>
    </section>
  );
}

function WisdomSection({ active }) {
  return (
    <section className="section" id="t-wisdom" role="tabpanel" aria-labelledby="tab-wisdom" hidden={active !== "wisdom"}>
      <div className="page-heading"><p className="eyebrow">TRADITIONS · ORIGINAL SUMMARIES</p><h1>Explore the <em>inner path.</em></h1><p className="sub">Short, newly written reflections based on the themes and source material you supplied—not quotations or claims of guaranteed results.</p></div>
      <WisdomCards wisdom={DATA.wisdom} className="wisdom-page" />
      <p className="safety-note">Traditions use different language and methods. Choose a qualified teacher for advanced practices, and seek appropriate professional care for health concerns.</p>
    </section>
  );
}

function JourneySection({ active, history, streak, onClear }) {
  const entries = Object.entries(history.days).sort((a, b) => b[0].localeCompare(a[0]));
  const minutes = Math.floor(entries.reduce((sum, [, seconds]) => sum + seconds, 0) / 60);
  return (
    <section className="section" id="t-journey" role="tabpanel" aria-labelledby="tab-journey" hidden={active !== "journey"}>
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

export default function Sections({ active, ...props }) {
  return (
    <>
      <HomeSection active={active} {...props.home} />
      <BreathSection active={active} {...props.breath} />
      <SitSection active={active} {...props.sit} />
      <ChakraSection active={active} {...props.chakra} />
      <PhraseSection active={active} {...props.affirm} group="affirm" />
      <PhraseSection active={active} {...props.kriya} group="kriya" />
      <PhraseSection active={active} {...props.advaita} group="advaita" />
      <NatureSection active={active} {...props.nature} />
      <TonesSection active={active} {...props.tones} />
      <MusicSection {...props.music} />
      <WisdomSection active={active} />
      <JourneySection active={active} {...props.journey} />
    </>
  );
}

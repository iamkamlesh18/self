import { useEffect, useState } from "react";
import { SADHANA_DURATIONS, SADHANA_QUESTIONS, SADHANA_STAGES } from "./data.js";
import "./sadhana.css";

function readCompletions() {
  try {
    const saved = Number(localStorage.getItem("come-home-sadhana-completions"));
    return Number.isFinite(saved) && saved > 0 ? saved : 0;
  } catch (error) {
    console.warn("Could not read Samyama Sadhana progress from local storage.", error);
    return 0;
  }
}

function displayTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function SamyamaSadhanaPage() {
  const [step, setStep] = useState("question");
  const [questionId, setQuestionId] = useState(SADHANA_QUESTIONS[0].id);
  const [customQuestion, setCustomQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [minutesPerStage, setMinutesPerStage] = useState(SADHANA_DURATIONS[0]);
  const [stageIndex, setStageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(minutesPerStage * 60);
  const [running, setRunning] = useState(false);
  const [completions, setCompletions] = useState(readCompletions);
  const selectedQuestion = SADHANA_QUESTIONS.find(item => item.id === questionId) || SADHANA_QUESTIONS[0];
  const questionText = questionId === "custom" && customQuestion.trim() ? customQuestion.trim() : selectedQuestion.question;
  const stage = SADHANA_STAGES[stageIndex];

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSecondsLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || secondsLeft > 0) return;
    if (stageIndex < SADHANA_STAGES.length - 1) {
      setStageIndex(value => value + 1);
      setSecondsLeft(minutesPerStage * 60);
      return;
    }
    setRunning(false);
    setStep("complete");
    setCompletions(value => value + 1);
  }, [minutesPerStage, running, secondsLeft, stageIndex]);

  useEffect(() => {
    try {
      localStorage.setItem("come-home-sadhana-completions", String(completions));
    } catch (error) {
      console.warn("Could not save Samyama Sadhana progress to local storage.", error);
    }
  }, [completions]);

  function chooseQuestion(id) {
    setQuestionId(id);
    setStep("answer");
  }

  function beginSadhana() {
    if (!answer.trim()) return;
    setStageIndex(0);
    setSecondsLeft(minutesPerStage * 60);
    setStep("practice");
    setRunning(true);
  }

  function resetSadhana() {
    setRunning(false);
    setStageIndex(0);
    setSecondsLeft(minutesPerStage * 60);
    setStep("answer");
  }

  function practiceAgain() {
    setStageIndex(0);
    setSecondsLeft(minutesPerStage * 60);
    setStep("practice");
    setRunning(true);
  }

  return (
    <section className="section sadhana-page" aria-label="Samyama Sadhana">
      <div className="sadhana-hero">
        <div className="sadhana-flower" aria-hidden="true"><span>✿</span><i></i><i></i><i></i><i></i><i></i></div>
        <p className="eyebrow">SAMYAMA SADHANA · A PRACTICE FOR YOUR INTENTION</p>
        <h1>Begin with what <em>matters.</em></h1>
        <p className="sub">Ask yourself a gentle question. Find your own words, then let a few quiet minutes of practice return you to them.</p>
      </div>

      {step === "question" && (
        <article className="card sadhana-card">
          <div className="section-title"><div><p className="eyebrow">FIRST · CHOOSE A QUESTION</p><h2>What would you like to explore?</h2></div></div>
          <div className="sadhana-question-grid" role="group" aria-label="Questions for reflection">
            {SADHANA_QUESTIONS.map(item => (
              <button className="sadhana-question" key={item.id} type="button" onClick={() => chooseQuestion(item.id)}>
                <span aria-hidden="true">✿</span><strong>{item.name}</strong><small>{item.question}</small>
              </button>
            ))}
          </div>
        </article>
      )}

      {step === "answer" && (
        <article className="card sadhana-card">
          <p className="eyebrow">THEN · ANSWER IN YOUR OWN WORDS</p>
          <h2 className="sadhana-question-title">{questionText}</h2>
          <p className="sadhana-source-theme">{selectedQuestion.sourceTheme}</p>
          {questionId === "custom" && (
            <label className="sadhana-field">Your question
              <input value={customQuestion} onChange={event => setCustomQuestion(event.target.value)} maxLength={120} placeholder="Write a question for yourself" />
            </label>
          )}
          <label className="sadhana-field" htmlFor="sadhanaAnswer">A word or short phrase to carry into practice
            <textarea id="sadhanaAnswer" value={answer} onChange={event => setAnswer(event.target.value)} maxLength={120} rows={2} placeholder={selectedQuestion.examples} autoFocus />
          </label>
          <div className="sadhana-duration">
            <span className="eyebrow">THREE QUIET STAGES · CHOOSE MINUTES PER STAGE</span>
            <div className="chip-row" role="group" aria-label="Minutes per Sadhana stage">
              {SADHANA_DURATIONS.map(value => <button key={value} className="chip" type="button" aria-pressed={minutesPerStage === value} onClick={() => { setMinutesPerStage(value); setSecondsLeft(value * 60); }}>{value} min</button>)}
            </div>
          </div>
          <div className="center-row">
            <button className="button button-soft" type="button" onClick={() => setStep("question")}>Back to questions</button>
            <button className="button button-primary" type="button" disabled={!answer.trim()} onClick={beginSadhana}>Begin my Sadhana</button>
          </div>
          <p className="sadhana-privacy">Your reflection stays in this page and is not saved. Only completed practice counts are kept on this device.</p>
        </article>
      )}

      {(step === "practice" || step === "complete") && (
        <article className="card sadhana-session">
          <div className="sadhana-intention">
            <p className="eyebrow">YOUR QUESTION</p>
            <p className="sadhana-question-echo">{questionText}</p>
            <p className="eyebrow">YOUR WORDS · RETURN TO THESE GENTLY</p>
            <p>“{answer.trim()}”</p>
          </div>
          <div className="sadhana-stage-list" aria-label="Sadhana stages">
            {SADHANA_STAGES.map((item, index) => (
              <div className={`sadhana-stage${stageIndex === index && step !== "complete" ? " current" : ""}${step === "complete" || stageIndex > index ? " passed" : ""}`} key={item.name}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name}</strong><small>{item.sanskrit}</small>
              </div>
            ))}
          </div>
          <div className="sadhana-clock" aria-live="polite">
            <div className="sadhana-clock-ring"><span>{step === "complete" ? "Complete" : `${stage.name} · ${stage.sanskrit}`}</span><strong>{displayTime(secondsLeft)}</strong></div>
            <p>{step === "complete" ? "Let the practice settle. Choose one small, kind action that reflects your words." : stage.instruction}</p>
          </div>
          {step === "practice" ? (
            <div className="center-row">
              <button className="button button-primary" type="button" onClick={() => setRunning(value => !value)}>{running ? "Pause gently" : "Continue practice"}</button>
              <button className="button button-soft" type="button" onClick={resetSadhana}>End practice</button>
            </div>
          ) : (
            <div className="center-row">
              <button className="button button-primary" type="button" onClick={practiceAgain}>Practice these words again</button>
              <button className="button button-soft" type="button" onClick={() => { setStep("question"); setAnswer(""); }}>Begin with a new question</button>
            </div>
          )}
          <p className="sadhana-completions">{completions} {completions === 1 ? "practice" : "practices"} completed on this device</p>
        </article>
      )}

      <aside className="safety-note">This original reflection adapts themes from the supplied commentaries: attention to external objects, noticing the mind and senses, friendliness, gradual practice, and non-attachment to extraordinary attainments. Traditions interpret these ideas differently; this gentle exercise promises no special state or result. Pause or stop whenever you wish.</aside>
    </section>
  );
}

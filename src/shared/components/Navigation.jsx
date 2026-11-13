import { NavLink } from "react-router-dom";
import { useRef } from "react";

export const TABS = [
  ["home", "Home"], ["breathe", "Breathe"], ["sit", "Sit"], ["chakras", "Chakras"], ["affirm", "Affirm"],
  ["kriya", "Kriya"], ["advaita", "Advaita"], ["nature", "Nature"], ["tones", "Tones"],
  ["samyama-foundations", "Samyama Foundations"], ["samyama-sadhana", "Samyama Sadhana"], ["samyama", "Samyama"],
  ["music", "Music"], ["wisdom", "Wisdom"], ["library", "Library"], ["journey", "Journey"]
];

export default function Navigation({ active, onSelect }) {
  const buttonRefs = useRef([]);

  function handleKeyDown(event, index) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    const [target] = TABS[next];
    onSelect(target);
    buttonRefs.current[next]?.focus();
  }

  return (
    <nav className="tabs" aria-label="Practice sections">
      {TABS.map(([id, label], index) => (
        <NavLink
          key={id}
          ref={element => { buttonRefs.current[index] = element; }}
          to={`/${id}`}
          end
          className={`tab${active === id ? " is-active" : ""}`}
          aria-current={active === id ? "page" : undefined}
          onKeyDown={event => handleKeyDown(event, index)}
        >{label}</NavLink>
      ))}
    </nav>
  );
}

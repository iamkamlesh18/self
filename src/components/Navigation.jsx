export const TABS = [
  ["home", "Home"], ["breathe", "Breathe"], ["sit", "Sit"], ["chakras", "Chakras"], ["affirm", "Affirm"],
  ["kriya", "Kriya"], ["advaita", "Advaita"], ["nature", "Nature"], ["tones", "Tones"],
  ["music", "Music"], ["wisdom", "Wisdom"], ["journey", "Journey"]
];

import { useRef } from "react";

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
    <nav className="tabs" role="tablist" aria-label="Practice sections">
      {TABS.map(([id, label], index) => (
        <button
          key={id}
          ref={element => { buttonRefs.current[index] = element; }}
          id={`tab-${id}`}
          className="tab"
          type="button"
          role="tab"
          aria-controls={`t-${id}`}
          aria-selected={active === id}
          tabIndex={active === id ? 0 : -1}
          onClick={() => onSelect(id)}
          onKeyDown={event => handleKeyDown(event, index)}
        >{label}</button>
      ))}
    </nav>
  );
}

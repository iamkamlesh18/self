import { useMemo, useState } from "react";
import { LIBRARY_CATEGORIES, LIBRARY_ENTRIES } from "./data.js";
import "./library.css";

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const entries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return LIBRARY_ENTRIES.filter(item => {
      const matchesCategory = category === "All" || item.category === category;
      const searchable = `${item.title} ${item.tradition} ${item.reference} ${item.summary} ${item.reflection}`.toLocaleLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [category, search]);

  return (
    <section className="section library-page" aria-label="Spiritual reading library">
      <div className="page-heading"><p className="eyebrow">A SMALL, CAREFULLY CURATED READING ROOM</p><h1>Many traditions. <em>Room to explore.</em></h1><p className="sub">Original summaries, source references, short mantras, and gentle reflection prompts. This is a starting point, not a complete account of any tradition.</p></div>
      <div className="card library-tools">
        <label className="library-search-label" htmlFor="library-search">Search texts, teachers, and themes</label>
        <input id="library-search" className="library-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Try “Upanishad”, “attention”, or “mantra”" />
        <div className="chip-row library-categories" role="group" aria-label="Filter by topic">
          {LIBRARY_CATEGORIES.map(item => <button className="chip" key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <p className="library-count" aria-live="polite">{entries.length} {entries.length === 1 ? "reflection" : "reflections"}</p>
      </div>
      <div className="library-grid">
        {entries.map(item => (
          <article className="library-card" key={`${item.tradition}-${item.reference}`}>
            <div className="library-card-meta"><span>{item.category}</span><span>{item.reference}</span></div>
            <h2>{item.title}</h2>
            <p className="library-tradition">{item.tradition}</p>
            <p>{item.summary}</p>
            <div className="library-reflection"><span className="eyebrow">A QUESTION TO SIT WITH</span><p>{item.reflection}</p></div>
          </article>
        ))}
        {entries.length === 0 && <p className="card library-empty">No entries match that search. Try another word or choose “All.”</p>}
      </div>
      <aside className="safety-note">Translations and interpretations vary across editions, lineages, and teachers. Scripture references are included to help you explore reputable translations. No long copyrighted translations are reproduced here; traditional accounts of spiritual powers are presented as beliefs, not verified abilities.</aside>
    </section>
  );
}

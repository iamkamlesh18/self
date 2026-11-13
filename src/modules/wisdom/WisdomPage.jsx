import { WISDOM_REFLECTIONS } from "./data.js";
import WisdomCards from "../../shared/components/WisdomCards.jsx";

export default function WisdomPage() {
  return (
    <section className="section" aria-label="Wisdom reflections">
      <div className="page-heading"><p className="eyebrow">TRADITIONS · ORIGINAL SUMMARIES</p><h1>Explore the <em>inner path.</em></h1><p className="sub">Short, newly written reflections based on the themes and source material you supplied—not quotations or claims of guaranteed results.</p></div>
      <WisdomCards wisdom={WISDOM_REFLECTIONS} className="wisdom-page" />
      <p className="safety-note">Traditions use different language and methods. Choose a qualified teacher for advanced practices, and seek appropriate professional care for health concerns.</p>
    </section>
  );
}

import "../../modules/wisdom/wisdom.css";

export default function WisdomCards({ wisdom, className = "" }) {
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

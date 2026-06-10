// Per-character text for the letter-swap hover effect (see .swap-text in
// globals.css). Render inside any element carrying the .swap-trigger class.
// A visually-hidden copy keeps the real string for screen readers.
export default function SwapText({
  text,
  className,
  stagger = 16,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className={`swap-text ${className ?? ""}`} aria-hidden>
        {text.split("").map((c, i) => (
          <span
            key={i}
            className="swap-unit"
            style={{ "--swap-delay": `${i * stagger}ms` } as React.CSSProperties}
          >
            {c}
            <span className="swap-dup">{c}</span>
          </span>
        ))}
      </span>
    </>
  );
}

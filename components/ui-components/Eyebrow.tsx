export const PROMPT_SYMBOL = ">";

interface EyebrowProps {
  symbol?: string;
  label: string;
}

export function Eyebrow({ symbol = PROMPT_SYMBOL, label }: EyebrowProps) {
  return (
    <div
      className="mb-4 flex items-center gap-2 font-mono text-xs
        text-foreground/60"
    >
      <span
        className="font-bold text-accent"
        aria-hidden="true"
      >
        {symbol}
      </span>
      <span className="tracking-wide">{label}</span>
    </div>
  );
}

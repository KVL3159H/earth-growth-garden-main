import { useState, useCallback } from "react";

interface ContributeButtonProps {
  onContribute: () => void;
  cooldownMs?: number;
}

const ContributeButton = ({ onContribute, cooldownMs = 1500 }: ContributeButtonProps) => {
  const [isCooling, setIsCooling] = useState(false);
  const [ripples, setRipples] = useState<number[]>([]);

  const handleClick = useCallback(() => {
    if (isCooling) return;
    onContribute();
    setIsCooling(true);
    setRipples((prev) => [...prev, Date.now()]);

    setTimeout(() => setIsCooling(false), cooldownMs);
    setTimeout(() => setRipples((prev) => prev.slice(1)), 1500);
  }, [isCooling, onContribute, cooldownMs]);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Ripple effects */}
      {ripples.map((id) => (
        <span
          key={id}
          className="absolute inset-0 rounded-full border-2 border-accent animate-pulse-grow pointer-events-none"
        />
      ))}
      <button
        onClick={handleClick}
        disabled={isCooling}
        className={`
          relative z-10 px-8 py-4 rounded-full font-display font-bold text-lg
          bg-accent text-accent-foreground
          shadow-lg shadow-accent/30
          transition-all duration-300 ease-out
          hover:shadow-xl hover:shadow-accent/40 hover:scale-105
          active:scale-95
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
        `}
      >
        {isCooling ? "Growing..." : "🌱 Contribute to Grow"}
      </button>
    </div>
  );
};

export default ContributeButton;

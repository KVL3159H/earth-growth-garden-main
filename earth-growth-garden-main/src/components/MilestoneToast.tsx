import { useEffect, useState } from "react";

interface MilestoneToastProps {
  message: string | null;
}

const MilestoneToast = ({ message }: MilestoneToastProps) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (message) {
      setText(message);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-float-up">
      <div className="glass-card rounded-full px-6 py-3 shadow-lg border border-accent/30">
        <span className="font-display font-bold text-accent text-sm">🎉 {text}</span>
      </div>
    </div>
  );
};

export default MilestoneToast;

import { type ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3 min-w-[160px]">
    <div className="text-primary text-xl">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground font-body">{label}</p>
      <p className="text-xl font-display font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default StatCard;

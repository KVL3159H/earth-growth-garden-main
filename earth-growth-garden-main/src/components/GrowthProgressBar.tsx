interface GrowthProgressBarProps {
  percent: number;
}

const GrowthProgressBar = ({ percent }: GrowthProgressBarProps) => {
  const stageName =
    percent < 5 ? "Seed" :
    percent < 20 ? "Sprout" :
    percent < 45 ? "Small Plant" :
    percent < 75 ? "Young Tree" :
    "Full Tree";

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="flex justify-between mb-1.5 font-body text-sm">
        <span className="text-soil-foreground font-medium">{stageName}</span>
        <span className="text-accent font-display font-bold">{percent.toFixed(1)}%</span>
      </div>
      <div className="h-3 rounded-full bg-soil-surface overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
};

export default GrowthProgressBar;

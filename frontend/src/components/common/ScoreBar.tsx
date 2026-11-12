import React from 'react';

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, maxValue = 1, color = 'bg-blue-500' }) => {
  const pct = Math.round((value / maxValue) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-700 font-medium w-12 text-right">{value.toFixed(2)}</span>
    </div>
  );
};

export default ScoreBar;


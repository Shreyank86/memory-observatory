import React from 'react';

interface FilterPanelProps {
  children: React.ReactNode;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ children }) => (
  <div className="flex flex-wrap items-center gap-3 py-3">
    {children}
  </div>
);

interface FilterSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, options, onChange }) => (
  <div className="flex items-center gap-1.5">
    <label className="text-xs text-slate-500 font-medium">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

export default FilterPanel;


import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
    <Loader2 className="w-8 h-8 animate-spin mb-3" />
    <p className="text-sm">{message}</p>
  </div>
);

export default LoadingState;


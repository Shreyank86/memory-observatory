import React, { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { ChartCard, StatCard } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import { mockAnalyticsData } from '../../data/mockData';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';

const PIE_COLORS = ['#2563eb', '#0284c7', '#4f46e5', '#7c3aed', '#64748b'];

const Analytics: React.FC = () => {
  const { memories } = useAppContext();
  const d = mockAnalyticsData;

  // Compute live type distribution
  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    memories.forEach(m => {
      const formatted = m.type.charAt(0).toUpperCase() + m.type.slice(1);
      counts[formatted] = (counts[formatted] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [memories]);

  // Compute live importance distribution
  const importanceDistribution = useMemo(() => {
    const buckets = [
      { range: '0.0–0.2', count: 0 },
      { range: '0.2–0.4', count: 0 },
      { range: '0.4–0.6', count: 0 },
      { range: '0.6–0.8', count: 0 },
      { range: '0.8–1.0', count: 0 },
    ];
    memories.forEach(m => {
      if (m.importance < 0.2) buckets[0].count++;
      else if (m.importance < 0.4) buckets[1].count++;
      else if (m.importance < 0.6) buckets[2].count++;
      else if (m.importance < 0.8) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [memories]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Evaluation</h1>
          <p className="text-sm text-slate-500 mt-1">Memory infrastructure benchmark metrics, retrieval latency, and IR ranking accuracy</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium self-start sm:self-auto">
          {memories.length} Persisted Memory Points
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Mean Reciprocal Rank" value={d.mrr.toFixed(2)} icon={Target} change="High retrieval accuracy" changeType="positive" />
        <StatCard label="Precision@1" value={d.precisionAtK[0].precision.toFixed(2)} icon={BarChart3} change="92% top hit match" changeType="positive" />
        <StatCard label="Recall@5" value={d.recallAtK[2].recall.toFixed(2)} icon={TrendingUp} change="85% relevance coverage" changeType="positive" />
        <StatCard label="Avg Latency (Nov)" value={`${d.avgLatency[d.avgLatency.length - 1].latency}ms`} icon={Clock} change="-14ms improvement" changeType="positive" />
      </div>

      {/* Growth & Retrieval */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Memory Growth Trends" subtitle="Cumulative memories over time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={d.memoryGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="count" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.12} strokeWidth={2} name="Total Stored" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Retrieval Frequency" subtitle="Number of retrievals per month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.retrievalFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} name="Retrieval Count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Latency & Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Average Retrieval Latency" subtitle="Milliseconds per month across pgvector ANN queries">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={d.avgLatency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" unit="ms" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="latency" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} name="Latency (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Memory Type Distribution" subtitle="Live distribution of active and candidate memory classes">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={typeDistribution} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={85} innerRadius={50} paddingAngle={2}>
                {typeDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Legend iconSize={9} wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Importance & Confidence Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Live Importance Distribution" subtitle="Computed importance scores of stored knowledge">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={importanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Memories in Bucket" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Confidence Distribution" subtitle="Confidence estimation bounds across candidate memories">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.confidenceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} name="Confidence Count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Duplicate & Consolidation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Duplicate Detection Statistics" subtitle="Detected vs resolved duplicates">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.duplicateStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Legend iconSize={9} wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
              <Bar dataKey="detected" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Detected" />
              <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Consolidation Statistics" subtitle="Memories consolidated per month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.consolidationStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="consolidated" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Consolidated" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Precision & Recall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Precision@K" subtitle="Retrieval precision at different K values">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={d.precisionAtK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="k" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" label={{ value: 'K', position: 'insideBottomRight', offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" domain={[0, 1]} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="precision" stroke="#2563eb" strokeWidth={2} dot={{ r: 5 }} name="Precision" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recall@K" subtitle="Retrieval recall at different K values">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={d.recallAtK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="k" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" label={{ value: 'K', position: 'insideBottomRight', offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" domain={[0, 1]} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="recall" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} name="Recall" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* MRR Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Mean Reciprocal Rank (MRR)</h3>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-extrabold text-slate-900 font-mono">{d.mrr.toFixed(2)}</span>
          <span className="text-sm text-slate-500 mb-1">/ 1.00</span>
        </div>
        <div className="mt-2.5 w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${d.mrr * 100}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          MRR measures how consistently the retrieval pipeline positions the single most relevant memory as the #1 ranked candidate result.
        </p>
      </div>
    </div>
  );
};

export default Analytics;

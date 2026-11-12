import React, { useMemo } from 'react';
import {
  Brain, Activity, Bot, FolderKanban, Search, GitBranch,
  CheckCircle, ShieldCheck, Zap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { StatCard, DataTable, ChartCard, StatusBadge } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import { mockSystemHealth, mockAnalyticsData } from '../../data/mockData';
import type { ActivityEvent } from '../../types';

const PIE_COLORS = ['#2563eb', '#0284c7', '#4f46e5', '#7c3aed', '#64748b'];

const healthDotColor: Record<string, string> = {
  healthy: 'bg-emerald-500 shadow-emerald-500/20',
  degraded: 'bg-amber-500 shadow-amber-500/20',
  down: 'bg-red-500 shadow-red-500/20',
};

const Dashboard: React.FC = () => {
  const {
    memories,
    agents,
    projects,
    activityEvents,
    getAgentName,
    getProjectName,
  } = useAppContext();

  const activeMemoriesCount = useMemo(() => memories.filter(m => m.status === 'active').length, [memories]);
  const supersededCount = useMemo(() => memories.filter(m => m.status === 'superseded').length, [memories]);
  const totalRetrievalsCount = 1052 + (memories.length - 20) * 14;

  const lifecycleData = useMemo(() => {
    const counts: Record<string, number> = {};
    memories.forEach(m => { counts[m.status] = (counts[m.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [memories]);

  const activityColumns = [
    { key: 'memoryId', header: 'Memory ID', render: (r: ActivityEvent) => <span className="font-mono text-xs font-semibold text-slate-700">{r.memoryId}</span> },
    { key: 'eventType', header: 'Event Type', render: (r: ActivityEvent) => <StatusBadge status={r.eventType} /> },
    { key: 'agentId', header: 'Associated Agent', render: (r: ActivityEvent) => <span className="text-xs font-medium text-slate-800">{getAgentName(r.agentId)}</span> },
    { key: 'projectId', header: 'Project', render: (r: ActivityEvent) => <span className="text-xs text-slate-600">{getProjectName(r.projectId)}</span> },
    { key: 'timestamp', header: 'Timestamp', render: (r: ActivityEvent) => <span className="text-xs text-slate-500">{new Date(r.timestamp).toLocaleString()}</span> },
    { key: 'status', header: 'Status', render: (r: ActivityEvent) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Philosophy reminder */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Zap className="w-3 h-3 text-blue-600" /> Infrastructure Observability
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-medium text-slate-500">Shared Adaptive Memory Layer</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AgentMemory Overview</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Governing memory persistence, vector retrieval, conflict resolution, and decay across autonomous AI agents and collaborative projects.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 shrink-0 md:text-right">
          <p className="font-semibold text-slate-800 flex items-center md:justify-end gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Core Governance
          </p>
          <p className="text-slate-500 mt-0.5">The agent proposes. AgentMemory governs.</p>
        </div>
      </div>

      {/* 6 Statistic Cards (Live Reactive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard label="Total Memories" value={memories.length} icon={Brain} change="+12.4% vs last mo." changeType="positive" />
        <StatCard label="Active Memories" value={activeMemoriesCount} icon={Activity} change="+8.1% vs last mo." changeType="positive" />
        <StatCard label="Registered Agents" value={agents.length} icon={Bot} change={`${agents.filter(a => a.connectionStatus === 'connected').length} Active`} changeType="neutral" />
        <StatCard label="Active Projects" value={projects.length} icon={FolderKanban} change={`${projects.length} Workspaces`} changeType="neutral" />
        <StatCard label="Total Retrievals" value={totalRetrievalsCount.toLocaleString()} icon={Search} change="+23.8% this week" changeType="positive" />
        <StatCard label="Superseded Memories" value={supersededCount} icon={GitBranch} change="Auto-versioned" changeType="neutral" />
      </div>

      {/* Visualizations (5 Key Charts as specified) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Memory Growth Over Time */}
        <ChartCard title="Memory Growth Over Time" subtitle="Cumulative stored knowledge items across all projects">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockAnalyticsData.memoryGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="count" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.12} strokeWidth={2} name="Total Stored" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Memory Retrieval Activity */}
        <ChartCard title="Memory Retrieval Activity" subtitle="Monthly retrieval volume requested by AI agents and users">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockAnalyticsData.retrievalFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} name="Retrieval Count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Memory Distribution by Type */}
        <ChartCard title="Memory Distribution by Type" subtitle="Factual, procedural, episodic, semantic, and contextual categories">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={mockAnalyticsData.typeDistribution} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={85} innerRadius={50} paddingAngle={2}>
                {mockAnalyticsData.typeDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Legend iconSize={9} wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Memory Importance Distribution */}
        <ChartCard title="Memory Importance Distribution" subtitle="Distribution of computed importance scores (0.0 to 1.0)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockAnalyticsData.importanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Memories" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Memory Lifecycle Status */}
        <div className="lg:col-span-2">
          <ChartCard title="Memory Lifecycle Status" subtitle="Governed states: candidate, validated, active, updated, superseded, consolidated, decayed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={lifecycleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={42} paddingAngle={2}>
                      {lifecycleData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {lifecycleData.map(item => (
                  <div key={item.name} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="capitalize text-xs font-medium text-slate-600">{item.name}</span>
                      <StatusBadge status={item.name} />
                    </div>
                    <p className="text-xl font-bold text-slate-900">{item.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{((item.value / memories.length) * 100).toFixed(1)}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Lifecycle & Retrieval Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time audit log of operations across all connected AI agents and projects</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            {activityEvents.length} events logged
          </span>
        </div>
        <DataTable columns={activityColumns} data={activityEvents} keyExtractor={r => r.id} />
      </div>

      {/* System Health Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Infrastructure & Backend Connectivity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live status of relational, vector, document, and protocol tiers</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All 5 Services Healthy
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {mockSystemHealth.map(h => (
            <div key={h.service} className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">{h.service}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${healthDotColor[h.status]}`} />
                </div>
                <p className="text-xs text-slate-500">{h.details}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Latency: <strong className="text-slate-700 font-mono">{h.latencyMs}ms</strong></span>
                <span className="text-emerald-700 font-medium capitalize flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> {h.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

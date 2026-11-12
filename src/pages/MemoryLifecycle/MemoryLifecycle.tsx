import React, { useMemo } from 'react';
import { ArrowRight, RefreshCw, AlertTriangle, Layers, TrendingDown, History, CheckCircle, Info } from 'lucide-react';
import { DataTable, StatusBadge } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import { mockConsolidationEvents, mockDecayEvents } from '../../data/mockData';
import type { LifecycleEvent } from '../../types';

const states = [
  { name: 'Candidate', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  { name: 'Validated', color: 'bg-blue-50 text-blue-800 border-blue-300' },
  { name: 'Active', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { name: 'Updated', color: 'bg-sky-50 text-sky-800 border-sky-300' },
  { name: 'Superseded', color: 'bg-orange-50 text-orange-800 border-orange-300' },
  { name: 'Consolidated', color: 'bg-purple-50 text-purple-800 border-purple-300' },
  { name: 'Decayed', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { name: 'Deleted', color: 'bg-red-50 text-red-800 border-red-300' },
];

const supersessionHistory = [
  {
    id: 'sup-1',
    supersededId: 'mem-009',
    supersededContent: 'APIForge rate limiting is implemented using Redis sliding window with 100 requests per minute per API key.',
    newMemoryId: 'mem-010',
    newContent: 'APIForge rate limiting upgraded to token bucket algorithm with 200 requests per minute per API key and burst capacity of 50.',
    reason: 'Rate limit architecture upgraded from sliding window (100 req/min) to token bucket (200 req/min + burst) to support high-throughput clients.',
    timestamp: '2026-10-25T10:00:00Z',
    agentId: 'a-1',
    projectId: 'p-2',
    status: 'Confirmed by AgentMemory Governance',
  },
];

const MemoryLifecycle: React.FC = () => {
  const {
    memories,
    lifecycleEvents,
    conflictEvents,
    resolveConflict,
    getAgentName,
    getProjectName,
  } = useAppContext();

  const lifecycleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    memories.forEach(m => { counts[m.status] = (counts[m.status] || 0) + 1; });
    return counts;
  }, [memories]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Memory Lifecycle Governance</h1>
        <p className="text-sm text-slate-500 mt-1">
          Autonomous governance of memory validation, classification, consolidation, conflict resolution, decay, and persistence
        </p>
      </div>

      {/* Central Philosophy & Confirmation Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Core Principle
              </span>
              <span className="text-xs text-slate-400">Deterministic Knowledge Governance</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              "The agent proposes. AgentMemory governs the memory lifecycle."
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              AI agents propose candidate knowledge, while AgentMemory independently validates schema, verifies duplicate bounds, executes conflict resolution, manages versioning, and performs automated importance decay.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 shrink-0 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Backend Confirmation Rule
            </p>
            <p className="text-slate-400 text-[11px]">
              No memory is updated or deleted unless confirmed by backend policy.
            </p>
          </div>
        </div>
      </div>

      {/* State Flow Diagram */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Governed Lifecycle States</h3>
            <p className="text-xs text-slate-500 mt-0.5">8 distinct states through which candidate memories transition</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            {memories.length} Total Monitored Items
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2">
          {states.map((s, i) => (
            <React.Fragment key={s.name}>
              <div className="flex flex-col items-center shrink-0">
                <div className={`px-3 py-2 rounded-lg border text-xs font-semibold ${s.color}`}>
                  {s.name}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 font-mono font-bold">
                  {lifecycleCounts[s.name.toLowerCase()] || 0}
                </span>
              </div>
              {i < states.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Lifecycle Transitions Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-900">Recent Lifecycle Transition Events</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time persistent audit log</span>
        </div>
        <DataTable
          columns={[
            { key: 'memoryId', header: 'Memory ID', render: (r: LifecycleEvent) => <span className="font-mono text-xs font-semibold text-slate-700">{r.memoryId}</span> },
            { key: 'fromStatus', header: 'Previous State', render: (r: LifecycleEvent) => <StatusBadge status={r.fromStatus} /> },
            { key: 'toStatus', header: 'Governed State', render: (r: LifecycleEvent) => <StatusBadge status={r.toStatus} /> },
            { key: 'reason', header: 'Governance Transition Reason', render: (r: LifecycleEvent) => <span className="text-slate-700 text-xs font-normal">{r.reason}</span>, className: 'max-w-md' },
            { key: 'triggeredBy', header: 'Triggered By', render: (r: LifecycleEvent) => <span className="text-xs font-medium text-slate-700">{r.triggeredBy === 'system' ? 'AgentMemory System' : getAgentName(r.triggeredBy)}</span> },
            { key: 'timestamp', header: 'Timestamp', render: (r: LifecycleEvent) => <span className="text-xs text-slate-500">{new Date(r.timestamp).toLocaleString()}</span> },
          ]}
          data={lifecycleEvents}
          keyExtractor={r => r.id}
        />
      </div>

      {/* Dedicated Section 1: Supersession History */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-orange-600" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Supersession History & Memory Evolution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tracking outdated knowledge replaced by verified updated facts</p>
            </div>
          </div>
          <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-semibold">
            {supersessionHistory.length} Superseded Chain
          </span>
        </div>

        <div className="p-5 space-y-4">
          {supersessionHistory.map(sup => (
            <div key={sup.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-800">
                  Project: {getProjectName(sup.projectId)} · Proposing Agent: {getAgentName(sup.agentId)}
                </span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {sup.status}
                </span>
              </div>

              {/* Before and After Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-orange-50/60 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-orange-800 font-mono">{sup.supersededId} (Superseded)</span>
                    <StatusBadge status="superseded" />
                  </div>
                  <p className="text-slate-700 italic">"{sup.supersededContent}"</p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-800 font-mono">{sup.newMemoryId} (Active Successor)</span>
                    <StatusBadge status="active" />
                  </div>
                  <p className="text-slate-700 font-medium">"{sup.newContent}"</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-md p-2.5 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Supersession Reason: </strong>
                  {sup.reason}
                  <span className="text-slate-400 block mt-0.5">Recorded: {new Date(sup.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Governance Operation Sections (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dedicated Section 2: Duplicate Detection */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">Duplicate Detection Engine</h3>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono">Jaccard ≥ 0.85</span>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Near-duplicate candidate detection uses MinHash with 128 permutations before persisting to vector stores.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xl font-bold text-slate-900">41</p>
              <p className="text-[11px] text-slate-500">Evaluated</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-xl font-bold text-emerald-700">38</p>
              <p className="text-[11px] text-emerald-700">Auto-Resolved</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xl font-bold text-amber-700">3</p>
              <p className="text-[11px] text-amber-700">Review Queue</p>
            </div>
          </div>
          <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            Duplicate candidates exceeding 90% semantic similarity are automatically merged with access weight transferred.
          </div>
        </div>

        {/* Dedicated Section 3: Conflict Resolution with Persistent Dropdowns */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-900">Conflict Resolution Activity</h3>
            </div>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono">
              {conflictEvents.length} Conflicts
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Detecting contradictory or overlapping assertions across independent AI agent proposals. Select resolution below (persists across refresh).
          </p>
          <div className="space-y-2.5">
            {conflictEvents.map(c => (
              <div key={c.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-700">{c.memoryIdA}</span>
                    <span className="text-slate-400">vs</span>
                    <span className="font-mono font-semibold text-slate-700">{c.memoryIdB}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Type: {c.conflictType}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                  <span className="font-medium">Governance Resolution:</span>
                  <select
                    value={c.resolution}
                    onChange={e => resolveConflict(c.id, e.target.value as any)}
                    className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white font-semibold text-slate-800"
                  >
                    <option value="merged">Merged (Synthesized)</option>
                    <option value="kept_a">Kept Candidate A ({c.memoryIdA})</option>
                    <option value="kept_b">Kept Candidate B ({c.memoryIdB})</option>
                    <option value="pending">Pending Evaluation</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Section 4: Consolidation Activity */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-900">Memory Consolidation</h3>
            </div>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono">
              Consolidation Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Synthesizing fragmented episodic and factual memory entries into unified semantic representations.
          </p>
          {mockConsolidationEvents.map(cs => (
            <div key={cs.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2">
              <p className="text-xs font-medium text-slate-800">{cs.reason}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span>Source items:</span>
                {cs.sourceMemoryIds.map(sid => (
                  <span key={sid} className="font-mono px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                    {sid}
                  </span>
                ))}
                <span>→ Result:</span>
                <span className="font-mono font-bold px-1.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 rounded">
                  {cs.resultMemoryId}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">{new Date(cs.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Dedicated Section 5: Memory Decay */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-semibold text-slate-900">Automated Memory Decay</h3>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
              Ebbinghaus Decay Curve
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Memories unaccessed for 60+ days with importance &lt; 0.50 undergo gradual importance decay toward archival.
          </p>
          {mockDecayEvents.map(d => (
            <div key={d.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700">{d.memoryId}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-500 line-through">{d.previousImportance.toFixed(2)}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-rose-600 font-bold">{d.newImportance.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">{d.reason}</p>
              <span className="text-[10px] text-slate-400 block">{new Date(d.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryLifecycle;

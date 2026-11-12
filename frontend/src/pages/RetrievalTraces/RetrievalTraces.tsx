import React, { useState } from 'react';
import { Route, ArrowRight, ArrowLeft, Search, Zap, Database, Filter, Target, Clock } from 'lucide-react';
import { DataTable, StatusBadge, ScoreBar } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import { mockRetrievalTraces } from '../../data/mockData';
import type { RetrievalTrace } from '../../types';

const pipelineSteps = [
  { icon: Search, label: 'User Query', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { icon: Zap, label: 'Query Embedding', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { icon: Database, label: 'Vector Similarity Search', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { icon: Filter, label: 'Candidate Memories', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { icon: Route, label: 'Adaptive Ranking', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { icon: Target, label: 'Top-K Selection', color: 'bg-sky-50 border-sky-200 text-sky-700' },
  { icon: Search, label: 'Returned Memories', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
];

const RetrievalTraces: React.FC = () => {
  const { memories, getAgentName, getProjectName } = useAppContext();
  const [selected, setSelected] = useState<RetrievalTrace | null>(null);

  if (selected) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to All Traces
        </button>

        {/* Trace Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-slate-400 font-semibold">{selected.id}</span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">"{selected.queryText}"</h2>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span>Agent: <strong className="text-slate-700">{getAgentName(selected.agentId)}</strong></span>
                <span>Project: <strong className="text-slate-700">{getProjectName(selected.projectId)}</strong></span>
                <span>{new Date(selected.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono font-bold text-slate-900 text-sm">{selected.latencyMs}ms</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selected.candidateCount} candidates evaluated → {selected.selectedMemoryIds.length} top-k selected</p>
            </div>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Retrieval Pipeline Flow</h3>
          <div className="flex flex-col items-center gap-1">
            {pipelineSteps.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border w-full max-w-md ${step.color}`}>
                  <step.icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="flex flex-col items-center py-0.5">
                    <div className="w-px h-3 bg-slate-300" />
                    <ArrowRight className="w-3 h-3 text-slate-400 rotate-90" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Ranking Scores */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Ranked Candidate Items</h3>
          <div className="space-y-4">
            {selected.scores.map((score, idx) => {
              const mem = memories.find(m => m.id === score.memoryId);
              return (
                <div key={score.memoryId} className={`border rounded-lg p-4 bg-white ${idx === 0 ? 'border-l-4 border-l-blue-600 border-slate-200' : 'border-slate-200'}`}>
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-slate-700 px-2 py-0.5 rounded bg-slate-100">{score.memoryId}</span>
                        {mem && <StatusBadge status={mem.type} />}
                        {mem && <StatusBadge status={mem.status} />}
                      </div>
                      {mem && <p className="text-sm text-slate-800 leading-relaxed font-normal">{mem.content}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-black text-blue-600 font-mono">{score.finalScore.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">FINAL SCORE</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <ScoreBar label="Semantic Similarity" value={score.semanticSimilarity} color="bg-blue-600" />
                    <ScoreBar label="Importance Score" value={score.importanceScore} color="bg-indigo-600" />
                    <ScoreBar label="Confidence Score" value={score.confidenceScore} color="bg-emerald-600" />
                    <ScoreBar label="Recency Score" value={score.recencyScore} color="bg-amber-600" />
                    <ScoreBar label="Access Frequency" value={score.accessFrequency} color="bg-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Retrieval Traces</h1>
          <p className="text-sm text-slate-500 mt-1">Audit and explain how AgentMemory evaluates and ranks memories</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium self-start sm:self-auto">
          {mockRetrievalTraces.length} Monitored Traces
        </span>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Retrieval Pipeline Stages</h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
          {pipelineSteps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center text-center min-w-[100px]">
                <div className={`p-2.5 rounded-lg border ${step.color}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 mt-1.5 leading-tight">{step.label}</span>
              </div>
              {i < pipelineSteps.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Traces Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <DataTable
          columns={[
            { key: 'id', header: 'Trace ID', render: (r: RetrievalTrace) => <span className="font-mono text-xs font-semibold text-slate-700">{r.id}</span> },
            { key: 'queryText', header: 'Query Text', render: (r: RetrievalTrace) => <span className="text-slate-800 line-clamp-1">{r.queryText}</span>, className: 'max-w-xs' },
            { key: 'candidateCount', header: 'Candidates', render: (r: RetrievalTrace) => <span className="font-mono text-xs font-medium">{r.candidateCount}</span> },
            { key: 'selected', header: 'Selected', render: (r: RetrievalTrace) => <span className="font-mono text-xs font-semibold text-blue-600">{r.selectedMemoryIds.length}</span> },
            { key: 'latencyMs', header: 'Latency', render: (r: RetrievalTrace) => <span className="font-mono text-xs">{r.latencyMs}ms</span> },
            { key: 'agentId', header: 'Proposing Agent', render: (r: RetrievalTrace) => <span className="text-xs font-medium">{getAgentName(r.agentId)}</span> },
            { key: 'timestamp', header: 'Timestamp', render: (r: RetrievalTrace) => <span className="text-xs text-slate-500">{new Date(r.timestamp).toLocaleString()}</span> },
          ]}
          data={mockRetrievalTraces}
          keyExtractor={r => r.id}
          onRowClick={(r) => setSelected(r)}
        />
      </div>
    </div>
  );
};

export default RetrievalTraces;

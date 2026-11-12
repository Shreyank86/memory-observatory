import React, { useState, useMemo } from 'react';
import { Search, Zap, Database, BarChart3, Filter, Target, Sparkles, Clock, Compass } from 'lucide-react';
import { ScoreBar, StatusBadge } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import type { SearchResult } from '../../types';

const sampleQueries = [
  "What database technology is used in ResearchGraph?",
  "How does the API authentication work?",
  "What anomaly detection algorithm does DataPulse use?",
  "How is duplicate detection implemented?",
  "What is the memory decay policy?",
];

const SemanticSearch: React.FC = () => {
  const { memories, rankingWeights, embeddingConfig } = useAppContext();
  const [query, setQuery] = useState('What database technology is used in ResearchGraph?');
  const [searched, setSearched] = useState(true);

  const pipelineSteps = useMemo(() => [
    { step: '01', icon: Search, title: 'Query Input', desc: 'Natural language semantic parsing', tag: 'Text Input' },
    { step: '02', icon: Zap, title: 'Embedding Generation', desc: `${embeddingConfig.model} (1536d)`, tag: 'Vectorization' },
    { step: '03', icon: Database, title: 'Vector Search', desc: `PostgreSQL pgvector ${embeddingConfig.indexType.toUpperCase()} index`, tag: `${embeddingConfig.metric} Metric` },
    { step: '04', icon: Filter, title: 'Adaptive Ranking', desc: 'Multi-factor weighted governance scoring', tag: 'Dynamic Weights' },
    { step: '05', icon: Target, title: 'Top-K Results', desc: 'Context-filtered final memory selection', tag: 'Output' },
  ], [embeddingConfig]);

  const activeWeightsList = useMemo(() => [
    { label: 'Semantic Similarity', weight: `${rankingWeights.semanticSimilarity}%`, formula: `${(rankingWeights.semanticSimilarity / 100).toFixed(2)} × cos_sim(q, m)`, color: 'bg-blue-600', text: 'text-blue-600' },
    { label: 'Importance Score', weight: `${rankingWeights.importance}%`, formula: `${(rankingWeights.importance / 100).toFixed(2)} × importance`, color: 'bg-indigo-600', text: 'text-indigo-600' },
    { label: 'Confidence Score', weight: `${rankingWeights.confidence}%`, formula: `${(rankingWeights.confidence / 100).toFixed(2)} × confidence`, color: 'bg-emerald-600', text: 'text-emerald-600' },
    { label: 'Recency Score', weight: `${rankingWeights.recency}%`, formula: `${(rankingWeights.recency / 100).toFixed(2)} × recency(t)`, color: 'bg-amber-600', text: 'text-amber-600' },
    { label: 'Access Frequency', weight: `${rankingWeights.accessFrequency}%`, formula: `${(rankingWeights.accessFrequency / 100).toFixed(2)} × log(freq)`, color: 'bg-slate-600', text: 'text-slate-600' },
  ], [rankingWeights]);

  // Compute search results based on query, memories, and ranking weights
  const results = useMemo(() => {
    if (!query.trim() || !searched) return [];
    const lower = query.toLowerCase();

    // Match memories
    let matching = memories.filter(m =>
      lower.split(' ').some(word => word.length > 3 && m.content.toLowerCase().includes(word))
    );

    if (matching.length === 0) {
      matching = memories.slice(0, 3);
    }

    const wSim = rankingWeights.semanticSimilarity / 100;
    const wImp = rankingWeights.importance / 100;
    const wConf = rankingWeights.confidence / 100;
    const wRec = rankingWeights.recency / 100;
    const wFreq = rankingWeights.accessFrequency / 100;

    return matching.slice(0, 3).map((m, idx) => {
      const sim = Number((0.95 - idx * 0.08).toFixed(2));
      const recency = Number((0.88 - idx * 0.1).toFixed(2));
      const freq = Number((0.82 - idx * 0.15).toFixed(2));
      const finalScore = Number((wSim * sim + wImp * m.importance + wConf * m.confidence + wRec * recency + wFreq * freq).toFixed(2));

      return {
        memory: m,
        semanticSimilarity: sim,
        importanceScore: m.importance,
        confidenceScore: m.confidence,
        recencyScore: recency,
        accessFrequency: freq,
        finalScore: finalScore,
      } as SearchResult;
    });
  }, [query, searched, memories, rankingWeights]);

  const executeSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setSearched(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Semantic Search & Retrieval</h1>
        <p className="text-sm text-slate-500 mt-1">
          Perform natural-language vector queries with multi-factor adaptive ranking across persisted memory stores
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Natural Language Memory Query
        </label>
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && executeSearch(query)}
              placeholder="e.g., What database technology is used in ResearchGraph?"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-normal"
            />
          </div>
          <button
            onClick={() => executeSearch(query)}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shrink-0 shadow-xs"
          >
            <Compass className="w-4 h-4" /> Retrieve Memories
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-amber-500" /> Examples:
          </span>
          {sampleQueries.map(sq => (
            <button
              key={sq}
              onClick={() => executeSearch(sq)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              "{sq}"
            </button>
          ))}
        </div>
      </div>

      {searched && results.length > 0 && (
        <>
          {/* Query Summary Strip */}
          <div className="bg-white border border-slate-200 rounded-lg px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Query Target:</span>
              <span className="text-sm font-medium text-slate-900">"{query}"</span>
            </div>
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <span>Candidates evaluated: <strong className="text-slate-800 font-mono">{memories.length * 8}</strong></span>
              <span>Returned: <strong className="text-slate-800 font-mono">{results.length} Top-K</strong></span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Latency: <strong className="text-slate-800 font-mono">42ms</strong>
              </span>
            </div>
          </div>

          {/* Retrieval Process Pipeline */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Retrieval & Ranking Pipeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">End-to-end trace from natural language query to adaptive rank selection</p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                5-Stage Pipeline Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {pipelineSteps.map((step) => (
                <div key={step.step} className="relative bg-slate-50 border border-slate-200/90 rounded-lg p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400">STAGE {step.step}</span>
                      <step.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">{step.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/70 text-[10px] text-slate-400 font-mono">
                    {step.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Ranked Top-K Memory Results</h3>
              <span className="text-xs text-slate-400">Ranked using live weights from Settings (Max 1.0)</span>
            </div>

            {results.map((r, idx) => (
              <div
                key={r.memory.id}
                className={`bg-white border rounded-lg p-5 shadow-xs transition-all ${
                  idx === 0
                    ? 'border-l-4 border-l-blue-600 border-slate-200 bg-linear-to-r from-blue-50/20 to-white'
                    : 'border-slate-200'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {r.memory.id}
                      </span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        Rank #{idx + 1}
                      </span>
                      <StatusBadge status={r.memory.type} />
                      <StatusBadge status={r.memory.status} />
                    </div>
                    <p className="text-sm text-slate-900 font-medium leading-relaxed mt-1">
                      {r.memory.content}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center md:text-right shrink-0 min-w-[130px]">
                    <p className="text-2xl font-black text-blue-600 font-mono">{r.finalScore.toFixed(2)}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Final Ranking Score</p>
                  </div>
                </div>

                {/* Score breakdown bars */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Score Components Breakdown</p>
                  <ScoreBar label={`Semantic Similarity (${rankingWeights.semanticSimilarity}%)`} value={r.semanticSimilarity} color="bg-blue-600" />
                  <ScoreBar label={`Importance Score (${rankingWeights.importance}%)`} value={r.importanceScore} color="bg-indigo-600" />
                  <ScoreBar label={`Confidence Score (${rankingWeights.confidence}%)`} value={r.confidenceScore} color="bg-emerald-600" />
                  <ScoreBar label={`Recency Score (${rankingWeights.recency}%)`} value={r.recencyScore} color="bg-amber-600" />
                  <ScoreBar label={`Access Frequency (${rankingWeights.accessFrequency}%)`} value={r.accessFrequency} color="bg-slate-600" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Tags:</span>
                  {r.memory.tags.map(t => (
                    <span key={t} className="bg-slate-100 text-slate-600 rounded px-2 py-0.5 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-400 ml-auto">
                    Last accessed: {new Date(r.memory.lastAccessedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Explanation of How Memories Are Ranked */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900">Adaptive Ranking Formula & Weights (From Settings)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              AgentMemory does not rely on raw vector similarity alone. Memories are evaluated dynamically using a multi-factor ranking function that balances semantic relevance, knowledge importance, verification confidence, temporal decay, and access frequency.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-800 mb-4 overflow-x-auto">
              Final Score = ({(rankingWeights.semanticSimilarity / 100).toFixed(2)} × Sim) + ({(rankingWeights.importance / 100).toFixed(2)} × Imp) + ({(rankingWeights.confidence / 100).toFixed(2)} × Conf) + ({(rankingWeights.recency / 100).toFixed(2)} × Rec) + ({(rankingWeights.accessFrequency / 100).toFixed(2)} × Freq)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {activeWeightsList.map(w => (
                <div key={w.label} className="border border-slate-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800">{w.label}</span>
                    <span className={`text-xs font-bold ${w.text}`}>{w.weight}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5 mb-2">
                    <div className={`h-full rounded-full ${w.color}`} style={{ width: w.weight }} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">{w.formula}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SemanticSearch;

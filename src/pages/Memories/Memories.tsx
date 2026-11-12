import React, { useState, useMemo } from 'react';
import { X, Tag, User, Bot as BotIcon, FolderKanban, Edit3, Trash2, History, Link2, Plus, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import { SearchBar, DataTable, StatusBadge, FilterPanel, FilterSelect, ScoreBar } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import { mockMemoryVersions } from '../../data/mockData';
import type { Memory, MemoryType } from '../../types';

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'factual', label: 'Factual' },
  { value: 'procedural', label: 'Procedural' },
  { value: 'episodic', label: 'Episodic' },
  { value: 'semantic', label: 'Semantic' },
  { value: 'contextual', label: 'Contextual' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'candidate', label: 'Candidate' },
  { value: 'validated', label: 'Validated' },
  { value: 'updated', label: 'Updated' },
  { value: 'superseded', label: 'Superseded' },
  { value: 'consolidated', label: 'Consolidated' },
  { value: 'decayed', label: 'Decayed' },
  { value: 'deleted', label: 'Deleted' },
];

const importanceOptions = [
  { value: 'all', label: 'All Importance' },
  { value: 'critical', label: 'Critical (> 0.90)' },
  { value: 'high', label: 'High (0.75 - 0.90)' },
  { value: 'medium', label: 'Medium (0.50 - 0.75)' },
  { value: 'low', label: 'Low (< 0.50)' },
];

const confidenceOptions = [
  { value: 'all', label: 'All Confidence' },
  { value: 'high', label: 'High (≥ 0.90)' },
  { value: 'medium', label: 'Medium (0.80 - 0.89)' },
  { value: 'low', label: 'Low (< 0.80)' },
];

const presetCandidatePrompts = [
  {
    title: 'PostgreSQL Connection Pooling',
    content: 'ResearchGraph uses PgBouncer in transaction pooling mode with a default pool size of 20 connections per service instance.',
    type: 'factual' as MemoryType,
    tags: ['postgresql', 'pgbouncer', 'pooling'],
    projectId: 'p-1',
    agentId: 'a-1',
  },
  {
    title: 'JWT Secret Rotation Policy',
    content: 'APIForge JWT asymmetric keys are automatically rotated every 90 days via AWS Secrets Manager with a 24-hour overlap grace period.',
    type: 'procedural' as MemoryType,
    tags: ['jwt', 'security', 'key-rotation'],
    projectId: 'p-2',
    agentId: 'a-1',
  },
  {
    title: 'Isolation Forest Threshold',
    content: 'DataPulse anomaly detection threshold is calibrated to 0.05 contamination factor with 200 estimators across streaming metrics.',
    type: 'factual' as MemoryType,
    tags: ['anomaly-detection', 'isolation-forest', 'streaming'],
    projectId: 'p-3',
    agentId: 'a-4',
  },
];

const Memories: React.FC = () => {
  const {
    memories,
    projects,
    agents,
    addMemory,
    updateMemory,
    deleteMemory,
    validateMemory,
    decayMemory,
    getUserName,
    getAgentName,
    getProjectName,
  } = useAppContext();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [importanceFilter, setImportanceFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [selected, setSelected] = useState<Memory | null>(null);

  // Propose Candidate Memory Modal State
  const [isProposeOpen, setIsProposeOpen] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    content: '',
    type: 'factual' as MemoryType,
    projectId: 'p-1',
    agentId: 'a-1',
    tags: 'database, architecture',
  });

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editContent, setEditContent] = useState('');

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeSelected = selected ? memories.find(m => m.id === selected.id) || selected : null;

  const projectOptions = useMemo(() => [
    { value: 'all', label: 'All Projects' },
    ...projects.map(p => ({ value: p.id, label: p.name })),
  ], [projects]);

  const agentOptions = useMemo(() => [
    { value: 'all', label: 'All Agents' },
    ...agents.map(a => ({ value: a.id, label: a.name })),
  ], [agents]);

  const filtered = useMemo(() => {
    return memories.filter(m => {
      if (search && !m.content.toLowerCase().includes(search.toLowerCase()) && !m.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && m.type !== typeFilter) return false;
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (projectFilter !== 'all' && m.projectId !== projectFilter) return false;
      if (agentFilter !== 'all' && m.agentId !== agentFilter) return false;

      if (importanceFilter === 'critical' && m.importance <= 0.9) return false;
      if (importanceFilter === 'high' && (m.importance <= 0.75 || m.importance > 0.9)) return false;
      if (importanceFilter === 'medium' && (m.importance <= 0.5 || m.importance > 0.75)) return false;
      if (importanceFilter === 'low' && m.importance > 0.5) return false;

      if (confidenceFilter === 'high' && m.confidence < 0.9) return false;
      if (confidenceFilter === 'medium' && (m.confidence < 0.8 || m.confidence >= 0.9)) return false;
      if (confidenceFilter === 'low' && m.confidence >= 0.8) return false;

      return true;
    });
  }, [memories, search, typeFilter, statusFilter, importanceFilter, confidenceFilter, projectFilter, agentFilter]);

  const columns = [
    { key: 'id', header: 'Memory ID', render: (r: Memory) => <span className="font-mono text-xs font-semibold text-slate-600">{r.id}</span> },
    { key: 'content', header: 'Content', render: (r: Memory) => <span className="text-slate-800 font-normal line-clamp-2">{r.content}</span>, className: 'max-w-md' },
    { key: 'type', header: 'Type', render: (r: Memory) => <span className="capitalize text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">{r.type}</span> },
    { key: 'importance', header: 'Importance', render: (r: Memory) => <span className="font-mono text-xs font-medium text-slate-800">{r.importance.toFixed(2)}</span> },
    { key: 'confidence', header: 'Confidence', render: (r: Memory) => <span className="font-mono text-xs font-medium text-slate-800">{r.confidence.toFixed(2)}</span> },
    { key: 'projectId', header: 'Project', render: (r: Memory) => <span className="text-xs font-medium text-slate-700">{getProjectName(r.projectId)}</span> },
    { key: 'createdAt', header: 'Created Date', render: (r: Memory) => <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: 'lastAccessedAt', header: 'Last Accessed', render: (r: Memory) => <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(r.lastAccessedAt).toLocaleDateString()}</span> },
    { key: 'status', header: 'Status', render: (r: Memory) => <StatusBadge status={r.status} /> },
  ];

  const versions = activeSelected ? mockMemoryVersions.filter(v => v.memoryId === activeSelected.id) : [];
  const relatedMemories = activeSelected ? memories.filter(m => m.projectId === activeSelected.projectId && m.id !== activeSelected.id).slice(0, 3) : [];

  const handleValidate = () => {
    if (!activeSelected) return;
    validateMemory(activeSelected.id);
    setActionNotice(`Memory ${activeSelected.id} status updated to VALIDATED. (Persisted to storage).`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDecay = () => {
    if (!activeSelected) return;
    decayMemory(activeSelected.id);
    setActionNotice(`Memory ${activeSelected.id} marked as DECAYED. (Persisted to storage).`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDelete = () => {
    if (!activeSelected) return;
    if (window.confirm(`Permanently flag memory ${activeSelected.id} as DELETED?`)) {
      deleteMemory(activeSelected.id);
      setActionNotice(`Memory ${activeSelected.id} marked as DELETED.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleOpenEdit = () => {
    if (!activeSelected) return;
    setEditContent(activeSelected.content);
    setIsEditOpen(true);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSelected || !editContent.trim()) return;
    updateMemory(activeSelected.id, { content: editContent.trim(), status: 'updated' });
    setIsEditOpen(false);
    setActionNotice(`Memory ${activeSelected.id} updated to version v${activeSelected.version + 1}. (Persisted).`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.content.trim()) return;

    const created = addMemory({
      content: proposalForm.content.trim(),
      type: proposalForm.type,
      projectId: proposalForm.projectId,
      agentId: proposalForm.agentId,
      userId: 'u-1',
      tags: proposalForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      importance: 0.89,
      confidence: 0.94,
      status: 'candidate',
    });

    setIsProposeOpen(false);
    setSelected(created);
    setActionNotice(`Agent "${getAgentName(created.agentId)}" proposed new candidate memory [${created.id}]. (Saved to storage).`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Memories</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, inspect, filter, and govern persistent knowledge items stored across projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProposeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Propose Candidate Memory
          </button>
          <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full font-medium">
            {filtered.length} / {memories.length} Memories
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> {actionNotice}
          </span>
          <button onClick={() => setActionNotice(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {/* Search Bar */}
      <SearchBar value={search} onChange={setSearch} placeholder="Search memory content or ID…" />

      {/* Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <FilterPanel>
          <FilterSelect label="Type" value={typeFilter} options={typeOptions} onChange={setTypeFilter} />
          <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
          <FilterSelect label="Project" value={projectFilter} options={projectOptions} onChange={setProjectFilter} />
          <FilterSelect label="Agent" value={agentFilter} options={agentOptions} onChange={setAgentFilter} />
          <FilterSelect label="Importance" value={importanceFilter} options={importanceOptions} onChange={setImportanceFilter} />
          <FilterSelect label="Confidence" value={confidenceFilter} options={confidenceOptions} onChange={setConfidenceFilter} />
          {(typeFilter !== 'all' || statusFilter !== 'all' || projectFilter !== 'all' || agentFilter !== 'all' || importanceFilter !== 'all' || confidenceFilter !== 'all' || search) && (
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('all');
                setStatusFilter('all');
                setProjectFilter('all');
                setAgentFilter('all');
                setImportanceFilter('all');
                setConfidenceFilter('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </FilterPanel>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={r => r.id}
          onRowClick={(r) => setSelected(r)}
          emptyMessage="No memories match your search criteria and active filters."
        />
      </div>

      {/* Propose Candidate Memory Modal */}
      {isProposeOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity" onClick={() => setIsProposeOpen(false)} />
          <div className="fixed inset-x-4 top-[10%] max-w-xl mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    AI Agent Simulation
                  </span>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-xs font-semibold text-slate-700">Proposal Ingestion</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1">Propose Candidate Memory</h2>
              </div>
              <button onClick={() => setIsProposeOpen(false)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProposeSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {/* Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Quick Sample Knowledge Proposals
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetCandidatePrompts.map(p => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => setProposalForm({
                        content: p.content,
                        type: p.type,
                        projectId: p.projectId,
                        agentId: p.agentId,
                        tags: p.tags.join(', '),
                      })}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                    >
                      + {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposing Agent & Project */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Proposing Agent</label>
                  <select
                    value={proposalForm.agentId}
                    onChange={e => setProposalForm(f => ({ ...f, agentId: e.target.value }))}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Target Project</label>
                  <select
                    value={proposalForm.projectId}
                    onChange={e => setProposalForm(f => ({ ...f, projectId: e.target.value }))}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Memory Type */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Memory Classification</label>
                <select
                  value={proposalForm.type}
                  onChange={e => setProposalForm(f => ({ ...f, type: e.target.value as MemoryType }))}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white capitalize"
                >
                  <option value="factual">Factual (Static technical truth)</option>
                  <option value="procedural">Procedural (Workflow / step-by-step)</option>
                  <option value="episodic">Episodic (Event occurrence)</option>
                  <option value="semantic">Semantic (Conceptual knowledge)</option>
                  <option value="contextual">Contextual (Session context)</option>
                </select>
              </div>

              {/* Memory Content */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Memory Content (Agent Proposal)
                </label>
                <textarea
                  rows={3}
                  required
                  value={proposalForm.content}
                  onChange={e => setProposalForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="e.g., PostgreSQL connection pooling is configured with max_connections = 100..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-normal"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Metadata Tags (comma separated)</label>
                <input
                  type="text"
                  value={proposalForm.tags}
                  onChange={e => setProposalForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="database, config, pgbouncer"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2"
                />
              </div>

              {/* Governance Pre-Flight Checks */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Automated Governance Pre-Flight
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Schema Validation:</span>
                  <span className="text-emerald-700 font-semibold font-mono">Passed (Valid Schema)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Duplicate Bound Check:</span>
                  <span className="text-emerald-700 font-semibold font-mono">Sim = 0.14 (No conflict)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Estimated Importance:</span>
                  <span className="text-blue-700 font-semibold font-mono">0.89 (High Persistence)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProposeOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Submit for Governance
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Edit Memory Modal */}
      {isEditOpen && activeSelected && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50" onClick={() => setIsEditOpen(false)} />
          <div className="fixed inset-x-4 top-[15%] max-w-lg mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs text-slate-400">{activeSelected.id}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Edit Memory Knowledge Content</h3>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                Saving will increment memory version to <strong>v{activeSelected.version + 1}</strong> and record an update lifecycle audit event.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800"
                >
                  Save Revision
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Detail Slide-over Panel */}
      {activeSelected && (
        <>
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[520px] bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{activeSelected.id}</span>
                <StatusBadge status={activeSelected.status} />
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Full Content */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Memory Content</label>
                <div className="text-sm text-slate-800 leading-relaxed bg-slate-50/80 p-4 rounded-lg border border-slate-200/80 font-normal">
                  {activeSelected.content}
                </div>
              </div>

              {/* Governance & Lifecycle Status */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Lifecycle Status</span>
                  <StatusBadge status={activeSelected.status} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Memory Version</span>
                  <span className="font-mono font-semibold text-slate-800">v{activeSelected.version}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Governance Policy</span>
                  <span className="text-slate-700">The agent proposes. AgentMemory governs.</span>
                </div>
              </div>

              {/* Scores */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Adaptive Scoring</label>
                <div className="space-y-2.5 bg-white border border-slate-200 rounded-lg p-3.5">
                  <ScoreBar label="Importance Score" value={activeSelected.importance} color="bg-blue-600" />
                  <ScoreBar label="Confidence Score" value={activeSelected.confidence} color="bg-emerald-600" />
                </div>
              </div>

              {/* Associations */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Origin & Associations</label>
                <div className="space-y-2.5 text-xs bg-white border border-slate-200 rounded-lg p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5"><FolderKanban className="w-3.5 h-3.5" /> Project</span>
                    <span className="font-semibold text-slate-800">{getProjectName(activeSelected.projectId)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5"><BotIcon className="w-3.5 h-3.5" /> Proposing Agent</span>
                    <span className="font-semibold text-slate-800">{getAgentName(activeSelected.agentId)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Authorized User</span>
                    <span className="font-semibold text-slate-800">{getUserName(activeSelected.userId)}</span>
                  </div>
                </div>
              </div>

              {/* Tags & Metadata */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Tags & Metadata</label>
                <div className="flex flex-wrap gap-1.5">
                  {activeSelected.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1 text-xs font-medium">
                      <Tag className="w-3 h-3 text-slate-400" /> {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Embedding Information */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Vector & Embedding Details</label>
                <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Embedding Model</span>
                    <span className="font-mono text-slate-800 font-medium">{activeSelected.embeddingModel || 'text-embedding-3-small'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vector Dimension</span>
                    <span className="font-mono text-slate-800 font-medium">1536 (float32)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Index Extension</span>
                    <span className="text-slate-800 font-medium">pgvector (HNSW cosine/dot)</span>
                  </div>
                </div>
              </div>

              {/* Access History */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Access & Retrieval Metrics</label>
                <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Retrieval Count</span>
                    <span className="font-semibold text-slate-800">{activeSelected.accessCount} retrievals</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Last Accessed</span>
                    <span className="text-slate-800">{new Date(activeSelected.lastAccessedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Created At</span>
                    <span className="text-slate-800">{new Date(activeSelected.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Version History */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" /> Version History ({versions.length})
                </label>
                {versions.length > 0 ? (
                  <div className="space-y-2">
                    {versions.map(v => (
                      <div key={v.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">Version {v.version}</span>
                          <span className="text-slate-400">{new Date(v.changedAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 mb-1.5 italic">"{v.content}"</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-1">
                          <span>Changed by: {v.changedBy}</span>
                          <span>Reason: {v.changeReason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">This memory is on its initial version (v{activeSelected.version}).</p>
                )}
              </div>

              {/* Related Memories in Project */}
              {relatedMemories.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-slate-400" /> Related Knowledge in Project
                  </label>
                  <div className="space-y-1.5">
                    {relatedMemories.map(rm => (
                      <div
                        key={rm.id}
                        onClick={() => setSelected(rm)}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs transition-colors"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-mono font-medium text-slate-600">{rm.id}</span>
                          <StatusBadge status={rm.status} />
                        </div>
                        <p className="text-slate-700 line-clamp-1">{rm.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleValidate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Validate
                </button>
                <button
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecay}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                >
                  Decay
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Memories;

import React, { useState, useEffect } from 'react';
import { User, Shield, Bot, Cpu, Sliders, Database, CheckCircle, Save, RotateCcw, Sparkles } from 'lucide-react';
import { StatusBadge } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import { mockSystemHealth } from '../../data/mockData';

const tabs = [
  { id: 'profile', label: 'User Profile', icon: User },
  { id: 'permissions', label: 'Project Permissions', icon: Shield },
  { id: 'agents', label: 'Agent Access', icon: Bot },
  { id: 'embedding', label: 'Embedding Config', icon: Cpu },
  { id: 'ranking', label: 'Ranking Weights', icon: Sliders },
  { id: 'system', label: 'System & Database', icon: Database },
];

const Settings: React.FC = () => {
  const {
    userProfile,
    projectPermissions,
    agentAccess,
    embeddingConfig,
    rankingWeights,
    systemConfig,
    projects,
    agents,
    updateUserProfile,
    updateProjectPermissionSetting,
    updateAgentAccessSetting,
    updateEmbeddingConfig,
    updateRankingWeights,
    updateSystemConfig,
    resetAllToDefaults,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('profile');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Local form states synced with context
  const [profileForm, setProfileForm] = useState(userProfile);
  const [embeddingForm, setEmbeddingForm] = useState(embeddingConfig);
  const [weightsForm, setWeightsForm] = useState(rankingWeights);
  const [systemForm, setSystemForm] = useState(systemConfig);

  useEffect(() => { setProfileForm(userProfile); }, [userProfile]);
  useEffect(() => { setEmbeddingForm(embeddingConfig); }, [embeddingConfig]);
  useEffect(() => { setWeightsForm(rankingWeights); }, [rankingWeights]);
  useEffect(() => { setSystemForm(systemConfig); }, [systemConfig]);

  const showSaved = (message: string) => {
    setSaveNotice(message);
    setTimeout(() => setSaveNotice(null), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    showSaved('User profile saved and persisted successfully.');
  };

  const handleEmbeddingSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmbeddingConfig(embeddingForm);
    showSaved('Embedding configuration updated and persisted.');
  };

  const handleWeightsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRankingWeights(weightsForm);
    showSaved('Retrieval ranking weights updated and persisted.');
  };

  const handleSystemSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig(systemForm);
    showSaved('System endpoints saved and persisted.');
  };

  const handleReset = () => {
    if (window.confirm('Reset all memories, projects, agent settings, and weights to initial mock defaults?')) {
      resetAllToDefaults();
      showSaved('All settings and data reset to initial defaults.');
    }
  };

  const weightsSum = Object.values(weightsForm).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage infrastructure governance parameters, access control, and storage configurations</p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-colors shadow-xs self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Initial Defaults
        </button>
      </div>

      {saveNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {saveNotice} (Changes saved to persistent storage)
          </span>
          <button onClick={() => setSaveNotice(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white md:bg-transparent'
                }`}
              >
                <t.icon className="w-4 h-4 shrink-0" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Pane */}
        <div className="flex-1 min-w-0">
          {/* TAB 1: User Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">User Profile & Identity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Edit administrative profile details. Updates reflect globally in the UI and sidebar.</p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">System Role</label>
                    <select
                      value={profileForm.role}
                      onChange={e => setProfileForm(f => ({ ...f, role: e.target.value as any }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white capitalize font-medium"
                    >
                      <option value="admin">Administrator (Full Control)</option>
                      <option value="editor">Editor (Read, Propose, Edit)</option>
                      <option value="viewer">Viewer (Read Only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Storage Persistence</label>
                    <input
                      type="text"
                      value="Browser LocalStorage Active"
                      disabled
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Project Permissions */}
          {activeTab === 'permissions' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Project Permissions & Access Control</h2>
                <p className="text-xs text-slate-500 mt-0.5">Control administrative access and permission scopes per project workspace. Changes persist immediately.</p>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {projects.map(p => {
                  const currentRole = projectPermissions[p.id] || 'editor';
                  return (
                    <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/60 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                          <span className="font-mono text-[11px] text-slate-400">{p.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <select
                          value={currentRole}
                          onChange={e => {
                            updateProjectPermissionSetting(p.id, e.target.value);
                            showSaved(`Updated permissions for ${p.name} to ${e.target.value.toUpperCase()}.`);
                          }}
                          className="text-xs border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="admin">Admin (Full Control)</option>
                          <option value="editor">Editor (Read / Propose)</option>
                          <option value="viewer">Viewer (Read Only)</option>
                        </select>
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Agent Access Management */}
          {activeTab === 'agents' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Agent Access & Ingestion Control</h2>
                <p className="text-xs text-slate-500 mt-0.5">Grant or revoke memory ingestion and retrieval permissions for autonomous AI agents.</p>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {agents.map(a => {
                  const currentAccess = agentAccess[a.id] || 'readwrite';
                  return (
                    <div key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg shrink-0">
                          <Bot className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                            <span className="font-mono text-[11px] text-slate-400">{a.id}</span>
                          </div>
                          <p className="text-xs text-slate-500 capitalize">{a.type} agent · {a.projectIds.length} projects connected</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <select
                          value={currentAccess}
                          onChange={e => {
                            updateAgentAccessSetting(a.id, e.target.value);
                            showSaved(`Agent ${a.name} access updated to ${e.target.value}.`);
                          }}
                          className="text-xs border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="readwrite">Read & Propose (Active)</option>
                          <option value="readonly">Read Only (Inspection)</option>
                          <option value="disabled">Disabled (Revoked)</option>
                        </select>
                        <StatusBadge status={a.connectionStatus} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Embedding Model Configuration */}
          {activeTab === 'embedding' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Embedding Model & Vector Parameters</h2>
                <p className="text-xs text-slate-500 mt-0.5">Configure embedding generation model, pgvector index type, and distance metrics.</p>
              </div>

              <form onSubmit={handleEmbeddingSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Embedding Model</label>
                    <select
                      value={embeddingForm.model}
                      onChange={e => setEmbeddingForm(f => ({ ...f, model: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="text-embedding-3-small">text-embedding-3-small (1536 dim, Recommended)</option>
                      <option value="text-embedding-3-large">text-embedding-3-large (3072 dim, High Precision)</option>
                      <option value="text-embedding-ada-002">text-embedding-ada-002 (1536 dim, Legacy)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Vector Index Algorithm</label>
                    <select
                      value={embeddingForm.indexType}
                      onChange={e => setEmbeddingForm(f => ({ ...f, indexType: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white uppercase font-mono"
                    >
                      <option value="hnsw">HNSW (Hierarchical Navigable Small World - High Recall)</option>
                      <option value="ivfflat">IVFFlat (Inverted File with Flat Compression)</option>
                      <option value="exact">Exact Brute-Force (kNN)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Distance / Similarity Metric</label>
                    <select
                      value={embeddingForm.metric}
                      onChange={e => setEmbeddingForm(f => ({ ...f, metric: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="dot">Dot Product (Normalized Cosine)</option>
                      <option value="cosine">Cosine Distance</option>
                      <option value="l2">Euclidean L2 Distance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Chunk Size (Tokens)</label>
                    <input
                      type="number"
                      min={128}
                      max={2048}
                      step={64}
                      value={embeddingForm.chunkSize}
                      onChange={e => setEmbeddingForm(f => ({ ...f, chunkSize: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Vector Configuration
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: Retrieval Ranking Weights */}
          {activeTab === 'ranking' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Adaptive Retrieval Ranking Weights</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust multi-factor scoring weights. Changes dynamically drive ranking calculation in Semantic Search and Retrieval Traces!
                </p>
              </div>

              <form onSubmit={handleWeightsSave} className="space-y-4">
                <div className="space-y-4 bg-slate-50/70 border border-slate-200 rounded-lg p-4">
                  {Object.entries(weightsForm).map(([key, val]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <label className="text-xs font-bold text-slate-700 w-44 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={val}
                        onChange={e => setWeightsForm(w => ({ ...w, [key]: Number(e.target.value) }))}
                        className="flex-1 accent-blue-600"
                      />
                      <span className="font-mono text-xs font-bold text-slate-800 w-12 text-right">
                        {val}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Total Weight Distribution:{' '}
                    <strong className={weightsSum === 100 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                      {weightsSum}% {weightsSum === 100 ? '(Optimal 100%)' : '(Adjust to sum to 100%)'}
                    </strong>
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Ranking Weights
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: System & Database */}
          {activeTab === 'system' && (
            <div className="space-y-5">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">System API & Protocol Configuration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Base connection endpoints for AgentMemory REST API and MCP sidecar daemon.</p>
                </div>

                <form onSubmit={handleSystemSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">REST API Base URL</label>
                      <input
                        type="text"
                        value={systemForm.apiUrl}
                        onChange={e => setSystemForm(f => ({ ...f, apiUrl: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">MCP Server Protocol Endpoint</label>
                      <input
                        type="text"
                        value={systemForm.mcpUrl}
                        onChange={e => setSystemForm(f => ({ ...f, mcpUrl: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Endpoints
                  </button>
                </form>
              </div>

              {/* Database Health Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Database Connection Health</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Status of relational, vector, and document storage nodes.</p>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {mockSystemHealth.map(h => (
                    <div key={h.service} className="p-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <div>
                          <p className="font-semibold text-slate-900">{h.service}</p>
                          <p className="text-slate-400 text-[11px]">{h.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-slate-600">{h.latencyMs}ms</span>
                        <StatusBadge status={h.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

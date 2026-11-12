import React, { useState, useMemo } from 'react';
import { Users, Bot, Brain, ArrowLeft, Activity, Shield, Lock, Globe, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { StatusBadge, DataTable, ChartCard } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import type { Project, Memory, ActivityEvent } from '../../types';

const PIE_COLORS = ['#2563eb', '#0284c7', '#4f46e5', '#7c3aed', '#64748b'];

const roleBadgeColor: Record<string, string> = {
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
  editor: 'bg-blue-50 text-blue-700 border-blue-200',
  viewer: 'bg-slate-100 text-slate-700 border-slate-200',
};

const Projects: React.FC = () => {
  const {
    projects,
    memories,
    agents,
    users,
    activityEvents,
    updateProjectMemberRole,
    getUserName,
    getAgentName,
  } = useAppContext();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [memoryScope, setMemoryScope] = useState<'shared' | 'personal'>('shared');
  const [notice, setNotice] = useState<string | null>(null);

  const activeProject = selectedProject ? projects.find(p => p.id === selectedProject.id) || selectedProject : null;

  const projectMemories = useMemo(() => {
    if (!activeProject) return [];
    return memories.filter(m => m.projectId === activeProject.id);
  }, [activeProject, memories]);

  const personalMemories = useMemo(() => {
    if (!activeProject) return [];
    return memories
      .filter(m => m.projectId === activeProject.id)
      .slice(0, 2)
      .map(m => ({
        ...m,
        id: `${m.id}-private`,
        content: `[Agent Local Scratchpad] Temporary session memory: ${m.content}`,
        status: 'candidate' as const,
      }));
  }, [activeProject, memories]);

  const displayedMemories = memoryScope === 'shared' ? projectMemories : personalMemories;

  const projectAgents = useMemo(() => {
    if (!activeProject) return [];
    return agents.filter(a => activeProject.agentIds.includes(a.id));
  }, [activeProject, agents]);

  const projectMembers = useMemo(() => {
    if (!activeProject) return [];
    return users.filter(u => activeProject.memberIds.includes(u.id));
  }, [activeProject, users]);

  const projectActivity = useMemo(() => {
    if (!activeProject) return [];
    return activityEvents.filter(e => e.projectId === activeProject.id).slice(0, 5);
  }, [activeProject, activityEvents]);

  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    projectMemories.forEach(m => { counts[m.type] = (counts[m.type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projectMemories]);

  const handleRoleChange = (userId: string, userName: string, newRole: 'admin' | 'editor' | 'viewer') => {
    if (!activeProject) return;
    updateProjectMemberRole(activeProject.id, userId, newRole);
    setNotice(`Updated ${userName}'s role to ${newRole.toUpperCase()} (Saved to storage).`);
    setTimeout(() => setNotice(null), 3000);
  };

  const memColumns = [
    { key: 'id', header: 'Memory ID', render: (r: Memory) => <span className="font-mono text-xs font-semibold text-slate-600">{r.id}</span> },
    { key: 'content', header: 'Content', render: (r: Memory) => <span className="text-slate-800 line-clamp-2">{r.content}</span>, className: 'max-w-md' },
    { key: 'type', header: 'Type', render: (r: Memory) => <span className="capitalize text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">{r.type}</span> },
    { key: 'importance', header: 'Importance', render: (r: Memory) => <span className="font-mono text-xs font-semibold">{r.importance.toFixed(2)}</span> },
    { key: 'status', header: 'Status', render: (r: Memory) => <StatusBadge status={r.status} /> },
  ];

  if (activeProject) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedProject(null)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Projects
        </button>

        {/* Project Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                  {activeProject.id}
                </span>
                <StatusBadge status={activeProject.status} size="md" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">{activeProject.name}</h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">{activeProject.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                <span>Owner: <strong className="text-slate-700">{getUserName(activeProject.ownerId)}</strong></span>
                <span>Created: {new Date(activeProject.createdAt).toLocaleDateString()}</span>
                <span>Last Activity: {new Date(activeProject.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {notice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> {notice}
            </span>
            <button onClick={() => setNotice(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{projectMembers.length}</p>
            <p className="text-xs text-slate-500">Authorized Members</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <Bot className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{projectAgents.length}</p>
            <p className="text-xs text-slate-500">Associated AI Agents</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <Brain className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{projectMemories.length}</p>
            <p className="text-xs text-slate-500">Shared Project Memories</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <Activity className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{projectActivity.length}</p>
            <p className="text-xs text-slate-500">Recent Lifecycle Events</p>
          </div>
        </div>

        {/* Members & Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Members with interactive Role Selectors */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Authorized Members & Access Roles</h3>
              <span className="text-xs text-slate-400">{projectMembers.length} users</span>
            </div>
            <div className="divide-y divide-slate-100">
              {projectMembers.map(u => (
                <div key={u.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, u.name, e.target.value as any)}
                      className={`text-xs rounded-md border px-2 py-1 font-semibold capitalize ${roleBadgeColor[u.role] || 'bg-slate-100 text-slate-700 border-slate-200'}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Associated AI Agents */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Associated AI Agents</h3>
              <span className="text-xs text-slate-400">{projectAgents.length} agents</span>
            </div>
            <div className="divide-y divide-slate-100">
              {projectAgents.map(a => (
                <div key={a.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
                      <Bot className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{a.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{a.type} agent · Contributed: {a.memoriesContributed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Propose & Read
                    </span>
                    <StatusBadge status={a.connectionStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Memory Scoping Section */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Project Knowledge Store</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {memoryScope === 'shared'
                  ? 'Shared project-level memories accessible across all authorized agents & users'
                  : 'Personal/agent scratchpad memories isolated to individual agent execution contexts'}
              </p>
            </div>

            {/* Scope Toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 self-start sm:self-auto">
              <button
                onClick={() => setMemoryScope('shared')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  memoryScope === 'shared'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Shared Project Memories ({projectMemories.length})
              </button>
              <button
                onClick={() => setMemoryScope('personal')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  memoryScope === 'personal'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Agent Private Scopes ({personalMemories.length})
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 border-b border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <strong>Scope Isolation:</strong> {memoryScope === 'shared'
                ? 'All project members and registered agents inherit collaborative access to these validated memories.'
                : 'Isolated to agent transient sessions. Must pass validation and governance before promotion to shared project scope.'}
            </span>
          </div>

          <DataTable columns={memColumns} data={displayedMemories} keyExtractor={r => r.id} />
        </div>

        {/* Memory Distribution & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {typeDistribution.length > 0 && (
            <ChartCard title="Project Memory Distribution by Type">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={typeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={42} paddingAngle={2}>
                    {typeDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={9} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {projectActivity.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent Project Activity</h3>
              <div className="divide-y divide-slate-100">
                {projectActivity.map(act => (
                  <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-700">{act.memoryId}</span>
                        <StatusBadge status={act.eventType} />
                      </div>
                      <p className="text-slate-400 mt-0.5">Agent: {getAgentName(act.agentId)}</p>
                    </div>
                    <span className="text-slate-400">{new Date(act.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Project List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Collaborative Projects</h1>
          <p className="text-sm text-slate-500 mt-1">
            Project workspaces governing shared persistent memories across AI agents and team members
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium self-start sm:self-auto">
          {projects.length} Active Workspaces
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p => (
          <div
            key={p.id}
            onClick={() => setSelectedProject(p)}
            className="bg-white border border-slate-200 rounded-lg p-5 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {p.name}
                </h3>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium"><Users className="w-3.5 h-3.5 text-slate-400" /> {p.memberIds.length} Members</span>
                <span className="flex items-center gap-1 font-medium"><Bot className="w-3.5 h-3.5 text-slate-400" /> {p.agentIds.length} Agents</span>
                <span className="flex items-center gap-1 font-medium"><Brain className="w-3.5 h-3.5 text-slate-400" /> {p.memoryCount} Memories</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Owner: <strong>{getUserName(p.ownerId)}</strong></span>
                <span>Updated: {new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

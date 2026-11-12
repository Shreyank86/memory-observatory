import React, { useState } from 'react';
import { Bot, ArrowLeft, Brain, Search, Clock, FolderKanban, Key, CheckCircle } from 'lucide-react';
import { StatusBadge, DataTable } from '../../components/common';
import { useAppContext } from '../../context/AppContext';
import type { Agent, ActivityEvent } from '../../types';

const AIAgents: React.FC = () => {
  const {
    agents,
    projects,
    activityEvents,
    agentProjectPermissions,
    updateAgentProjectPermission,
    updateAgentConnection,
    getUserName,
    getProjectName,
  } = useAppContext();

  const [selected, setSelected] = useState<Agent | null>(null);
  const [permissionNotice, setPermissionNotice] = useState<string | null>(null);

  // Sync selected agent object with state if updated
  const activeAgent = selected ? agents.find(a => a.id === selected.id) || selected : null;

  const handlePermissionChange = (agentId: string, projectId: string, projectName: string, newPerm: string) => {
    updateAgentProjectPermission(agentId, projectId, newPerm);
    setPermissionNotice(`Permission for "${activeAgent?.name}" on "${projectName}" saved as "${newPerm}" (Persisted in Storage).`);
    setTimeout(() => setPermissionNotice(null), 3500);
  };

  const handleStatusChange = (agentId: string, newStatus: 'connected' | 'disconnected' | 'error') => {
    updateAgentConnection(agentId, newStatus);
    setPermissionNotice(`Connection status for agent updated to ${newStatus}.`);
    setTimeout(() => setPermissionNotice(null), 3000);
  };

  if (activeAgent) {
    const agentProjects = projects.filter(p => activeAgent.projectIds.includes(p.id));
    const agentActivity = activityEvents.filter(e => e.agentId === activeAgent.id).slice(0, 8);
    const agentPerms = agentProjectPermissions[activeAgent.id] || {};

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to AI Agents
        </button>

        {/* Agent Profile Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl shrink-0">
                <Bot className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-900">{activeAgent.name}</h1>
                  <StatusBadge status={activeAgent.connectionStatus} size="md" />
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                    {activeAgent.type} Agent
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">{activeAgent.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>Agent ID: <strong className="font-mono text-slate-700">{activeAgent.id}</strong></span>
                  <span>Registered Owner: <strong className="text-slate-700">{getUserName(activeAgent.ownerId)}</strong></span>
                  <span>Registered: {new Date(activeAgent.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Connection Toggle */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs">
              <span className="text-slate-600 font-medium">Connection:</span>
              <select
                value={activeAgent.connectionStatus}
                onChange={e => handleStatusChange(activeAgent.id, e.target.value as any)}
                className="bg-white border border-slate-200 rounded px-2 py-1 font-semibold text-slate-800"
              >
                <option value="connected">Connected</option>
                <option value="disconnected">Disconnected</option>
                <option value="error">Error State</option>
              </select>
            </div>
          </div>
        </div>

        {permissionNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> {permissionNotice}
            </span>
            <button onClick={() => setPermissionNotice(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <Brain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{activeAgent.memoriesContributed}</p>
            <p className="text-xs text-slate-500">Memories Proposed</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <Search className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{activeAgent.memoriesRetrieved}</p>
            <p className="text-xs text-slate-500">Retrieval Operations</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <FolderKanban className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">{agentProjects.length}</p>
            <p className="text-xs text-slate-500">Authorized Projects</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-900 mt-1">{new Date(activeAgent.lastActiveAt).toLocaleTimeString()}</p>
            <p className="text-xs text-slate-500">Last Active</p>
          </div>
        </div>

        {/* Granular Project Permissions Matrix */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Project Permissions Matrix</h3>
                <p className="text-xs text-slate-500 mt-0.5">Authorization levels and memory lifecycle governance privileges per project (Persists on refresh)</p>
              </div>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
              Governed by AgentMemory ACL
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Project Workspace</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Access Scope</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Memory Lifecycle Privileges</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Retrieval Limit</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Permission Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agentProjects.map(p => {
                  const currentPerm = agentPerms[p.id] || 'Propose & Read (Default)';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <span className="font-mono text-[11px] text-slate-400">{p.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                          Shared Project + Local Scope
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        Propose candidates, query vectors, trigger validation
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-slate-700">
                        1,000 / min
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={currentPerm}
                          onChange={(e) => handlePermissionChange(activeAgent.id, p.id, p.name, e.target.value)}
                          className="text-xs border border-slate-200 rounded-md px-2.5 py-1 bg-white text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Propose & Read (Default)">Propose & Read (Default)</option>
                          <option value="Full Read / Write">Full Read / Write</option>
                          <option value="Read Only">Read Only</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agent Activity History */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Agent Activity Audit Log</h3>
              <p className="text-xs text-slate-500 mt-0.5">Chronological record of memory submissions and retrieval requests</p>
            </div>
            <span className="text-xs text-slate-400">{agentActivity.length} events</span>
          </div>
          <DataTable
            columns={[
              { key: 'memoryId', header: 'Memory ID', render: (r: ActivityEvent) => <span className="font-mono text-xs font-semibold text-slate-700">{r.memoryId}</span> },
              { key: 'eventType', header: 'Action', render: (r: ActivityEvent) => <StatusBadge status={r.eventType} /> },
              { key: 'projectId', header: 'Target Project', render: (r: ActivityEvent) => <span className="text-xs font-medium text-slate-800">{getProjectName(r.projectId)}</span> },
              { key: 'timestamp', header: 'Timestamp', render: (r: ActivityEvent) => <span className="text-xs text-slate-500">{new Date(r.timestamp).toLocaleString()}</span> },
              { key: 'status', header: 'Outcome', render: (r: ActivityEvent) => <StatusBadge status={r.status} /> },
            ]}
            data={agentActivity}
            keyExtractor={r => r.id}
            emptyMessage="No activity recorded for this agent."
          />
        </div>
      </div>
    );
  }

  // Agent List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registered AI Agents</h1>
          <p className="text-sm text-slate-500 mt-1">
            Agents connected to AgentMemory layer for autonomous memory proposal and semantic retrieval
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium self-start sm:self-auto">
          {agents.length} Registered Agents
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <DataTable
          columns={[
            {
              key: 'name', header: 'Agent', render: (r: Agent) => (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                    <Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{r.type} agent · {r.id}</p>
                  </div>
                </div>
              )
            },
            { key: 'ownerId', header: 'Registered Owner', render: (r: Agent) => <span className="text-xs font-medium text-slate-700">{getUserName(r.ownerId)}</span> },
            {
              key: 'projects', header: 'Associated Projects', render: (r: Agent) => (
                <div className="flex flex-wrap gap-1">
                  {r.projectIds.map(id => (
                    <span key={id} className="bg-slate-100 text-slate-700 border border-slate-200 rounded px-2 py-0.5 text-xs font-medium">
                      {getProjectName(id)}
                    </span>
                  ))}
                </div>
              )
            },
            { key: 'memoriesContributed', header: 'Contributed', render: (r: Agent) => <span className="font-mono text-xs font-semibold text-slate-800">{r.memoriesContributed}</span> },
            { key: 'memoriesRetrieved', header: 'Retrieved', render: (r: Agent) => <span className="font-mono text-xs font-semibold text-slate-800">{r.memoriesRetrieved}</span> },
            { key: 'lastActiveAt', header: 'Last Active', render: (r: Agent) => <span className="text-xs text-slate-500">{new Date(r.lastActiveAt).toLocaleString()}</span> },
            { key: 'connectionStatus', header: 'Connection', render: (r: Agent) => <StatusBadge status={r.connectionStatus} /> },
          ]}
          data={agents}
          keyExtractor={r => r.id}
          onRowClick={(r) => setSelected(r)}
        />
      </div>
    </div>
  );
};

export default AIAgents;

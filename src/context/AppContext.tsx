import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Memory, Agent, Project, User, ActivityEvent, LifecycleEvent,
  ConflictEvent, UserProfileSettings, EmbeddingConfigSettings,
  RankingWeightsSettings, SystemConfigSettings, MemoryType, MemoryStatus
} from '../types';
import {
  mockMemories, mockAgents, mockProjects, mockUsers,
  mockActivityEvents, mockLifecycleEvents, mockConflictEvents
} from '../data/mockData';

// LocalStorage Keys
const STORAGE_KEYS = {
  MEMORIES: 'agentmemory_memories',
  AGENTS: 'agentmemory_agents',
  PROJECTS: 'agentmemory_projects',
  USERS: 'agentmemory_users',
  ACTIVITY: 'agentmemory_activity',
  LIFECYCLE: 'agentmemory_lifecycle',
  CONFLICTS: 'agentmemory_conflicts',
  PROFILE: 'agentmemory_profile',
  PROJECT_PERMS: 'agentmemory_project_perms',
  AGENT_ACCESS: 'agentmemory_agent_access',
  AGENT_PROJECT_PERMS: 'agentmemory_agent_project_perms',
  EMBEDDING: 'agentmemory_embedding',
  RANKING: 'agentmemory_ranking_weights',
  SYSTEM: 'agentmemory_system_config',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to parse localStorage key ${key}`, err);
    return fallback;
  }
}

function saveStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save to localStorage key ${key}`, err);
  }
}

interface AppContextType {
  memories: Memory[];
  agents: Agent[];
  projects: Project[];
  users: User[];
  activityEvents: ActivityEvent[];
  lifecycleEvents: LifecycleEvent[];
  conflictEvents: ConflictEvent[];

  // Settings State
  userProfile: UserProfileSettings;
  projectPermissions: Record<string, string>;
  agentAccess: Record<string, string>;
  agentProjectPermissions: Record<string, Record<string, string>>;
  embeddingConfig: EmbeddingConfigSettings;
  rankingWeights: RankingWeightsSettings;
  systemConfig: SystemConfigSettings;

  // Actions
  addMemory: (memory: Partial<Memory>) => Memory;
  updateMemory: (id: string, patch: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  validateMemory: (id: string) => void;
  decayMemory: (id: string) => void;

  updateAgent: (id: string, patch: Partial<Agent>) => void;
  updateAgentConnection: (id: string, status: 'connected' | 'disconnected' | 'error') => void;
  updateAgentProjectPermission: (agentId: string, projectId: string, permission: string) => void;

  updateProject: (id: string, patch: Partial<Project>) => void;
  updateProjectMemberRole: (projectId: string, userId: string, role: 'admin' | 'editor' | 'viewer') => void;

  resolveConflict: (conflictId: string, resolution: 'merged' | 'kept_a' | 'kept_b') => void;

  updateUserProfile: (profile: Partial<UserProfileSettings>) => void;
  updateProjectPermissionSetting: (projectId: string, role: string) => void;
  updateAgentAccessSetting: (agentId: string, access: string) => void;
  updateEmbeddingConfig: (config: Partial<EmbeddingConfigSettings>) => void;
  updateRankingWeights: (weights: RankingWeightsSettings) => void;
  updateSystemConfig: (config: Partial<SystemConfigSettings>) => void;

  resetAllToDefaults: () => void;

  // Lookups
  getUserName: (id: string) => string;
  getAgentName: (id: string) => string;
  getProjectName: (id: string) => string;
}

const defaultUserProfile: UserProfileSettings = {
  name: 'Shreya Patel',
  email: 'shreya@agentmemory.dev',
  role: 'admin',
};

const defaultProjectPermissions: Record<string, string> = {
  'p-1': 'admin',
  'p-2': 'editor',
  'p-3': 'admin',
};

const defaultAgentAccess: Record<string, string> = {
  'a-1': 'readwrite',
  'a-2': 'readwrite',
  'a-3': 'readonly',
  'a-4': 'readwrite',
  'a-5': 'disabled',
};

const defaultAgentProjectPermissions: Record<string, Record<string, string>> = {
  'a-1': { 'p-1': 'Full Read / Write', 'p-2': 'Full Read / Write' },
  'a-2': { 'p-1': 'Propose & Read (Default)', 'p-3': 'Propose & Read (Default)' },
  'a-3': { 'p-2': 'Read Only' },
  'a-4': { 'p-3': 'Full Read / Write' },
  'a-5': { 'p-1': 'Read Only', 'p-2': 'Read Only', 'p-3': 'Read Only' },
};

const defaultEmbeddingConfig: EmbeddingConfigSettings = {
  model: 'text-embedding-3-small',
  indexType: 'hnsw',
  metric: 'dot',
  chunkSize: 512,
};

const defaultRankingWeights: RankingWeightsSettings = {
  semanticSimilarity: 40,
  importance: 20,
  confidence: 15,
  recency: 15,
  accessFrequency: 10,
};

const defaultSystemConfig: SystemConfigSettings = {
  apiUrl: 'http://localhost:8000/v1',
  mcpUrl: 'http://localhost:8001',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Domain Data States
  const [memories, setMemories] = useState<Memory[]>(() =>
    loadStored(STORAGE_KEYS.MEMORIES, mockMemories)
  );
  const [agents, setAgents] = useState<Agent[]>(() =>
    loadStored(STORAGE_KEYS.AGENTS, mockAgents)
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    loadStored(STORAGE_KEYS.PROJECTS, mockProjects)
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadStored(STORAGE_KEYS.USERS, mockUsers)
  );
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(() =>
    loadStored(STORAGE_KEYS.ACTIVITY, mockActivityEvents)
  );
  const [lifecycleEvents, setLifecycleEvents] = useState<LifecycleEvent[]>(() =>
    loadStored(STORAGE_KEYS.LIFECYCLE, mockLifecycleEvents)
  );
  const [conflictEvents, setConflictEvents] = useState<ConflictEvent[]>(() =>
    loadStored(STORAGE_KEYS.CONFLICTS, mockConflictEvents)
  );

  // Settings States
  const [userProfile, setUserProfile] = useState<UserProfileSettings>(() =>
    loadStored(STORAGE_KEYS.PROFILE, defaultUserProfile)
  );
  const [projectPermissions, setProjectPermissions] = useState<Record<string, string>>(() =>
    loadStored(STORAGE_KEYS.PROJECT_PERMS, defaultProjectPermissions)
  );
  const [agentAccess, setAgentAccess] = useState<Record<string, string>>(() =>
    loadStored(STORAGE_KEYS.AGENT_ACCESS, defaultAgentAccess)
  );
  const [agentProjectPermissions, setAgentProjectPermissions] = useState<Record<string, Record<string, string>>>(() =>
    loadStored(STORAGE_KEYS.AGENT_PROJECT_PERMS, defaultAgentProjectPermissions)
  );
  const [embeddingConfig, setEmbeddingConfig] = useState<EmbeddingConfigSettings>(() =>
    loadStored(STORAGE_KEYS.EMBEDDING, defaultEmbeddingConfig)
  );
  const [rankingWeights, setRankingWeights] = useState<RankingWeightsSettings>(() =>
    loadStored(STORAGE_KEYS.RANKING, defaultRankingWeights)
  );
  const [systemConfig, setSystemConfig] = useState<SystemConfigSettings>(() =>
    loadStored(STORAGE_KEYS.SYSTEM, defaultSystemConfig)
  );

  // Sync to localStorage
  useEffect(() => { saveStored(STORAGE_KEYS.MEMORIES, memories); }, [memories]);
  useEffect(() => { saveStored(STORAGE_KEYS.AGENTS, agents); }, [agents]);
  useEffect(() => { saveStored(STORAGE_KEYS.PROJECTS, projects); }, [projects]);
  useEffect(() => { saveStored(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => { saveStored(STORAGE_KEYS.ACTIVITY, activityEvents); }, [activityEvents]);
  useEffect(() => { saveStored(STORAGE_KEYS.LIFECYCLE, lifecycleEvents); }, [lifecycleEvents]);
  useEffect(() => { saveStored(STORAGE_KEYS.CONFLICTS, conflictEvents); }, [conflictEvents]);
  useEffect(() => { saveStored(STORAGE_KEYS.PROFILE, userProfile); }, [userProfile]);
  useEffect(() => { saveStored(STORAGE_KEYS.PROJECT_PERMS, projectPermissions); }, [projectPermissions]);
  useEffect(() => { saveStored(STORAGE_KEYS.AGENT_ACCESS, agentAccess); }, [agentAccess]);
  useEffect(() => { saveStored(STORAGE_KEYS.AGENT_PROJECT_PERMS, agentProjectPermissions); }, [agentProjectPermissions]);
  useEffect(() => { saveStored(STORAGE_KEYS.EMBEDDING, embeddingConfig); }, [embeddingConfig]);
  useEffect(() => { saveStored(STORAGE_KEYS.RANKING, rankingWeights); }, [rankingWeights]);
  useEffect(() => { saveStored(STORAGE_KEYS.SYSTEM, systemConfig); }, [systemConfig]);

  // Lookup helpers
  const getUserName = (id: string): string => {
    return users.find(u => u.id === id)?.name || id;
  };
  const getAgentName = (id: string): string => {
    return agents.find(a => a.id === id)?.name || id;
  };
  const getProjectName = (id: string): string => {
    return projects.find(p => p.id === id)?.name || id;
  };

  // Memory Actions
  const addMemory = (memory: Partial<Memory>): Memory => {
    const newId = `mem-${String(memories.length + 1).padStart(3, '0')}`;
    const newMemory: Memory = {
      id: newId,
      content: memory.content || '',
      type: (memory.type as MemoryType) || 'factual',
      importance: memory.importance ?? 0.88,
      confidence: memory.confidence ?? 0.92,
      status: (memory.status as MemoryStatus) || 'candidate',
      projectId: memory.projectId || 'p-1',
      agentId: memory.agentId || 'a-1',
      userId: memory.userId || 'u-1',
      tags: memory.tags || ['proposed'],
      embeddingModel: embeddingConfig.model,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      accessCount: 1,
      version: 1,
      metadata: memory.metadata || {},
    };

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      memoryId: newId,
      eventType: 'created',
      agentId: newMemory.agentId,
      projectId: newMemory.projectId,
      timestamp: new Date().toISOString(),
      status: 'success',
    };

    const newLifecycle: LifecycleEvent = {
      id: `le-${Date.now()}`,
      memoryId: newId,
      fromStatus: 'candidate',
      toStatus: 'candidate',
      reason: 'Agent proposed memory. Awaiting governance validation.',
      triggeredBy: newMemory.agentId,
      timestamp: new Date().toISOString(),
    };

    setMemories(prev => [newMemory, ...prev]);
    setActivityEvents(prev => [newActivity, ...prev]);
    setLifecycleEvents(prev => [newLifecycle, ...prev]);

    // Update project memory count
    setProjects(prev => prev.map(p =>
      p.id === newMemory.projectId ? { ...p, memoryCount: p.memoryCount + 1 } : p
    ));

    // Update agent contributed count
    setAgents(prev => prev.map(a =>
      a.id === newMemory.agentId ? { ...a, memoriesContributed: a.memoriesContributed + 1 } : a
    ));

    return newMemory;
  };

  const updateMemory = (id: string, patch: Partial<Memory>) => {
    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          ...patch,
          updatedAt: new Date().toISOString(),
          version: patch.content && patch.content !== m.content ? m.version + 1 : m.version,
        };
      }
      return m;
    }));

    setActivityEvents(prev => [{
      id: `act-${Date.now()}`,
      memoryId: id,
      eventType: 'updated',
      agentId: 'a-1',
      projectId: 'p-1',
      timestamp: new Date().toISOString(),
      status: 'success',
    }, ...prev]);
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, status: 'deleted' as MemoryStatus } : m));
    setActivityEvents(prev => [{
      id: `act-${Date.now()}`,
      memoryId: id,
      eventType: 'deleted',
      agentId: 'system',
      projectId: 'p-1',
      timestamp: new Date().toISOString(),
      status: 'success',
    }, ...prev]);
  };

  const validateMemory = (id: string) => {
    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: 'validated' as MemoryStatus, confidence: Math.min(1.0, m.confidence + 0.05) };
      }
      return m;
    }));

    setLifecycleEvents(prev => [{
      id: `le-${Date.now()}`,
      memoryId: id,
      fromStatus: 'candidate',
      toStatus: 'validated',
      reason: 'AgentMemory validation passed: schema verified, duplicate bounds checked.',
      triggeredBy: 'system',
      timestamp: new Date().toISOString(),
    }, ...prev]);
  };

  const decayMemory = (id: string) => {
    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: 'decayed' as MemoryStatus, importance: Math.max(0.1, Number((m.importance * 0.7).toFixed(2))) };
      }
      return m;
    }));

    setLifecycleEvents(prev => [{
      id: `le-${Date.now()}`,
      memoryId: id,
      fromStatus: 'active',
      toStatus: 'decayed',
      reason: 'Memory decayed due to inactivity / manual governance trigger.',
      triggeredBy: 'system',
      timestamp: new Date().toISOString(),
    }, ...prev]);
  };

  // Agent Actions
  const updateAgent = (id: string, patch: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  };

  const updateAgentConnection = (id: string, status: 'connected' | 'disconnected' | 'error') => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, connectionStatus: status } : a));
  };

  const updateAgentProjectPermission = (agentId: string, projectId: string, permission: string) => {
    setAgentProjectPermissions(prev => ({
      ...prev,
      [agentId]: {
        ...(prev[agentId] || {}),
        [projectId]: permission,
      },
    }));
  };

  // Project Actions
  const updateProject = (id: string, patch: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p));
  };

  const updateProjectMemberRole = (projectId: string, userId: string, role: 'admin' | 'editor' | 'viewer') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    setProjectPermissions(prev => ({ ...prev, [projectId]: role }));
  };

  // Conflict Action
  const resolveConflict = (conflictId: string, resolution: 'merged' | 'kept_a' | 'kept_b') => {
    setConflictEvents(prev => prev.map(c =>
      c.id === conflictId
        ? { ...c, resolution, resolvedAt: new Date().toISOString(), resolvedBy: 'u-1' }
        : c
    ));
  };

  // Settings Actions
  const updateUserProfile = (profile: Partial<UserProfileSettings>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    // Also update users[0]
    setUsers(prev => prev.map((u, i) => i === 0 ? { ...u, ...profile } : u));
  };

  const updateProjectPermissionSetting = (projectId: string, role: string) => {
    setProjectPermissions(prev => ({ ...prev, [projectId]: role }));
  };

  const updateAgentAccessSetting = (agentId: string, access: string) => {
    setAgentAccess(prev => ({ ...prev, [agentId]: access }));
    // Also update connection status if disabled
    if (access === 'disabled') {
      updateAgentConnection(agentId, 'disconnected');
    } else {
      updateAgentConnection(agentId, 'connected');
    }
  };

  const updateEmbeddingConfig = (config: Partial<EmbeddingConfigSettings>) => {
    setEmbeddingConfig(prev => ({ ...prev, ...config }));
  };

  const updateRankingWeights = (weights: RankingWeightsSettings) => {
    setRankingWeights(weights);
  };

  const updateSystemConfig = (config: Partial<SystemConfigSettings>) => {
    setSystemConfig(prev => ({ ...prev, ...config }));
  };

  // Reset to initial defaults
  const resetAllToDefaults = () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    setMemories(mockMemories);
    setAgents(mockAgents);
    setProjects(mockProjects);
    setUsers(mockUsers);
    setActivityEvents(mockActivityEvents);
    setLifecycleEvents(mockLifecycleEvents);
    setConflictEvents(mockConflictEvents);
    setUserProfile(defaultUserProfile);
    setProjectPermissions(defaultProjectPermissions);
    setAgentAccess(defaultAgentAccess);
    setAgentProjectPermissions(defaultAgentProjectPermissions);
    setEmbeddingConfig(defaultEmbeddingConfig);
    setRankingWeights(defaultRankingWeights);
    setSystemConfig(defaultSystemConfig);
  };

  return (
    <AppContext.Provider
      value={{
        memories,
        agents,
        projects,
        users,
        activityEvents,
        lifecycleEvents,
        conflictEvents,

        userProfile,
        projectPermissions,
        agentAccess,
        agentProjectPermissions,
        embeddingConfig,
        rankingWeights,
        systemConfig,

        addMemory,
        updateMemory,
        deleteMemory,
        validateMemory,
        decayMemory,

        updateAgent,
        updateAgentConnection,
        updateAgentProjectPermission,

        updateProject,
        updateProjectMemberRole,

        resolveConflict,

        updateUserProfile,
        updateProjectPermissionSetting,
        updateAgentAccessSetting,
        updateEmbeddingConfig,
        updateRankingWeights,
        updateSystemConfig,

        resetAllToDefaults,

        getUserName,
        getAgentName,
        getProjectName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};


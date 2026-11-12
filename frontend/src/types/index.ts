// ── Core Domain Types for AgentMemory ──

export type MemoryType = 'factual' | 'procedural' | 'episodic' | 'semantic' | 'contextual';

export type MemoryStatus =
  | 'candidate'
  | 'validated'
  | 'active'
  | 'updated'
  | 'superseded'
  | 'consolidated'
  | 'decayed'
  | 'deleted';

export type ImportanceLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Memory {
  id: string;
  content: string;
  type: MemoryType;
  importance: number;       // 0–1
  confidence: number;       // 0–1
  status: MemoryStatus;
  projectId: string;
  agentId: string;
  userId: string;
  tags: string[];
  embedding?: number[];
  embeddingModel?: string;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  accessCount: number;
  version: number;
  previousVersionId?: string;
  metadata: Record<string, unknown>;
}

export interface MemoryVersion {
  id: string;
  memoryId: string;
  version: number;
  content: string;
  importance: number;
  confidence: number;
  status: MemoryStatus;
  changedBy: string;
  changedAt: string;
  changeReason: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'coding' | 'research' | 'writing' | 'analysis' | 'general';
  ownerId: string;
  projectIds: string[];
  lastActiveAt: string;
  memoriesContributed: number;
  memoriesRetrieved: number;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  createdAt: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  agentIds: string[];
  memoryCount: number;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface RetrievalTrace {
  id: string;
  queryText: string;
  queryEmbedding?: number[];
  candidateCount: number;
  selectedMemoryIds: string[];
  scores: RetrievalScore[];
  latencyMs: number;
  agentId: string;
  projectId: string;
  timestamp: string;
}

export interface RetrievalScore {
  memoryId: string;
  semanticSimilarity: number;
  importanceScore: number;
  confidenceScore: number;
  recencyScore: number;
  accessFrequency: number;
  finalScore: number;
}

export interface LifecycleEvent {
  id: string;
  memoryId: string;
  fromStatus: MemoryStatus;
  toStatus: MemoryStatus;
  reason: string;
  triggeredBy: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SystemHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  lastChecked: string;
  details?: string;
}

export interface ActivityEvent {
  id: string;
  memoryId: string;
  eventType: 'created' | 'retrieved' | 'updated' | 'superseded' | 'consolidated' | 'decayed' | 'deleted';
  agentId: string;
  projectId: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
}

export interface DashboardStats {
  totalMemories: number;
  activeMemories: number;
  registeredAgents: number;
  activeProjects: number;
  totalRetrievals: number;
  supersededMemories: number;
}

export interface AnalyticsData {
  memoryGrowth: { date: string; count: number }[];
  retrievalFrequency: { date: string; count: number }[];
  avgLatency: { date: string; latency: number }[];
  typeDistribution: { type: string; count: number }[];
  importanceDistribution: { range: string; count: number }[];
  confidenceDistribution: { range: string; count: number }[];
  duplicateStats: { date: string; detected: number; resolved: number }[];
  consolidationStats: { date: string; consolidated: number }[];
  precisionAtK: { k: number; precision: number }[];
  recallAtK: { k: number; recall: number }[];
  mrr: number;
}

export interface SearchResult {
  memory: Memory;
  semanticSimilarity: number;
  importanceScore: number;
  confidenceScore: number;
  recencyScore: number;
  accessFrequency: number;
  finalScore: number;
}

export interface ConflictEvent {
  id: string;
  memoryIdA: string;
  memoryIdB: string;
  conflictType: 'contradictory' | 'overlapping' | 'outdated';
  resolution: 'merged' | 'kept_a' | 'kept_b' | 'pending';
  resolvedAt?: string;
  resolvedBy?: string;
  timestamp: string;
}

export interface ConsolidationEvent {
  id: string;
  sourceMemoryIds: string[];
  resultMemoryId: string;
  reason: string;
  timestamp: string;
}

export interface DecayEvent {
  id: string;
  memoryId: string;
  previousImportance: number;
  newImportance: number;
  reason: string;
  timestamp: string;
}

export interface UserProfileSettings {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface EmbeddingConfigSettings {
  model: string;
  indexType: string;
  metric: string;
  chunkSize: number;
}

export interface RankingWeightsSettings {
  semanticSimilarity: number;
  importance: number;
  confidence: number;
  recency: number;
  accessFrequency: number;
}

export interface SystemConfigSettings {
  apiUrl: string;
  mcpUrl: string;
}



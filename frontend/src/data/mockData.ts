import type {
  Memory, User, Agent, Project, RetrievalTrace, LifecycleEvent,
  SystemHealth, ActivityEvent, DashboardStats, AnalyticsData,
  MemoryVersion, SearchResult, ConflictEvent, ConsolidationEvent, DecayEvent,
} from '../types';

// ── Users ──
export const mockUsers: User[] = [
  { id: 'u-1', name: 'Shreya Patel', email: 'shreya@agentmemory.dev', role: 'admin', createdAt: '2026-08-01T09:00:00Z', lastActiveAt: '2026-11-12T06:30:00Z' },
  { id: 'u-2', name: 'Arjun Mehta', email: 'arjun@agentmemory.dev', role: 'editor', createdAt: '2026-08-10T10:00:00Z', lastActiveAt: '2026-11-11T14:00:00Z' },
  { id: 'u-3', name: 'Kavya Sharma', email: 'kavya@agentmemory.dev', role: 'editor', createdAt: '2026-09-01T08:00:00Z', lastActiveAt: '2026-11-10T11:00:00Z' },
  { id: 'u-4', name: 'Rohan Gupta', email: 'rohan@agentmemory.dev', role: 'viewer', createdAt: '2026-09-15T12:00:00Z', lastActiveAt: '2026-11-09T16:00:00Z' },
];

// ── Agents ──
export const mockAgents: Agent[] = [
  { id: 'a-1', name: 'CodeAssist', type: 'coding', ownerId: 'u-1', projectIds: ['p-1', 'p-2'], lastActiveAt: '2026-11-12T06:25:00Z', memoriesContributed: 128, memoriesRetrieved: 342, connectionStatus: 'connected', createdAt: '2026-08-05T09:00:00Z', description: 'AI coding assistant for development workflows' },
  { id: 'a-2', name: 'ResearchBot', type: 'research', ownerId: 'u-2', projectIds: ['p-1', 'p-3'], lastActiveAt: '2026-11-12T05:50:00Z', memoriesContributed: 95, memoriesRetrieved: 267, connectionStatus: 'connected', createdAt: '2026-08-12T10:00:00Z', description: 'Literature and data research agent' },
  { id: 'a-3', name: 'DocWriter', type: 'writing', ownerId: 'u-1', projectIds: ['p-2'], lastActiveAt: '2026-11-11T18:00:00Z', memoriesContributed: 64, memoriesRetrieved: 189, connectionStatus: 'disconnected', createdAt: '2026-09-01T08:00:00Z', description: 'Technical documentation writer' },
  { id: 'a-4', name: 'AnalyticsAgent', type: 'analysis', ownerId: 'u-3', projectIds: ['p-3'], lastActiveAt: '2026-11-12T04:30:00Z', memoriesContributed: 47, memoriesRetrieved: 156, connectionStatus: 'connected', createdAt: '2026-09-20T14:00:00Z', description: 'Data analytics and reporting agent' },
  { id: 'a-5', name: 'GeneralHelper', type: 'general', ownerId: 'u-2', projectIds: ['p-1', 'p-2', 'p-3'], lastActiveAt: '2026-11-10T22:00:00Z', memoriesContributed: 33, memoriesRetrieved: 98, connectionStatus: 'error', createdAt: '2026-10-01T11:00:00Z', description: 'General-purpose assistant agent' },
];

// ── Projects ──
export const mockProjects: Project[] = [
  { id: 'p-1', name: 'ResearchGraph', description: 'Knowledge graph construction from research papers using PostgreSQL with pgvector for semantic search.', ownerId: 'u-1', memberIds: ['u-1', 'u-2', 'u-3'], agentIds: ['a-1', 'a-2', 'a-5'], memoryCount: 187, status: 'active', createdAt: '2026-08-05T09:00:00Z', updatedAt: '2026-11-12T06:00:00Z' },
  { id: 'p-2', name: 'APIForge', description: 'REST API generation platform with automated documentation and testing.', ownerId: 'u-2', memberIds: ['u-1', 'u-2'], agentIds: ['a-1', 'a-3', 'a-5'], memoryCount: 124, status: 'active', createdAt: '2026-09-01T10:00:00Z', updatedAt: '2026-11-11T15:00:00Z' },
  { id: 'p-3', name: 'DataPulse', description: 'Real-time data pipeline monitoring and anomaly detection system.', ownerId: 'u-3', memberIds: ['u-2', 'u-3', 'u-4'], agentIds: ['a-2', 'a-4', 'a-5'], memoryCount: 93, status: 'active', createdAt: '2026-09-20T14:00:00Z', updatedAt: '2026-11-10T12:00:00Z' },
];

// ── Memories ──
export const mockMemories: Memory[] = [
  { id: 'mem-001', content: 'ResearchGraph uses PostgreSQL with pgvector extension for vector similarity search on research paper embeddings.', type: 'factual', importance: 0.92, confidence: 0.95, status: 'active', projectId: 'p-1', agentId: 'a-1', userId: 'u-1', tags: ['database', 'postgresql', 'pgvector', 'embeddings'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-08-10T09:00:00Z', updatedAt: '2026-10-15T14:00:00Z', lastAccessedAt: '2026-11-12T06:00:00Z', accessCount: 47, version: 2, metadata: {} },
  { id: 'mem-002', content: 'The API authentication flow uses JWT tokens with RS256 signing algorithm and 15-minute expiry for access tokens.', type: 'procedural', importance: 0.88, confidence: 0.90, status: 'active', projectId: 'p-2', agentId: 'a-1', userId: 'u-2', tags: ['authentication', 'jwt', 'security', 'api'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-09-05T11:00:00Z', updatedAt: '2026-09-05T11:00:00Z', lastAccessedAt: '2026-11-11T18:00:00Z', accessCount: 32, version: 1, metadata: {} },
  { id: 'mem-003', content: 'DataPulse anomaly detection uses Isolation Forest algorithm with a contamination factor of 0.05 for real-time stream analysis.', type: 'factual', importance: 0.85, confidence: 0.88, status: 'active', projectId: 'p-3', agentId: 'a-4', userId: 'u-3', tags: ['anomaly-detection', 'ml', 'isolation-forest', 'streaming'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-09-25T14:00:00Z', updatedAt: '2026-10-20T10:00:00Z', lastAccessedAt: '2026-11-10T11:00:00Z', accessCount: 24, version: 1, metadata: {} },
  { id: 'mem-004', content: 'The ResearchGraph paper ingestion pipeline follows: PDF upload → text extraction (PyMuPDF) → chunk splitting (512 tokens) → embedding generation → pgvector storage.', type: 'procedural', importance: 0.90, confidence: 0.93, status: 'active', projectId: 'p-1', agentId: 'a-2', userId: 'u-1', tags: ['pipeline', 'ingestion', 'pdf', 'chunking'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-08-15T10:00:00Z', updatedAt: '2026-11-01T09:00:00Z', lastAccessedAt: '2026-11-12T05:50:00Z', accessCount: 38, version: 3, metadata: {} },
  { id: 'mem-005', content: 'APIForge generates OpenAPI 3.1 specification files from annotated Python function signatures using AST parsing.', type: 'factual', importance: 0.82, confidence: 0.87, status: 'active', projectId: 'p-2', agentId: 'a-3', userId: 'u-2', tags: ['openapi', 'codegen', 'python', 'ast'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-09-10T13:00:00Z', updatedAt: '2026-09-10T13:00:00Z', lastAccessedAt: '2026-11-09T16:00:00Z', accessCount: 19, version: 1, metadata: {} },
  { id: 'mem-006', content: 'The MongoDB instance stores unstructured metadata and agent interaction logs with TTL indexes set to 90 days.', type: 'factual', importance: 0.78, confidence: 0.85, status: 'active', projectId: 'p-1', agentId: 'a-1', userId: 'u-1', tags: ['mongodb', 'metadata', 'logging', 'ttl'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-08-20T15:00:00Z', updatedAt: '2026-08-20T15:00:00Z', lastAccessedAt: '2026-11-08T12:00:00Z', accessCount: 15, version: 1, metadata: {} },
  { id: 'mem-007', content: 'DataPulse Kafka consumer group uses exactly-once semantics with idempotent producers and transactional reads.', type: 'procedural', importance: 0.86, confidence: 0.91, status: 'active', projectId: 'p-3', agentId: 'a-2', userId: 'u-3', tags: ['kafka', 'streaming', 'exactly-once', 'consumer-group'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-10-01T09:00:00Z', updatedAt: '2026-10-01T09:00:00Z', lastAccessedAt: '2026-11-10T08:00:00Z', accessCount: 21, version: 1, metadata: {} },
  { id: 'mem-008', content: 'ResearchGraph citation network visualization uses D3.js force-directed layout with collision detection for up to 10,000 nodes.', type: 'factual', importance: 0.75, confidence: 0.82, status: 'active', projectId: 'p-1', agentId: 'a-1', userId: 'u-2', tags: ['visualization', 'd3', 'graph', 'citation-network'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-09-12T11:00:00Z', updatedAt: '2026-09-12T11:00:00Z', lastAccessedAt: '2026-11-07T15:00:00Z', accessCount: 12, version: 1, metadata: {} },
  { id: 'mem-009', content: 'APIForge rate limiting is implemented using Redis sliding window with 100 requests per minute per API key.', type: 'factual', importance: 0.80, confidence: 0.88, status: 'superseded', projectId: 'p-2', agentId: 'a-1', userId: 'u-2', tags: ['rate-limiting', 'redis', 'api', 'throttling'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-09-08T16:00:00Z', updatedAt: '2026-10-25T10:00:00Z', lastAccessedAt: '2026-10-25T10:00:00Z', accessCount: 28, version: 1, previousVersionId: undefined, metadata: {} },
  { id: 'mem-010', content: 'APIForge rate limiting upgraded to token bucket algorithm with 200 requests per minute per API key and burst capacity of 50.', type: 'factual', importance: 0.84, confidence: 0.92, status: 'active', projectId: 'p-2', agentId: 'a-1', userId: 'u-2', tags: ['rate-limiting', 'token-bucket', 'api', 'throttling'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-10-25T10:00:00Z', updatedAt: '2026-10-25T10:00:00Z', lastAccessedAt: '2026-11-11T14:00:00Z', accessCount: 14, version: 1, previousVersionId: 'mem-009', metadata: {} },
  { id: 'mem-011', content: 'The embedding dimension for text-embedding-3-small is 1536, stored as vector type in pgvector with HNSW index for approximate nearest neighbor search.', type: 'factual', importance: 0.87, confidence: 0.94, status: 'active', projectId: 'p-1', agentId: 'a-2', userId: 'u-1', tags: ['embeddings', 'pgvector', 'hnsw', 'vector-search'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-08-18T10:00:00Z', updatedAt: '2026-08-18T10:00:00Z', lastAccessedAt: '2026-11-12T06:20:00Z', accessCount: 41, version: 1, metadata: {} },
  { id: 'mem-012', content: 'DataPulse dashboard refresh interval is 5 seconds for critical metrics and 30 seconds for non-critical panels.', type: 'contextual', importance: 0.65, confidence: 0.80, status: 'active', projectId: 'p-3', agentId: 'a-4', userId: 'u-3', tags: ['dashboard', 'refresh', 'monitoring', 'metrics'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-10-05T08:00:00Z', updatedAt: '2026-10-05T08:00:00Z', lastAccessedAt: '2026-11-09T09:00:00Z', accessCount: 8, version: 1, metadata: {} },
  { id: 'mem-013', content: 'Team standup meetings are held every weekday at 10:00 AM IST via Google Meet.', type: 'episodic', importance: 0.45, confidence: 0.95, status: 'decayed', projectId: 'p-1', agentId: 'a-5', userId: 'u-2', tags: ['meetings', 'standup', 'schedule'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-08-06T10:00:00Z', updatedAt: '2026-08-06T10:00:00Z', lastAccessedAt: '2026-09-15T10:00:00Z', accessCount: 3, version: 1, metadata: {} },
  { id: 'mem-014', content: 'ResearchGraph search relevance improved by 23% after switching from cosine to dot-product similarity with normalized embeddings.', type: 'episodic', importance: 0.83, confidence: 0.89, status: 'active', projectId: 'p-1', agentId: 'a-2', userId: 'u-1', tags: ['search', 'similarity', 'improvement', 'benchmarks'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-10-10T16:00:00Z', updatedAt: '2026-10-10T16:00:00Z', lastAccessedAt: '2026-11-11T10:00:00Z', accessCount: 17, version: 1, metadata: {} },
  { id: 'mem-015', content: 'Memory consolidation policy: memories accessed fewer than 3 times in 60 days with importance below 0.5 are candidates for decay.', type: 'procedural', importance: 0.91, confidence: 0.96, status: 'active', projectId: 'p-1', agentId: 'a-1', userId: 'u-1', tags: ['policy', 'consolidation', 'decay', 'lifecycle'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-08-25T09:00:00Z', updatedAt: '2026-10-30T11:00:00Z', lastAccessedAt: '2026-11-12T06:10:00Z', accessCount: 35, version: 2, metadata: {} },
  { id: 'mem-016', content: 'APIForge test coverage target is 85% for unit tests and 70% for integration tests, enforced via CI pipeline.', type: 'procedural', importance: 0.76, confidence: 0.90, status: 'active', projectId: 'p-2', agentId: 'a-3', userId: 'u-2', tags: ['testing', 'coverage', 'ci', 'quality'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-09-15T14:00:00Z', updatedAt: '2026-09-15T14:00:00Z', lastAccessedAt: '2026-11-08T17:00:00Z', accessCount: 11, version: 1, metadata: {} },
  { id: 'mem-017', content: 'Duplicate detection uses MinHash with 128 permutations and Jaccard threshold of 0.85 for near-duplicate identification.', type: 'procedural', importance: 0.88, confidence: 0.92, status: 'active', projectId: 'p-1', agentId: 'a-1', userId: 'u-1', tags: ['deduplication', 'minhash', 'jaccard', 'similarity'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-09-02T10:00:00Z', updatedAt: '2026-09-02T10:00:00Z', lastAccessedAt: '2026-11-11T09:00:00Z', accessCount: 22, version: 1, metadata: {} },
  { id: 'mem-018', content: 'DataPulse alert routing uses PagerDuty integration with severity-based escalation: P1 within 5 min, P2 within 15 min, P3 within 1 hour.', type: 'procedural', importance: 0.79, confidence: 0.86, status: 'active', projectId: 'p-3', agentId: 'a-4', userId: 'u-3', tags: ['alerting', 'pagerduty', 'escalation', 'monitoring'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-10-08T13:00:00Z', updatedAt: '2026-10-08T13:00:00Z', lastAccessedAt: '2026-11-10T07:00:00Z', accessCount: 9, version: 1, metadata: {} },
  { id: 'mem-019', content: 'ResearchGraph supports batch embedding generation with a maximum batch size of 2048 texts per API call to the embedding service.', type: 'factual', importance: 0.72, confidence: 0.85, status: 'active', projectId: 'p-1', agentId: 'a-2', userId: 'u-1', tags: ['batch', 'embeddings', 'api', 'performance'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-09-18T11:00:00Z', updatedAt: '2026-09-18T11:00:00Z', lastAccessedAt: '2026-11-06T14:00:00Z', accessCount: 7, version: 1, metadata: {} },
  { id: 'mem-020', content: 'The MCP (Model Context Protocol) server exposes memory operations as tool calls for compatible AI agents to interact with AgentMemory.', type: 'factual', importance: 0.93, confidence: 0.97, status: 'active', projectId: 'p-1', agentId: 'a-1', userId: 'u-1', tags: ['mcp', 'protocol', 'integration', 'agents'], embeddingModel: 'text-embedding-3-small', createdAt: '2026-08-08T09:00:00Z', updatedAt: '2026-11-05T10:00:00Z', lastAccessedAt: '2026-11-12T06:30:00Z', accessCount: 52, version: 3, metadata: {} },
];

// ── Dashboard Stats ──
export const mockDashboardStats: DashboardStats = {
  totalMemories: 404,
  activeMemories: 347,
  registeredAgents: 5,
  activeProjects: 3,
  totalRetrievals: 1052,
  supersededMemories: 23,
};

// ── System Health ──
export const mockSystemHealth: SystemHealth[] = [
  { service: 'PostgreSQL', status: 'healthy', latencyMs: 3, lastChecked: '2026-11-12T06:30:00Z', details: 'v16.1 – pgvector 0.7.0' },
  { service: 'pgvector', status: 'healthy', latencyMs: 5, lastChecked: '2026-11-12T06:30:00Z', details: 'HNSW index active' },
  { service: 'MongoDB', status: 'healthy', latencyMs: 4, lastChecked: '2026-11-12T06:30:00Z', details: 'v7.0 – replica set' },
  { service: 'REST API', status: 'healthy', latencyMs: 12, lastChecked: '2026-11-12T06:30:00Z', details: 'v1.2.0' },
  { service: 'MCP Server', status: 'healthy', latencyMs: 8, lastChecked: '2026-11-12T06:30:00Z', details: 'Protocol v1.0' },
];

// ── Activity Events ──
export const mockActivityEvents: ActivityEvent[] = [
  { id: 'act-1', memoryId: 'mem-020', eventType: 'retrieved', agentId: 'a-1', projectId: 'p-1', timestamp: '2026-11-12T06:30:00Z', status: 'success' },
  { id: 'act-2', memoryId: 'mem-011', eventType: 'retrieved', agentId: 'a-2', projectId: 'p-1', timestamp: '2026-11-12T06:20:00Z', status: 'success' },
  { id: 'act-3', memoryId: 'mem-015', eventType: 'updated', agentId: 'a-1', projectId: 'p-1', timestamp: '2026-11-12T06:10:00Z', status: 'success' },
  { id: 'act-4', memoryId: 'mem-001', eventType: 'retrieved', agentId: 'a-2', projectId: 'p-1', timestamp: '2026-11-12T06:00:00Z', status: 'success' },
  { id: 'act-5', memoryId: 'mem-004', eventType: 'retrieved', agentId: 'a-2', projectId: 'p-1', timestamp: '2026-11-12T05:50:00Z', status: 'success' },
  { id: 'act-6', memoryId: 'mem-010', eventType: 'created', agentId: 'a-1', projectId: 'p-2', timestamp: '2026-10-25T10:00:00Z', status: 'success' },
  { id: 'act-7', memoryId: 'mem-009', eventType: 'superseded', agentId: 'a-1', projectId: 'p-2', timestamp: '2026-10-25T10:00:00Z', status: 'success' },
  { id: 'act-8', memoryId: 'mem-013', eventType: 'decayed', agentId: 'a-5', projectId: 'p-1', timestamp: '2026-10-20T08:00:00Z', status: 'success' },
  { id: 'act-9', memoryId: 'mem-017', eventType: 'retrieved', agentId: 'a-1', projectId: 'p-1', timestamp: '2026-11-11T09:00:00Z', status: 'success' },
  { id: 'act-10', memoryId: 'mem-002', eventType: 'retrieved', agentId: 'a-3', projectId: 'p-2', timestamp: '2026-11-11T18:00:00Z', status: 'success' },
];

// ── Retrieval Traces ──
export const mockRetrievalTraces: RetrievalTrace[] = [
  {
    id: 'rt-1',
    queryText: 'What database technology is used in ResearchGraph?',
    candidateCount: 8,
    selectedMemoryIds: ['mem-001', 'mem-011', 'mem-006'],
    scores: [
      { memoryId: 'mem-001', semanticSimilarity: 0.94, importanceScore: 0.92, confidenceScore: 0.95, recencyScore: 0.88, accessFrequency: 0.82, finalScore: 0.93 },
      { memoryId: 'mem-011', semanticSimilarity: 0.87, importanceScore: 0.87, confidenceScore: 0.94, recencyScore: 0.90, accessFrequency: 0.78, finalScore: 0.88 },
      { memoryId: 'mem-006', semanticSimilarity: 0.79, importanceScore: 0.78, confidenceScore: 0.85, recencyScore: 0.60, accessFrequency: 0.45, finalScore: 0.74 },
    ],
    latencyMs: 42,
    agentId: 'a-2',
    projectId: 'p-1',
    timestamp: '2026-11-12T06:00:00Z',
  },
  {
    id: 'rt-2',
    queryText: 'How does the API authentication work?',
    candidateCount: 5,
    selectedMemoryIds: ['mem-002', 'mem-016'],
    scores: [
      { memoryId: 'mem-002', semanticSimilarity: 0.96, importanceScore: 0.88, confidenceScore: 0.90, recencyScore: 0.85, accessFrequency: 0.70, finalScore: 0.91 },
      { memoryId: 'mem-016', semanticSimilarity: 0.62, importanceScore: 0.76, confidenceScore: 0.90, recencyScore: 0.72, accessFrequency: 0.40, finalScore: 0.65 },
    ],
    latencyMs: 38,
    agentId: 'a-1',
    projectId: 'p-2',
    timestamp: '2026-11-11T18:00:00Z',
  },
  {
    id: 'rt-3',
    queryText: 'What anomaly detection algorithm does DataPulse use?',
    candidateCount: 6,
    selectedMemoryIds: ['mem-003', 'mem-007'],
    scores: [
      { memoryId: 'mem-003', semanticSimilarity: 0.95, importanceScore: 0.85, confidenceScore: 0.88, recencyScore: 0.78, accessFrequency: 0.55, finalScore: 0.89 },
      { memoryId: 'mem-007', semanticSimilarity: 0.71, importanceScore: 0.86, confidenceScore: 0.91, recencyScore: 0.75, accessFrequency: 0.50, finalScore: 0.73 },
    ],
    latencyMs: 35,
    agentId: 'a-4',
    projectId: 'p-3',
    timestamp: '2026-11-10T11:00:00Z',
  },
  {
    id: 'rt-4',
    queryText: 'How is duplicate detection implemented?',
    candidateCount: 4,
    selectedMemoryIds: ['mem-017', 'mem-015'],
    scores: [
      { memoryId: 'mem-017', semanticSimilarity: 0.93, importanceScore: 0.88, confidenceScore: 0.92, recencyScore: 0.82, accessFrequency: 0.55, finalScore: 0.90 },
      { memoryId: 'mem-015', semanticSimilarity: 0.68, importanceScore: 0.91, confidenceScore: 0.96, recencyScore: 0.90, accessFrequency: 0.72, finalScore: 0.78 },
    ],
    latencyMs: 31,
    agentId: 'a-1',
    projectId: 'p-1',
    timestamp: '2026-11-11T09:00:00Z',
  },
  {
    id: 'rt-5',
    queryText: 'What is the paper ingestion pipeline for ResearchGraph?',
    candidateCount: 7,
    selectedMemoryIds: ['mem-004', 'mem-001', 'mem-019'],
    scores: [
      { memoryId: 'mem-004', semanticSimilarity: 0.97, importanceScore: 0.90, confidenceScore: 0.93, recencyScore: 0.92, accessFrequency: 0.75, finalScore: 0.94 },
      { memoryId: 'mem-001', semanticSimilarity: 0.78, importanceScore: 0.92, confidenceScore: 0.95, recencyScore: 0.88, accessFrequency: 0.82, finalScore: 0.86 },
      { memoryId: 'mem-019', semanticSimilarity: 0.72, importanceScore: 0.72, confidenceScore: 0.85, recencyScore: 0.55, accessFrequency: 0.30, finalScore: 0.68 },
    ],
    latencyMs: 45,
    agentId: 'a-2',
    projectId: 'p-1',
    timestamp: '2026-11-12T05:50:00Z',
  },
];

// ── Lifecycle Events ──
export const mockLifecycleEvents: LifecycleEvent[] = [
  { id: 'le-1', memoryId: 'mem-001', fromStatus: 'candidate', toStatus: 'validated', reason: 'Schema validation passed', triggeredBy: 'system', timestamp: '2026-08-10T09:00:30Z' },
  { id: 'le-2', memoryId: 'mem-001', fromStatus: 'validated', toStatus: 'active', reason: 'No duplicates detected', triggeredBy: 'system', timestamp: '2026-08-10T09:01:00Z' },
  { id: 'le-3', memoryId: 'mem-001', fromStatus: 'active', toStatus: 'updated', reason: 'Content refined with additional details', triggeredBy: 'a-1', timestamp: '2026-10-15T14:00:00Z' },
  { id: 'le-4', memoryId: 'mem-009', fromStatus: 'active', toStatus: 'superseded', reason: 'Replaced by mem-010 with updated rate limiting config', triggeredBy: 'a-1', timestamp: '2026-10-25T10:00:00Z' },
  { id: 'le-5', memoryId: 'mem-010', fromStatus: 'candidate', toStatus: 'active', reason: 'Validated and supersedes mem-009', triggeredBy: 'system', timestamp: '2026-10-25T10:00:30Z' },
  { id: 'le-6', memoryId: 'mem-013', fromStatus: 'active', toStatus: 'decayed', reason: 'Low access count (3) and importance (0.45) over 60-day window', triggeredBy: 'system', timestamp: '2026-10-20T08:00:00Z' },
  { id: 'le-7', memoryId: 'mem-020', fromStatus: 'active', toStatus: 'updated', reason: 'Protocol version updated to v1.0', triggeredBy: 'a-1', timestamp: '2026-11-05T10:00:00Z' },
  { id: 'le-8', memoryId: 'mem-004', fromStatus: 'active', toStatus: 'updated', reason: 'Pipeline step details clarified', triggeredBy: 'a-2', timestamp: '2026-11-01T09:00:00Z' },
  { id: 'le-9', memoryId: 'mem-015', fromStatus: 'active', toStatus: 'updated', reason: 'Decay policy threshold adjusted', triggeredBy: 'a-1', timestamp: '2026-10-30T11:00:00Z' },
];

// ── Memory Versions ──
export const mockMemoryVersions: MemoryVersion[] = [
  { id: 'mv-1', memoryId: 'mem-001', version: 1, content: 'ResearchGraph uses PostgreSQL with pgvector for embedding storage.', importance: 0.88, confidence: 0.90, status: 'active', changedBy: 'a-1', changedAt: '2026-08-10T09:00:00Z', changeReason: 'Initial submission' },
  { id: 'mv-2', memoryId: 'mem-001', version: 2, content: 'ResearchGraph uses PostgreSQL with pgvector extension for vector similarity search on research paper embeddings.', importance: 0.92, confidence: 0.95, status: 'active', changedBy: 'a-1', changedAt: '2026-10-15T14:00:00Z', changeReason: 'Added detail about vector similarity search use case' },
  { id: 'mv-3', memoryId: 'mem-020', version: 1, content: 'The MCP server exposes memory operations as tool calls for AI agents.', importance: 0.90, confidence: 0.93, status: 'active', changedBy: 'a-1', changedAt: '2026-08-08T09:00:00Z', changeReason: 'Initial submission' },
  { id: 'mv-4', memoryId: 'mem-020', version: 2, content: 'The MCP (Model Context Protocol) server exposes memory operations as tool calls for AI agents to interact with AgentMemory.', importance: 0.92, confidence: 0.95, status: 'active', changedBy: 'a-1', changedAt: '2026-09-15T10:00:00Z', changeReason: 'Added protocol name expansion' },
  { id: 'mv-5', memoryId: 'mem-020', version: 3, content: 'The MCP (Model Context Protocol) server exposes memory operations as tool calls for compatible AI agents to interact with AgentMemory.', importance: 0.93, confidence: 0.97, status: 'active', changedBy: 'a-1', changedAt: '2026-11-05T10:00:00Z', changeReason: 'Clarified compatibility requirement' },
];

// ── Conflict Events ──
export const mockConflictEvents: ConflictEvent[] = [
  { id: 'cf-1', memoryIdA: 'mem-009', memoryIdB: 'mem-010', conflictType: 'outdated', resolution: 'kept_b', resolvedAt: '2026-10-25T10:01:00Z', resolvedBy: 'system', timestamp: '2026-10-25T10:00:00Z' },
  { id: 'cf-2', memoryIdA: 'mem-006', memoryIdB: 'mem-011', conflictType: 'overlapping', resolution: 'merged', resolvedAt: '2026-09-20T15:00:00Z', resolvedBy: 'u-1', timestamp: '2026-09-20T14:30:00Z' },
];

// ── Consolidation Events ──
export const mockConsolidationEvents: ConsolidationEvent[] = [
  { id: 'cs-1', sourceMemoryIds: ['mem-006', 'mem-011'], resultMemoryId: 'mem-011', reason: 'Overlapping database configuration information', timestamp: '2026-09-20T15:00:00Z' },
];

// ── Decay Events ──
export const mockDecayEvents: DecayEvent[] = [
  { id: 'de-1', memoryId: 'mem-013', previousImportance: 0.60, newImportance: 0.45, reason: 'Low access frequency (3 accesses in 60 days) with below-threshold importance', timestamp: '2026-10-20T08:00:00Z' },
];

// ── Analytics Data ──
export const mockAnalyticsData: AnalyticsData = {
  memoryGrowth: [
    { date: '2026-08', count: 45 },
    { date: '2026-09', count: 132 },
    { date: '2026-10', count: 298 },
    { date: '2026-11', count: 404 },
  ],
  retrievalFrequency: [
    { date: '2026-08', count: 89 },
    { date: '2026-09', count: 234 },
    { date: '2026-10', count: 412 },
    { date: '2026-11', count: 317 },
  ],
  avgLatency: [
    { date: '2026-08', latency: 52 },
    { date: '2026-09', latency: 45 },
    { date: '2026-10', latency: 39 },
    { date: '2026-11', latency: 38 },
  ],
  typeDistribution: [
    { type: 'Factual', count: 178 },
    { type: 'Procedural', count: 112 },
    { type: 'Episodic', count: 56 },
    { type: 'Semantic', count: 34 },
    { type: 'Contextual', count: 24 },
  ],
  importanceDistribution: [
    { range: '0.0–0.2', count: 12 },
    { range: '0.2–0.4', count: 28 },
    { range: '0.4–0.6', count: 67 },
    { range: '0.6–0.8', count: 156 },
    { range: '0.8–1.0', count: 141 },
  ],
  confidenceDistribution: [
    { range: '0.0–0.2', count: 5 },
    { range: '0.2–0.4', count: 15 },
    { range: '0.4–0.6', count: 42 },
    { range: '0.6–0.8', count: 138 },
    { range: '0.8–1.0', count: 204 },
  ],
  duplicateStats: [
    { date: '2026-08', detected: 8, resolved: 7 },
    { date: '2026-09', detected: 15, resolved: 14 },
    { date: '2026-10', detected: 12, resolved: 12 },
    { date: '2026-11', detected: 6, resolved: 5 },
  ],
  consolidationStats: [
    { date: '2026-08', consolidated: 3 },
    { date: '2026-09', consolidated: 7 },
    { date: '2026-10', consolidated: 5 },
    { date: '2026-11', consolidated: 2 },
  ],
  precisionAtK: [
    { k: 1, precision: 0.92 },
    { k: 3, precision: 0.87 },
    { k: 5, precision: 0.82 },
    { k: 10, precision: 0.74 },
  ],
  recallAtK: [
    { k: 1, recall: 0.45 },
    { k: 3, recall: 0.72 },
    { k: 5, recall: 0.85 },
    { k: 10, recall: 0.94 },
  ],
  mrr: 0.89,
};

// ── Search Results (for demo) ──
export const mockSearchResults: SearchResult[] = [
  {
    memory: mockMemories[0],
    semanticSimilarity: 0.94,
    importanceScore: 0.92,
    confidenceScore: 0.95,
    recencyScore: 0.88,
    accessFrequency: 0.82,
    finalScore: 0.93,
  },
  {
    memory: mockMemories[10],
    semanticSimilarity: 0.87,
    importanceScore: 0.87,
    confidenceScore: 0.94,
    recencyScore: 0.90,
    accessFrequency: 0.78,
    finalScore: 0.88,
  },
  {
    memory: mockMemories[5],
    semanticSimilarity: 0.79,
    importanceScore: 0.78,
    confidenceScore: 0.85,
    recencyScore: 0.60,
    accessFrequency: 0.45,
    finalScore: 0.74,
  },
];

// ── Helper: Look up entity names ──
export function getUserName(id: string): string {
  return mockUsers.find(u => u.id === id)?.name ?? id;
}
export function getAgentName(id: string): string {
  return mockAgents.find(a => a.id === id)?.name ?? id;
}
export function getProjectName(id: string): string {
  return mockProjects.find(p => p.id === id)?.name ?? id;
}


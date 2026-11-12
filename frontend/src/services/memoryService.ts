import api from './api';
import type { Memory, SearchResult } from '../types';
import { mockMemories, mockSearchResults } from '../data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export const memoryService = {
  async list(): Promise<Memory[]> {
    if (USE_MOCK) return mockMemories;
    const { data } = await api.get('/memories');
    return data;
  },

  async get(id: string): Promise<Memory | undefined> {
    if (USE_MOCK) return mockMemories.find(m => m.id === id);
    const { data } = await api.get(`/memories/${id}`);
    return data;
  },

  async create(memory: Partial<Memory>): Promise<Memory> {
    if (USE_MOCK) {
      const newMemory: Memory = {
        id: `mem-${String(mockMemories.length + 1).padStart(3, '0')}`,
        content: memory.content || '',
        type: memory.type || 'factual',
        importance: memory.importance ?? 0.85,
        confidence: memory.confidence ?? 0.90,
        status: memory.status || 'candidate',
        projectId: memory.projectId || 'p-1',
        agentId: memory.agentId || 'a-1',
        userId: memory.userId || 'u-1',
        tags: memory.tags || ['proposed'],
        embeddingModel: 'text-embedding-3-small',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        accessCount: 1,
        version: 1,
        metadata: memory.metadata || {},
      };
      mockMemories.unshift(newMemory);
      return newMemory;
    }
    const { data } = await api.post('/memories', memory);
    return data;
  },

  async update(id: string, patch: Partial<Memory>): Promise<Memory> {
    if (USE_MOCK) {
      const idx = mockMemories.findIndex(m => m.id === id);
      if (idx !== -1) {
        mockMemories[idx] = { ...mockMemories[idx], ...patch, updatedAt: new Date().toISOString() };
        return mockMemories[idx];
      }
      throw new Error(`Memory ${id} not found`);
    }
    const { data } = await api.patch(`/memories/${id}`, patch);
    return data;
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK) {
      const idx = mockMemories.findIndex(m => m.id === id);
      if (idx !== -1) {
        mockMemories[idx].status = 'deleted';
      }
      return;
    }
    await api.delete(`/memories/${id}`);
  },

  async search(query: string): Promise<SearchResult[]> {
    if (USE_MOCK) return mockSearchResults;
    const { data } = await api.post('/memories/search', { query });
    return data;
  },
};

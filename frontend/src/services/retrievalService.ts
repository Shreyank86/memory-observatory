import api from './api';
import type { RetrievalTrace } from '../types';
import { mockRetrievalTraces } from '../data/mockData';

const USE_MOCK = true;

export const retrievalService = {
  async list(): Promise<RetrievalTrace[]> {
    if (USE_MOCK) return mockRetrievalTraces;
    const { data } = await api.get('/retrieval-traces');
    return data;
  },
  async get(id: string): Promise<RetrievalTrace | undefined> {
    if (USE_MOCK) return mockRetrievalTraces.find(t => t.id === id);
    const { data } = await api.get(`/retrieval-traces/${id}`);
    return data;
  },
};


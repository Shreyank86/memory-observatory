import api from './api';
import type { Agent } from '../types';
import { mockAgents } from '../data/mockData';

const USE_MOCK = true;

export const agentService = {
  async list(): Promise<Agent[]> {
    if (USE_MOCK) return mockAgents;
    const { data } = await api.get('/agents');
    return data;
  },
  async get(id: string): Promise<Agent | undefined> {
    if (USE_MOCK) return mockAgents.find(a => a.id === id);
    const { data } = await api.get(`/agents/${id}`);
    return data;
  },
};


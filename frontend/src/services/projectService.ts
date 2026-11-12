import api from './api';
import type { Project } from '../types';
import { mockProjects } from '../data/mockData';

const USE_MOCK = true;

export const projectService = {
  async list(): Promise<Project[]> {
    if (USE_MOCK) return mockProjects;
    const { data } = await api.get('/projects');
    return data;
  },
  async get(id: string): Promise<Project | undefined> {
    if (USE_MOCK) return mockProjects.find(p => p.id === id);
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },
};


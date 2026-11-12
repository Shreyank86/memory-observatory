import type { AnalyticsData } from '../types';
import { mockAnalyticsData } from '../data/mockData';

const USE_MOCK = true;

export const analyticsService = {
  async get(): Promise<AnalyticsData> {
    if (USE_MOCK) return mockAnalyticsData;
    // Replace with real API call
    return mockAnalyticsData;
  },
};


import { useQuery, useMutation } from '@tanstack/react-query';
import { useUIStore } from '@/store/ui.store';
import api from '@/lib/api';

interface LogFilters {
  level?: string;
  source?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const useLogs = (filters: LogFilters = {}) => {
  const { currentOrg } = useUIStore();
  const orgId = currentOrg?.id;

  // Build query string from filters
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, String(v)); });

  // Fetch logs
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['logs', orgId, filters],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/logs?${params}`);
      return data.data;
    },
    enabled: !!orgId,
    refetchInterval: filters.level === undefined ? 10000 : false, // live mode
  });

  // Log stats for dashboard
  const { data: stats } = useQuery({
    queryKey: ['log-stats', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/logs/stats`);
      return data.data.stats;
    },
    enabled: !!orgId,
    refetchInterval: 30000,
  });

  // Write a log manually
  const writeLog = useMutation({
    mutationFn: (log: { level: string; message: string; source?: string; metadata?: object }) =>
      api.post(`/organizations/${orgId}/logs`, log),
  });

  return {
    logs: data?.logs || [],
    pagination: data?.pagination,
    stats,
    isLoading,
    refetch,
    writeLog,
  };
};

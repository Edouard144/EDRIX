import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/store/ui.store';
import api from '@/lib/api';

export const useJobs = (statusFilter?: string) => {
  const { currentOrg } = useUIStore();
  const queryClient = useQueryClient();
  const orgId = currentOrg?.id;

  // All jobs, optional filter by status
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', orgId, statusFilter],
    queryFn: async () => {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/organizations/${orgId}/jobs${params}`);
      return data.data.jobs;
    },
    enabled: !!orgId,
    refetchInterval: 5000, // auto-refresh every 5s (jobs change fast)
  });

  // Single job with logs
  const useJob = (jobId: string) => useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/jobs/${jobId}`);
      return data.data.job;
    },
    enabled: !!orgId && !!jobId,
  });

  // Dead letter queue
  const { data: deadLetterJobs } = useQuery({
    queryKey: ['dead-letter', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/jobs/dead-letter`);
      return data.data.jobs;
    },
    enabled: !!orgId,
  });

  // Create job
  const createJob = useMutation({
    mutationFn: ({ name, payload }: { name: string; payload?: object }) =>
      api.post(`/organizations/${orgId}/jobs`, { name, payload }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs', orgId] }),
  });

  // Retry dead letter job
  const retryJob = useMutation({
    mutationFn: (jobId: string) =>
      api.post(`/organizations/${orgId}/jobs/${jobId}/retry`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', orgId] });
      queryClient.invalidateQueries({ queryKey: ['dead-letter', orgId] });
    },
  });

  return { jobs, isLoading, deadLetterJobs, useJob, createJob, retryJob };
};

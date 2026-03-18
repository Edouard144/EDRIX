import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/store/ui.store';
import api from '@/lib/api';

export const useApiKeys = () => {
  const { currentOrg } = useUIStore();
  const queryClient = useQueryClient();
  const orgId = currentOrg?.id;

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/api-keys`);
      return data.data.apiKeys;
    },
    enabled: !!orgId,
  });

  const createApiKey = useMutation({
    mutationFn: ({ name, scopes, expires_in_days }:
      { name: string; scopes: string[]; expires_in_days?: number }) => {
      if (!orgId) throw new Error('No organization selected');
      return api.post(`/organizations/${orgId}/api-keys`, { name, scopes, expires_in_days });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys', orgId] }),
  });

  const revokeApiKey = useMutation({
    mutationFn: (keyId: string) => {
      if (!orgId) throw new Error('No organization selected');
      return api.delete(`/organizations/${orgId}/api-keys/${keyId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys', orgId] }),
  });

  return { apiKeys, isLoading, createApiKey, revokeApiKey };
};

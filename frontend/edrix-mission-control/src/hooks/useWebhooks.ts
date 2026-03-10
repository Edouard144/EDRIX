import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/store/ui.store';
import api from '@/lib/api';

export const useWebhooks = () => {
  const { currentOrg } = useUIStore();
  const queryClient = useQueryClient();
  const orgId = currentOrg?.id;

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ['webhooks', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/webhooks`);
      return data.data.webhooks;
    },
    enabled: !!orgId,
  });

  const useDeliveries = (webhookId: string) => useQuery({
    queryKey: ['deliveries', webhookId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/webhooks/${webhookId}/deliveries`);
      return data.data.deliveries;
    },
    enabled: !!orgId && !!webhookId,
  });

  const createWebhook = useMutation({
    mutationFn: ({ name, url, events }: { name: string; url: string; events: string[] }) =>
      api.post(`/organizations/${orgId}/webhooks`, { name, url, events }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks', orgId] }),
  });

  const updateWebhook = useMutation({
    mutationFn: ({ id, ...body }: { id: string; is_active?: boolean; name?: string }) =>
      api.patch(`/organizations/${orgId}/webhooks/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks', orgId] }),
  });

  const deleteWebhook = useMutation({
    mutationFn: (id: string) => api.delete(`/organizations/${orgId}/webhooks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks', orgId] }),
  });

  const testWebhook = useMutation({
    mutationFn: () => api.post(`/organizations/${orgId}/webhooks/test`),
  });

  return { webhooks, isLoading, useDeliveries, createWebhook, updateWebhook, deleteWebhook, testWebhook };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/store/ui.store';
import api from '@/lib/api';

export const useBilling = () => {
  const { currentOrg } = useUIStore();
  const queryClient = useQueryClient();
  const orgId = currentOrg?.id;

  // Plans (public)
  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data } = await api.get('/billing/plans');
      return data.data.plans;
    },
  });

  // Current subscription
  const { data: subscription } = useQuery({
    queryKey: ['subscription', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/billing/subscription`);
      return data.data.subscription;
    },
    enabled: !!orgId,
  });

  // Usage summary
  const { data: usage } = useQuery({
    queryKey: ['usage', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/billing/usage`);
      return data.data.usage;
    },
    enabled: !!orgId,
    refetchInterval: 60000, // refresh every minute
  });

  // Invoices
  const { data: invoices } = useQuery({
    queryKey: ['invoices', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/billing/invoices`);
      return data.data.invoices;
    },
    enabled: !!orgId,
  });

  // Change plan
  const changePlan = useMutation({
    mutationFn: (plan: string) => {
      if (!orgId) throw new Error('No organization selected');
      return api.patch(`/organizations/${orgId}/billing/subscription`, { plan });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscription', orgId] }),
  });

  // Generate invoice
  const generateInvoice = useMutation({
    mutationFn: () => {
      if (!orgId) throw new Error('No organization selected');
      return api.post(`/organizations/${orgId}/billing/invoices/generate`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices', orgId] }),
  });

  return { plans, subscription, usage, invoices, changePlan, generateInvoice };
};

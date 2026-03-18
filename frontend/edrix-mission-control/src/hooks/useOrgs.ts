import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/store/ui.store';
import api from '@/lib/api';

export const useOrgs = () => {
  const { setOrgs, setCurrentOrg, currentOrg } = useUIStore();
  const queryClient = useQueryClient();

  // Fetch all orgs for current user
  const { data, isLoading } = useQuery({
    queryKey: ['orgs'],
    queryFn: async () => {
      const { data } = await api.get('/organizations');
      const orgs = data.data.orgs;
      setOrgs(orgs);                          // ← sets orgs AND currentOrg
      if (orgs.length > 0 && !currentOrg) {
        setCurrentOrg(orgs[0]);
      }
      return orgs;
    },
  });

  // Create a new org
  const createOrg = useMutation({
    mutationFn: (name: string) => api.post('/organizations', { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orgs'] }),
  });

  // Get members of current org
  const useMembers = () => useQuery({
    queryKey: ['members', currentOrg?.id],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${currentOrg?.id}/members`);
      return data.data.members;
    },
    enabled: !!currentOrg?.id,
  });

  // Invite a member
  const inviteMember = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) => {
      if (!currentOrg?.id) throw new Error('No organization selected');
      return api.post(`/organizations/${currentOrg.id}/invite`, { email, role });
    },
  });

  // Get audit log
  const useAuditLog = () => useQuery({
    queryKey: ['audit-log', currentOrg?.id],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${currentOrg?.id}/audit-log`);
      return data.data.logs;
    },
    enabled: !!currentOrg?.id,
  });

  return {
    orgs: data || [],
    isLoading,
    currentOrg,
    createOrg,
    useMembers,
    inviteMember,
    useAuditLog,
  };
};

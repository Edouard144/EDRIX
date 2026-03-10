import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/store/ui.store';
import api from '@/lib/api';

export const useProjects = () => {
  const { currentOrg } = useUIStore();
  const queryClient = useQueryClient();
  const orgId = currentOrg?.id;

  // All projects in org
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', orgId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/projects`);
      return data.data.projects;
    },
    enabled: !!orgId,
  });

  // Single project with environments
  const useProject = (projectId: string) => useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data } = await api.get(`/organizations/${orgId}/projects/${projectId}`);
      return data.data.project;
    },
    enabled: !!orgId && !!projectId,
  });

  // Create project
  const createProject = useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      api.post(`/organizations/${orgId}/projects`, { name, description }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', orgId] }),
  });

  // Delete project
  const deleteProject = useMutation({
    mutationFn: (projectId: string) =>
      api.delete(`/organizations/${orgId}/projects/${projectId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', orgId] }),
  });

  // Env variables
  const useEnvVars = (projectId: string, environmentId: string) => useQuery({
    queryKey: ['env-vars', environmentId],
    queryFn: async () => {
      const { data } = await api.get(
        `/organizations/${orgId}/projects/${projectId}/environments/${environmentId}/vars`
      );
      return data.data.variables;
    },
    enabled: !!orgId && !!projectId && !!environmentId,
  });

  const setEnvVar = useMutation({
    mutationFn: ({ projectId, environmentId, key, value, is_secret }:
      { projectId: string; environmentId: string; key: string; value: string; is_secret: boolean }) =>
      api.post(`/organizations/${orgId}/projects/${projectId}/environments/${environmentId}/vars`,
        { key, value, is_secret }),
    onSuccess: (_, vars) =>
      queryClient.invalidateQueries({ queryKey: ['env-vars', vars.environmentId] }),
  });

  const deleteEnvVar = useMutation({
    mutationFn: ({ projectId, environmentId, key }:
      { projectId: string; environmentId: string; key: string }) =>
      api.delete(`/organizations/${orgId}/projects/${projectId}/environments/${environmentId}/vars/${key}`),
  });

  return { projects, isLoading, useProject, createProject, deleteProject, useEnvVars, setEnvVar, deleteEnvVar };
};

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import api from '@/lib/api';
import { TooltipProvider } from '@/components/ui/tooltip';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import OverviewPage from '@/pages/OverviewPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import JobsPage from '@/pages/JobsPage';
import LogsPage from '@/pages/LogsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import WebhooksPage from '@/pages/WebhooksPage';
import BillingPage from '@/pages/BillingPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFound from '@/pages/NotFound';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Protects any route — redirects to /login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirects logged-in users away from auth pages
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/overview" replace /> : <>{children}</>;
};

function AppInit() {
  const { fetchMe, token } = useAuthStore();
  const { setOrgs, setCurrentOrg } = useUIStore();

  useEffect(() => {
    if (token) {
      fetchMe();
      api.get('/organizations')
        .then((r) => {
          const orgs = r.data.data.orgs;
          if (orgs.length > 0) {
            setOrgs(orgs);
            setCurrentOrg(orgs[0]); // ← set immediately on load
          }
        })
        .catch(() => {});
    }
  }, [token]); // ← depend on token not []

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInit />
        <TooltipProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

            {/* Protected dashboard */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/webhooks" element={<WebhooksPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

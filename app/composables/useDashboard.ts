import type { DashboardData } from '~~/types/dashboard';

export const useDashboard = () => {
  const dashboard = useState<DashboardData | null>(
    'dashboard',
    () => null,
  );

  const isLoading = useState<boolean>(
    'dashboard-loading',
    () => false,
  );

  const fetchDashboard = async (
    month: number,
    year: number,
    mode: 'month' | 'year',
  ) => {
    dashboard.value = null;
    isLoading.value = true;

    try {
      dashboard.value = await $fetch<DashboardData>('/api/dashboard', {
        query: {
          month,
          year,
          mode,
        },
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    dashboard,
    isLoading,
    fetchDashboard,
  };
};
import type { DashboardData } from '~~/types/dashboard';

const DEV_BUDGET_ID = 'local-dev';

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
    isLoading.value = true;

    try {
      dashboard.value = await $fetch<DashboardData>('/api/dashboard', {
        query: {
          budgetId: DEV_BUDGET_ID,
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
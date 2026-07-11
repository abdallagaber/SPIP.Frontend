export const DASHBOARDS = {
  admin: {
    route: '/dashboard/admin',
    title: 'Admin Dashboard',
    icon: 'layout-dashboard'
  },
  manager: {
    route: '/dashboard/manager',
    title: 'Manager Dashboard',
    icon: 'briefcase'
  },
  accountant: {
    route: '/dashboard/accountant',
    title: 'Accountant Dashboard',
    icon: 'calculator'
  }
} as const;

export type DashboardRole = keyof typeof DASHBOARDS;

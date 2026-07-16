import { AppIcon } from '../../../core/icons/lucide-icons';
import { DashboardStats } from '../models/dashboard-stats.model';

export interface DashboardWidget {
    id: string;
    title: string;
    icon: AppIcon;
    field: keyof DashboardStats;
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
    {
        id: 'total-users',
        title: 'Total Users',
        icon: 'Users',
        field: 'totalUsers'
    },
    {
        id: 'active-users',
        title: 'Active Users',
        icon: 'UserCheck',
        field: 'activeUsers'
    },
    {
        id: 'inactive-users',
        title: 'Inactive Users',
        icon: 'UserX',
        field: 'inactiveUsers'
    },
    {
        id: 'roles',
        title: 'Roles',
        icon: 'Shield',
        field: 'totalRoles'
    },
    {
        id: 'permissions',
        title: 'Permissions',
        icon: 'Key',
        field: 'totalPermissions'
    }
];

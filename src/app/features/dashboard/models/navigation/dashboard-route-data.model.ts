import { Permission } from '../../../../core/auth/constants/permissions';

export interface DashboardRouteData {
    title?: string;
    permissions?: Permission[];
}

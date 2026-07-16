import { Permission } from '../../../../core/auth/constants/permissions';
import { AppIcon } from '../../../../core/icons/lucide-icons';

export interface DashboardPage {
    id: string;
    title: string;
    icon: AppIcon;
    route: string;
    group: string;
    showInSidebar: boolean;
    sidebarOrder: number;
    homePriority: number | null;
    isDashboardHome?: boolean;
    permissions: Permission[];
}

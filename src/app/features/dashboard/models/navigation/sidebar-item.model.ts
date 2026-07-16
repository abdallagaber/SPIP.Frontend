import { Permission } from '../../../../core/auth/constants/permissions';
import { AppIcon } from '../../../../core/icons/lucide-icons';

export interface SidebarItem {
    label: string;
    icon: AppIcon;
    route: string;
    permissions?: Permission[];
}

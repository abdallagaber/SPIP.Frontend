import { SidebarItem } from './sidebar-item.model';

export interface SidebarGroup {
    label: string;
    items: SidebarItem[];
}

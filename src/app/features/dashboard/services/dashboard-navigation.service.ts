import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { AuthStorageService } from '../../../core/auth/services/auth-storage.service';
import { DASHBOARD_PAGES } from '../config/dashboard-pages.config';
import { SidebarGroup } from '../models/navigation/sidebar-group.model';
import { SidebarItem } from '../models/navigation/sidebar-item.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardNavigationService {
  private readonly authService = inject(AuthService);
  private readonly authStorage = inject(AuthStorageService);

  readonly accessiblePages = computed(() => {
    if (!this.authStorage.isInitialized()) return [];

    return DASHBOARD_PAGES.filter(page => {
      if (!page.permissions || page.permissions.length === 0) return true;
      return page.permissions.every(p => this.authService.hasPermission(p));
    });
  });

  readonly sidebar = computed(() => {
    if (!this.authStorage.isInitialized()) return [];

    const pages = this.accessiblePages().filter(p => p.showInSidebar);
    
    // Group pages
    const grouped = pages.reduce((acc, page) => {
      if (!acc[page.group]) {
        acc[page.group] = [];
      }
      acc[page.group].push({
        label: page.title,
        icon: page.icon,
        route: page.route,
        permissions: page.permissions,
        order: page.sidebarOrder // Temporary for sorting
      });
      return acc;
    }, {} as Record<string, (SidebarItem & { order: number })[]>);

    // Build array and sort items
    const groups: SidebarGroup[] = Object.keys(grouped).map(groupName => {
      const items = grouped[groupName].sort((a, b) => a.order - b.order);
      // Clean up the temporary order property
      const cleanItems = items.map(({ order, ...item }) => item);
      return {
        label: groupName,
        items: cleanItems
      };
    });

    return groups;
  });

  readonly homeRoute = computed(() => {
    if (!this.authStorage.isInitialized()) return null;

    const pages = this.accessiblePages();

    // 1. Find designated dashboard home
    const dashboardHome = pages.find(p => p.isDashboardHome === true);
    if (dashboardHome) {
      return dashboardHome.route;
    }

    // 2. Fallback to homePriority sorting
    const homePages = pages
      .filter(p => p.homePriority !== null)
      .sort((a, b) => (a.homePriority as number) - (b.homePriority as number));

    if (homePages.length > 0) {
      return homePages[0].route;
    }

    // 3. Unauthorized fallback
    return '/unauthorized';
  });
}

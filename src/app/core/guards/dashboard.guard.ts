import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { DashboardSelectionService } from '../../features/dashboard/services/dashboard-selection.service';
import { DashboardRole } from '../constants/dashboard.constants';

export const dashboardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const dashboardSelectionService = inject(DashboardSelectionService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/auth/login');
  }

  const availableDashboards = dashboardSelectionService.availableDashboards();
  const availableRoles = availableDashboards.map((d: any) => d.role);

  if (availableRoles.length === 0) {
    return router.parseUrl('/unauthorized');
  }

  const url = state.url;
  const targetRoleStr = url.split('/').pop()?.toLowerCase() || '';

  // 1. Direct navigation to a specific role dashboard (e.g. /dashboard/admin)
  if (targetRoleStr && availableRoles.includes(targetRoleStr as DashboardRole)) {
    // If it's a valid target role, auto-select it for multi-role users
    dashboardSelectionService.setSelectedDashboard(targetRoleStr as DashboardRole);
    return true;
  }

  // If navigating to a specific role they don't have access to
  if (targetRoleStr && targetRoleStr !== 'dashboard' && targetRoleStr !== 'select') {
    return router.parseUrl('/unauthorized');
  }

  // 2. Saved cookie / previously selected dashboard
  const selectedDashboard = dashboardSelectionService.selectedDashboard();
  
  if (url === '/dashboard' || url === '/dashboard/') {
    if (selectedDashboard) {
      return router.parseUrl(`/dashboard/${selectedDashboard}`);
    }

    // 3. User roles logic (no cookie, or navigating to /dashboard/select)
    if (availableRoles.length === 1) {
      return router.parseUrl(`/dashboard/${availableRoles[0]}`);
    } else if (availableRoles.length > 1) {
      return router.parseUrl('/dashboard/select');
    }
  }

  return true;
};

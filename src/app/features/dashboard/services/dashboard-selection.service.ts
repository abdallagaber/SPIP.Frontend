import { Injectable, computed, inject, signal } from '@angular/core';
import { CookieUtils } from '../../../core/utils/cookie.utils';
import { AuthService } from '../../auth/services/auth.service';
import { DashboardRole, DASHBOARDS } from '../../../core/constants/dashboard.constants';

const DASHBOARD_COOKIE_KEY = 'activeDashboard';

export interface DashboardInfo {
  role: DashboardRole;
  route: string;
  title: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardSelectionService {
  private readonly authService = inject(AuthService);
  private readonly _cookieDashboard = signal<DashboardRole | null>(null);

  constructor() {
    const saved = CookieUtils.getCookie(DASHBOARD_COOKIE_KEY) as DashboardRole;
    if (saved) {
      this._cookieDashboard.set(saved);
    }
  }

  readonly availableDashboards = computed(() => {
    const roles = this.authService.currentRoles();
    if (!roles || roles.length === 0) return [];

    const available: DashboardInfo[] = [];
    
    roles.forEach(role => {
      const roleKey = role as DashboardRole;
      if (DASHBOARDS[roleKey]) {
        available.push({
          role: roleKey,
          ...DASHBOARDS[roleKey]
        });
      }
    });

    return available;
  });

  setSelectedDashboard(role: DashboardRole): void {
    const roles = this.authService.currentRoles();
    // Only save in cookie if user has multiple roles
    if (roles && roles.length > 1) {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      CookieUtils.setCookie(DASHBOARD_COOKIE_KEY, role, d.toISOString());
      this._cookieDashboard.set(role);
    }
  }

  readonly selectedDashboard = computed(() => {
    const roles = this.authService.currentRoles();
    if (!roles || roles.length === 0) return null;

    // Single role user
    if (roles.length === 1) {
      const role = roles[0] as DashboardRole;
      return DASHBOARDS[role] ? role : null;
    }

    // Multi-role user
    const cookieRole = this._cookieDashboard() as DashboardRole;
    if (cookieRole && DASHBOARDS[cookieRole] && roles.includes(cookieRole)) {
      return cookieRole;
    }

    return null;
  });

  clearSelectedDashboard(): void {
    CookieUtils.removeCookie(DASHBOARD_COOKIE_KEY);
    this._cookieDashboard.set(null);
  }
}

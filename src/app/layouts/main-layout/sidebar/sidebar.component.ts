import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Users, FileText, Settings, Briefcase, Calculator, X } from 'lucide-angular';
import { Drawer } from 'primeng/drawer';
import { DashboardSelectionService } from '../../../features/dashboard/services/dashboard-selection.service';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, Drawer],
  template: `
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex flex-col w-64 h-screen bg-surface-0 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 sticky top-0 left-0 z-20">
      <div class="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-contrast font-bold text-xl">S</div>
        <span class="text-xl font-bold text-surface-900 dark:text-surface-0">SPIP</span>
      </div>
      <nav class="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        @for (item of menuItems(); track item.route) {
          <a [routerLink]="item.route" 
             routerLinkActive="bg-primary/10 text-primary font-medium" 
             [routerLinkActiveOptions]="{exact: false}"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <lucide-icon [name]="item.icon" [size]="20"></lucide-icon>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </aside>

    <!-- Mobile Drawer -->
    <p-drawer [visible]="isMobileOpen()" (visibleChange)="isMobileOpen.set($event)" [modal]="true" position="left" styleClass="w-64 !p-0">
      <ng-template #header>
        <div class="flex items-center gap-2 w-full">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-contrast font-bold text-xl">S</div>
          <span class="text-xl font-bold text-surface-900 dark:text-surface-0">SPIP</span>
        </div>
      </ng-template>
      <nav class="flex-1 py-4 px-3 flex flex-col gap-1">
        @for (item of menuItems(); track item.route) {
          <a [routerLink]="item.route" 
             routerLinkActive="bg-primary/10 text-primary font-medium" 
             [routerLinkActiveOptions]="{exact: false}"
             (click)="isMobileOpen.set(false)"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <lucide-icon [name]="item.icon" [size]="20"></lucide-icon>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </p-drawer>
  `
})
export class SidebarComponent {
  private readonly dashboardSelectionService = inject(DashboardSelectionService);
  
  // This will be true when opened from topbar on mobile
  readonly isMobileOpen = signal(false);

  readonly menuItems = computed(() => {
    const role = this.dashboardSelectionService.selectedDashboard();
    
    if (role === 'admin') {
      return [
        { label: 'Overview', route: '/dashboard/admin', icon: 'layout-dashboard' },
        { label: 'Users', route: '/dashboard/admin/users', icon: 'users' },
        { label: 'Reports', route: '/dashboard/admin/reports', icon: 'file-text' },
        { label: 'Settings', route: '/dashboard/admin/settings', icon: 'settings' }
      ];
    }
    
    if (role === 'manager') {
      return [
        { label: 'Overview', route: '/dashboard/manager', icon: 'layout-dashboard' },
        { label: 'Team', route: '/dashboard/manager/team', icon: 'users' },
        { label: 'Projects', route: '/dashboard/manager/projects', icon: 'briefcase' }
      ];
    }

    if (role === 'accountant') {
      return [
        { label: 'Overview', route: '/dashboard/accountant', icon: 'layout-dashboard' },
        { label: 'Invoices', route: '/dashboard/accountant/invoices', icon: 'file-text' },
        { label: 'Financials', route: '/dashboard/accountant/financials', icon: 'calculator' }
      ];
    }
    
    return [];
  });

  toggleMobile(): void {
    this.isMobileOpen.update(v => !v);
  }
}

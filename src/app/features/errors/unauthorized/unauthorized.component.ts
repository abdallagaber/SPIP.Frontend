import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardSelectionService } from '../../dashboard/services/dashboard-selection.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [Button, RouterLink, LucideAngularModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950 px-4">
      <div class="text-center max-w-md w-full bg-surface-0 dark:bg-surface-900 p-8 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <lucide-icon name="lock" [size]="32" strokeWidth="2"></lucide-icon>
        </div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-3">Access Denied</h1>
        <p class="text-surface-500 mb-8">You don't have access to this dashboard.</p>
        
        @if (hasMultipleRoles()) {
          <a routerLink="/dashboard/select" class="block w-full">
            <p-button label="Choose another dashboard" styleClass="w-full" />
          </a>
        } @else {
          <a routerLink="/dashboard" class="block w-full">
            <p-button label="Back to dashboard" styleClass="w-full" />
          </a>
        }
      </div>
    </div>
  `
})
export class UnauthorizedComponent {
  private readonly dashboardSelection = inject(DashboardSelectionService);

  readonly hasMultipleRoles = computed(() => {
    return this.dashboardSelection.availableDashboards().length > 1;
  });
}

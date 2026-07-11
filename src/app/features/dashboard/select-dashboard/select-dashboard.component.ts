import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardSelectionService, DashboardInfo } from '../services/dashboard-selection.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-select-dashboard',
  standalone: true,
  imports: [Button, LucideAngularModule],
  template: `
    <div class="py-8 max-w-5xl mx-auto">
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-3">Welcome back, {{ userName }}</h1>
        <p class="text-surface-500 text-lg">Please select the dashboard you want to access.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (dashboard of dashboards; track dashboard.role) {
          <div class="bg-surface-0 dark:bg-surface-900 p-8 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 hover:border-primary transition-colors cursor-pointer flex flex-col items-center text-center group" (click)="selectDashboard(dashboard)">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <lucide-icon [name]="dashboard.icon" [size]="32"></lucide-icon>
            </div>
            <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-2">{{ dashboard.title }}</h3>
            <p class="text-surface-500 mb-8">Access the {{ dashboard.title.toLowerCase() }} features and reports.</p>
            
            <p-button label="Enter Dashboard" styleClass="w-full mt-auto" />
          </div>
        }
      </div>
    </div>
  `
})
export class SelectDashboardComponent {
  private readonly dashboardSelection = inject(DashboardSelectionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly dashboards: DashboardInfo[] = this.dashboardSelection.availableDashboards();
  
  get userName(): string {
    return this.authService.currentUser()?.fullName || 'User';
  }

  selectDashboard(dashboard: DashboardInfo): void {
    this.dashboardSelection.setSelectedDashboard(dashboard.role);
    this.router.navigate([dashboard.route]);
  }
}

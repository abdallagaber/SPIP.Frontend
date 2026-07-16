import { Injectable, inject, signal, computed } from '@angular/core';
import { HomeService } from './home.service';
import { DashboardStats } from '../../models/dashboard-stats.model';

export interface UsersPerRoleChartData {
  labels: string[];
  series: number[];
}

@Injectable({
  providedIn: 'root'
})
export class HomeFacade {
  private readonly homeService = inject(HomeService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly hasStats = computed(() => !!this.stats());
  
  readonly usersPerRoleData = computed<UsersPerRoleChartData | null>(() => {
    const data = this.stats();
    if (!data || !data.usersPerRole) return null;
    
    const labels = Object.keys(data.usersPerRole);
    const series = Object.values(data.usersPerRole);
    
    if (labels.length === 0) return null;
    
    return {
      labels,
      series
    };
  });

  loadStats(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.homeService.getStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats.set(response.data);
        } else {
          this.error.set(response.message || 'Failed to load dashboard statistics.');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'An error occurred while loading dashboard statistics.');
        this.isLoading.set(false);
      }
    });
  }
}

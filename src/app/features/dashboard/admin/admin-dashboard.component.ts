import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../shared/widgets/stat-card/stat-card.component';
import { LineChartComponent } from '../shared/charts/line-chart/line-chart.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [PageHeaderComponent, StatCardComponent, LineChartComponent, Button],
  template: `
    <app-page-header title="Admin Overview" description="Monitor system activity and users.">
      <p-button label="Download Report" icon="pi pi-download" size="small" />
    </app-page-header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <app-stat-card title="Total Users" value="12,450" icon="users" [trend]="{value: 12, isPositive: true}" />
      <app-stat-card title="Active Sessions" value="1,245" icon="activity" [trend]="{value: 4.5, isPositive: true}" />
      <app-stat-card title="System Errors" value="23" icon="alert-triangle" [trend]="{value: 2, isPositive: false}" />
      <app-stat-card title="New Registrations" value="450" icon="user-plus" [trend]="{value: 8.2, isPositive: true}" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <app-line-chart title="User Growth" [categories]="months()" [series]="userGrowthSeries()" />
      <app-line-chart title="Revenue" [categories]="months()" [series]="revenueSeries()" />
    </div>
  `
})
export class AdminDashboardComponent {
  readonly months = signal(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  
  readonly userGrowthSeries = signal([
    {
      name: 'Users',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150, 160, 180]
    }
  ]);

  readonly revenueSeries = signal([
    {
      name: 'Revenue',
      data: [30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 125000, 150000, 160000, 180000]
    }
  ]);

}

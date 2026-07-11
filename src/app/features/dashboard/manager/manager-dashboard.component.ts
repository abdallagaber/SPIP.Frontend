import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../shared/widgets/stat-card/stat-card.component';
import { LineChartComponent } from '../shared/charts/line-chart/line-chart.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [PageHeaderComponent, StatCardComponent, LineChartComponent, Button],
  template: `
    <app-page-header title="Manager Overview" description="Team performance and goals.">
      <p-button label="Add Goal" icon="pi pi-plus" size="small" />
    </app-page-header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <app-stat-card title="Team Members" value="45" icon="users" />
      <app-stat-card title="Tasks Completed" value="842" icon="check-circle" [trend]="{value: 15, isPositive: true}" />
      <app-stat-card title="Avg Resolution Time" value="4.2h" icon="clock" [trend]="{value: 8, isPositive: false}" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <app-line-chart title="Productivity Trends" [categories]="months()" [series]="productivitySeries()" />
    </div>
  `
})
export class ManagerDashboardComponent {
  readonly months = signal(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
  readonly productivitySeries = signal([{ name: 'Tasks Completed', data: [120, 150, 180, 170, 210, 240] }]);

}

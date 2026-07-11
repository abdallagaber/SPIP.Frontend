import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../shared/widgets/stat-card/stat-card.component';
import { LineChartComponent } from '../shared/charts/line-chart/line-chart.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-accountant-dashboard',
  standalone: true,
  imports: [PageHeaderComponent, StatCardComponent, LineChartComponent, Button],
  template: `
    <app-page-header title="Accountant Overview" description="Financial metrics and invoices.">
      <p-button label="Export CSV" icon="pi pi-file-excel" size="small" />
    </app-page-header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <app-stat-card title="Total Revenue" value="$42,500" icon="dollar-sign" [trend]="{value: 12.5, isPositive: true}" />
      <app-stat-card title="Pending Invoices" value="14" icon="file-text" />
      <app-stat-card title="Expenses" value="$18,200" icon="trending-down" [trend]="{value: 5.2, isPositive: false}" />
      <app-stat-card title="Net Profit" value="$24,300" icon="pie-chart" [trend]="{value: 18.1, isPositive: true}" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <app-line-chart title="Revenue vs Expenses" [categories]="months()" [series]="financialSeries()" />
    </div>
  `
})
export class AccountantDashboardComponent {
  readonly months = signal(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
  readonly financialSeries = signal([
    { name: 'Revenue', data: [32000, 35000, 31000, 42000, 45000, 42500] },
    { name: 'Expenses', data: [15000, 16000, 14000, 19000, 17500, 18200] }
  ]);

}

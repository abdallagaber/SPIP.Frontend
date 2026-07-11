import { Component, computed, inject, input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ThemeService } from '../../../../../core/services/theme.service';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 h-full">
      <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4">{{ title() }}</h3>
      <apx-chart
        [series]="series()"
        [chart]="chartOptions().chart"
        [xaxis]="chartOptions().xaxis"
        [yaxis]="chartOptions().yaxis"
        [stroke]="chartOptions().stroke"
        [theme]="chartOptions().theme"
        [colors]="chartOptions().colors"
        [tooltip]="chartOptions().tooltip"
        [grid]="chartOptions().grid"
        [dataLabels]="chartOptions().dataLabels">
      </apx-chart>
    </div>
  `
})
export class LineChartComponent {
  private readonly themeService = inject(ThemeService);

  readonly title = input.required<string>();
  readonly series = input.required<any[]>();
  readonly categories = input.required<string[]>();
  readonly height = input<number>(300);

  readonly chartOptions = computed<any>(() => {
    const isDark = this.themeService.currentTheme() === 'dark' || 
                  (this.themeService.currentTheme() === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const textColor = isDark ? '#e2e8f0' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    return {
      chart: {
        type: 'area',
        height: this.height(),
        toolbar: { show: false },
        fontFamily: 'inherit',
        background: 'transparent'
      },
      colors: ['#0ea5e9', '#8b5cf6'], // Primary and a secondary color
      stroke: {
        curve: 'smooth',
        width: 2
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
      },
      xaxis: {
        categories: this.categories(),
        labels: { style: { colors: textColor } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: { style: { colors: textColor } }
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light'
      },
      theme: {
        mode: isDark ? 'dark' : 'light'
      }
    };
  });
}

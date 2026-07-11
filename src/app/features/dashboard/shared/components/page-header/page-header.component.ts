import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ title() }}</h1>
        @if (description()) {
          <p class="text-surface-500 mt-1 mb-0">{{ description() }}</p>
        }
      </div>
      <div class="flex items-center gap-3">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input<string>();
}

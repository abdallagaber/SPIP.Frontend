import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { LucideAngularModule, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-column-mapping-row',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, LucideAngularModule],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center py-4 border-b border-surface-200 dark:border-surface-700 last:border-0 gap-4">
      <div class="flex items-center gap-2 w-full sm:w-1/3">
        <span class="font-medium text-surface-900 dark:text-surface-0">{{ systemField() }}</span>
        <lucide-icon *ngIf="isRequired()" [img]="AlertCircleIcon" class="w-4 h-4 text-red-500" strokeWidth="2"></lucide-icon>
      </div>

      <div class="flex-1 w-full flex items-center gap-4">
        <div class="text-surface-400 hidden sm:block">
          <!-- Connect icon or arrow could go here -->
          &rarr;
        </div>
        <p-select
          [options]="dropdownOptions()"
          [ngModel]="selectedValue()"
          (ngModelChange)="onSelectionChange($event)"
          [filter]="true"
          filterPlaceholder="Search columns..."
          placeholder="Select a column from Excel"
          styleClass="w-full"
          class="w-full"
          optionLabel="label"
          optionValue="value"
          optionDisabled="disabled"
          [showClear]="!isRequired()"
        >
        </p-select>
      </div>
    </div>
  `
})
export class ColumnMappingRowComponent {
  systemField = input.required<string>();
  isRequired = input<boolean>(false);
  extractedColumns = input.required<string[]>();
  selectedValue = input<string | null>(null);
  
  // Columns that have already been mapped to OTHER system fields
  mappedExcelColumns = input<string[]>([]);

  mappingChange = output<string | null>();

  AlertCircleIcon = AlertCircle;

  dropdownOptions = computed(() => {
    const cols = this.extractedColumns();
    const mapped = this.mappedExcelColumns();
    const currentVal = this.selectedValue();

    return cols.map(col => {
      // Disable if it's already mapped somewhere else, but NOT if it's currently selected here
      const disabled = mapped.includes(col) && col !== currentVal;
      return {
        label: col,
        value: col,
        disabled
      };
    });
  });

  onSelectionChange(value: string | null) {
    this.mappingChange.emit(value);
  }
}

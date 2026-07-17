import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-excel-preview-panel',
  standalone: true,
  imports: [CommonModule, TagModule],
  styles: [`
    .selected-row-cell {
        background-color: var(--p-tag-info-background) !important;
        color: var(--p-tag-info-color) !important;
        font-weight: 600 !important;
    }
  `],
  template: `
    <div class="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 flex flex-col h-full min-h-0 min-w-0">
      
      <!-- Panel Header -->
      <div class="p-4 border-b border-surface-200 dark:border-surface-700 shrink-0 bg-surface-50 dark:bg-surface-800 rounded-t-xl flex items-center justify-between">
        <div>
          <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-0">Preview Data</h3>
          <p class="text-xs text-surface-500 mt-1">Select the row that contains the column headers.</p>
        </div>
        
        @if (selectedRow() !== null) {
          <p-tag severity="info" [value]="'Row ' + (selectedRow()! + 1) + ' Selected'"></p-tag>
        }
      </div>

      <!-- Scrollable Table Area -->
      <div class="flex-1 overflow-auto max-h-[500px]">
        <table class="min-w-max w-full text-sm text-left text-surface-700 dark:text-surface-300 border-collapse">
          <thead class="sticky top-0 bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-0 z-20 shadow-sm">
            <tr>
              <th class="sticky left-0 bg-surface-100 dark:bg-surface-800 z-30 px-4 py-2 border-b border-surface-200 dark:border-surface-700 font-semibold w-12 text-center">#</th>
              <th *ngFor="let col of headerColumns(); let i = index" class="px-4 py-2 border-b border-surface-200 dark:border-surface-700 font-semibold whitespace-nowrap">
                Column {{ i + 1 }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700 bg-surface-0 dark:bg-surface-900">
            
            <tr *ngIf="mappedData().length === 0">
              <td [attr.colspan]="headerColumns().length + 1" class="px-4 py-8 text-center text-surface-500">
                No preview data available.
              </td>
            </tr>

            <tr *ngFor="let row of mappedData()" 
                (click)="selectRow(row.rowIndex)"
                class="cursor-pointer transition-all duration-200 group">
              
              <td class="sticky left-0 px-4 py-2 text-center border-r border-surface-200 dark:border-surface-700 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151] z-10 transition-colors"
                  [class.bg-surface-0]="selectedRow() !== row.rowIndex"
                  [class.dark:bg-surface-900]="selectedRow() !== row.rowIndex"
                  [class.text-surface-500]="selectedRow() !== row.rowIndex"
                  [class.font-medium]="selectedRow() !== row.rowIndex"
                  [class.selected-row-cell]="selectedRow() === row.rowIndex"
                  [class.group-hover:bg-surface-100]="selectedRow() !== row.rowIndex"
                  [class.dark:group-hover:bg-surface-800]="selectedRow() !== row.rowIndex">
                {{ row.rowIndex + 1 }}
              </td>
              
              <td *ngFor="let cell of row.cells" 
                  class="px-4 py-2 whitespace-nowrap max-w-[300px] truncate transition-colors duration-200" 
                  [title]="cell"
                  [class.selected-row-cell]="selectedRow() === row.rowIndex"
                  [class.group-hover:bg-surface-100]="selectedRow() !== row.rowIndex"
                  [class.dark:group-hover:bg-surface-800]="selectedRow() !== row.rowIndex">
                {{ cell || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class ExcelPreviewPanelComponent {
  data = input.required<string[][]>();
  selectedRow = input<number | null>(null);
  rowSelected = output<number>();

  headerColumns = computed(() => {
    const rawData = this.data();
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) return [];
    
    let maxCols = 0;
    for (const row of rawData) {
      if (row.length > maxCols) {
        maxCols = row.length;
      }
    }
    
    return Array.from({ length: maxCols }, (_, i) => i);
  });

  mappedData = computed(() => {
    const rawData = this.data();
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map((row, index) => {
      if (!Array.isArray(row)) return { rowIndex: index, cells: [] };
      return { 
        rowIndex: index, 
        cells: row.map(cell => cell ?? '') 
      };
    });
  });

  selectRow(index: number) {
    this.rowSelected.emit(index);
  }
}

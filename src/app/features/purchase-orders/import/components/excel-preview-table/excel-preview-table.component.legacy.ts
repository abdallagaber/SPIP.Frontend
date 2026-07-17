import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-excel-preview-table',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule],
  template: `
    <div class="w-full min-w-0 overflow-hidden">
      <div class="overflow-x-auto">
        <p-table 
          [value]="mappedData()" 
          [scrollable]="true" 
          scrollHeight="400px"
          responsiveLayout="scroll"
          styleClass="p-datatable-sm w-full"
        [tableStyle]="{'min-width': '50rem'}"
        [rowHover]="true"
        [selectionMode]="'single'"
        [selection]="selectedRow()"
        (selectionChange)="onSelectionChange($event)"
        dataKey="rowIndex"
      >
        <ng-template #header>
          <tr>
            <th class="w-16 sticky left-0 z-10 bg-surface-50 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 text-center">#</th>
            <th *ngFor="let col of headerColumns(); let i = index" class="whitespace-nowrap truncate max-w-xs" [pTooltip]="'Column ' + (i + 1)" tooltipPosition="top">
              Column {{ i + 1 }}
            </th>
          </tr>
        </ng-template>
        
        <ng-template #body let-row let-rowIndex="rowIndex">
          <tr 
            [pSelectableRow]="row" 
            [ngClass]="{'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium': selectedRowIndex() === rowIndex}"
            class="cursor-pointer transition-colors"
          >
            <td class="w-16 sticky left-0 z-10 bg-surface-50 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 text-center font-bold text-surface-500">
              {{ rowIndex + 1 }}
            </td>
            <td *ngFor="let cell of row.cells" class="whitespace-nowrap truncate max-w-[200px]" [pTooltip]="cell" tooltipPosition="top">
              {{ cell || '-' }}
            </td>
          </tr>
        </ng-template>

        <ng-template #empty>
          <tr>
            <td [attr.colspan]="(headerColumns()?.length || 0) + 1" class="text-center p-4 text-surface-500">
              No preview data available.
            </td>
          </tr>
        </ng-template>
      </p-table>
      </div>
    </div>
  `
})
export class ExcelPreviewTableComponent {
  data = input.required<string[][]>();
  selectedRowIndex = input<number | null>(null);
  rowSelected = output<number>();

  // Max columns to prevent sparse arrays and ensure headers align with max row length
  headerColumns = computed(() => {
    const rawData = this.data();
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) return [];
    
    // Find the row with the most columns
    let maxCols = 0;
    for (const row of rawData) {
      if (row.length > maxCols) {
        maxCols = row.length;
      }
    }
    
    // Bug Fix 2: use Array.from instead of new Array(maxCols)
    return Array.from({ length: maxCols }, (_, i) => i);
  });

  // Table requires objects with a unique dataKey for selection to work properly
  // Since our data is string[][], we map it to { rowIndex: number, cells: string[] }
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

  // Find the selected row object
  selectedRow = computed(() => {
    const idx = this.selectedRowIndex();
    if (idx === null) return null;
    return this.mappedData().find(r => r.rowIndex === idx) || null;
  });

  onSelectionChange(selectedRowData: any) {
    if (selectedRowData) {
      this.rowSelected.emit(selectedRowData.rowIndex);
    }
  }
}

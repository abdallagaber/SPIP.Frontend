import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { LucideAngularModule, GitMerge, AlertCircle, CheckCircle2 } from 'lucide-angular';
import { PoImportStoreService } from '../../services/po-import-store.service';
import { PoImportApiService } from '../../services/po-import-api.service';
import { ColumnMappingRowComponent } from '../column-mapping-row/column-mapping-row.component';
import { ColumnMapping, REQUIRED_SYSTEM_FIELDS, SystemField } from '../../models/po-import.model';

@Component({
  selector: 'app-map-columns-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessageModule,
    ProgressSpinnerModule,
    CheckboxModule,
    LucideAngularModule,
    ColumnMappingRowComponent
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 flex items-center gap-2">
            <lucide-icon [img]="GitMergeIcon" class="w-5 h-5 text-primary-500"></lucide-icon>
            Map Excel Columns
          </h3>
          <p class="text-sm text-surface-500 mt-1">Match your Excel columns to the required system fields.</p>
        </div>
        
        <div class="flex items-center gap-2 text-sm font-medium" [ngClass]="store.isMappingValid() ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
          <lucide-icon [img]="store.isMappingValid() ? CheckCircle2Icon : AlertCircleIcon" class="w-4 h-4"></lucide-icon>
          {{ store.isMappingValid() ? 'All required fields mapped' : 'Missing required mappings' }}
        </div>
      </div>

      <div *ngIf="loadingMappings()" class="flex flex-col items-center justify-center p-8">
        <p-progress-spinner styleClass="w-10 h-10" strokeWidth="4"></p-progress-spinner>
        <p class="mt-4 text-surface-600 font-medium">Loading previous mappings...</p>
      </div>

      <div *ngIf="!loadingMappings()" class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
        <div class="px-6 py-3 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex text-sm font-medium text-surface-500">
          <div class="w-full sm:w-1/3">System Field</div>
          <div class="flex-1 hidden sm:block">Excel Column</div>
        </div>

        <div class="px-6 flex flex-col">
          <app-column-mapping-row
            *ngFor="let field of requiredFields"
            [systemField]="field"
            [isRequired]="true"
            [extractedColumns]="store.extractedColumns()"
            [selectedValue]="getMappedColumn(field)"
            [mappedExcelColumns]="mappedExcelColumns()"
            (mappingChange)="onMappingChange(field, $event)">
          </app-column-mapping-row>
        </div>
      </div>

      <div class="flex items-center gap-2 mt-4" *ngIf="!loadingMappings()">
        <p-checkbox [binary]="true" inputId="saveMapping" [ngModel]="store.saveVendorMapping()" (ngModelChange)="store.setSaveVendorMapping($event)"></p-checkbox>
        <label for="saveMapping" class="text-surface-700 dark:text-surface-300 font-medium cursor-pointer">Save these mappings for future imports from this vendor</label>
      </div>
    </div>
  `
})
export class MapColumnsStepComponent implements OnInit {
  store = inject(PoImportStoreService);
  private api = inject(PoImportApiService);

  requiredFields = REQUIRED_SYSTEM_FIELDS;
  loadingMappings = signal(false);

  GitMergeIcon = GitMerge;
  AlertCircleIcon = AlertCircle;
  CheckCircle2Icon = CheckCircle2;

  mappedExcelColumns = computed(() => {
    return this.store.mappings().map(m => m.excelColumn);
  });

  ngOnInit() {
    this.loadVendorMappings();
  }

  loadVendorMappings() {
    const vendorId = this.store.selectedVendor();
    if (!vendorId) return;

    this.loadingMappings.set(true);
    this.api.getVendorMappings(vendorId).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.mappings) {
          // Only apply mappings if the excel columns actually exist in the current file
          const validMappings = res.data.mappings.filter((m: ColumnMapping) => 
            this.store.extractedColumns().includes(m.excelColumn)
          );
          
          if (validMappings.length > 0) {
            this.store.setMappings(validMappings);
          }
        }
        this.loadingMappings.set(false);
      },
      error: () => {
        // Ignore error, they might just not have previous mappings
        this.loadingMappings.set(false);
      }
    });
  }

  getMappedColumn(systemField: string): string | null {
    const mapping = this.store.mappings().find(m => m.systemField === systemField);
    return mapping ? mapping.excelColumn : null;
  }

  onMappingChange(systemField: string, excelColumn: string | null) {
    const currentMappings = [...this.store.mappings()];
    
    // Remove existing mapping for this field if any
    const existingIndex = currentMappings.findIndex(m => m.systemField === systemField);
    if (existingIndex > -1) {
      currentMappings.splice(existingIndex, 1);
    }

    // Add new mapping if a column was selected
    if (excelColumn) {
      currentMappings.push({ systemField, excelColumn });
    }

    this.store.setMappings(currentMappings);
  }
}

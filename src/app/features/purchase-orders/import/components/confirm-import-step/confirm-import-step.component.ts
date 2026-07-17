import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LucideAngularModule, CheckCircle2, AlertTriangle, FileSpreadsheet, Building, ListOrdered } from 'lucide-angular';
import { PoImportStoreService } from '../../services/po-import-store.service';
import { PoImportApiService } from '../../services/po-import-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-import-step',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    LucideAngularModule
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- File Summary -->
        <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-2">
          <div class="flex items-center gap-2 text-surface-500 font-medium text-sm mb-1">
            <lucide-icon [img]="FileSpreadsheetIcon" class="w-4 h-4"></lucide-icon>
            File Details
          </div>
          <div class="font-semibold text-surface-900 dark:text-surface-0 truncate" [title]="store.selectedFile()?.name">
            {{ store.selectedFile()?.name }}
          </div>
          <div class="text-sm text-surface-500">
            {{ store.totalRowsFound() }} total rows detected
          </div>
        </div>

        <!-- Vendor Summary -->
        <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-2">
          <div class="flex items-center gap-2 text-surface-500 font-medium text-sm mb-1">
            <lucide-icon [img]="BuildingIcon" class="w-4 h-4"></lucide-icon>
            Vendor
          </div>
          <div class="font-semibold text-surface-900 dark:text-surface-0">
            {{ store.selectedVendor() }}
          </div>
          <div class="text-sm text-surface-500">
            Mappings {{ store.saveVendorMapping() ? 'will' : 'will not' }} be saved
          </div>
        </div>

        <!-- Header Summary -->
        <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-2">
          <div class="flex items-center gap-2 text-surface-500 font-medium text-sm mb-1">
            <lucide-icon [img]="ListOrderedIcon" class="w-4 h-4"></lucide-icon>
            Header Row
          </div>
          <div class="font-semibold text-surface-900 dark:text-surface-0">
            Row {{ (store.selectedHeaderRow() || 0) + 1 }}
          </div>
          <div class="text-sm text-surface-500">
            {{ store.mappings().length }} columns mapped
          </div>
        </div>
      </div>

      <!-- Mappings List -->
      <div class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden mt-2">
        <div class="px-6 py-3 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 font-medium text-surface-900 dark:text-surface-0">
          Column Mappings Review
        </div>
        <div class="p-0">
          <ul class="divide-y divide-surface-200 dark:divide-surface-700">
            <li *ngFor="let mapping of store.mappings()" class="flex items-center justify-between px-6 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <span class="font-medium text-surface-900 dark:text-surface-0">{{ mapping.systemField }}</span>
              <span class="text-surface-500 flex items-center gap-2">
                <span class="hidden sm:inline">&rarr;</span>
                <span class="px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded-md text-sm">{{ mapping.excelColumn }}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div *ngIf="importError()" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 mt-4">
        <lucide-icon [img]="AlertTriangleIcon" class="text-red-500 mt-0.5 w-5 h-5"></lucide-icon>
        <div class="text-red-700 dark:text-red-400 flex-1">
          <p class="font-medium">Import Failed</p>
          <p class="text-sm mt-1">{{ importError() }}</p>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <p-button 
          label="Confirm & Import" 
          icon="pi pi-check" 
          (onClick)="confirmImport()" 
          [loading]="isImporting()"
          [disabled]="!store.canGoToConfirmation() || isImporting()">
        </p-button>
      </div>

    </div>
  `
})
export class ConfirmImportStepComponent {
  store = inject(PoImportStoreService);
  private api = inject(PoImportApiService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  isImporting = signal(false);
  importError = signal<string | null>(null);

  CheckCircle2Icon = CheckCircle2;
  AlertTriangleIcon = AlertTriangle;
  FileSpreadsheetIcon = FileSpreadsheet;
  BuildingIcon = Building;
  ListOrderedIcon = ListOrdered;

  confirmImport() {
    if (!this.store.canGoToConfirmation()) return;

    this.isImporting.set(true);
    this.importError.set(null);

    const file = this.store.selectedFile()!;
    const vendorId = this.store.selectedVendor()!;
    const headerRowIdx = this.store.selectedHeaderRow()!;
    const mappings = this.store.mappings();
    const saveMappings = this.store.saveVendorMapping();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('vendorId', vendorId);
    formData.append('headerRowIndex', headerRowIdx.toString());
    formData.append('saveVendorMapping', saveMappings.toString());
    formData.append('mappings', JSON.stringify(mappings));

    this.api.importPurchaseOrder(formData).subscribe({
      next: (res) => {
        if (res && res.success === false) {
          this.isImporting.set(false);
          this.importError.set(res.message || 'Import failed.');
          return;
        }

        this.isImporting.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Purchase order imported successfully.' });
        
        // Optional: save vendor mappings explicitly if the backend doesn't handle it inside the import endpoint
        if (saveMappings) {
          this.api.saveVendorMappings({ vendorId, mappings }).subscribe();
        }

        setTimeout(() => {
          this.router.navigate(['/dashboard/po-imports']);
        }, 1500);
      },
      error: (err) => {
        this.isImporting.set(false);
        this.importError.set(err.error?.message || 'An unexpected error occurred during import.');
      }
    });
  }
}

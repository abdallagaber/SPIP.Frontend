import { Injectable, computed, signal } from '@angular/core';
import { ColumnMapping, REQUIRED_SYSTEM_FIELDS, SystemField } from '../models/po-import.model';

@Injectable({
  providedIn: 'root'
})
export class PoImportStoreService {
  readonly selectedFile = signal<File | null>(null);
  readonly selectedVendor = signal<string | null>(null);
  readonly previewData = signal<string[][]>([]);
  readonly totalRowsFound = signal<number>(0);
  readonly selectedHeaderRow = signal<number | null>(null);
  readonly mappings = signal<ColumnMapping[]>([]);
  readonly loading = signal<boolean>(false);
  readonly validationErrors = signal<string[]>([]);
  readonly saveVendorMapping = signal<boolean>(false);

  // Computed
  readonly hasPreview = computed(() => this.previewData().length > 0);
  
  readonly canProceed = computed(() => {
    const vendor = this.selectedVendor();
    const file = this.selectedFile();
    const row = this.selectedHeaderRow();

    return vendor !== null
        && file !== null
        && row !== null;
  });

  readonly extractedColumns = computed(() => {
    const data = this.previewData();
    const headerRowIdx = this.selectedHeaderRow();
    if (headerRowIdx === null || !data[headerRowIdx]) {
      return [];
    }
    return data[headerRowIdx].map(col => col?.trim() || '');
  });

  readonly isMappingValid = computed(() => {
    const currentMappings = this.mappings();
    // Check if all required fields are mapped
    for (const requiredField of REQUIRED_SYSTEM_FIELDS) {
      if (!currentMappings.find(m => m.systemField === requiredField)) {
        return false;
      }
    }
    return true;
  });

  readonly canGoToConfirmation = computed(() => {
    return this.canProceed() && this.isMappingValid();
  });

  // Actions
  replaceFile(file: File) {
    this.selectedFile.set(file);
    this.resetPreview();
  }

  removeFile() {
    this.selectedFile.set(null);
    this.resetPreview();
  }

  resetPreview() {
    this.previewData.set([]);
    this.totalRowsFound.set(0);
    this.selectedHeaderRow.set(null);
    this.mappings.set([]);
  }

  setVendor(vendorId: string | null) {
    this.selectedVendor.set(vendorId);
  }

  setPreviewData(dataGrid: string[][], totalRows: number) {
    this.previewData.set(dataGrid);
    this.totalRowsFound.set(totalRows);
  }

  setSelectedHeaderRow(index: number | null) {
    this.selectedHeaderRow.set(index);
    // Reset mappings when header changes
    this.mappings.set([]);
  }

  setMappings(mappings: ColumnMapping[]) {
    this.mappings.set(mappings);
  }

  setLoading(loading: boolean) {
    this.loading.set(loading);
  }
  
  setSaveVendorMapping(save: boolean) {
    this.saveVendorMapping.set(save);
  }

  reset() {
    this.selectedFile.set(null);
    this.selectedVendor.set(null);
    this.previewData.set([]);
    this.totalRowsFound.set(0);
    this.selectedHeaderRow.set(null);
    this.mappings.set([]);
    this.loading.set(false);
    this.validationErrors.set([]);
    this.saveVendorMapping.set(false);
  }
}

import { Injectable, signal } from '@angular/core';

@Injectable()
export class CrudStateStore<T> {
  // Selection
  readonly selectedItem = signal<T | null>(null);
  readonly selectedId = signal<string | number | null>(null);

  // Loading States
  readonly createLoading = signal<boolean>(false);
  readonly updateLoading = signal<boolean>(false);
  readonly deleteLoading = signal<boolean>(false);

  // Error States
  readonly createError = signal<string | null>(null);
  readonly updateError = signal<string | null>(null);
  readonly deleteError = signal<string | null>(null);

  // Actions
  selectItem(item: T | null, id: string | number | null = null) {
    this.selectedItem.set(item);
    this.selectedId.set(id);
    console.log('[STORE] Vendor loaded:', this.selectedItem());
  }

  setCreateLoading(isLoading: boolean) {
    this.createLoading.set(isLoading);
    if (isLoading) this.createError.set(null);
  }

  setUpdateLoading(isLoading: boolean) {
    this.updateLoading.set(isLoading);
    if (isLoading) this.updateError.set(null);
  }

  setDeleteLoading(isLoading: boolean) {
    this.deleteLoading.set(isLoading);
    if (isLoading) this.deleteError.set(null);
  }

  setCreateError(error: string | null) {
    this.createError.set(error);
  }

  setUpdateError(error: string | null) {
    this.updateError.set(error);
  }

  setDeleteError(error: string | null) {
    this.deleteError.set(error);
  }
}

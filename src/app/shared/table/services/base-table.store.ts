import { computed, Injectable, signal } from '@angular/core';
import { TableState } from '../models/table-state.model';

@Injectable()
export class BaseTableStore<T> {
  // State
  readonly items = signal<T[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly pageNumber = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalCount = signal<number>(0);

  readonly searchTerm = signal<string>('');

  // Computed
  readonly hasData = computed(() => this.items().length > 0);

  readonly isEmpty = computed(() => !this.loading() && this.items().length === 0);

  readonly state = computed<TableState>(() => {
    if (this.loading()) {
      return 'loading';
    }
    if (this.error()) {
      return 'error';
    }
    if (this.items().length === 0) {
      return 'empty';
    }
    return 'data';
  });

  // Actions
  setItems(items: T[], totalCount: number) {
    this.items.set(items);
    this.totalCount.set(totalCount);
    this.error.set(null);
  }

  setLoading(isLoading: boolean) {
    this.loading.set(isLoading);
  }

  setError(errorMessage: string) {
    this.error.set(errorMessage);
    this.items.set([]);
  }

  setPage(pageNumber: number, pageSize: number) {
    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
    this.pageNumber.set(1); // Reset to first page on search
  }
}

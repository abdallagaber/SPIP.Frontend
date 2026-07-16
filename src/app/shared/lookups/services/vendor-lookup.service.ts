import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, of, map, catchError } from 'rxjs';
import { ApiService } from '../../api/services/api.service';
import { ApiResponse } from '../../api/models/api-response.model';
import { PagedResult } from '../../api/models/paged-result.model';
import { VendorOption } from '../models/vendor-option.model';

interface VendorResponse {
  id: string;
  erpId: string;
  name: string;
  isApproved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VendorLookupService {
  private readonly apiService = inject(ApiService);
  private readonly baseUrl = '/vendors';

  private vendorsCache = signal<VendorOption[] | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  get vendors() {
    return this.vendorsCache.asReadonly();
  }

  loadVendors(): Observable<VendorOption[]> {
    const cached = this.vendorsCache();
    if (cached) {
      return of(cached);
    }

    this.loading.set(true);
    this.error.set(null);

    return this.apiService.get<ApiResponse<PagedResult<VendorResponse>>>(`${this.baseUrl}?pageNumber=1&pageSize=1000`).pipe(
      map(response => {
        if (response.success && response.data) {
          // Filter only approved vendors
          const approvedVendors = response.data.items.filter(v => v.isApproved);
          return approvedVendors.map(v => ({
            id: v.id,
            name: v.name,
            erpId: v.erpId
          }));
        }
        throw new Error(response.message || 'Failed to load vendors');
      }),
      tap(vendors => {
        this.vendorsCache.set(vendors);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set(err.message || 'Error fetching vendors');
        this.loading.set(false);
        throw err;
      })
    );
  }

  clearCache() {
    this.vendorsCache.set(null);
  }
}

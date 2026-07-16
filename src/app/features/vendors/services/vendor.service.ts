import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../shared/api/services/api.service';
import { ApiResponse } from '../../../shared/api/models/api-response.model';
import { PagedResult } from '../../../shared/api/models/paged-result.model';
import { Vendor, CreateVendorRequest, UpdateVendorRequest } from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private readonly baseUrl = '/vendors';

  constructor(private readonly apiService: ApiService) {}

  getVendors(pageNumber: number, pageSize: number, searchTerm?: string): Observable<ApiResponse<PagedResult<Vendor>>> {
    const params: Record<string, string | number | boolean> = { pageNumber, pageSize };
    if (searchTerm) {
      params['searchTerm'] = searchTerm;
    }
    return this.apiService.get<ApiResponse<PagedResult<Vendor>>>(this.baseUrl, params);
  }

  getVendor(id: string): Observable<ApiResponse<Vendor>> {
    console.log('[SERVICE] Loading vendor:', id);
    return this.apiService.get<ApiResponse<Vendor>>(`${this.baseUrl}/${id}`).pipe(
      tap(response => {
        console.log('[API RESPONSE]', response);
      })
    );
  }

  createVendor(vendor: CreateVendorRequest): Observable<ApiResponse<Vendor>> {
    return this.apiService.post<ApiResponse<Vendor>>(this.baseUrl, vendor);
  }

  updateVendor(id: string, vendor: UpdateVendorRequest): Observable<ApiResponse<Vendor>> {
    return this.apiService.put<ApiResponse<Vendor>>(`${this.baseUrl}/${id}`, vendor);
  }

  deleteVendor(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  toggleApproval(id: string): Observable<ApiResponse<void>> {
    return this.apiService.put<ApiResponse<void>>(`${this.baseUrl}/${id}/toggle-approval`, {});
  }
}

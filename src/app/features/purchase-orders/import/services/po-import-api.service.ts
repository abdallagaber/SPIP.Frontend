import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../../../../core/constants/api.constants';
import { ApiResponse } from '../../../../shared/api/models/api-response.model';
import { ImportPreviewResponse, VendorMapping, ColumnMapping } from '../models/po-import.model';

@Injectable({
  providedIn: 'root'
})
export class PoImportApiService {
  private http = inject(HttpClient);
  
  private readonly baseUrl = API_BASE_URL;

  previewImport(file: File, rowsToExtract: number = 50): Observable<ImportPreviewResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportPreviewResponse>(`${this.baseUrl}${API_ENDPOINTS.purchaseOrders}/import-preview?rowsToExtract=${rowsToExtract}`, formData);
  }

  getVendorMappings(vendorId: string): Observable<ApiResponse<VendorMapping>> {
    return this.http.get<ApiResponse<VendorMapping>>(`${this.baseUrl}/vendor-mappings/vendor/${vendorId}`);
  }

  saveVendorMappings(vendorMapping: VendorMapping): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/vendor-mappings`, vendorMapping);
  }

  importPurchaseOrder(payload: FormData): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}${API_ENDPOINTS.purchaseOrders}/import`, payload);
  }
}

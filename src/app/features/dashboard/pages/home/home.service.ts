import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { DashboardStats } from '../../models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly apiService = inject(ApiService);

  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.apiService.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  }
}

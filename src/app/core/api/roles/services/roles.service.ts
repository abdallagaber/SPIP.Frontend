import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../constants/api.constants';
import { ApiResponse } from '../../../models/api-response.model';
import { PagedResult } from '../../../../shared/api/models/paged-result.model';
import { Role, AssignPermissionsDto } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/roles`;

  getRoles(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResult<Role>>> {
    return this.http.get<ApiResponse<PagedResult<Role>>>(`${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getRoleById(id: string): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.baseUrl}/${id}`);
  }

  createRole(data: { name: string }): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(this.baseUrl, data);
  }

  updateRole(id: string, data: { name: string }): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.baseUrl}/${id}`, data);
  }

  deleteRole(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }

  assignPermissions(id: string, dto: AssignPermissionsDto): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/${id}/permissions`, dto);
  }
}

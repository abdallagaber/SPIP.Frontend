import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../shared/api/services/api.service';
import { ApiResponse } from '../../../../shared/api/models/api-response.model';
import { PagedResult } from '../../../../shared/api/models/paged-result.model';
import { User } from '../dtos/user-response.dto';
import { UpdateUserRequest } from '../dtos/update-user.dto';
import { RegisterRequestDto } from '../dtos/register-user.dto';

@Injectable()
export class UserService {
  private readonly apiService = inject(ApiService);
  private readonly baseUrl = '/users';
  private readonly authUrl = '/auth';

  getUsers(searchTerm?: string, role?: string, isActive?: boolean, pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResult<User>>> {
    return this.apiService.get<ApiResponse<PagedResult<User>>>(this.baseUrl, {
      ...(searchTerm && { SearchTerm: searchTerm }),
      ...(role && { Role: role }),
      ...(isActive !== undefined && { IsActive: isActive }),
      PageNumber: pageNumber,
      PageSize: pageSize
    });
  }

  getById(id: number): Observable<ApiResponse<User>> {
    return this.apiService.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
  }

  create(data: RegisterRequestDto): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(`${this.authUrl}/register`, data);
  }

  update(id: number, data: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.apiService.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.apiService.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }

  toggleStatus(id: number): Observable<ApiResponse<boolean>> {
    return this.apiService.put<ApiResponse<boolean>>(`${this.baseUrl}/${id}/toggle-status`, {});
  }
}

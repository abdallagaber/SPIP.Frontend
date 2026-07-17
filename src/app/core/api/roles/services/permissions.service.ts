import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { API_BASE_URL } from '../../../constants/api.constants';
import { ApiResponse } from '../../../models/api-response.model';
import { PermissionModule } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/permissions`;

  private permissionsCache$?: Observable<ApiResponse<PermissionModule[]>>;

  getPermissions(): Observable<ApiResponse<PermissionModule[]>> {
    if (!this.permissionsCache$) {
      this.permissionsCache$ = this.http.get<ApiResponse<PermissionModule[]>>(this.baseUrl).pipe(
        shareReplay(1)
      );
    }
    return this.permissionsCache$;
  }
}

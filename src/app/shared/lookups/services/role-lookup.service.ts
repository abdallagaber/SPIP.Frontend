import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../api/services/api.service';
import { ApiResponse } from '../../api/models/api-response.model';
import { PagedResult } from '../../api/models/paged-result.model';

export interface RoleOption {
  label: string;
  value: string;
}

export interface RoleDto {
  id: string;
  name: string;
  permissions?: string[];
  isSystem?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoleLookupService {
  private readonly apiService = inject(ApiService);

  readonly roles = signal<RoleOption[]>([]);
  readonly loading = signal<boolean>(false);

  loadRoles() {
    if (this.roles().length > 0) {
      return; // return cached
    }

    this.loading.set(true);
    return this.apiService
      .get<ApiResponse<PagedResult<RoleDto>>>('/roles', { PageNumber: 1, PageSize: 1000 })
      .pipe(
        tap({
          next: (response) => {
            if (response.success && response.data?.items) {
              const mappedRoles = response.data.items.map((r) => ({
                label: r.name,
                value: r.id,
              }));
              this.roles.set(mappedRoles);
            }
          },
          error: () => {
            this.roles.set([]);
          },
          finalize: () => {
            this.loading.set(false);
          },
        }),
      );
  }
}

import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { AUTH_ENDPOINTS } from '../../../core/constants/auth.constants';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { AuthUser } from '../../../core/models/user.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { AuthResponse } from '../../../core/models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly authStorage = inject(AuthStorageService);

  readonly currentUser = signal<AuthUser | null>(this.authStorage.getUser());
  
  readonly isAuthenticated = computed(() => !!this.currentUser());

  login(payload: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.login, payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          const authData = response.data;
          this.authStorage.setToken(authData.token);
          this.authStorage.setUser(authData.user);
          this.currentUser.set(authData.user);
        }
      })
    );
  }

  register(payload: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.register, payload).pipe(
      tap(response => {
        // Usually, registration doesn't auto-login or might return the same payload depending on backend.
        // We handle it here if it returns token.
        if (response.success && response.data && response.data.token) {
          const authData = response.data;
          this.authStorage.setToken(authData.token);
          this.authStorage.setUser(authData.user);
          this.currentUser.set(authData.user);
        }
      })
    );
  }

  logout(): void {
    this.authStorage.clear();
    this.currentUser.set(null);
  }
}

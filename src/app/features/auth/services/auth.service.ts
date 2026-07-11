import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CookieUtils } from '../../../core/utils/cookie.utils';
import { getRolesFromToken, isTokenExpired } from '../../../core/utils/jwt.utils';
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
  
  readonly currentUser = signal<AuthUser | null>(null);
  readonly currentToken = signal<string | null>(null);
  
  readonly currentRoles = computed(() => {
    const token = this.currentToken();
    if (!token) return [];
    return getRolesFromToken(token);
  });

  readonly isAuthenticated = computed(() => !!this.currentToken() && !!this.currentUser());

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    const token = CookieUtils.getCookie('spip_token');
    if (token) {
      if (isTokenExpired(token)) {
        this.logout();
      } else {
        this.currentToken.set(token);
        const userJson = localStorage.getItem('spip_user');
        if (userJson) {
          try {
            this.currentUser.set(JSON.parse(userJson) as AuthUser);
          } catch {
            this.logout();
          }
        }
      }
    }
  }

  login(payload: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.login, payload).pipe(
      tap(response => {
        if (response.success && response.data) {
          const authData = response.data;
          
          CookieUtils.setCookie('spip_token', authData.token, authData.expiresAt);
          
          const user: AuthUser = {
            userId: authData.userId,
            fullName: authData.fullName,
            userName: authData.userName,
            email: authData.email
          };
          
          localStorage.setItem('spip_user', JSON.stringify(user));
          
          this.currentToken.set(authData.token);
          this.currentUser.set(user);
        }
      })
    );
  }

  register(payload: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.register, payload).pipe(
      tap(response => {
        if (response.success && response.data && response.data.token) {
          const authData = response.data;
          
          CookieUtils.setCookie('spip_token', authData.token, authData.expiresAt);
          
          const user: AuthUser = {
            userId: authData.userId,
            fullName: authData.fullName,
            userName: authData.userName,
            email: authData.email
          };
          
          localStorage.setItem('spip_user', JSON.stringify(user));
          
          this.currentToken.set(authData.token);
          this.currentUser.set(user);
        }
      })
    );
  }

  logout(): void {
    CookieUtils.removeCookie('spip_token');
    localStorage.removeItem('spip_user');
    this.currentToken.set(null);
    this.currentUser.set(null);
  }
}

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { AUTH_ENDPOINTS } from '../constants/auth.constants';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.currentToken();

  const isAuthEndpoint = req.url.includes(AUTH_ENDPOINTS.login) || req.url.includes(AUTH_ENDPOINTS.register);

  if (token && !isAuthEndpoint) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};

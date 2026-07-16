import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStorageService } from '../services/auth-storage.service';
import { AUTH_ROUTES } from '../constants/auth.constants';

export const authGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (authStorage.isAuthenticated()) {
    return true;
  }

  return router.parseUrl(AUTH_ROUTES.login);
};

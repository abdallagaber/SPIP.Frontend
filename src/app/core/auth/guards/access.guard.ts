import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthStorageService } from '../services/auth-storage.service';
import { Role, Permission } from '../models/auth.types';
import { AUTH_ROUTES } from '../constants/auth.constants';

export const accessGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (!authStorage.isAuthenticated()) {
    return router.parseUrl(AUTH_ROUTES.login);
  }

  const role = route.data['role'] as Role | undefined;
  const permissions = route.data['permissions'] as Permission[] | undefined;
  const requireAll = route.data['requireAll'] as boolean | undefined;

  const hasAccess = authService.canAccess({ role, permissions, requireAll });

  if (!hasAccess) {
    return router.parseUrl('/unauthorized');
  }

  return true;
};

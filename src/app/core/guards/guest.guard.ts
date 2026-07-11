import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const roles = authService.currentRoles();
    if (roles.length === 1) {
      return router.parseUrl(`/dashboard/${roles[0]}`);
    } else if (roles.length > 1) {
      return router.parseUrl('/dashboard/select');
    }
    return router.parseUrl('/dashboard');
  }

  return true;
};

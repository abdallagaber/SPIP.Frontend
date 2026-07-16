import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthStorageService } from '../../../core/auth/services/auth-storage.service';
import { DashboardNavigationService } from '../services/dashboard-navigation.service';

export const dashboardHomeGuard: CanActivateFn = () => {
  const navService = inject(DashboardNavigationService);
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  return toObservable(authStorage.isInitialized).pipe(
    filter(isInit => isInit === true),
    take(1),
    map(() => {
      const homeRoute = navService.homeRoute();
      return router.parseUrl(homeRoute || '/unauthorized');
    })
  );
};

import { Routes } from '@angular/router';
import { dashboardGuard } from '../../core/guards/dashboard.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [dashboardGuard],
    children: [
      {
        path: 'select',
        loadComponent: () => import('./select-dashboard/select-dashboard.component').then(m => m.SelectDashboardComponent)
      },
      {
        path: 'admin',
        loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'manager',
        loadComponent: () => import('./manager/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
      },
      {
        path: 'accountant',
        loadComponent: () => import('./accountant/accountant-dashboard.component').then(m => m.AccountantDashboardComponent)
      }
    ]
  }
];

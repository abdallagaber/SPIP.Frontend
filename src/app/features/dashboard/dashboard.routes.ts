import { Routes } from '@angular/router';
import { accessGuard } from '../../core/auth/guards/access.guard';
import { PERMISSIONS } from '../../core/auth/constants/permissions';
import { DashboardRouteData } from './models/navigation/dashboard-route-data.model';
import { dashboardHomeGuard } from './guards/dashboard-home.guard';
import { DashboardRedirectComponent } from './components/dashboard-redirect.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardRedirectComponent,
    canActivate: [dashboardHomeGuard]
  },
  {
    path: 'home',
    canActivate: [accessGuard],
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      permissions: [PERMISSIONS.dashboard.view]
    } as DashboardRouteData,
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'users',
    canActivate: [accessGuard],
    data: {
      title: 'Users',
      permissions: [PERMISSIONS.users.view]
    } as DashboardRouteData,
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'roles',
    canActivate: [accessGuard],
    data: {
      title: 'Roles',
      permissions: [PERMISSIONS.roles.view]
    } as DashboardRouteData,
    loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent)
  },
  {
    path: 'vendors',
    data: {
      title: 'Vendors',
      breadcrumb: 'Vendors'
    } as DashboardRouteData,
    loadChildren: () => import('../vendors/vendors.routes').then(m => m.VENDORS_ROUTES)
  },
  {
    path: 'products',
    data: {
      title: 'Products',
      breadcrumb: 'Products'
    } as DashboardRouteData,
    loadChildren: () => import('../products/products.routes').then(m => m.PRODUCTS_ROUTES)
  },
  {
    path: 'po-imports',
    canActivate: [accessGuard],
    data: {
      title: 'PO Imports',
      permissions: [PERMISSIONS.poImports.view]
    } as DashboardRouteData,
    loadComponent: () => import('./pages/po-imports/po-imports.component').then(m => m.PoImportsComponent)
  },
  {
    path: 'vendor-mappings',
    canActivate: [accessGuard],
    data: {
      title: 'Vendor Mappings',
      permissions: [PERMISSIONS.vendorMappings.view]
    } as DashboardRouteData,
    loadComponent: () => import('./pages/vendor-mappings/vendor-mappings.component').then(m => m.VendorMappingsComponent)
  },
  {
    path: 'reports',
    canActivate: [accessGuard],
    data: {
      title: 'Reports',
      permissions: [PERMISSIONS.reports.view]
    } as DashboardRouteData,
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
  }
];

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
    canActivate: [accessGuard],
    data: {
      title: 'Vendors',
      permissions: [PERMISSIONS.vendors.view]
    } as DashboardRouteData,
    loadComponent: () => import('./pages/vendors/vendors.component').then(m => m.VendorsComponent)
  },
  {
    path: 'products',
    canActivate: [accessGuard],
    data: {
      title: 'Products',
      permissions: [PERMISSIONS.products.view]
    } as DashboardRouteData,
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
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

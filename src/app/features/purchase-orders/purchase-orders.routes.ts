import { Routes } from '@angular/router';
import { accessGuard } from '../../core/auth/guards/access.guard';
import { PERMISSIONS } from '../../core/auth/constants/permissions';

export const PURCHASE_ORDERS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'import',
    pathMatch: 'full'
  },
  {
    path: 'import',
    canActivate: [accessGuard],
    data: {
      title: 'Import PO',
      breadcrumb: 'Import PO',
      permissions: [PERMISSIONS.poImports.view] // Use the appropriate permission from constants
    },
    loadComponent: () => import('./import/pages/po-import-page/po-import-page.component').then(m => m.PoImportPageComponent)
  }
];

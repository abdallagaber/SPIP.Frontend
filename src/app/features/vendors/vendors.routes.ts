import { Routes } from '@angular/router';
import { accessGuard } from '../../core/auth/guards/access.guard';
import { PERMISSIONS } from '../../core/auth/constants/permissions';
import { VendorStore, VENDOR_TABLE_STORE, VENDOR_CRUD_STORE } from './stores/vendor.store';
import { BaseTableStore } from '../../shared/table/services/base-table.store';
import { CrudStateStore } from '../../shared/table/services/crud-state.store';
import { VendorFacade } from './facades/vendor.facade';
import { VendorService } from './services/vendor.service';

export const VENDORS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      VendorService,
      { provide: VENDOR_TABLE_STORE, useClass: BaseTableStore },
      { provide: VENDOR_CRUD_STORE, useClass: CrudStateStore },
      VendorStore,
      VendorFacade
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/vendor-list/vendor-list').then(m => m.VendorListComponent),
        canActivate: [accessGuard],
        data: { permissions: [PERMISSIONS.vendors.view] }
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/vendor-create/vendor-create').then(m => m.VendorCreateComponent),
        canActivate: [accessGuard],
        data: { permissions: [PERMISSIONS.vendors.create] }
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/vendor-edit/vendor-edit').then(m => m.VendorEditComponent),
        canActivate: [accessGuard],
        data: { permissions: [PERMISSIONS.vendors.update] }
      }
    ]
  }
];

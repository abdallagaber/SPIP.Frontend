import { Routes } from '@angular/router';
import { accessGuard } from '../../core/auth/guards/access.guard';
import { PERMISSIONS } from '../../core/auth/constants/permissions';
import { BaseTableStore } from '../../shared/table/services/base-table.store';
import { CrudStateStore } from '../../shared/table/services/crud-state.store';

import { UserService } from './api/services/user.service';
import { RoleLookupService } from '../../shared/lookups/services/role-lookup.service';
import { USER_TABLE_STORE, USER_CRUD_STORE } from './stores/user.tokens';
import { UserStore } from './stores/user.store';
import { UserFacade } from './facades/user.facade';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      UserService,
      RoleLookupService,
      { provide: USER_TABLE_STORE, useClass: BaseTableStore },
      { provide: USER_CRUD_STORE, useClass: CrudStateStore },
      UserStore,
      UserFacade
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/user-list/user-list.component').then(m => m.UserListComponent),
        canActivate: [accessGuard],
        data: { permissions: [PERMISSIONS.users.view] }
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/user-edit/user-edit.component').then(m => m.UserEditComponent),
        canActivate: [accessGuard],
        data: { permissions: [PERMISSIONS.users.update] }
      }
    ]
  }
];

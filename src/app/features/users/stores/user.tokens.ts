import { InjectionToken } from '@angular/core';
import { BaseTableStore } from '../../../shared/table/services/base-table.store';
import { CrudStateStore } from '../../../shared/table/services/crud-state.store';
import { User } from '../models/user.model';

export const USER_TABLE_STORE = new InjectionToken<BaseTableStore<User>>('USER_TABLE_STORE');
export const USER_CRUD_STORE = new InjectionToken<CrudStateStore<User>>('USER_CRUD_STORE');

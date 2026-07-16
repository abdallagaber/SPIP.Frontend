import { InjectionToken } from '@angular/core';
import { BaseTableStore } from '../../../shared/table/services/base-table.store';
import { CrudStateStore } from '../../../shared/table/services/crud-state.store';
import { Product } from '../models/product.model';

export const PRODUCT_TABLE_STORE = new InjectionToken<BaseTableStore<Product>>('PRODUCT_TABLE_STORE');
export const PRODUCT_CRUD_STORE = new InjectionToken<CrudStateStore<Product>>('PRODUCT_CRUD_STORE');

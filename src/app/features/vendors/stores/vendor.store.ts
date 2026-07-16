import { Injectable, InjectionToken, Inject } from '@angular/core';
import { BaseTableStore } from '../../../shared/table/services/base-table.store';
import { CrudStateStore } from '../../../shared/table/services/crud-state.store';
import { Vendor } from '../models/vendor.model';

export const VENDOR_TABLE_STORE = new InjectionToken<BaseTableStore<Vendor>>('VENDOR_TABLE_STORE');
export const VENDOR_CRUD_STORE = new InjectionToken<CrudStateStore<Vendor>>('VENDOR_CRUD_STORE');

@Injectable()
export class VendorStore {
  constructor(
    @Inject(VENDOR_TABLE_STORE) readonly table: BaseTableStore<Vendor>,
    @Inject(VENDOR_CRUD_STORE) readonly crud: CrudStateStore<Vendor>
  ) {}
}

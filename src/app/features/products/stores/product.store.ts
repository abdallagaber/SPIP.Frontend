import { Injectable, inject } from '@angular/core';
import { PRODUCT_TABLE_STORE, PRODUCT_CRUD_STORE } from './product.tokens';

@Injectable()
export class ProductStore {
  readonly table = inject(PRODUCT_TABLE_STORE);
  readonly crud = inject(PRODUCT_CRUD_STORE);
}

import { Injectable, inject } from '@angular/core';
import { USER_TABLE_STORE, USER_CRUD_STORE } from './user.tokens';

@Injectable()
export class UserStore {
  readonly tableStore = inject(USER_TABLE_STORE);
  readonly crudStore = inject(USER_CRUD_STORE);
}

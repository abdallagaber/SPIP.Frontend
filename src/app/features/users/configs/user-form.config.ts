import { Validators } from '@angular/forms';

export const USER_FORM_CONFIG = {
  fullName: ['', [Validators.required]],
  roleId: ['', [Validators.required]],
  isActive: [true]
};

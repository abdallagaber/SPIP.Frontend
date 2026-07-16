import { Validators } from '@angular/forms';

export const VENDOR_FORM_CONFIG = {
  erpId: ['', Validators.required],
  name: ['', Validators.required],
  taxRegistrationNumber: ['', Validators.required],
  contactEmail: ['', [Validators.required, Validators.email]],
  contactPhone: ['', Validators.required],
  address: ['', Validators.required]
};

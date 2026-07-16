import { Validators } from '@angular/forms';

export const PRODUCT_FORM_CONFIG = {
  erpId: ['', [Validators.required]],
  name: ['', [Validators.required]],
  sku: ['', [Validators.required]],
  barcode: [''],
  description: [''],
  unitPrice: [0, [Validators.required, Validators.min(0)]],
  uom: [''],
  vendorId: [null as number | null, [Validators.required]]
};

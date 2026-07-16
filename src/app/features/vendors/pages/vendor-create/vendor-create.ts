import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorFacade } from '../../facades/vendor.facade';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { VENDOR_FORM_CONFIG } from '../../config/vendor-form.config';

@Component({
  selector: 'app-vendor-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './vendor-create.html'
})
export class VendorCreateComponent {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(VendorFacade);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group(VENDOR_FORM_CONFIG);

  onSubmit() {
    if (this.form.valid) {
      this.facade.createVendor(this.form.getRawValue(), this.router);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/vendors']);
  }
}

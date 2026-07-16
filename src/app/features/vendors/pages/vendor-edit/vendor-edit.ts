import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorFacade } from '../../facades/vendor.facade';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { VENDOR_FORM_CONFIG } from '../../config/vendor-form.config';

@Component({
  selector: 'app-vendor-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SkeletonModule
  ],
  templateUrl: './vendor-edit.html'
})
export class VendorEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(VendorFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private vendorId: string | null = null;

  form = this.fb.nonNullable.group(VENDOR_FORM_CONFIG);

  constructor() {
    effect(() => {
      const vendor = this.facade.selectedItem();
      console.log('[COMPONENT] Vendor:', vendor);

      if (vendor && vendor.id.toString() === this.vendorId) {
        this.form.patchValue({
          erpId: vendor.erpId,
          name: vendor.name,
          taxRegistrationNumber: vendor.taxRegistrationNumber,
          contactEmail: vendor.contactEmail,
          contactPhone: vendor.contactPhone,
          address: vendor.address
        });
        console.log('[FORM]', this.form.getRawValue());
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.vendorId = params.get('id');
      console.log('[EDIT] Route ID:', this.vendorId);
      if (this.vendorId) {
        this.facade.loadVendor(this.vendorId);
      }
    });
  }

  onSubmit() {
    if (this.form.valid && this.vendorId) {
      const payload = {
        id: this.vendorId,
        ...this.form.getRawValue()
      };
      this.facade.updateVendor(this.vendorId, payload, this.router);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/vendors']);
  }
}

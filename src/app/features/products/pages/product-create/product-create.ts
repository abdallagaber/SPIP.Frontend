import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductFacade } from '../../facades/product.facade';
import { VendorLookupService } from '../../../../shared/lookups/services/vendor-lookup.service';
import { PRODUCT_FORM_CONFIG } from '../../configs/product-form.config';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './product-create.html'
})
export class ProductCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(ProductFacade);
  readonly vendorLookup = inject(VendorLookupService);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group(PRODUCT_FORM_CONFIG);

  ngOnInit() {
    this.vendorLookup.loadVendors().subscribe();
  }

  onSubmit() {
    if (this.form.valid) {
      const payload = this.form.getRawValue() as unknown as import('../../models/product.model').CreateProductRequest;
      this.facade.createProduct(payload, this.router);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/products']);
  }
}

import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFacade } from '../../facades/product.facade';
import { VendorLookupService } from '../../../../shared/lookups/services/vendor-lookup.service';
import { PRODUCT_FORM_CONFIG } from '../../configs/product-form.config';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    SkeletonModule
  ],
  templateUrl: './product-edit.html'
})
export class ProductEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(ProductFacade);
  readonly vendorLookup = inject(VendorLookupService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private productId: string | null = null;

  form = this.fb.nonNullable.group(PRODUCT_FORM_CONFIG);

  constructor() {
    effect(() => {
      const product = this.facade.selectedItem();
      if (product && product.id.toString() === this.productId) {
        this.form.patchValue({
          erpId: product.erpId,
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          description: product.description,
          unitPrice: product.unitPrice,
          uom: product.uom,
          vendorId: product.vendorId
        });
      }
    });
  }

  ngOnInit() {
    this.vendorLookup.loadVendors().subscribe();
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.facade.loadProduct(this.productId);
      }
    });
  }

  onSubmit() {
    if (this.form.valid && this.productId) {
      const payload = {
        id: this.productId,
        ...this.form.getRawValue()
      } as unknown as import('../../models/product.model').UpdateProductRequest;
      this.facade.updateProduct(this.productId, payload, this.router);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/products']);
  }
}

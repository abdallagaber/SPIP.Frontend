import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductFacade } from '../../facades/product.facade';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { PERMISSIONS } from '../../../../core/auth/constants/permissions';
import { PRODUCT_TABLE_COLUMNS } from '../../configs/product-table-columns.config';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { ToolbarComponent } from '../../../../shared/table/components/toolbar/toolbar';
import { PaginationComponent } from '../../../../shared/table/components/pagination/pagination';
import { EmptyStateComponent } from '../../../../shared/table/components/empty-state/empty-state';
import { LoadingSkeletonComponent } from '../../../../shared/table/components/loading-skeleton/loading-skeleton';
import { ErrorStateComponent } from '../../../../shared/table/components/error-state/error-state';
import { DeleteConfirmationComponent } from '../../../../shared/dialogs/components/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    TooltipModule,
    ToolbarComponent,
    PaginationComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSkeletonComponent,
    DeleteConfirmationComponent
  ],
  templateUrl: './product-list.html'
})
export class ProductListComponent implements OnInit {
  facade = inject(ProductFacade);
  authService = inject(AuthService);
  router = inject(Router);

  columns = PRODUCT_TABLE_COLUMNS;
  
  canCreate = this.authService.hasPermission(PERMISSIONS.products.create);
  canUpdate = this.authService.hasPermission(PERMISSIONS.products.update);
  canDelete = this.authService.hasPermission(PERMISSIONS.products.delete);

  deleteDialogVisible = false;
  productToDelete: string | number | null = null;

  ngOnInit() {
    this.facade.loadProducts();
  }

  onAdd() {
    this.router.navigate(['/dashboard/products/create']);
  }

  onEdit(id: string | number) {
    this.router.navigate(['/dashboard/products', id, 'edit']);
  }

  confirmDelete(id: string | number) {
    this.productToDelete = id;
    this.deleteDialogVisible = true;
  }

  onDelete() {
    if (this.productToDelete) {
      this.facade.deleteProduct(this.productToDelete, () => {
        this.deleteDialogVisible = false;
        this.productToDelete = null;
      });
    }
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorFacade } from '../../facades/vendor.facade';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { PERMISSIONS } from '../../../../core/auth/constants/permissions';
import { VENDOR_TABLE_COLUMNS } from '../../config/vendor-table-columns.config';
import { Vendor } from '../../models/vendor.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

import { ToolbarComponent } from '../../../../shared/table/components/toolbar/toolbar';
import { PaginationComponent } from '../../../../shared/table/components/pagination/pagination';
import { EmptyStateComponent } from '../../../../shared/table/components/empty-state/empty-state';
import { LoadingSkeletonComponent } from '../../../../shared/table/components/loading-skeleton/loading-skeleton';
import { ErrorStateComponent } from '../../../../shared/table/components/error-state/error-state';
import { DeleteConfirmationComponent } from '../../../../shared/dialogs/components/delete-confirmation/delete-confirmation';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    ToggleSwitchModule,
    FormsModule,
    TooltipModule,
    ToolbarComponent,
    PaginationComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSkeletonComponent,
    DeleteConfirmationComponent
  ],
  templateUrl: './vendor-list.html'
})
export class VendorListComponent implements OnInit {
  facade = inject(VendorFacade);
  authService = inject(AuthService);
  router = inject(Router);

  columns = VENDOR_TABLE_COLUMNS;
  
  canCreate = this.authService.hasPermission(PERMISSIONS.vendors.create);
  canUpdate = this.authService.hasPermission(PERMISSIONS.vendors.update);
  canDelete = this.authService.hasPermission(PERMISSIONS.vendors.delete);

  deleteDialogVisible = false;
  vendorToDelete: string | null = null;

  ngOnInit() {
    this.facade.loadVendors();
  }

  onAdd() {
    this.router.navigate(['/dashboard/vendors/create']);
  }

  onEdit(id: string) {
    this.router.navigate(['/dashboard/vendors', id, 'edit']);
  }

  confirmDelete(id: string) {
    this.vendorToDelete = id;
    this.deleteDialogVisible = true;
  }

  onDelete() {
    if (this.vendorToDelete) {
      this.facade.deleteVendor(this.vendorToDelete, () => {
        this.deleteDialogVisible = false;
        this.vendorToDelete = null;
      });
    }
  }

  onToggleApproval(vendor: Vendor) {
    this.facade.toggleApproval(vendor);
  }
}

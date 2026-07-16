import { Injectable, inject } from '@angular/core';
import { VendorService } from '../services/vendor.service';
import { VendorStore } from '../stores/vendor.store';
import { CreateVendorRequest, UpdateVendorRequest, Vendor } from '../models/vendor.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VendorFacade {
  readonly state;
  readonly items;
  readonly totalCount;
  readonly pageNumber;
  readonly pageSize;
  readonly searchTerm;
  readonly loading;

  readonly createLoading;
  readonly updateLoading;
  readonly deleteLoading;
  readonly selectedItem;

  constructor(
    private readonly service: VendorService,
    private readonly store: VendorStore,
    private readonly messageService: MessageService
  ) {
    this.state = this.store.table.state;
    this.items = this.store.table.items;
    this.totalCount = this.store.table.totalCount;
    this.pageNumber = this.store.table.pageNumber;
    this.pageSize = this.store.table.pageSize;
    this.searchTerm = this.store.table.searchTerm;
    this.loading = this.store.table.loading;

    this.createLoading = this.store.crud.createLoading;
    this.updateLoading = this.store.crud.updateLoading;
    this.deleteLoading = this.store.crud.deleteLoading;
    this.selectedItem = this.store.crud.selectedItem;
  }

  loadVendors() {
    this.store.table.setLoading(true);
    this.service.getVendors(this.pageNumber(), this.pageSize(), this.searchTerm())
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.store.table.setItems(response.data.items, response.data.totalCount);
          } else {
            this.store.table.setError(response.message || 'Failed to load vendors');
          }
          this.store.table.setLoading(false);
        },
        error: () => {
          this.store.table.setError('An error occurred while loading vendors');
          this.store.table.setLoading(false);
        }
      });
  }

  setPage(pageNumber: number, pageSize: number) {
    this.store.table.setPage(pageNumber, pageSize);
    this.loadVendors();
  }

  setSearchTerm(term: string) {
    this.store.table.setSearchTerm(term);
    this.loadVendors();
  }

  loadVendor(id: string) {
    this.store.crud.setUpdateLoading(true);
    this.service.getVendor(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.store.crud.selectItem(response.data, id);
          console.log('[FACADE]', this.selectedItem());
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to load vendor' });
        }
        this.store.crud.setUpdateLoading(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while loading vendor' });
        this.store.crud.setUpdateLoading(false);
      }
    });
  }

  createVendor(vendor: CreateVendorRequest, router: any) {
    this.store.crud.setCreateLoading(true);
    this.service.createVendor(vendor).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vendor created successfully' });
          router.navigate(['/dashboard/vendors']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to create vendor' });
        }
        this.store.crud.setCreateLoading(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
        this.store.crud.setCreateLoading(false);
      }
    });
  }

  updateVendor(id: string, vendor: UpdateVendorRequest, router: any) {
    this.store.crud.setUpdateLoading(true);
    this.service.updateVendor(id, vendor).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vendor updated successfully' });
          router.navigate(['/dashboard/vendors']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to update vendor' });
        }
        this.store.crud.setUpdateLoading(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
        this.store.crud.setUpdateLoading(false);
      }
    });
  }

  deleteVendor(id: string, onSuccess?: () => void) {
    this.store.crud.setDeleteLoading(true);
    this.service.deleteVendor(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vendor deleted successfully' });
          this.loadVendors();
          if (onSuccess) onSuccess();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to delete vendor' });
        }
        this.store.crud.setDeleteLoading(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
        this.store.crud.setDeleteLoading(false);
      }
    });
  }

  toggleApproval(vendor: Vendor) {
    const originalState = vendor.isApproved;
    // Optimistic update
    const updatedItems = this.store.table.items().map(v => v.id === vendor.id ? { ...v, isApproved: !originalState } : v);
    this.store.table.items.set(updatedItems);

    this.service.toggleApproval(vendor.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vendor approval status updated' });
        } else {
          this.rollbackApproval(vendor.id, originalState);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to update approval status' });
        }
      },
      error: () => {
        this.rollbackApproval(vendor.id, originalState);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
      }
    });
  }

  private rollbackApproval(id: string, originalState: boolean) {
    const rollbackItems = this.store.table.items().map(v => v.id === id ? { ...v, isApproved: originalState } : v);
    this.store.table.items.set(rollbackItems);
  }
}

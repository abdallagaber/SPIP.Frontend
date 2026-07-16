import { Injectable, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { UserService } from '../api/services/user.service';
import { UserStore } from '../stores/user.store';
import { User, UpdateUserRequest } from '../models/user.model';

@Injectable()
export class UserFacade {
  private readonly userService = inject(UserService);
  private readonly store = inject(UserStore);
  private readonly messageService = inject(MessageService);

  // Table State
  readonly items = this.store.tableStore.items;
  readonly loading = this.store.tableStore.loading;
  readonly error = this.store.tableStore.error;
  readonly totalCount = this.store.tableStore.totalCount;
  readonly pageNumber = this.store.tableStore.pageNumber;
  readonly pageSize = this.store.tableStore.pageSize;
  readonly searchTerm = this.store.tableStore.searchTerm;
  readonly hasData = this.store.tableStore.hasData;
  readonly state = this.store.tableStore.state;

  // CRUD State
  readonly selectedItem = this.store.crudStore.selectedItem;
  readonly updateLoading = this.store.crudStore.updateLoading;
  readonly updateError = this.store.crudStore.updateError;
  readonly deleteLoading = this.store.crudStore.deleteLoading;

  setSearchTerm(term: string) {
    this.store.tableStore.setSearchTerm(term);
    this.loadUsers();
  }

  setPage(pageNumber: number, pageSize: number) {
    this.store.tableStore.setPage(pageNumber, pageSize);
    this.loadUsers();
  }

  loadUsers() {
    this.store.tableStore.setLoading(true);
    
    this.userService.getUsers(
      this.searchTerm(),
      undefined, // role filter not implemented in list UI yet
      undefined, // isActive filter not implemented in list UI yet
      this.pageNumber(),
      this.pageSize()
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.store.tableStore.setItems(response.data.items, response.data.totalCount);
        } else {
          this.store.tableStore.setError(response.message || 'Failed to load users');
        }
        this.store.tableStore.setLoading(false);
      },
      error: (err) => {
        this.store.tableStore.setError(err.error?.message || 'An error occurred while loading users');
        this.store.tableStore.setLoading(false);
      }
    });
  }

  loadUser(id: number) {
    this.store.crudStore.setUpdateLoading(true);
    this.userService.getById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.store.crudStore.selectItem(response.data, id);
        } else {
          this.store.crudStore.setUpdateError(response.message || 'Failed to load user');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to load user' });
        }
        this.store.crudStore.setUpdateLoading(false);
      },
      error: (err) => {
        this.store.crudStore.setUpdateError(err.error?.message || 'An error occurred');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to load user' });
        this.store.crudStore.setUpdateLoading(false);
      }
    });
  }

  updateUser(id: number, data: UpdateUserRequest, router: Router) {
    this.store.crudStore.setUpdateLoading(true);
    this.userService.update(id, data).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
          router.navigate(['/dashboard/users']);
        } else {
          this.store.crudStore.setUpdateError(response.message || 'Failed to update user');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to update user' });
        }
        this.store.crudStore.setUpdateLoading(false);
      },
      error: (err) => {
        this.store.crudStore.setUpdateError(err.error?.message || 'An error occurred');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update user' });
        this.store.crudStore.setUpdateLoading(false);
      }
    });
  }

  deleteUser(id: number) {
    this.store.crudStore.setDeleteLoading(true);
    this.userService.delete(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });
          this.loadUsers(); // Refresh table
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to delete user' });
          this.store.crudStore.setDeleteLoading(false);
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to delete user' });
        this.store.crudStore.setDeleteLoading(false);
      }
    });
  }

  toggleStatus(user: User) {
    const originalState = user.isActive;
    // Optimistic update
    const updatedItems = this.store.tableStore.items().map(u => u.id === user.id ? { ...u, isActive: !originalState } : u);
    this.store.tableStore.items.set(updatedItems);

    this.userService.toggleStatus(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User status updated successfully' });
        } else {
          this.rollbackStatus(user.id, originalState);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to update status' });
        }
      },
      error: (err) => {
        this.rollbackStatus(user.id, originalState);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update status' });
      }
    });
  }

  private rollbackStatus(id: number, originalState: boolean) {
    const rollbackItems = this.store.tableStore.items().map(u => u.id === id ? { ...u, isActive: originalState } : u);
    this.store.tableStore.items.set(rollbackItems);
  }
}

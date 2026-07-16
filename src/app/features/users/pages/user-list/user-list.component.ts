import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { UserFacade } from '../../facades/user.facade';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { PERMISSIONS } from '../../../../core/auth/constants/permissions';
import { USER_TABLE_COLUMNS } from '../../configs/user-table-columns.config';

import { ToolbarComponent } from '../../../../shared/table/components/toolbar/toolbar';
import { PaginationComponent } from '../../../../shared/table/components/pagination/pagination';
import { EmptyStateComponent } from '../../../../shared/table/components/empty-state/empty-state';
import { LoadingSkeletonComponent } from '../../../../shared/table/components/loading-skeleton/loading-skeleton';
import { ErrorStateComponent } from '../../../../shared/table/components/error-state/error-state';
import { DeleteConfirmationComponent } from '../../../../shared/dialogs/components/delete-confirmation/delete-confirmation';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TableModule, 
    ButtonModule, 
    TooltipModule,
    ToggleSwitchModule,
    ToolbarComponent,
    PaginationComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSkeletonComponent,
    DeleteConfirmationComponent
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  facade = inject(UserFacade);
  authService = inject(AuthService);
  router = inject(Router);

  columns = USER_TABLE_COLUMNS;
  
  // Note: users.delete is missing from permissions.ts, falling back to update for demo purposes
  canUpdate = this.authService.hasPermission(PERMISSIONS.users.update);
  canDelete = this.authService.hasPermission(PERMISSIONS.users.update);
  canToggle = this.authService.hasPermission(PERMISSIONS.users.activate) || this.authService.hasPermission(PERMISSIONS.users.deactivate);

  deleteDialogVisible = false;
  userToDelete: number | null = null;

  ngOnInit() {
    this.facade.loadUsers();
  }

  onEdit(id: number) {
    this.router.navigate(['/dashboard/users', id, 'edit']);
  }

  confirmDelete(id: number) {
    this.userToDelete = id;
    this.deleteDialogVisible = true;
  }

  onDelete() {
    if (this.userToDelete !== null) {
      this.facade.deleteUser(this.userToDelete);
      this.deleteDialogVisible = false;
      this.userToDelete = null;
    }
  }

  onToggleStatus(user: User) {
    this.facade.toggleStatus(user);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { PermissionsMatrixComponent } from '../../components/permissions-matrix/permissions-matrix.component';
import { RoleDialogComponent } from '../../components/role-dialog/role-dialog.component';
import { DeleteRoleDialogComponent } from '../../components/delete-role-dialog/delete-role-dialog.component';
import { RolesFacade } from '../../services/roles-facade.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { PERMISSIONS } from '../../../../../core/auth/constants/permissions';

@Component({
  selector: 'app-roles-permissions-page',
  standalone: true,
  imports: [
    CommonModule,
    RoleListComponent,
    PermissionsMatrixComponent,
    RoleDialogComponent,
    DeleteRoleDialogComponent,
    ToolbarModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './roles-permissions-page.component.html'
})
export class RolesPermissionsPageComponent implements OnInit {
  readonly facade = inject(RolesFacade);
  readonly authService = inject(AuthService);

  showRoleDialog = false;
  showDeleteDialog = false;

  readonly canCreateRole = this.authService.hasPermission(PERMISSIONS.roles.create);
  readonly canEditRole = this.authService.hasPermission(PERMISSIONS.roles.update);
  readonly canDeleteRole = this.authService.hasPermission(PERMISSIONS.roles.delete);

  ngOnInit() {
    this.facade.loadInitialData();
  }

  openCreateDialog() {
    this.facade.selectedRole.set(null); // Clear selection for create
    this.showRoleDialog = true;
  }

  openEditDialog() {
    if (this.facade.selectedRole()) {
      this.showRoleDialog = true;
    }
  }

  openDeleteDialog() {
    if (this.facade.selectedRole()) {
      this.showDeleteDialog = true;
    }
  }

  refresh() {
    this.facade.loadRoles();
  }
}

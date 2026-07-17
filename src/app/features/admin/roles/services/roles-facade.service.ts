import { computed, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PERMISSIONS } from '../../../../core/auth/constants/permissions';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { PermissionModule } from '../../../../core/api/roles/models/permission.model';
import { Role } from '../../../../core/api/roles/models/role.model';
import { PermissionsService } from '../../../../core/api/roles/services/permissions.service';
import { RolesService } from '../../../../core/api/roles/services/roles.service';
import { PermissionMatrixRow, PermissionCell } from '../models/permission-matrix.model';

@Injectable({
  providedIn: 'root'
})
export class RolesFacade {
  private readonly rolesService = inject(RolesService);
  private readonly permissionsService = inject(PermissionsService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  // State
  readonly roles = signal<Role[]>([]);
  readonly selectedRole = signal<Role | null>(null);
  readonly selectedPermissionIds = signal<Set<number>>(new Set());
  readonly originalPermissionIds = signal<Set<number>>(new Set());
  readonly permissionModules = signal<PermissionModule[]>([]);
  readonly loading = signal<boolean>(false);
  readonly roleDetailsLoading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly search = signal<string>('');

  // Computed
  readonly selectedRoleId = computed(() => this.selectedRole()?.id ?? null);
  
  readonly filteredRoles = computed(() => {
    const term = this.search().toLowerCase();
    if (!term) return this.roles();
    return this.roles().filter(r => r.name.toLowerCase().includes(term));
  });

  readonly hasUnsavedChanges = computed(() => {
    const selected = this.selectedPermissionIds();
    const original = this.originalPermissionIds();
    if (selected.size !== original.size) return true;
    for (const id of selected) {
      if (!original.has(id)) return true;
    }
    return false;
  });

  readonly selectedRolePermissionCount = computed(() => this.selectedPermissionIds().size);

  readonly canEditPermissions = computed(() => this.authService.hasPermission(PERMISSIONS.roles.update));

  readonly matrixColumns = computed(() => {
    const modules = this.permissionModules();
    const actions = new Set<string>();
    
    modules.forEach(m => {
      m.permissions.forEach(p => {
        const action = p.systemName.split('.')[1];
        if (action) {
          actions.add(action);
        }
      });
    });

    // We can define a preferred stable order here, or just Array.from
    const stableOrder = ['View', 'Create', 'Update', 'Delete', 'Activate', 'Deactivate', 'Import', 'Manage'];
    const result: string[] = [];
    
    // First push the standard actions in order
    stableOrder.forEach(a => {
      if (actions.has(a)) {
        result.push(a);
        actions.delete(a);
      }
    });
    
    // Then push any remaining actions
    Array.from(actions).sort().forEach(a => result.push(a));
    
    return result;
  });

  readonly groupedPermissions = computed(() => {
    const modules = this.permissionModules();
    
    return modules.map(m => {
      const cells: PermissionCell[] = m.permissions.map(p => {
        const action = p.systemName.split('.')[1] || p.systemName;
        return {
          id: p.id,
          systemName: p.systemName,
          displayName: p.displayName,
          action
        };
      });
      
      return {
        moduleName: m.moduleName,
        permissions: cells
      } as PermissionMatrixRow;
    });
  });

  // Actions
  loadInitialData() {
    this.loading.set(true);
    
    this.permissionsService.getPermissions().subscribe({
      next: (res) => {
        if (res.success) {
          this.permissionModules.set(res.data);
        }
      },
      error: () => this.showError('Failed to load permissions')
    });

    this.loadRoles();
  }

  loadRoles(preserveSelection = true) {
    this.loading.set(true);
    // Hardcoding page size for the view
    this.rolesService.getRoles(1, 100).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (res) => {
        if (res.success) {
          const fetchedRoles = res.data.items || [];
          this.roles.set(fetchedRoles);
          
          if (preserveSelection) {
            this.enforceSelectionRules();
          }
        }
      },
      error: () => this.showError('Failed to load roles')
    });
  }

  private enforceSelectionRules() {
    const currentRoles = this.roles();
    const currentSelectedId = this.selectedRoleId();
    
    if (currentRoles.length === 0) {
      this.selectedRole.set(null);
      return;
    }
    
    if (currentSelectedId) {
      const stillExists = currentRoles.find(r => r.id === currentSelectedId);
      if (stillExists) {
        // Keep selection but update to latest object reference
        this.selectedRole.set(stillExists);
        return;
      }
    }
    
    // If deleted or not found, select first
    this.selectRole(currentRoles[0]);
  }

  selectRole(role: Role | null) {
    if (!role) {
      this.selectedRole.set(null);
      this.selectedPermissionIds.set(new Set());
      this.originalPermissionIds.set(new Set());
      return;
    }

    if (this.hasUnsavedChanges()) {
       // Ideally we'd prompt the user, but for now we discard unsaved changes on selection change
       // We can just proceed and override
    }

    this.selectedRole.set(role);
    this.roleDetailsLoading.set(true);

    this.rolesService.getRoleById(role.id).pipe(
      finalize(() => this.roleDetailsLoading.set(false))
    ).subscribe({
      next: (res) => {
        if (res.success && res.data.permissionIds) {
          const ids = new Set<number>(res.data.permissionIds);
          this.selectedPermissionIds.set(ids);
          this.originalPermissionIds.set(new Set<number>(ids)); // copy for diffing
        }
      },
      error: () => this.showError('Failed to load role details')
    });
  }

  togglePermission(permissionId: number) {
    const selected = new Set(this.selectedPermissionIds());
    if (selected.has(permissionId)) {
      selected.delete(permissionId);
    } else {
      selected.add(permissionId);
    }
    this.selectedPermissionIds.set(selected);
  }

  savePermissions() {
    const roleId = this.selectedRoleId();
    if (!roleId || !this.hasUnsavedChanges()) return;

    this.saving.set(true);
    const dto = { permissionIds: Array.from(this.selectedPermissionIds()) };

    this.rolesService.assignPermissions(roleId, dto).pipe(
      finalize(() => this.saving.set(false))
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.originalPermissionIds.set(new Set(this.selectedPermissionIds()));
          this.showSuccess('Permissions updated successfully.');
        } else {
          this.rollbackPermissions();
          this.showError('Failed to update permissions.');
        }
      },
      error: () => {
        this.rollbackPermissions();
        this.showError('Failed to update permissions.');
      }
    });
  }

  resetPermissions() {
    this.rollbackPermissions();
  }

  private rollbackPermissions() {
    this.selectedPermissionIds.set(new Set(this.originalPermissionIds()));
  }

  createRole(name: string) {
    this.rolesService.createRole({ name }).subscribe({
      next: (res) => {
        if (res.success) {
          this.showSuccess('Role created successfully.');
          this.loadRoles(true); // will enforce selection
        } else {
          this.showError('Failed to create role.');
        }
      },
      error: () => this.showError('Failed to create role.')
    });
  }

  updateRole(id: string, name: string) {
    this.rolesService.updateRole(id, { name }).subscribe({
      next: (res) => {
        if (res.success) {
          this.showSuccess('Role updated successfully.');
          this.loadRoles(true);
        } else {
          this.showError('Failed to update role.');
        }
      },
      error: () => this.showError('Failed to update role.')
    });
  }

  deleteRole(id: string) {
    const subject = new Subject<boolean>();
    this.rolesService.deleteRole(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.showSuccess('Role deleted successfully.');
          this.loadRoles(true); // will select first role if current was deleted
          subject.next(true);
        } else {
          this.showError('Failed to delete role.');
          subject.next(false);
        }
        subject.complete();
      },
      error: () => {
        this.showError('Failed to delete role.');
        subject.next(false);
        subject.complete();
      }
    });
    return subject.asObservable();
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}

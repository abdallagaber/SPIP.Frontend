import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { RolesFacade } from '../../services/roles-facade.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-permissions-matrix',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToggleSwitchModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule
  ],
  templateUrl: './permissions-matrix.component.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `]
})
export class PermissionsMatrixComponent {
  readonly facade = inject(RolesFacade);

  onTogglePermission(permissionId: number) {
    this.facade.togglePermission(permissionId);
  }

  onSave() {
    this.facade.savePermissions();
  }

  onCancel() {
    this.facade.resetPermissions();
  }

  getPermissionForAction(permissions: any[], action: string) {
    return permissions.find(p => p.action === action);
  }
}

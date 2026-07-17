import { Component, EventEmitter, inject, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RolesFacade } from '../../services/roles-facade.service';
import { Role } from '../../../../../core/api/roles/models/role.model';

@Component({
  selector: 'app-delete-role-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, FormsModule],
  template: `
    <p-dialog 
      header="Delete Role" 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{width: '450px'}" 
      (onHide)="close()">
      
      <div class="flex flex-col gap-4 py-4">
        <div class="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
          <i class="pi pi-exclamation-triangle text-2xl"></i>
          <span class="font-medium">You are about to permanently delete this role.</span>
        </div>

        <p class="text-gray-600 m-0">This action cannot be undone.</p>
        
        <p class="text-gray-700 m-0 mt-2">
          To confirm, type the role name below: <br/>
          Role: <strong>{{ role?.name }}</strong>
        </p>

        <div class="flex flex-col gap-2 mt-2">
          <input 
            pInputText 
            [ngModel]="confirmationText()" 
            (ngModelChange)="confirmationText.set($event)"
            [placeholder]="'Type \\'' + role?.name + '\\' to confirm'"
            class="w-full p-inputtext-sm"
            [disabled]="deleting()"
            autofocus
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="close()" [disabled]="deleting()"></p-button>
        <p-button label="Delete Role" severity="danger" (onClick)="confirm()" [loading]="deleting()" [disabled]="!canDelete()"></p-button>
      </div>
    </p-dialog>
  `
})
export class DeleteRoleDialogComponent {
  readonly facade = inject(RolesFacade);

  @Input() visible = false;
  @Input() role: Role | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  readonly confirmationText = signal('');
  readonly deleting = signal(false);

  readonly canDelete = computed(() => {
    const roleName = this.role?.name;
    if (!roleName) return false;
    return this.confirmationText().trim() === roleName;
  });

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    // Reset state after dialog closes so it's clean for the next time
    setTimeout(() => {
      this.confirmationText.set('');
      this.deleting.set(false);
    }, 300);
  }

  confirm() {
    if (!this.canDelete() || !this.role) return;

    this.deleting.set(true);
    
    this.facade.deleteRole(this.role.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.close();
      },
      error: () => {
        this.deleting.set(false);
      }
    });
  }
}

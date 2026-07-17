import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolesFacade } from '../../services/roles-facade.service';
import { Role } from '../../../../../core/api/roles/models/role.model';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  template: `
    <p-dialog
      [header]="role ? 'Edit Role' : 'Create Role'"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '400px' }"
      (onHide)="close()"
    >
      <form [formGroup]="form" (ngSubmit)="save()" class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium text-gray-700"
            >Role Name <span class="text-red-500">*</span></label
          >
          <input
            id="name"
            type="text"
            pInputText
            formControlName="name"
            placeholder="e.g. Administrator"
            autofocus
          />
          @if (form.get('name')?.invalid && form.get('name')?.touched) {
            <small class="text-red-500"
              >Role name is required and must be at least 2 characters.</small
            >
          }
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <p-button
            label="Cancel"
            severity="secondary"
            [outlined]="true"
            (onClick)="close()"
          ></p-button>
          <p-button
            label="Save"
            type="submit"
            [disabled]="form.invalid || facade.saving()"
          ></p-button>
        </div>
      </form>
    </p-dialog>
  `,
})
export class RoleDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(RolesFacade);

  @Input() visible = false;
  @Input() set role(val: Role | null) {
    this._role = val;
    if (val) {
      this.form.patchValue({ name: val.name });
    } else {
      this.form.reset();
    }
  }
  get role() {
    return this._role;
  }
  private _role: Role | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.form.reset();
  }

  save() {
    if (this.form.invalid) return;

    const name = this.form.value.name!;
    if (this.role) {
      this.facade.updateRole(this.role.id, name);
    } else {
      this.facade.createRole(name);
    }
    this.close();
  }
}

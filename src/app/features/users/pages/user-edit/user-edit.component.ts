import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageModule } from 'primeng/message';

import { UserFacade } from '../../facades/user.facade';
import { RoleLookupService } from '../../../../shared/lookups/services/role-lookup.service';
import { USER_FORM_CONFIG } from '../../configs/user-form.config';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    ToggleSwitchModule,
    MessageModule
  ],
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  readonly facade = inject(UserFacade);
  readonly roleLookup = inject(RoleLookupService);

  form: FormGroup = this.fb.group(USER_FORM_CONFIG);
  private id!: number;

  constructor() {
    effect(() => {
      const user = this.facade.selectedItem();
      if (user) {
        this.form.patchValue({
          fullName: user.fullName,
          roleId: user.roleId,
          isActive: user.isActive
        });
      }
    });
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.roleLookup.loadRoles()?.subscribe();
    this.facade.loadUser(this.id);
  }

  ngOnDestroy() {
    // Optionally clean up
  }

  onSubmit() {
    if (this.form.valid) {
      this.facade.updateUser(this.id, this.form.value, this.router);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/users']);
  }
}

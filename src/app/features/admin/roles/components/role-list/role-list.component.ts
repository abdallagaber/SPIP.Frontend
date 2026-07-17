import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RolesFacade } from '../../services/roles-facade.service';
import { Role } from '../../../../../core/api/roles/models/role.model';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    SkeletonModule
  ],
  templateUrl: './role-list.component.html'
})
export class RoleListComponent {
  readonly facade = inject(RolesFacade);

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.facade.search.set(input.value);
  }

  onSelectRole(role: Role) {
    this.facade.selectRole(role);
  }
}

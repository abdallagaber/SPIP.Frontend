import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [Menu, ConfirmDialog],
  providers: [ConfirmationService],
  template: `
    <div class="relative cursor-pointer" (click)="menu.toggle($event)">
      <div class="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
        {{ userInitials() }}
      </div>
      <p-menu #menu [model]="menuItems()" [popup]="true" appendTo="body" />
    </div>

    <!-- Confirmation dialog for logout -->
    <p-confirmdialog 
      header="Confirmation" 
      icon="pi pi-exclamation-triangle"
      [style]="{width: '400px'}"
      rejectButtonStyleClass="p-button-text"
      acceptButtonStyleClass="p-button-danger">
    </p-confirmdialog>
  `
})
export class UserMenuComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly menuItems = signal([
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        // Nav to profile
      }
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.confirmLogout()
    }
  ]);

  readonly userInitials = computed(() => {
    const user = this.authService.currentUser();
    if (!user || !user.fullName) return 'U';
    
    const parts = user.fullName.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.fullName[0].toUpperCase();
  });

  private confirmLogout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Confirm Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Logout',
      rejectLabel: 'Cancel',
      accept: () => {
        // Clear active dashboard cookie (to be implemented in next phase)
        // For now, call authService.logout()
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}

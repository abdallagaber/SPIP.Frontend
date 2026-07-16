import { Component, inject, output, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Menu, Sun, Moon, LogOut } from 'lucide-angular';
import { Button } from 'primeng/button';
import { ThemeService } from '../../../core/services/theme.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [LucideAngularModule, Button, BreadcrumbComponent, UserMenuComponent],
  template: `
    <header class="h-16 bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 w-full">
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Toggle -->
        <p-button variant="text" severity="secondary" rounded="true" styleClass="lg:!hidden !p-2" (onClick)="toggleSidebar()">
          <lucide-icon name="menu" [size]="20"></lucide-icon>
        </p-button>
        
        <!-- Breadcrumb -->
        <div class="hidden md:block">
          <app-breadcrumb />
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <p-button variant="text" severity="secondary" rounded="true" styleClass="!p-2" (onClick)="toggleTheme()">
          @if (themeService.currentTheme() === 'dark' || (themeService.currentTheme() === 'system' && isSystemDark())) {
            <lucide-icon name="sun" [size]="20"></lucide-icon>
          } @else {
            <lucide-icon name="moon" [size]="20"></lucide-icon>
          }
        </p-button>

        <!-- User Menu -->
        <app-user-menu />
      </div>
    </header>
  `
})
export class TopbarComponent {
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  
  readonly menuToggle = output<void>();
  
  // Track system preference robustly
  readonly isSystemDark = signal<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);

  constructor() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.isSystemDark.set(e.matches);
    });
  }

  toggleSidebar(): void {
    this.menuToggle.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

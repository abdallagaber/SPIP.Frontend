import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [Button, RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950 px-4">
      <div class="text-center max-w-md w-full bg-surface-0 dark:bg-surface-900 p-8 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div class="text-primary font-bold text-6xl mb-6">404</div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-3">Page Not Found</h1>
        <p class="text-surface-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        
        <a routerLink="/dashboard" class="block w-full">
          <p-button label="Go to Dashboard" styleClass="w-full" />
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          You do not have permission to access this resource.
        </p>
        <div class="mt-8">
          <a routerLink="/" class="text-indigo-600 hover:text-indigo-500 font-medium">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}

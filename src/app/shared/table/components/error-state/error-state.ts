import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-state.html'
})
export class ErrorStateComponent {
  message = input<string>('Failed to load vendors.\n\nPlease try again.');
}

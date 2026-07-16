import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './delete-confirmation.html'
})
export class DeleteConfirmationComponent {
  visible = input<boolean>(false);
  loading = input<boolean>(false);
  message = input<string>('Are you sure you want to delete this item?');

  visibleChange = output<boolean>();
  confirm = output<void>();
  cancel = output<void>();

  onHide() {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}

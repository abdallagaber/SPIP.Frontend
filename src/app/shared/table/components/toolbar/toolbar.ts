import { Component, EventEmitter, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule],
  templateUrl: './toolbar.html'
})
export class ToolbarComponent {
  loading = input<boolean>(false);
  showAdd = input<boolean>(false);
  addLabel = input<string>('Add');
  searchPlaceholder = input<string>('Search...');
  
  searchChange = output<string>();
  refresh = output<void>();
  add = output<void>();

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onRefresh() {
    if (this.loading()) {
      return;
    }
    this.refresh.emit();
  }
}

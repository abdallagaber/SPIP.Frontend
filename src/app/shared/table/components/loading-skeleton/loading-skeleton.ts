import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule, TableModule],
  templateUrl: './loading-skeleton.html'
})
export class LoadingSkeletonComponent {
  columns = input<number>(5);
  rows = input<number>(5);
  
  get columnsArray() {
    return Array.from({ length: this.columns() });
  }

  get rowsArray() {
    return Array.from({ length: this.rows() });
  }
}

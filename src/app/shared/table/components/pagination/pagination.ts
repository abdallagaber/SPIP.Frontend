import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  templateUrl: './pagination.html'
})
export class PaginationComponent {
  totalCount = input<number>(0);
  pageNumber = input<number>(1);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([10, 20, 50, 100]);

  pageChange = output<{ pageNumber: number; pageSize: number }>();

  first = computed(() => (this.pageNumber() - 1) * this.pageSize());

  onPageChange(event: PaginatorState) {
    const newPage = (event.page ?? 0) + 1;
    const newSize = event.rows ?? 10;
    this.pageChange.emit({ pageNumber: newPage, pageSize: newSize });
  }
}

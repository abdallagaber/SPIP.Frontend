import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeFacade } from './home.facade';
import { AuthStorageService } from '../../../../core/auth/services/auth-storage.service';
import { DASHBOARD_WIDGETS } from '../../config/dashboard-widgets.config';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { BadgeModule } from 'primeng/badge';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    SkeletonModule,
    ProgressSpinnerModule,
    MessageModule,
    BadgeModule,
    LucideAngularModule
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public readonly facade = inject(HomeFacade);
  public readonly authStorage = inject(AuthStorageService);

  public readonly widgets = DASHBOARD_WIDGETS;

  ngOnInit(): void {
    this.facade.loadStats();
  }

  getWidgetValue(field: string): number {
    const stats = this.facade.stats();
    if (!stats) return 0;
    return (stats as any)[field] || 0;
  }
}

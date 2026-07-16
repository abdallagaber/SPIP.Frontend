import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Permission } from '../models/auth.types';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  private permissions: Permission[] = [];
  private requireAll = false;
  private hasView = false;

  @Input() set hasPermission(val: Permission | Permission[]) {
    this.permissions = Array.isArray(val) ? val : [val];
    this.updateView();
  }

  @Input() set hasPermissionRequireAll(val: boolean) {
    this.requireAll = val;
    this.updateView();
  }

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  private updateView() {
    if (this.permissions.length === 0) return;

    const hasAccess = this.authService.canAccess({
      permissions: this.permissions,
      requireAll: this.requireAll
    });

    if (hasAccess && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAccess && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

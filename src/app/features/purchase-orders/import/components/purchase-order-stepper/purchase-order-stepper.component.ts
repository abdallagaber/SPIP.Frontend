import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-purchase-order-stepper',
  standalone: true,
  imports: [CommonModule, StepperModule],
  template: `
    <p-stepper [value]="currentStep" (valueChange)="onStepClick($event)" class="w-full">
      <p-step-list>
        <p-step [value]="1" class="flex-1 cursor-pointer">Upload Excel</p-step>
        <p-step [value]="2" class="flex-1 cursor-pointer" [class.opacity-50]="!canGoToMapping">Map Columns</p-step>
        <p-step [value]="3" class="flex-1 cursor-pointer" [class.opacity-50]="!canGoToConfirmation">Confirm & Import</p-step>
      </p-step-list>
    </p-stepper>
  `
})
export class PurchaseOrderStepperComponent {
  @Input({ required: true }) currentStep!: number;
  @Input({ required: true }) canGoToMapping!: boolean;
  @Input({ required: true }) canGoToConfirmation!: boolean;

  @Output() stepChange = new EventEmitter<number>();
  private messageService = inject(MessageService);

  onStepClick(step: number | undefined) {
    if (step === undefined || step === this.currentStep) return;

    if (step === 1) {
      this.stepChange.emit(step);
      return;
    }

    if (step === 2 && this.canGoToMapping) {
      this.stepChange.emit(step);
      return;
    }

    if (step === 3 && this.canGoToConfirmation) {
      this.stepChange.emit(step);
      return;
    }

    // Force revert visual state if blocked
    setTimeout(() => this.stepChange.emit(this.currentStep), 0);

    this.messageService.add({
      severity: 'warn',
      summary: 'Step locked',
      detail: 'Please complete previous steps first.'
    });
  }
}

import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, Event } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SPIP.Frontend');
  private readonly router = inject(Router);

}

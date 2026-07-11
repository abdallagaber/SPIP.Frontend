import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, Event } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SPIP.Frontend');
  private readonly router = inject(Router);

}

import { Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage.constants';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = document;
  readonly currentTheme = signal<ThemeMode>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) as ThemeMode;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme() === 'system') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(mode: ThemeMode): void {
    this.currentTheme.set(mode);
    localStorage.setItem(STORAGE_KEYS.theme, mode);
    
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.applyTheme(mode);
    }
  }

  toggleTheme(): void {
    const nextTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  private applyTheme(mode: 'light' | 'dark'): void {
    const root = this.document.documentElement;
    if (mode === 'dark') {
      root.classList.add('my-app-dark');
    } else {
      root.classList.remove('my-app-dark');
    }
  }
}

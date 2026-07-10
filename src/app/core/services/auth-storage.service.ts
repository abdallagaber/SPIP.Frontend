import { Injectable } from '@angular/core';
import { AuthUser } from '../models/user.model';
import { STORAGE_KEYS } from '../constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.token, token);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.token);
  }

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.token);
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.user);
    if (userJson) {
      try {
        return JSON.parse(userJson) as AuthUser;
      } catch {
        return null;
      }
    }
    return null;
  }

  removeUser(): void {
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}

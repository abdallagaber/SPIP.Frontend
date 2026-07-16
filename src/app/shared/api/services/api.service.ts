import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.get<T>(`${API_BASE_URL}${endpoint}`, {
      params: this.buildParams(params)
    });
  }

  post<T>(endpoint: string, body: any, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.post<T>(`${API_BASE_URL}${endpoint}`, body, {
      params: this.buildParams(params)
    });
  }

  put<T>(endpoint: string, body: any, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.put<T>(`${API_BASE_URL}${endpoint}`, body, {
      params: this.buildParams(params)
    });
  }

  delete<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.delete<T>(`${API_BASE_URL}${endpoint}`, {
      params: this.buildParams(params)
    });
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return httpParams;
  }
}

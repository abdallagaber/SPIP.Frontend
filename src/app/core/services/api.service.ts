import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  buildUrl(endpoint: string): string {
    return `${API_BASE_URL}${endpoint}`;
  }

  buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return httpParams;
  }

  buildHeaders(headers?: Record<string, string>): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    if (headers) {
      Object.keys(headers).forEach(key => {
        httpHeaders = httpHeaders.append(key, headers[key]);
      });
    }
    return httpHeaders;
  }

  get<T>(endpoint: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers)
    });
  }

  post<T>(endpoint: string, body: any, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers)
    });
  }

  put<T>(endpoint: string, body: any, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers)
    });
  }

  patch<T>(endpoint: string, body: any, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), body, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers)
    });
  }

  delete<T>(endpoint: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers)
    });
  }
}

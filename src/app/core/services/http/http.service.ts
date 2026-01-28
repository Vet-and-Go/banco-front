import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Http {
  private readonly baseUrl: string = '/api';

  constructor(private http: HttpClient) { }

  getAll<T>(route: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${route}`);
  }

  getById<T>(route: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${route}`);
  }

  create<T>(route: string, newObject: T): Observable<T>;
  create<T, R>(route: string, newObject: T): Observable<R>;
  create<T, R = T>(route: string, newObject: T): Observable<R> {
    return this.http.post<R>(`${this.baseUrl}/${route}`, newObject);
  }

  update<T>(route: string, newObject: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${route}`, newObject);
  }

  deleteById<T>(route: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${route}`);
  }

  getByName<T>(route: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${route}`);
  }
}

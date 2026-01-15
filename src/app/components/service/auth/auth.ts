import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay, of, catchError } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../../Models/auth';
import { Client } from '../../../Models/client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl: string = '/api/clients/auth/';

  currentUser: Client | null = null;
  private _username: string | null = null;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Login attempt with:', credentials.username);
    return this.http.post<LoginResponse>(`${this.baseUrl}login`, credentials).pipe(
      tap(res => {
        console.log('Login response:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        this._username = res.username;
        console.log('Token stored:', localStorage.getItem('token'));
      })
    );
  }

  logout(): Observable<void> {
    const username = this.getUsername();
    return this.http.post<void>(`${this.baseUrl}logout`, { username }).pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession();
        return of(undefined);
      })
    );
  }

  private session$?: Observable<Client>;

  validateSession(): Observable<Client> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.error('No token found');
        observer.complete();
      });
    }

    if (this.currentUser) {
      return of(this.currentUser);
    }

    if (!this.session$) {
      // Sending token as raw string body as requested
      this.session$ = this.http.post<Client>(`${this.baseUrl}session`, token, {
        headers: { 'Content-Type': 'text/plain' }
      }).pipe(
        tap(client => {
          this.currentUser = client;
          this._username = client.login;
        }),
        shareReplay(1),
        catchError(err => {
          this.session$ = undefined;
          throw err;
        })
      );
    }

    return this.session$;
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.currentUser = null;
    this._username = null;
    this.session$ = undefined;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return this._username || localStorage.getItem('username');
  }

  getUserId(): number | null {
    return this.currentUser?.id || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

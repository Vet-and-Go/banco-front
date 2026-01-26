import { Injectable } from '@angular/core';
import { Observable, tap, shareReplay, of, catchError } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../../Models/auth';
import { Client } from '../../../Models/client';
import { Http } from '../../../core/services/http/http.service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: Client | null = null;
  private _username: string | null = null;

  constructor(private http: Http) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Login attempt with:', credentials.username);
    return this.http.create<LoginRequest, LoginResponse>('clients/auth/login', credentials).pipe(
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
    return this.http.create<{ username: string | null }, void>('clients/auth/logout', { username }).pipe(
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
      this.session$ = this.http.create<string, Client>('clients/auth/session', token).pipe(
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

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Client } from '../../../Models/client';
import { Http } from '../../../core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: Http) { }

  getAll(): Observable<Client[]> {
    return this.http.getAll<Client>('clients');
  }

  getById(id: number): Observable<Client> {
    return this.http.getById<Client>(`clients/${id}`);
  }

  getByUsername(username: string): Observable<Client> {
    return this.getAll().pipe(
      map(clients => {
        const search = username.toLowerCase().trim();
        const client = clients.find(c =>
          (c.login && c.login.toLowerCase() === search) ||
          (c.firstName && c.firstName.toLowerCase() === search) ||
          (c.lastName && c.lastName.toLowerCase() === search)
        );

        if (!client) {
          throw new Error(`Client not found for username: ${username}`);
        }
        return client;
      })
    );
  }
}

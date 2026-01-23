import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';



import { Client } from '../../../Models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'api/clients';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
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

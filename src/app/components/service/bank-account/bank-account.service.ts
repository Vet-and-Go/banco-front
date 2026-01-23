import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount, BankAccountOperation } from '../../../Models/bank-account';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private baseUrl = 'api/bank-accounts';

  constructor(private http: HttpClient) { }

  getAll(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.baseUrl);
  }

  getById(id: number): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.baseUrl}/${id}`);
  }

  deposit(operation: BankAccountOperation): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/deposit`, operation);
  }

  withdraw(operation: BankAccountOperation): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/withdraw`, operation);
  }

  getByClientId(clientId: number): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.baseUrl}/client/${clientId}`);
  }
}

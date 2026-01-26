import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankAccount, BankAccountOperation } from '../../../Models/bank-account';
import { Http } from '../../../core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  constructor(private http: Http) { }

  getAll(): Observable<BankAccount[]> {
    return this.http.getAll<BankAccount>('bank-accounts');
  }

  getById(id: number): Observable<BankAccount> {
    return this.http.getById<BankAccount>(`bank-accounts/${id}`);
  }

  deposit(operation: BankAccountOperation): Observable<void> {
    return this.http.create<void>('bank-accounts/deposit', operation);
  }

  withdraw(operation: BankAccountOperation): Observable<void> {
    return this.http.create<void>('bank-accounts/withdraw', operation);
  }

  getByClientId(clientId: number): Observable<BankAccount[]> {
    return this.http.getAll<BankAccount>(`bank-accounts/client/${clientId}`);
  }
}

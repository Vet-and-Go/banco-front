import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankTransaction } from '../../../Models/bank-transaction';
import { Http } from '../../../core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class BankTransactionService {
  constructor(private http: Http) { }

  getAll(): Observable<BankTransaction[]> {
    return this.http.getAll<BankTransaction>('bank-transactions');
  }

  getById(id: number): Observable<BankTransaction> {
    return this.http.getById<BankTransaction>(`bank-transactions/${id}`);
  }

  getByAccountId(accountId: number): Observable<BankTransaction[]> {
    return this.http.getAll<BankTransaction>(`bank-transactions/account/${accountId}`);
  }
}

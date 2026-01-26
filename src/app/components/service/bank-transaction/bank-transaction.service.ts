import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankTransaction } from '../../../Models/bank-transaction';

@Injectable({
  providedIn: 'root'
})
export class BankTransactionService {
  private baseUrl = '/api/bank-transactions';

  constructor(private http: HttpClient) { }

  getAll(): Observable<BankTransaction[]> {
    return this.http.get<BankTransaction[]>(this.baseUrl);
  }

  getById(id: number): Observable<BankTransaction> {
    return this.http.get<BankTransaction>(`${this.baseUrl}/${id}`);
  }

  getByAccountId(accountId: number): Observable<BankTransaction[]> {
    return this.http.get<BankTransaction[]>(`${this.baseUrl}/account/${accountId}`);
  }
}

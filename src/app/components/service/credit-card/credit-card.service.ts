import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditCard } from '../../../Models/credit-card';
import { Http } from '../../../core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  constructor(private http: Http) { }

  getAll(): Observable<CreditCard[]> {
    return this.http.getAll<CreditCard>('credit-cards');
  }

  getById(id: number): Observable<CreditCard> {
    return this.http.getById<CreditCard>(`credit-cards/${id}`);
  }

  getByClientId(clientId: number): Observable<CreditCard[]> {
    return this.http.getAll<CreditCard>(`credit-cards/client/${clientId}`);
  }

  getByAccountId(bankAccountId: number): Observable<CreditCard[]> {
    return this.http.getAll<CreditCard>(`credit-cards/account/${bankAccountId}`);
  }

  getTransactions(cardId: number): Observable<any[]> {
    return this.http.getAll<any>(`credit-cards/transactions/${cardId}`);
  }

  getSpending(cardId: number): Observable<number> {
    return this.http.getById<number>(`credit-cards/spending/${cardId}`);
  }

  private cardStyles = new Map<number, string>();

  getCardStyle(itemId: number): string {
    if (!this.cardStyles.has(itemId)) {
      const variant = Math.floor(Math.random() * 5);
      this.cardStyles.set(itemId, `credit-card--variant-${variant}`);
    }
    return this.cardStyles.get(itemId)!;
  }
}

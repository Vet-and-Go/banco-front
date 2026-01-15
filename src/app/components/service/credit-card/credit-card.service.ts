import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditCard } from '../../../Models/credit-card';

@Injectable({
    providedIn: 'root'
})
export class CreditCardService {
    private baseUrl = '/api/credit-cards';

    constructor(private http: HttpClient) { }

    getAll(): Observable<CreditCard[]> {
        return this.http.get<CreditCard[]>(this.baseUrl);
    }

    getById(id: number): Observable<CreditCard> {
        return this.http.get<CreditCard>(`${this.baseUrl}/${id}`);
    }

    getByClientId(clientId: number): Observable<CreditCard[]> {
        return this.http.get<CreditCard[]>(`${this.baseUrl}/client/${clientId}`);
    }

    getTransactions(cardId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/transactions/${cardId}`);
    }

    getSpending(cardId: number): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/spending/${cardId}`);
    }
}

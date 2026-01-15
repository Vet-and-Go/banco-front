import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { CreditCardService } from '../../service/credit-card/credit-card.service';
import { CreditCard } from '../../../Models/credit-card';

@Component({
    selector: 'app-cards',
    standalone: true,
    imports: [CommonModule, Header],
    templateUrl: './cards.html',
    styleUrls: ['./cards.scss']
})
export class CardsComponent implements OnInit {
    transactions: any[] = [];
    currentCard: CreditCard | undefined;
    monthlySpending: number = 0;
    errorMessage: string = '';

    constructor(
        private creditCardService: CreditCardService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const cardId = params.get('id');
            if (cardId) {
                this.loadCardInfo(+cardId);
                this.loadCardTransactions(+cardId);
                this.loadMonthlySpending(+cardId);
            }
        });
    }

    loadMonthlySpending(cardId: number): void {
        this.creditCardService.getSpending(cardId).subscribe({
            next: (spending) => this.monthlySpending = spending,
            error: (err) => console.error('Error loading monthly spending', err)
        });
    }

    loadCardInfo(cardId: number): void {
        this.creditCardService.getById(cardId).subscribe({
            next: (card) => this.currentCard = card,
            error: (err) => {
                console.error('Error loading card info', err);
                this.errorMessage = 'No se pudo cargar la información de la tarjeta.';
            }
        });
    }

    loadCardTransactions(cardId: number): void {
        this.creditCardService.getTransactions(cardId).subscribe({
            next: (data) => this.transactions = data,
            error: (err) => {
                console.error('Error loading card transactions', err);
                this.errorMessage = 'No se pudieron cargar los movimientos de la tarjeta.';
            }
        });
    }
}

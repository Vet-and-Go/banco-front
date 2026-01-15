import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { BankTransactionService } from '../../service/bank-transaction/bank-transaction.service';
import { BankTransaction } from '../../../Models/bank-transaction';
import { BankAccountService } from '../../service/bank-account/bank-account.service';
import { BankAccount } from '../../../Models/bank-account';
import { CreditCardService } from '../../service/credit-card/credit-card.service';
import { CreditCard } from '../../../Models/credit-card';

@Component({
    selector: 'app-movements',
    standalone: true,
    imports: [CommonModule, Header, RouterModule],
    templateUrl: './accounts.html',
    styleUrls: ['./accounts.scss']
})
export class MovementsComponent implements OnInit {
    transactions: BankTransaction[] = [];
    currentAccount: BankAccount | undefined;
    associatedCards: CreditCard[] = [];
    errorMessage: string = '';

    // Map to store consistent random styles for each card ID
    private cardStyles = new Map<number, number>();

    constructor(
        private transactionService: BankTransactionService,
        private accountService: BankAccountService,
        private creditCardService: CreditCardService,
        private route: ActivatedRoute
    ) { }

    getCardStyle(cardId: number): string {
        if (!this.cardStyles.has(cardId)) {
            // Assign a random style index from 0 to 4
            const randomStyle = Math.floor(Math.random() * 5);
            this.cardStyles.set(cardId, randomStyle);
        }
        return `credit-card--variant-${this.cardStyles.get(cardId)}`;
    }

    ngOnInit(): void {
        console.log('Accounts component initialized');
        this.route.paramMap.subscribe(params => {
            const accountId = params.get('id');
            console.log('Account ID from route:', accountId);
            if (accountId) {
                this.loadAccountInfo(+accountId);
                this.loadTransactionsByAccount(+accountId);
            } else {
                this.loadAllTransactions();
            }
        });
    }

    loadAccountInfo(accountId: number): void {
        console.log('Loading account info for ID:', accountId);
        this.accountService.getById(accountId).subscribe({
            next: (account: any) => {
                console.log('Account loaded:', account);
                this.currentAccount = account;

                const clientId = account.clientId ||
                    localStorage.getItem('userId');

                if (clientId) {
                    this.loadAssociatedCards(Number(clientId), account.id);
                }
            },
            error: (err) => {
                console.error('Error loading account info', err);
            }
        });
    }

    loadAssociatedCards(clientId: number, accountId: number): void {
        this.creditCardService.getByClientId(clientId).subscribe({
            next: (cards: any[]) => {
                this.associatedCards = cards.filter((card: any) => {
                    const cardAccId = card.bankAccount?.id || card.bankAccountId || card.bankAccount;
                    return Number(cardAccId) === Number(accountId);
                });
            },
            error: (err) => console.error('Error loading associated cards', err)
        });
    }

    loadAllTransactions(): void {
        this.transactionService.getAll().subscribe({
            next: (data) => this.transactions = data,
            error: (err) => {
                console.error('Error loading transactions', err);
                this.errorMessage = 'No se pudieron cargar los movimientos.';
            }
        });
    }

    loadTransactionsByAccount(accountId: number): void {
        console.log('Loading transactions for account ID:', accountId);
        this.transactionService.getByAccountId(accountId).subscribe({
            next: (data) => {
                console.log('Transactions loaded:', data);
                this.transactions = data;
            },
            error: (err) => {
                console.error('Error loading transactions for account', err);
                this.errorMessage = 'No se pudieron cargar los movimientos de la cuenta.';
            }
        });
    }
}

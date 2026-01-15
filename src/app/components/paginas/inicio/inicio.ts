import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { BankAccountService } from '../../service/bank-account/bank-account.service';
import { CreditCardService } from '../../service/credit-card/credit-card.service';
import { ClientService } from '../../service/client/client.service';
import { BankAccount } from '../../../Models/bank-account';
import { CreditCard } from '../../../Models/credit-card';
import { AuthService } from '../../service/auth/auth';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [CommonModule, Header, RouterLink],
    templateUrl: './inicio.html',
    styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {
    accounts: BankAccount[] = [];
    cards: CreditCard[] = [];
    errorMessage: string = '';
    clientName: string = '';

    constructor(
        private accountService: BankAccountService,
        public creditCardService: CreditCardService,
        private clientService: ClientService,
        public auth: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.auth.validateSession().subscribe({
            next: (client: any) => {
                this.clientName = client.firstName || client.login;
                this.loadData(client.id);
            },
            error: (err: any) => {
                console.error('Session validation failed', err);
                this.router.navigate(['/bank/login']);
            }
        });
    }

    private loadData(clientId: number): void {
        this.accountService.getByClientId(clientId).subscribe({
            next: (data) => this.accounts = data,
            error: (err) => {
                console.error('Error loading accounts', err);
                this.errorMessage = 'No se pudieron cargar las cuentas.';
            }
        });

        this.creditCardService.getByClientId(clientId).subscribe({
            next: (data) => this.cards = data,
            error: (err) => {
                console.error('Error loading credit cards', err);
            }
        });
    }
}

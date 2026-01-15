export interface BankAccount {
    id: number;
    iban: string;
    balance: number;
    clientId: number;
    type: string;
}

export interface BankAccountOperation {
    iban: string;
    amount: number;
}

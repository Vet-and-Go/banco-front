export interface BankTransaction {
    id: number;
    amount: number;
    date: string; // ISO Date
    concept?: string;
    type: string;
    origin: string;
    cardNumber?: string;
    originIban?: string;
    destinationIban?: string;
}

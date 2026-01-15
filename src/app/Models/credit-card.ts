export interface CreditCard {
    id: number;
    cardNumber: string;
    expirationDate: string;
    cvc: string;
    fullName: string;
    bankAccount?: any; // Or define a simpler structure if needed, e.g. { id: number }
    expired?: boolean;
    yearMonth?: string;
}

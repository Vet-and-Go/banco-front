export interface Client {
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    dni: string;
    email?: string;
    phone?: string;
    address?: string;
}

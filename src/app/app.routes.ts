import { Routes } from '@angular/router';
import { Login } from './components/paginas/login/login';
import { Inicio } from './components/paginas/inicio/inicio';

import { MovementsComponent } from './components/paginas/accounts/accounts';
import { loginGuard } from './core/guards/login.guard';
import { AppComponent } from './components/paginas/app/app.component';


import { CardsComponent } from './components/paginas/cards/cards';

export const routes: Routes = [
    { path: 'bank', component: Inicio, canActivate: [loginGuard] },
    { path: 'bank/accounts/:id/movements', component: MovementsComponent, canActivate: [loginGuard] },
    { path: 'bank/cards/:id/movements', component: CardsComponent, canActivate: [loginGuard] },
    { path: 'bank/login', component: Login },
    { path: '**', redirectTo: 'bank/login' }
];

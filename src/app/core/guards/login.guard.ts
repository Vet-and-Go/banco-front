import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../components/service/auth/auth';
import { map, catchError, of } from 'rxjs';


export const loginGuard: CanActivateFn = (nextState, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();
    const isLoggedIn = authService.isLoggedIn();

    console.log('LoginGuard executed:', {
        url: state.url,
        hasToken: !!token,
        token: token,
        isLoggedIn: isLoggedIn
    });

    if (isLoggedIn) {
        console.log('LoginGuard: Access granted');
        return true;
    }

    console.log('LoginGuard: Access denied, redirecting to login');
    router.navigate(['/bank/login']);
    return false;
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../components/service/auth/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError(error => {
            const backendMessage = error.error?.message || '';

            if (error.status === 400) {
                console.error('400 Bad Request:', {
                    url: req.url,
                    method: req.method,
                    message: backendMessage,
                    errorBody: error.error
                });

                // For auth endpoints, let the component handle it
                if (!req.url.includes('/auth/')) {
                    alert(`Error: ${backendMessage || 'Solicitud inválida'}`);
                }
            }

            if (error.status === 401) {
                console.error('401 Unauthorized:', {
                    url: req.url,
                    method: req.method,
                    hasAuthHeader: req.headers.has('Authorization'),
                    authHeader: req.headers.get('Authorization'),
                    errorBody: error.error
                });

                if (req.url.includes('/auth/login')) {
                } else {
                    console.error('Sesión expirada o token inválido');
                    authService.clearSession();
                    router.navigate(['/bank/login']);
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                }
            }

            if (error.status === 403) {
                console.error('403 Forbidden:', backendMessage);
                alert('🚫 No tienes permisos para realizar esta acción');
            }

            if (error.status === 404) {
                console.error('404 Not Found:', {
                    url: req.url,
                    message: backendMessage
                });
            }

            if (error.status === 422) {
                console.error('422 Unprocessable Entity:', backendMessage);
                alert(`⚠️ ${backendMessage || 'No se pudo procesar la solicitud'}`);
            }

            if (error.status === 500) {
                console.error('500 Internal Server Error:', error.error || 'No hay cuerpo de error');
                alert('⚠️ Error del servidor. Por favor, intenta más tarde.');
            }

            if (error.status === 0) {
                console.error('Error de conexión:', error);
                alert('🌐 No se pudo conectar con el servidor. Verifica tu conexión.');
            }

            return throwError(() => error);
        })
    );
};

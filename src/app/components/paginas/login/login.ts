import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnDestroy {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private subscription: Subscription | null = null;

  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;

    this.subscription = this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/bank']);
      },
      error: (err) => {
        console.error('Error Login:', err);
        this.isLoading = false;

        const backendMessage = err.error?.message || '';

        if (err.status === 400) {
          this.errorMessage = '⚠️ Contraseña o usuario incorrectos';
        } else if (err.status === 401) {
          this.errorMessage = '❌ No autorizado. Verifica tus credenciales';
        } else if (err.status === 403) {
          this.errorMessage = '🚫 No tienes permisos para acceder';
        } else if (err.status === 404) {
          this.errorMessage = '❌ Servicio de autenticación no encontrado';
        } else if (err.status === 422) {
          // Show specific backend message for business logic errors
          this.errorMessage = backendMessage || '⚠️ No se pudo procesar la solicitud';
        } else if (err.status === 500) {
          this.errorMessage = '⚠️ Error del servidor. Intenta más tarde';
        } else if (err.status === 0) {
          this.errorMessage = '🌐 Sin conexión al servidor';
        } else {
          this.errorMessage = '❌ Error al iniciar sesión. Intenta nuevamente';
        }

        // Auto-clear error after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

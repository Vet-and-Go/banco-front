import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnDestroy {
  readonly auth = inject(AuthService);
  readonly router = inject(Router);
  subscription: Subscription | null = null;

  logout() {
    this.subscription = this.auth.logout().subscribe({
      complete: () => this.router.navigate(['/bank/login']),
      error: (err) => {
        console.error('Error en logout:', err);
        this.auth.clearSession();
        this.router.navigate(['/bank/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

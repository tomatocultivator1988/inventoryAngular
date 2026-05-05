import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-10">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-float"></div>
        <div class="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl animate-float-delayed"></div>
      </div>

      <div class="w-full max-w-md animate-enter">
        <div class="bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-xl shadow-2xl p-8 border border-slate-700/80 backdrop-blur-sm">
          <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p class="text-slate-400 text-sm">Sign in to continue managing your inventory</p>
          </div>

          <form (ngSubmit)="login()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                class="w-full px-4 py-2.5 bg-slate-700/70 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                class="w-full px-4 py-2.5 bg-slate-700/70 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <div *ngIf="error()" class="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm animate-shake">
              {{ error() }}
            </div>

            <button
              type="submit"
              [disabled]="loading()"
              class="group w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
            >
              <span class="inline-flex items-center gap-2">
                <svg *ngIf="loading()" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ loading() ? 'Logging in...' : 'Login' }}
              </span>
            </button>
          </form>

          <p class="mt-6 text-center text-slate-400">
            Don&apos;t have an account?
            <a routerLink="/register" class="text-blue-400 hover:text-cyan-300 transition-colors">Register here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes enter {
      from {
        opacity: 0;
        transform: translateY(14px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-14px); }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px); }
      75% { transform: translateX(3px); }
    }

    .animate-enter {
      animation: enter 500ms ease-out;
    }

    .animate-float {
      animation: float 7s ease-in-out infinite;
    }

    .animate-float-delayed {
      animation: float 9s ease-in-out infinite;
      animation-delay: 600ms;
    }

    .animate-shake {
      animation: shake 260ms ease-in-out;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private ui: UiFeedbackService
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.ui.showLoading('Signing you in...');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.ui.hideLoading();
        this.ui.showToast('Welcome back!', 'success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set(err.message || 'Login failed');
        this.loading.set(false);
        this.ui.hideLoading();
        this.ui.showToast('Login failed. Please try again.', 'error');
      }
    });
  }
}

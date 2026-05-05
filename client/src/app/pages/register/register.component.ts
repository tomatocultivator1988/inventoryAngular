import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div class="w-full max-w-md">
        <div class="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
          <h1 class="text-3xl font-bold text-white mb-8 text-center">
            <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Register
            </span>
          </h1>

          <form (ngSubmit)="register()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                required
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div *ngIf="error()" class="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
              {{ error() }}
            </div>

            <button
              type="submit"
              [disabled]="loading()"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {{ loading() ? 'Creating account...' : 'Register' }}
            </button>
          </form>

          <p class="mt-6 text-center text-slate-400">
            Already have an account?
            <a routerLink="/login" class="text-blue-400 hover:text-blue-300">Login here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error.set('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.register(this.email, this.password, this.name).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set(err.message || 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}

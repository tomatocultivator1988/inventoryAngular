import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div class="max-w-2xl mx-auto px-4">
        <!-- Profile Info Card -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 mb-8 shadow-xl">
          <div class="flex items-center gap-4 mb-8">
            <div class="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">My Profile</h1>
              <p class="text-slate-400">Manage your account information</p>
            </div>
          </div>

          <div *ngIf="user()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Email
                </label>
                <div class="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-medium">
                  {{ user()?.email }}
                </div>
              </div>

              <div>
                <label class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Role
                </label>
                <div class="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg">
                  <span [ngClass]="{
                    'bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold': user()?.role === 'admin',
                    'bg-slate-600 text-slate-200 px-3 py-1 rounded-full text-sm font-semibold': user()?.role === 'user'
                  }">
                    {{ user()?.role | uppercase }}
                  </span>
                </div>
              </div>

              <div *ngIf="user()?.created_at">
                <label class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Member Since
                </label>
                <div class="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-medium">
                  {{ user()?.created_at | date: 'MMM d, y' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 shadow-xl">
          <div class="flex items-center gap-4 mb-8">
            <div class="bg-yellow-500/20 p-3 rounded-lg">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">Change Password</h2>
              <p class="text-slate-400 text-sm">Update your account password</p>
            </div>
          </div>

          <form (ngSubmit)="changePassword()" class="space-y-6">
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                Current Password *
              </label>
              <input
                type="password"
                [(ngModel)]="passwordForm.oldPassword"
                name="oldPassword"
                required
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                New Password *
              </label>
              <input
                type="password"
                [(ngModel)]="passwordForm.newPassword"
                name="newPassword"
                required
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Confirm New Password *
              </label>
              <input
                type="password"
                [(ngModel)]="passwordForm.confirmPassword"
                name="confirmPassword"
                required
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div *ngIf="passwordError()" class="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
              <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-red-300">{{ passwordError() }}</span>
            </div>

            <div *ngIf="passwordSuccess()" class="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
              <svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-green-300">{{ passwordSuccess() }}</span>
            </div>

            <div class="flex gap-4 pt-6 border-t border-slate-700">
              <button
                type="submit"
                [disabled]="passwordLoading()"
                class="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition-all hover:scale-105 disabled:scale-100"
              >
                <svg *ngIf="!passwordLoading()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg *ngIf="passwordLoading()" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ passwordLoading() ? 'Updating...' : 'Update Password' }}
              </button>
              <button
                type="button"
                (click)="resetPasswordForm()"
                class="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Reset
              </button>
            </div>
          </form>
        </div>

        <!-- Back Button -->
        <div class="mt-8">
          <a routerLink="/" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 text-white px-6 py-3 rounded-lg transition-all inline-flex">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span class="font-medium">Back to Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  passwordLoading = signal(false);
  passwordError = signal('');
  passwordSuccess = signal('');

  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(private authService: AuthService, private ui: UiFeedbackService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user.set(response.user);
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  changePassword(): void {
    this.passwordError.set('');
    this.passwordSuccess.set('');

    if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      this.passwordError.set('Please fill in all fields');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError.set('New passwords do not match');
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.passwordError.set('New password must be at least 6 characters');
      return;
    }

    this.passwordLoading.set(true);
    this.ui.showLoading('Updating password...');

    this.authService.changePassword(this.passwordForm.oldPassword, this.passwordForm.newPassword).subscribe({
      next: () => {
        this.passwordSuccess.set('Password changed successfully!');
        this.resetPasswordForm();
        this.passwordLoading.set(false);
        this.ui.hideLoading();
        this.ui.showToast('Password changed successfully', 'success');
      },
      error: (err) => {
        this.passwordError.set(err.message || 'Failed to change password');
        this.passwordLoading.set(false);
        this.ui.hideLoading();
        this.ui.showToast('Failed to change password', 'error');
      }
    });
  }

  resetPasswordForm(): void {
    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordError.set('');
    setTimeout(() => this.passwordSuccess.set(''), 3000);
  }
}

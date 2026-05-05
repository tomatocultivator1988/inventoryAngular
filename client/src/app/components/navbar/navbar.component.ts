import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border-b border-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Navigation -->
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-3 group">
              <div class="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Inventory System
              </span>
            </a>
            
            <div *ngIf="isAuthenticated()" class="hidden md:flex gap-2">
              <a routerLink="/products" routerLinkActive="bg-slate-700 text-blue-400" 
                 class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-blue-400 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <span class="font-medium">Products</span>
              </a>
              <a routerLink="/profile" routerLinkActive="bg-slate-700 text-blue-400"
                 class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-blue-400 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="font-medium">Profile</span>
              </a>
            </div>
          </div>

          <!-- User Info and Actions -->
          <div class="flex items-center gap-4">
            <div *ngIf="isAuthenticated()" class="hidden sm:flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">{{ getInitials() }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-white">{{ currentUser()?.email }}</span>
                <span class="text-xs text-slate-400 uppercase">{{ currentUser()?.role }}</span>
              </div>
            </div>
            
            <button
              *ngIf="isAuthenticated()"
              (click)="logout()"
              class="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all hover:scale-105"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span class="font-medium">Logout</span>
            </button>

            <!-- Mobile Menu Button -->
            <button
              *ngIf="isAuthenticated()"
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            <div *ngIf="!isAuthenticated()" class="flex gap-3">
              <a routerLink="/login" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                <span class="font-medium">Login</span>
              </a>
              <a routerLink="/register" class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg transition-all hover:scale-105">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                <span class="font-medium">Register</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="isAuthenticated() && showMobileMenu()" class="md:hidden border-t border-slate-700 py-4">
          <div class="flex flex-col gap-2">
            <a routerLink="/products" (click)="closeMobileMenu()" routerLinkActive="bg-slate-700 text-blue-400"
               class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 hover:text-blue-400 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <span class="font-medium">Products</span>
            </a>
            <a routerLink="/profile" (click)="closeMobileMenu()" routerLinkActive="bg-slate-700 text-blue-400"
               class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 hover:text-blue-400 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="font-medium">Profile</span>
            </a>
            <button
              (click)="logout(); closeMobileMenu()"
              class="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all text-left"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span class="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Logout Confirmation Modal -->
    <div *ngIf="showLogoutModal()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-lg shadow-xl max-w-md w-full border border-slate-700 animate-fade-in">
        <div class="p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-yellow-500/20 p-3 rounded-full">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Logout</h3>
              <p class="text-slate-400 text-sm">Are you sure you want to leave?</p>
            </div>
          </div>
          
          <p class="text-slate-300 mb-6">
            You will be logged out of your account.
          </p>

          <div class="flex gap-3">
            <button
              (click)="closeLogoutModal()"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="confirmLogout()"
              class="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }
  `]
})
export class NavbarComponent {
  isAuthenticated = signal(false);
  currentUser = signal<any>(null);
  showLogoutModal = signal(false);
  showMobileMenu = signal(false);

  constructor(private authService: AuthService, private router: Router, private ui: UiFeedbackService) {
    this.isAuthenticated = this.authService.isAuthenticatedSignal();
    this.currentUser.set(this.authService.getCurrentUser());
  }

  openLogoutModal(): void {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal(): void {
    this.showLogoutModal.set(false);
  }

  confirmLogout(): void {
    this.ui.showLoading('Logging you out...');
    setTimeout(() => {
      this.authService.logout();
      this.showLogoutModal.set(false);
      this.ui.hideLoading();
      this.ui.showToast('Logged out successfully', 'info');
    }, 550);
  }

  logout(): void {
    this.openLogoutModal();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update(v => !v);
  }

  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }

  getInitials(): string {
    const email = this.currentUser()?.email || '';
    return email.charAt(0).toUpperCase();
  }
}

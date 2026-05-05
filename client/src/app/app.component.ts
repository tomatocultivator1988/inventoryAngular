import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { UiFeedbackService } from './services/ui-feedback.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="min-h-screen bg-background">
      <router-outlet></router-outlet>
    </main>

    <div *ngIf="ui.loading()" class="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4">
      <div class="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in">
        <svg class="animate-spin h-8 w-8 mx-auto mb-3 text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p class="text-white font-semibold">{{ ui.loadingMessage() }}</p>
        <p class="text-slate-400 text-sm mt-1">Processing your request...</p>
      </div>
    </div>

    <div *ngIf="ui.toastMessage()"
      class="fixed bottom-5 right-5 z-[90] px-4 py-3 rounded-lg border shadow-lg text-sm font-medium animate-slide-up"
      [ngClass]="{
        'bg-green-500/20 border-green-500 text-green-300': ui.toastType() === 'success',
        'bg-red-500/20 border-red-500 text-red-300': ui.toastType() === 'error',
        'bg-blue-500/20 border-blue-500 text-blue-300': ui.toastType() === 'info'
      }">
      {{ ui.toastMessage() }}
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes slide-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in { animation: fade-in 180ms ease-out; }
    .animate-slide-up { animation: slide-up 220ms ease-out; }
  `]
})
export class AppComponent {
  title = 'inventory-frontend';

  constructor(public ui: UiFeedbackService) {}
}

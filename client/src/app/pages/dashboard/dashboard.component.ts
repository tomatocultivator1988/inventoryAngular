import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">
            Welcome, <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {{ currentUser()?.email?.split('@')[0] }}
            </span>
          </h1>
          <p class="text-slate-400">Manage your inventory efficiently</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all">
            <div class="flex items-center gap-4">
              <div class="bg-blue-500/20 p-3 rounded-lg">
                <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div>
                <div class="text-slate-400 text-sm mb-1">Total Products</div>
                <div class="text-3xl font-bold text-white">{{ stats().totalProducts }}</div>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all">
            <div class="flex items-center gap-4">
              <div class="bg-green-500/20 p-3 rounded-lg">
                <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <div class="text-slate-400 text-sm mb-1">Total Value</div>
                <div class="text-3xl font-bold text-white">₱{{ stats().totalValue.toFixed(2) }}</div>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-orange-500 transition-all">
            <div class="flex items-center gap-4">
              <div class="bg-orange-500/20 p-3 rounded-lg">
                <svg class="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div>
                <div class="text-slate-400 text-sm mb-1">Low Stock</div>
                <div class="text-3xl font-bold text-orange-400">{{ stats().lowStock }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Products -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          <div class="p-6 border-b border-slate-700 bg-slate-800/50">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="bg-blue-500/20 p-2 rounded-lg">
                  <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-white">Recent Products</h2>
              </div>
              <a *ngIf="isAdmin()" routerLink="/products/add" 
                 class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg transition-all hover:scale-105">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="font-medium">Add Product</span>
              </a>
            </div>
          </div>

          <div *ngIf="loading()" class="p-8 text-center text-slate-400">
            <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading products...
          </div>

          <div *ngIf="!loading() && products().length === 0" class="p-12 text-center">
            <div class="bg-slate-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
            </div>
            <p class="text-slate-400 mb-4">No products found</p>
            <a *ngIf="isAdmin()" routerLink="/products/add" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Your First Product
            </a>
          </div>

          <!-- Mobile Card View -->
          <div *ngIf="!loading() && products().length > 0" class="md:hidden divide-y divide-slate-700">
            <div *ngFor="let product of products()" class="p-4 hover:bg-slate-700/50 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                  <h3 class="text-white font-semibold text-lg mb-1">{{ product.name }}</h3>
                  <p class="text-slate-400 text-sm font-mono">{{ product.sku }}</p>
                </div>
                <span [ngClass]="{
                  'bg-green-500/20 text-green-400': product.quantity > 20,
                  'bg-yellow-500/20 text-yellow-400': product.quantity > 5 && product.quantity <= 20,
                  'bg-red-500/20 text-red-400': product.quantity <= 5
                }" class="px-3 py-1 rounded-full text-sm font-semibold">
                  {{ product.quantity }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-white text-xl font-bold">₱{{ product.price.toFixed(2) }}</span>
                <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">{{ product.category }}</span>
              </div>
            </div>
          </div>

          <!-- Desktop Table View -->
          <div *ngIf="!loading() && products().length > 0" class="hidden md:block">
            <table class="w-full">
              <thead class="bg-slate-700/50">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-slate-300">SKU</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-slate-300">Quantity</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-slate-300">Price</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-slate-300">Category</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr *ngFor="let product of products()" class="hover:bg-slate-700/50 transition-colors">
                  <td class="px-6 py-4 text-white font-medium">{{ product.name }}</td>
                  <td class="px-6 py-4 text-slate-400 font-mono text-sm">{{ product.sku }}</td>
                  <td class="px-6 py-4">
                    <span [ngClass]="{
                      'bg-green-500/20 text-green-400 px-2 py-1 rounded': product.quantity > 20,
                      'bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded': product.quantity > 5 && product.quantity <= 20,
                      'bg-red-500/20 text-red-400 px-2 py-1 rounded': product.quantity <= 5
                    }" class="font-semibold">
                      {{ product.quantity }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-white font-semibold">₱{{ product.price.toFixed(2) }}</td>
                  <td class="px-6 py-4">
                    <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">{{ product.category }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex gap-4">
          <a routerLink="/products" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 text-white px-6 py-3 rounded-lg transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <span class="font-medium">View All Products</span>
          </a>
          <a routerLink="/profile" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 text-white px-6 py-3 rounded-lg transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span class="font-medium">Manage Profile</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  currentUser = signal<any>(null);
  stats = signal({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0
  });

  constructor(
    private productsService: ProductsService,
    private authService: AuthService
  ) {
    this.currentUser.set(this.authService.getCurrentUser());
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productsService.getProducts(1, 100).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.calculateStats();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.loading.set(false);
      }
    });
  }

  private calculateStats(): void {
    const prods = this.products();
    const totalValue = prods.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStock = prods.filter(p => p.quantity <= 5).length;

    this.stats.set({
      totalProducts: prods.length,
      totalValue: totalValue,
      lowStock: lowStock
    });
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
}

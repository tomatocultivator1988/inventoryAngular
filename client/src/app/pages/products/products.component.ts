import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-4">
            <div class="bg-blue-500/20 p-3 rounded-lg">
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-white">Products</h1>
              <p class="text-slate-400 mt-1">Manage your inventory</p>
            </div>
          </div>
          <div *ngIf="canManage()" class="flex gap-4">
            <a routerLink="/products/add" class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-lg transition-all hover:scale-105">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="font-medium">Add Product</span>
            </a>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 mb-8 shadow-xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Search
              </label>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (keyup)="onSearch()"
                placeholder="Search by name or SKU..."
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                Category
              </label>
              <input
                type="text"
                [(ngModel)]="selectedCategory"
                (keyup)="onFilter()"
                placeholder="Filter by category..."
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Products Table/Cards -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
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
            <p class="text-slate-400">No products found.</p>
          </div>

          <!-- Mobile Card View -->
          <div *ngIf="!loading() && products().length > 0" class="md:hidden divide-y divide-slate-700">
            <div *ngFor="let product of products()" 
                 (click)="viewProduct(product)"
                 class="p-4 hover:bg-slate-700/50 transition-colors cursor-pointer">
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
              
              <div class="flex justify-between items-center mb-3">
                <span class="text-white text-xl font-bold">₱{{ product.price.toFixed(2) }}</span>
                <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">{{ product.category }}</span>
              </div>

              <div *ngIf="canManage() || canDelete()" class="flex gap-2 pt-3 border-t border-slate-700" (click)="$event.stopPropagation()">
                <a *ngIf="canManage()" [routerLink]="['/products', product.id, 'edit']" 
                   class="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </a>
                <button *ngIf="canDelete()"
                  (click)="openDeleteModal(product.id, product.name)"
                  class="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
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
                  <th class="px-6 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr *ngFor="let product of products()" class="hover:bg-slate-700/50 transition-colors cursor-pointer" (click)="viewProduct(product)">
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
                  <td class="px-6 py-4" (click)="$event.stopPropagation()">
                    <div class="flex gap-2">
                      <a *ngIf="canManage()" [routerLink]="['/products', product.id, 'edit']" 
                         class="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </a>
                      <button
                        *ngIf="canDelete()"
                        (click)="openDeleteModal(product.id, product.name)"
                        class="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading() && totalPages() > 1" class="flex justify-center items-center gap-2 mt-8">
          <button
            (click)="previousPage()"
            [disabled]="currentPage() === 1"
            class="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors"
            title="Previous page"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <div class="flex gap-1">
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              [class]="page === currentPage() 
                ? 'px-3 py-1 bg-blue-600 text-white rounded-lg font-medium' 
                : 'px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors'"
            >
              {{ page }}
            </button>
          </div>

          <button
            (click)="nextPage()"
            [disabled]="currentPage() === totalPages()"
            class="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors"
            title="Next page"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Product Details Modal -->
    <div *ngIf="showDetailsModal()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeDetailsModal()">
      <div class="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full border border-slate-700 animate-fade-in" (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-2xl font-bold text-white">Product Details</h3>
            <button (click)="closeDetailsModal()" class="text-slate-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Image -->
            <div>
              <img 
                *ngIf="selectedProduct()?.image_url" 
                [src]="selectedProduct()?.image_url" 
                [alt]="selectedProduct()?.name"
                class="w-full h-64 object-cover rounded-lg border border-slate-600"
              />
              <div 
                *ngIf="!selectedProduct()?.image_url"
                class="w-full h-64 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center"
              >
                <svg class="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>

            <!-- Details -->
            <div class="space-y-4">
              <div>
                <div class="text-slate-400 text-sm mb-1">Product Name</div>
                <div class="text-white text-lg font-semibold">{{ selectedProduct()?.name }}</div>
              </div>

              <div>
                <div class="text-slate-400 text-sm mb-1">SKU</div>
                <div class="text-white font-mono">{{ selectedProduct()?.sku }}</div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-slate-400 text-sm mb-1">Quantity</div>
                  <div [ngClass]="{
                    'text-green-400': selectedProduct()!.quantity > 20,
                    'text-yellow-400': selectedProduct()!.quantity > 5 && selectedProduct()!.quantity <= 20,
                    'text-red-400': selectedProduct()!.quantity <= 5
                  }" class="text-2xl font-bold">
                    {{ selectedProduct()?.quantity }}
                  </div>
                </div>

                <div>
                  <div class="text-slate-400 text-sm mb-1">Price</div>
                  <div class="text-white text-2xl font-bold">₱{{ selectedProduct()!.price.toFixed(2) }}</div>
                </div>
              </div>

              <div>
                <div class="text-slate-400 text-sm mb-1">Category</div>
                <div class="text-white">{{ selectedProduct()?.category }}</div>
              </div>

              <div>
                <div class="text-slate-400 text-sm mb-1">Description</div>
                <div class="text-slate-300">{{ selectedProduct()?.description || 'No description' }}</div>
              </div>

              <div>
                <div class="text-slate-400 text-sm mb-1">Total Value</div>
                <div class="text-blue-400 text-xl font-semibold">
                  ₱{{ (selectedProduct()!.price * selectedProduct()!.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6 pt-6 border-t border-slate-700">
            <button
              (click)="closeDetailsModal()"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
            <a
              *ngIf="canManage()"
              [routerLink]="['/products', selectedProduct()?.id, 'edit']"
              (click)="closeDetailsModal()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
            >
              Edit Product
            </a>
            <button
              *ngIf="canManage()"
              (click)="openStockModal('IN')"
              class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Stock In
            </button>
            <button
              *ngIf="canManage()"
              (click)="openStockModal('OUT')"
              class="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Stock Out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock In/Out Modal (simple: updates product.quantity only) -->
    <div *ngIf="showStockModal()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-lg shadow-xl max-w-md w-full border border-slate-700 animate-fade-in">
        <div class="p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-xl font-bold text-white">
                {{ stockMode() === 'IN' ? 'Stock In' : 'Stock Out' }}
              </h3>
              <p class="text-slate-400 text-sm">
                This will update the product quantity.
              </p>
            </div>
            <button (click)="closeStockModal()" class="text-slate-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="bg-slate-900/30 border border-slate-700 rounded-lg p-4 mb-5">
            <div class="flex items-center justify-between">
              <div class="text-slate-400 text-sm">Current quantity</div>
              <div class="text-white font-semibold text-lg">{{ selectedProduct()?.quantity ?? 0 }}</div>
            </div>
            <div class="flex items-center justify-between mt-2">
              <div class="text-slate-400 text-sm">New quantity</div>
              <div class="font-bold text-lg"
                [ngClass]="{
                  'text-green-400': stockMode() === 'IN',
                  'text-orange-400': stockMode() === 'OUT'
                }">
                {{ computeNewQty() }}
              </div>
            </div>
          </div>

          <label class="block text-sm font-medium text-slate-300 mb-2">Quantity to {{ stockMode() === 'IN' ? 'add' : 'subtract' }}</label>
          <input
            type="number"
            min="1"
            [(ngModel)]="stockAmount"
            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter amount"
          />

          <div *ngIf="stockError()" class="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
            {{ stockError() }}
          </div>

          <div class="flex gap-3 mt-6">
            <button
              (click)="closeStockModal()"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="applyStockChange()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-lg shadow-xl max-w-md w-full border border-slate-700 animate-fade-in">
        <div class="p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-red-500/20 p-3 rounded-full">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Delete Product</h3>
              <p class="text-slate-400 text-sm">This action cannot be undone</p>
            </div>
          </div>
          
          <p class="text-slate-300 mb-6">
            Are you sure you want to delete <span class="font-semibold text-white">"{{ productNameToDelete() }}"</span>?
          </p>

          <div class="flex gap-3">
            <button
              (click)="closeDeleteModal()"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="confirmDelete()"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete
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
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  searchTerm = '';
  selectedCategory = '';
  currentUser = signal<any>(null);
  showDeleteModal = signal(false);
  productToDelete = signal<string | null>(null);
  productNameToDelete = signal<string>('');
  showDetailsModal = signal(false);
  selectedProduct = signal<Product | null>(null);
  showStockModal = signal(false);
  stockMode = signal<'IN' | 'OUT'>('IN');
  stockAmount = 1;
  stockError = signal('');

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private ui: UiFeedbackService
  ) {
    this.currentUser.set(this.authService.getCurrentUser());
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productsService.getProducts(
      this.currentPage(),
      this.pageSize(),
      this.selectedCategory || undefined,
      this.searchTerm || undefined
    ).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.totalPages.set(response.pagination.pages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  onFilter(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadProducts();
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          alert('Failed to delete product: ' + err.message);
        }
      });
    }
  }

  openDeleteModal(id: string, name: string): void {
    this.productToDelete.set(id);
    this.productNameToDelete.set(name);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
    this.productNameToDelete.set('');
  }

  confirmDelete(): void {
    const id = this.productToDelete();
    if (id) {
      this.ui.showLoading('Deleting product...');
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.closeDeleteModal();
          this.ui.hideLoading();
          this.ui.showToast('Product deleted successfully', 'success');
        },
        error: (err) => {
          this.ui.hideLoading();
          this.ui.showToast('Failed to delete product', 'error');
          this.closeDeleteModal();
        }
      });
    }
  }

  canManage(): boolean {
    return this.authService.canAccess(['admin']);
  }

  canDelete(): boolean {
    return this.authService.canAccess(['admin']);
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1); // ellipsis
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
    }
  }

  viewProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.showDetailsModal.set(true);
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedProduct.set(null);
  }

  openStockModal(mode: 'IN' | 'OUT'): void {
    this.stockMode.set(mode);
    this.stockAmount = 1;
    this.stockError.set('');
    this.showStockModal.set(true);
  }

  closeStockModal(): void {
    this.showStockModal.set(false);
    this.stockError.set('');
  }

  computeNewQty(): number {
    const current = this.selectedProduct()?.quantity ?? 0;
    const amt = Number(this.stockAmount) || 0;
    return this.stockMode() === 'IN' ? current + amt : current - amt;
  }

  applyStockChange(): void {
    const product = this.selectedProduct();
    if (!product) return;

    const amt = Number(this.stockAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      this.stockError.set('Please enter a valid quantity.');
      return;
    }

    const newQty = this.computeNewQty();
    if (newQty < 0) {
      this.stockError.set('Stock out is greater than current quantity.');
      return;
    }

    this.stockError.set('');
    this.ui.showLoading(this.stockMode() === 'IN' ? 'Applying stock in...' : 'Applying stock out...');

    this.productsService.updateQuantity(product.id, newQty).subscribe({
      next: (response) => {
        // Update modal product + list without refetch flicker
        const updated = response.data;
        this.selectedProduct.set(updated);
        this.products.update(list => list.map(p => (p.id === updated.id ? updated : p)));
        this.ui.hideLoading();
        this.ui.showToast('Quantity updated', 'success');
        this.closeStockModal();
      },
      error: () => {
        this.ui.hideLoading();
        this.ui.showToast('Failed to update quantity', 'error');
      }
    });
  }
}

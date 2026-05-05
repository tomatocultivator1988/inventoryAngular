import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../services/products.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div class="max-w-2xl mx-auto px-4">
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 class="text-3xl font-bold text-white mb-8">
            {{ isEditing() ? 'Edit Product' : 'Add New Product' }}
          </h1>

          <form (ngSubmit)="submitForm()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Product Name *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.name"
                  name="name"
                  required
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">SKU *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.sku"
                  name="sku"
                  required
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SKU"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Quantity *</label>
                <input
                  type="number"
                  [(ngModel)]="formData.quantity"
                  name="quantity"
                  required
                  min="0"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Price *</label>
                <input
                  type="number"
                  [(ngModel)]="formData.price"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <input
                  type="text"
                  [(ngModel)]="formData.category"
                  name="category"
                  class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Electronics, Clothing, etc."
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                [(ngModel)]="formData.description"
                name="description"
                rows="4"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product description"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Product Image</label>
              
              <!-- File Upload -->
              <div class="mb-4">
                <label class="block">
                  <div class="flex items-center justify-center w-full px-4 py-6 bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                    <div class="text-center">
                      <svg class="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <p class="mt-2 text-sm text-slate-400">
                        <span class="font-semibold text-blue-400">Click to upload</span> or drag and drop
                      </p>
                      <p class="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                    class="hidden"
                  />
                </label>
              </div>

              <!-- Image Preview -->
              <div *ngIf="imagePreview() || formData.image_url" class="mb-4">
                <img 
                  [src]="imagePreview() || formData.image_url" 
                  alt="Product preview" 
                  class="w-full h-48 object-cover rounded-lg border border-slate-600"
                />
              </div>

              <!-- Upload Progress -->
              <div *ngIf="uploadingImage()" class="mb-4 text-center text-blue-400">
                <div class="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full"></div>
                <span class="ml-2">Uploading image...</span>
              </div>

              <!-- Or use URL -->
              <div class="text-center text-slate-400 text-sm mb-2">OR</div>
              <input
                type="url"
                [(ngModel)]="formData.image_url"
                name="image_url"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image URL"
              />
            </div>

            <div *ngIf="error()" class="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-300">
              {{ error() }}
            </div>

            <div *ngIf="success()" class="bg-green-500/20 border border-green-500 rounded-lg p-4 text-green-300">
              {{ success() }}
            </div>

            <div class="flex gap-4 pt-6 border-t border-slate-700">
              <button
                type="submit"
                [disabled]="loading()"
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {{ loading() ? 'Saving...' : (isEditing() ? 'Update Product' : 'Add Product') }}
              </button>
              <a routerLink="/products" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors text-center">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div *ngIf="showConfirmModal()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-lg shadow-xl max-w-md w-full border border-slate-700 animate-fade-in">
        <div class="p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-blue-500/20 p-3 rounded-full">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ isEditing() ? 'Update Product' : 'Create Product' }}</h3>
              <p class="text-slate-400 text-sm">Please confirm your action</p>
            </div>
          </div>
          
          <p class="text-slate-300 mb-6">
            Are you sure you want to {{ isEditing() ? 'update' : 'create' }} <span class="font-semibold text-white">"{{ formData.name }}"</span>?
          </p>

          <div class="flex gap-3">
            <button
              type="button"
              (click)="closeConfirmModal()"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="confirmSubmit()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Confirm
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
export class ProductFormComponent implements OnInit {
  isEditing = signal(false);
  loading = signal(false);
  error = signal('');
  success = signal('');
  productId: string | null = null;
  uploadingImage = signal(false);
  selectedFile: File | null = null;
  imagePreview = signal<string>('');
  showConfirmModal = signal(false);

  formData = {
    name: '',
    description: '',
    sku: '',
    quantity: 0,
    price: 0,
    category: 'Uncategorized',
    image_url: ''
  };

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private ui: UiFeedbackService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = params['id'];
        this.isEditing.set(true);
        this.loadProduct();
      }
    });
  }

  private loadProduct(): void {
    if (!this.productId) return;

    this.loading.set(true);
    this.productsService.getProduct(this.productId).subscribe({
      next: (response) => {
        const product = response.data;
        this.formData = {
          name: product.name,
          description: product.description,
          sku: product.sku,
          quantity: product.quantity,
          price: product.price,
          category: product.category,
          image_url: product.image_url || ''
        };
        if (product.image_url) {
          this.imagePreview.set(product.image_url);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product');
        this.loading.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error.set('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error.set('Only image files are allowed');
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload immediately
      this.uploadImage();
    }
  }

  private uploadImage(): void {
    if (!this.selectedFile) return;

    this.uploadingImage.set(true);
    this.error.set('');

    this.productsService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.formData.image_url = response.imageUrl;
        this.uploadingImage.set(false);
        this.success.set('Image uploaded successfully');
        setTimeout(() => this.success.set(''), 3000);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to upload image');
        this.uploadingImage.set(false);
        this.selectedFile = null;
        this.imagePreview.set('');
      }
    });
  }

  submitForm(): void {
    if (!this.formData.name || !this.formData.sku || this.formData.quantity === undefined || !this.formData.price) {
      this.error.set('Please fill in all required fields');
      return;
    }

    this.showConfirmModal.set(true);
  }

  closeConfirmModal(): void {
    this.showConfirmModal.set(false);
  }

  confirmSubmit(): void {
    this.showConfirmModal.set(false);
    this.loading.set(true);
    this.error.set('');
    this.success.set('');
    this.ui.showLoading(this.isEditing() ? 'Updating product...' : 'Creating product...');

    const submitData = {
      name: this.formData.name,
      description: this.formData.description,
      sku: this.formData.sku,
      quantity: this.formData.quantity,
      price: this.formData.price,
      category: this.formData.category,
      image_url: this.formData.image_url || undefined
    };

    if (this.isEditing() && this.productId) {
      this.productsService.updateProduct(this.productId, submitData).subscribe({
        next: () => {
          this.success.set('Product updated successfully');
          this.ui.hideLoading();
          this.ui.showToast('Product updated successfully', 'success');
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1000);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to update product');
          this.loading.set(false);
          this.ui.hideLoading();
          this.ui.showToast('Failed to update product', 'error');
        }
      });
    } else {
      this.productsService.createProduct(submitData).subscribe({
        next: () => {
          this.success.set('Product created successfully');
          this.ui.hideLoading();
          this.ui.showToast('Product added successfully', 'success');
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1000);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to create product');
          this.loading.set(false);
          this.ui.hideLoading();
          this.ui.showToast('Failed to create product', 'error');
        }
      });
    }
  }
}

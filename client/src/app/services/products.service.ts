import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  image_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://imsys.up.railway.app/api/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1, limit: number = 10, category?: string, search?: string): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (category) {
      params = params.set('category', category);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Observable<{ message: string; data: Product }> {
    return this.http.post<{ message: string; data: Product }>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'created_by'>>): Observable<{ message: string; data: Product }> {
    return this.http.put<{ message: string; data: Product }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  updateQuantity(id: string, quantity: number): Observable<{ message: string; data: Product }> {
    return this.http.patch<{ message: string; data: Product }>(`${this.apiUrl}/${id}/update-quantity`, { quantity });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  uploadImage(file: File): Observable<{ message: string; imageUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ message: string; imageUrl: string; filename: string }>(`${this.apiUrl}/upload`, formData);
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);
  private token = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (storedToken && storedUser) {
      this.token.set(storedToken);
      this.currentUser.set(JSON.parse(storedUser));
      this.isAuthenticated.set(true);
    }
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password, name })
      .pipe(
        tap(response => {
          this.setAuth(response.token, response.user);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.setAuth(response.token, response.user);
        })
      );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { oldPassword, newPassword });
  }

  private setAuth(token: string, user: User): void {
    this.token.set(token);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getToken(): string | null {
    return this.token();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isAuthenticatedSignal() {
    return this.isAuthenticated;
  }

  canAccess(requiredRoles: string[]): boolean {
    const user = this.currentUser();
    return user ? requiredRoles.includes(user.role) : false;
  }
}

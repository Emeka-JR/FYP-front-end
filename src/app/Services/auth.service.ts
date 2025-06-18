import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

// export interface User {
//   id: string;
//   email: string;
//   full_name: string;
//   role: string;
//   is_active: boolean;
//   created_at: string;
//   last_login: string;
// }

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const payload = {
      username: email,
      password: password
    };

    return this.http.post<AuthResponse>(
      `${environment.apiUrl}${environment.apiEndpoints.auth.login}`,
      payload
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(email: string, password: string, full_name: string, role: string, adminCode?: string): Observable<AuthResponse> {
    const payload: any = { email, password, full_name, role };
    if (role === 'admin' && adminCode) {
      payload.adminCode = adminCode;
    }
    return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.apiEndpoints.auth.register}`, payload)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (route.data['requiresAdmin'] && !this.isAdmin()) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}

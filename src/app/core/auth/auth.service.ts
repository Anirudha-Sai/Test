import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Role } from '../enums/insurance.enums';
import { AuthState, AuthUser, LoginRequest, LoginResponse, RegisterRequest } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'insurance_auth_state';
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());

  readonly currentUser$ = this.currentUserSubject.asObservable();

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        map((response) => ({
          ...response,
          role: this.normalizeRole(response.role)
        })),
        tap((response) => this.storeAuthState(response))
      );
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    const safePayload: RegisterRequest = {
      ...payload,
      role: payload.role ?? Role.User
    };

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/register`, safePayload)
      .pipe(
        map((response) => ({
          ...response,
          role: this.normalizeRole(response.role)
        }))
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  }

  getAccessToken(): string | null {
    const authState = this.readAuthState();
    return authState?.accessToken ?? null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value ?? this.getStoredUser();
  }

  getRole(): Role | null {
    return this.getCurrentUser()?.role ?? null;
  }

  hasRole(role: Role): boolean {
    return this.getRole() === role;
  }

  hasAnyRole(roles: Role[]): boolean {
    const currentRole = this.getRole();
    return !!currentRole && roles.includes(currentRole);
  }

  getDashboardRouteForRole(role: Role | null): string {
    switch (role) {
      case Role.User:
        return '/user/dashboard';
      case Role.Customer:
        return '/customer/dashboard';
      case Role.Agent:
        return '/agent/dashboard';
      case Role.Underwriter:
        return '/underwriter/dashboard';
      case Role.Admin:
        return '/admin/dashboard';
      case Role.ClaimManager:
        return '/claim-manager/dashboard';
      default:
        return '/login';
    }
  }

  private storeAuthState(response: LoginResponse): void {
    const user: AuthUser = {
      id: response.userId,
      email: response.email,
      fullName: response.fullName,
      role: this.normalizeRole(response.role)
    };

    const authState: AuthState = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: response.expiresAt,
      user
    };

    localStorage.setItem(this.storageKey, JSON.stringify(authState));
    this.currentUserSubject.next(user);
  }

  private readAuthState(): AuthState | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthState;
    } catch {
      this.logout();
      return null;
    }
  }

  private getStoredUser(): AuthUser | null {
    const authState = this.readAuthState();
    return authState?.user ?? null;
  }

  private normalizeRole(role: Role | string): Role {
    const roles = Object.values(Role) as string[];
    return roles.includes(String(role)) ? (String(role) as Role) : Role.User;
  }
}

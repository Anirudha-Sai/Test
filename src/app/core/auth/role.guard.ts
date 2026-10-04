import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Role } from '../enums/insurance.enums';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = (route.data['roles'] as Role[] | undefined) ?? [];
    if (allowedRoles.length === 0) {
      return true;
    }

    const currentRole = this.authService.getRole();

    if (currentRole && allowedRoles.includes(currentRole)) {
      return true;
    }

    const fallbackPath = this.authService.getDashboardRouteForRole(currentRole);
    this.router.navigate([fallbackPath]);
    return false;
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/enums/insurance.enums';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './app-shell.component.html'
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.getCurrentUser();
  readonly role = this.authService.getRole() ?? Role.User;
  sidebarCollapsed = false;

  readonly navItems: NavigationItem[] = this.getNavigationForRole(this.role);

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getNavigationForRole(role: Role): NavigationItem[] {
    switch (role) {
      case Role.User:
        return [
          { label: 'Dashboard', route: '/user/dashboard', icon: '▣' },
          { label: 'Explore', route: '/user/explore', icon: '◌' },
          { label: 'Profile', route: '/user/profile', icon: '◍' }
        ];
      case Role.Customer:
        return [
          { label: 'Dashboard', route: '/customer/dashboard', icon: '▣' },
          { label: 'Quotes', route: '/customer/quotes', icon: '◎' },
          { label: 'Policies', route: '/customer/policies', icon: '▤' },
          { label: 'Profile', route: '/customer/profile', icon: '◍' }
        ];
      case Role.Agent:
        return [
          { label: 'Dashboard', route: '/agent/dashboard', icon: '▣' },
          { label: 'Users', route: '/agent/users', icon: '◫' },
          { label: 'Customers', route: '/agent/customers', icon: '◬' },
          { label: 'Assets', route: '/agent/customers', icon: '▦' },
          { label: 'Underwriting Requests', route: '/agent/underwriting', icon: '▨' },
          { label: 'Quotes', route: '/agent/quotes', icon: '◎' },
          { label: 'Policies', route: '/agent/policies', icon: '▤' }
        ];
      case Role.Underwriter:
        return [
          { label: 'Dashboard', route: '/underwriter/dashboard', icon: '▣' },
          { label: 'Requests', route: '/underwriter/requests', icon: '◫' },
          { label: 'Risk Assessment', route: '/underwriter/risk-assessment', icon: '◭' },
          { label: 'Quotes', route: '/underwriter/quotes', icon: '◎' },
          { label: 'Approvals', route: '/underwriter/approvals', icon: '▤' }
        ];
      case Role.Admin:
        return [{ label: 'Dashboard', route: '/admin/dashboard', icon: '▣' }];
      case Role.ClaimManager:
        return [{ label: 'Dashboard', route: '/claim-manager/dashboard', icon: '▣' }];
      default:
        return [{ label: 'Dashboard', route: '/user/dashboard', icon: '▣' }];
    }
  }
}

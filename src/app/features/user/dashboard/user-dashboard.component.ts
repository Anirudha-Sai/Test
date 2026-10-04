import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent {
  readonly overviewStats = [
    { label: 'Account', value: 'Active', tone: 'success' },
    { label: 'Policies', value: '0', tone: 'neutral' },
    { label: 'Quotes', value: '0', tone: 'neutral' },
    { label: 'Products', value: '0', tone: 'accent' }
  ];

  readonly products = [
    {
      name: 'Property Protection',
      description: 'Coverage designed for homes and rental property portfolios.'
    },
    {
      name: 'Vehicle Shield',
      description: 'Flexible vehicle cover for personal and commercial fleets.'
    },
    {
      name: 'Earthquake Essentials',
      description: 'Risk-first protection for residential and commercial exposures.'
    }
  ];

  readonly profileDetails = [
    { label: 'Role', value: 'User' },
    { label: 'Status', value: 'Ready for onboarding' },
    { label: 'Access', value: 'Product exploration' }
  ];
}

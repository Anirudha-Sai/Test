import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-dashboard.component.html'
})
export class CustomerDashboardComponent {
  readonly stats = [
    { label: 'Active policies', value: 0, tone: 'success' },
    { label: 'Pending quotes', value: 0, tone: 'warning' },
    { label: 'Selected quotes', value: 0, tone: 'accent' },
    { label: 'Coverage summary', value: '$0', tone: 'neutral' }
  ];

  readonly recentActivity = [
    'No recent activity has been recorded yet.',
    'Policy and quote updates will appear here once workflows are active.'
  ];
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-dashboard.component.html'
})
export class AgentDashboardComponent {
  readonly stats = [
    { label: 'Total users', value: 0, tone: 'neutral' },
    { label: 'Total customers', value: 0, tone: 'accent' },
    { label: 'Assets', value: 0, tone: 'neutral' },
    { label: 'Pending underwriting', value: 0, tone: 'warning' },
    { label: 'Quotes', value: 0, tone: 'neutral' },
    { label: 'Policies', value: 0, tone: 'success' }
  ];

  readonly recentActivity = [
    'No recent activity has been recorded yet.',
    'Agent onboarding and asset workflows will appear here once integrated.'
  ];
}

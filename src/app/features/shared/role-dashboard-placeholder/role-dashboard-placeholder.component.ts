import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-role-dashboard-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-header">
      <div>
        <span class="eyebrow">Role dashboard</span>
        <h1>{{ title }}</h1>
      </div>
    </section>

    <div class="panel">
      <div class="empty-state">
        <p>This dashboard is currently reserved for future workflow implementation.</p>
      </div>
    </div>
  `
})
export class RoleDashboardPlaceholderComponent {
  @Input() title = 'Dashboard';
}

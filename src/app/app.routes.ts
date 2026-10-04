import { Routes } from '@angular/router';

import { AuthGuard } from './core/auth/auth.guard';
import { RoleGuard } from './core/auth/role.guard';
import { Role } from './core/enums/insurance.enums';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AppShellComponent } from './features/layout/app-shell/app-shell.component';
import { UserDashboardComponent } from './features/user/dashboard/user-dashboard.component';
import { CustomerDashboardComponent } from './features/customer/dashboard/customer-dashboard.component';
import { AgentDashboardComponent } from './features/agent/dashboard/agent-dashboard.component';
import { UnderwriterDashboardComponent } from './features/underwriter/dashboard/underwriter-dashboard.component';
import { RoleDashboardPlaceholderComponent } from './features/shared/role-dashboard-placeholder/role-dashboard-placeholder.component';
import { AgentUsersComponent } from './features/agent/users/agent-users.component';
import { AgentUserDetailComponent } from './features/agent/user-detail/agent-user-detail.component';
import { AgentCustomersComponent } from './features/agent/customers/agent-customers.component';
import { AgentCustomerDetailComponent } from './features/agent/customer-detail/agent-customer-detail.component';
import { AgentCustomerAssetsComponent } from './features/agent/customer-assets/agent-customer-assets.component';
import { AgentAssetFormComponent } from './features/agent/asset-form/agent-asset-form.component';
import { AgentAssetDetailComponent } from './features/agent/asset-detail/agent-asset-detail.component';
import { AgentUnderwritingFormComponent } from './features/agent/underwriting-form/agent-underwriting-form.component';
import { AgentUnderwritingListComponent } from './features/agent/underwriting-list/agent-underwriting-list.component';
import { CustomerPolicyDetailComponent } from './features/customer/policies/customer-policy-detail.component';
import { CustomerPoliciesComponent } from './features/customer/policies/customer-policies.component';
import { CustomerProfileComponent } from './features/customer/profile/customer-profile.component';
import { CustomerQuoteCompareComponent } from './features/customer/quotes/customer-quote-compare.component';
import { CustomerQuoteDetailComponent } from './features/customer/quotes/customer-quote-detail.component';
import { CustomerQuoteListComponent } from './features/customer/quotes/customer-quote-list.component';
import { CustomerSelectedQuoteComponent } from './features/customer/quotes/customer-selected-quote.component';
import { UnderwriterApprovalQueueComponent } from './features/underwriter/approvals/underwriter-approval-queue.component';
import { UnderwriterQuoteDetailComponent } from './features/underwriter/quotes/underwriter-quote-detail.component';
import { UnderwriterQuoteListComponent } from './features/underwriter/quotes/underwriter-quote-list.component';
import { UnderwriterRequestDetailComponent } from './features/underwriter/request-detail/underwriter-request-detail.component';
import { UnderwriterRequestsComponent } from './features/underwriter/requests/underwriter-requests.component';
import { UnderwriterRiskAssessmentComponent } from './features/underwriter/risk-assessment/underwriter-risk-assessment.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'user/dashboard', pathMatch: 'full' },
      {
        path: 'user/dashboard',
        component: UserDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.User] }
      },
      {
        path: 'customer/dashboard',
        component: CustomerDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'customer/quotes',
        component: CustomerQuoteListComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'customer/quotes/:requestId',
        component: CustomerQuoteDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'customer/quotes/:requestId/compare',
        component: CustomerQuoteCompareComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'customer/quotes/:requestId/selected',
        component: CustomerSelectedQuoteComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'customer/quotes/selected',
        component: CustomerSelectedQuoteComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'customer/policies',
        component: CustomerPoliciesComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'customer/policies/:policyNumber',
        component: CustomerPolicyDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'customer/profile',
        component: CustomerProfileComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Customer] }
      },
      {
        path: 'agent/dashboard',
        component: AgentDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/users',
        component: AgentUsersComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/users/:id',
        component: AgentUserDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/customers',
        component: AgentCustomersComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/customers/:id',
        component: AgentCustomerDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/customers/:customerId/assets',
        component: AgentCustomerAssetsComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/customers/:customerId/assets/new',
        component: AgentAssetFormComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent], mode: 'create' }
      },
      {
        path: 'agent/assets/:id',
        component: AgentAssetDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/assets/:id/edit',
        component: AgentAssetFormComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent], mode: 'edit' }
      },
      {
        path: 'agent/assets/:id/underwriting',
        component: AgentUnderwritingFormComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/underwriting',
        component: AgentUnderwritingListComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] }
      },
      {
        path: 'agent/quotes',
        component: RoleDashboardPlaceholderComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] },
        title: 'Quotes'
      },
      {
        path: 'agent/policies',
        component: RoleDashboardPlaceholderComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Agent] },
        title: 'Policies'
      },
      {
        path: 'underwriter/dashboard',
        component: UnderwriterDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Underwriter] }
      },
      {
        path: 'underwriter/requests',
        component: UnderwriterRequestsComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Underwriter] }
      },
      {
        path: 'underwriter/requests/:id',
        component: UnderwriterRequestDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Underwriter] }
      },
      {
        path: 'underwriter/requests/:id/risk-assessment',
        component: UnderwriterRiskAssessmentComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Underwriter] }
      },
      {
        path: 'underwriter/requests/:id/quotes',
        component: UnderwriterQuoteListComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Underwriter] }
      },
      {
        path: 'underwriter/quotes',
        component: UnderwriterQuoteListComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Underwriter] }
      },
      {
        path: 'underwriter/quotes/:id',
        component: UnderwriterQuoteDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Underwriter] }
      },
      {
        path: 'underwriter/approvals',
        component: UnderwriterApprovalQueueComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Underwriter] }
      },
      {
        path: 'underwriter/risk-assessment',
        redirectTo: 'underwriter/requests',
        pathMatch: 'full'
      },
      {
        path: 'admin/dashboard',
        component: RoleDashboardPlaceholderComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.Admin] },
        title: 'Admin Dashboard'
      },
      {
        path: 'claim-manager/dashboard',
        component: RoleDashboardPlaceholderComponent,
        canActivate: [RoleGuard],
        data: { roles: [Role.ClaimManager] },
        title: 'Claim Manager Dashboard'
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

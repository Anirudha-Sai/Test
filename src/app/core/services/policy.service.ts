import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Policy, PolicyCreateRequest, PolicyStatusUpdateRequest } from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/policies`;

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.apiUrl);
  }

  getCustomerPolicies(customerId: number | string): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  getPolicy(id: number | string): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/${id}`);
  }

  getPolicyDocument(policyNumber: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/document/${policyNumber}`, { responseType: 'blob' });
  }

  createPolicy(payload: PolicyCreateRequest): Observable<Policy> {
    return this.http.post<Policy>(this.apiUrl, payload);
  }

  updatePolicy(id: number | string, payload: Partial<Policy>): Observable<Policy> {
    return this.http.put<Policy>(`${this.apiUrl}/${id}`, payload);
  }

  updatePolicyStatus(id: number | string, payload: PolicyStatusUpdateRequest): Observable<Policy> {
    return this.http.patch<Policy>(`${this.apiUrl}/${id}/status`, payload);
  }

  convertQuoteToPolicy(quoteId: number | string): Observable<Policy> {
    return this.http.post<Policy>(`${environment.apiUrl}/quotes/${quoteId}/convert-to-policy`, {});
  }

  deletePolicy(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

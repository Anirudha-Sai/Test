import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Customer, CustomerStatusUpdateRequest } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/customers`;

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  createCustomer(userId: number | string): Observable<Customer>;
  createCustomer(payload: Partial<Customer>): Observable<Customer>;
  createCustomer(payloadOrUserId: number | string | Partial<Customer>): Observable<Customer> {
    const payload =
      typeof payloadOrUserId === 'number' || typeof payloadOrUserId === 'string'
        ? { userId: payloadOrUserId }
        : payloadOrUserId;

    return this.http.post<Customer>(this.apiUrl, payload);
  }

  getCustomer(id: number | string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  deleteCustomer(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCustomerStatus(id: number | string, payload: CustomerStatusUpdateRequest): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/${id}/status`, payload);
  }
}

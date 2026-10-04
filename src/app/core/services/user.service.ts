import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateUserRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number | string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  batchUsers(payload: CreateUserRequest[]): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/batch`, payload);
  }

  createBatchUsers(payload: CreateUserRequest[]): Observable<User[]> {
    return this.batchUsers(payload);
  }
}

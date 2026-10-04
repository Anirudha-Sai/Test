import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Asset, AssetStatusUpdateRequest, CreateAssetRequest } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/assets`;

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl);
  }

  createAsset(payload: CreateAssetRequest): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, payload);
  }

  getAsset(id: number | string | null | undefined): Observable<Asset> {
    if (!id) {
      throw new Error('Asset ID is required');
    }
    return this.http.get<Asset>(`${this.apiUrl}/${id}`);
  }

  updateAsset(id: number | string, payload: Partial<Asset>): Observable<Asset> {
    return this.http.put<Asset>(`${this.apiUrl}/${id}`, payload);
  }

  deleteAsset(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCustomerAssets(customerId: number | string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  updateAssetStatus(id: number | string, payload: AssetStatusUpdateRequest): Observable<Asset> {
    return this.http.patch<Asset>(`${this.apiUrl}/${id}/status`, payload);
  }
}

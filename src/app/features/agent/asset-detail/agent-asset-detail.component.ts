import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AssetType } from '../../../core/enums/insurance.enums';
import { Asset, PropertyDetail, VehicleDetail } from '../../../core/models/asset.model';
import { AssetService } from '../../../core/services/asset.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-agent-asset-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-asset-detail.component.html'
})
export class AgentAssetDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly assetService = inject(AssetService);
  private readonly toastService = inject(ToastService);

  asset: Asset | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Asset was not found.';
      return;
    }

    this.loadAsset(id);
  }

  getAssetName(): string {
    return this.asset?.name ?? this.asset?.assetName ?? 'Asset';
  }

  getAssetTypeLabel(): string {
    const value = Number(this.asset?.assetType ?? AssetType.ResidentialProperty);
    switch (value) {
      case AssetType.ResidentialProperty:
        return 'Residential Property';
      case AssetType.CommercialProperty:
        return 'Commercial Property';
      case AssetType.Vehicle:
        return 'Vehicle';
      default:
        return 'Asset';
    }
  }

  getPropertyDetails(): PropertyDetail | null {
    return this.asset?.propertyDetails ?? this.asset?.propertyDetail ?? null;
  }

  getVehicleDetails(): VehicleDetail | null {
    return this.asset?.vehicleDetails ?? this.asset?.vehicleDetail ?? null;
  }

  getPropertyEntry(key: keyof PropertyDetail): string | number | null {
    const value = this.getPropertyDetails()?.[key];
    return value == null ? null : value;
  }

  getVehicleEntry(key: keyof VehicleDetail): string | number | boolean | null {
    const value = this.getVehicleDetails()?.[key];
    return value == null ? null : value;
  }

  editAsset(): void {
    if (!this.asset?.assetId) {
      return;
    }

    this.router.navigate(['/agent/assets', this.asset.assetId, 'edit']);
  }

  deleteAsset(): void {
    if (!this.asset?.assetId) {
      return;
    }

    const confirmed = window.confirm('Delete this asset?\n\nThis action cannot be undone.');
    if (!confirmed) {
      return;
    }

    this.assetService.deleteAsset(this.asset.assetId).subscribe({
      next: () => {
        this.toastService.showSuccess('Asset deleted successfully.');
        if (this.asset?.customerId != null) {
          this.router.navigate(['/agent/customers', this.asset.customerId, 'assets']);
        } else {
          this.router.navigate(['/agent/customers']);
        }
      },
      error: () => {
        this.toastService.showError('Unable to delete this asset.');
      }
    });
  }

  openUnderwritingRequest(): void {
    if (!this.asset?.assetId) {
      return;
    }

    this.router.navigate(['/agent/assets', this.asset.assetId, 'underwriting']);
  }

  private loadAsset(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.assetService.getAsset(id).subscribe({
      next: (asset) => {
        console.log('Loaded asset:', asset);
        this.asset = asset;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the asset.';
        this.isLoading = false;
      }
    });
  }
}

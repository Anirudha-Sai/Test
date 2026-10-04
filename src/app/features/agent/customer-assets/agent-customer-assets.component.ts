import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AssetType } from '../../../core/enums/insurance.enums';
import { Asset } from '../../../core/models/asset.model';
import { AssetService } from '../../../core/services/asset.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-agent-customer-assets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-customer-assets.component.html'
})
export class AgentCustomerAssetsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly assetService = inject(AssetService);
  private readonly toastService = inject(ToastService);

  customerId: string | null = null;
  assets: Asset[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    if (!this.customerId) {
      this.errorMessage = 'Customer was not found.';
      return;
    }

    this.loadAssets();
  }

  trackAsset(index: number, asset: Asset): number | string {
    return asset.assetId ?? index;
  }

  getAssetName(asset: Asset): string {
    return asset.name ?? asset.assetName ?? 'Asset';
  }

  getAssetTypeLabel(asset: Asset): string {
    const value = Number(asset.assetType);
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

  openAsset(asset: Asset): void {
    if (asset.assetId == null) {
      return;
    }

    this.router.navigate(['/agent/assets', asset.assetId]);
  }

  editAsset(asset: Asset): void {
    if (asset.assetId == null) {
      return;
    }

    this.router.navigate(['/agent/assets', asset.assetId, 'edit']);
  }

  deleteAsset(asset: Asset): void {
    if (asset.assetId == null) {
      return;
    }

    const confirmed = window.confirm('Delete this asset?\n\nThis action cannot be undone.');
    if (!confirmed) {
      return;
    }

    this.assetService.deleteAsset(asset.assetId).subscribe({
      next: () => {
        this.toastService.showSuccess('Asset deleted successfully.');
        this.loadAssets();
      },
      error: () => {
        this.toastService.showError('Unable to delete this asset.');
      }
    });
  }

  private loadAssets(): void {
    if (!this.customerId) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.assetService.getCustomerAssets(this.customerId).subscribe({
      next: (assets) => {
        this.assets = assets ?? [];
        console.log('Loaded assets:', this.assets);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load customer assets.';
        this.isLoading = false;
      }
    });
  }
}

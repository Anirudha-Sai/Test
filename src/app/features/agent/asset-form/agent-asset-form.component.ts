import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AssetType, ConstructionType, OccupancyType } from '../../../core/enums/insurance.enums';
import { Asset, CreateAssetRequest } from '../../../core/models/asset.model';
import { AssetService } from '../../../core/services/asset.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-agent-asset-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './agent-asset-form.component.html'
})
export class AgentAssetFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly assetService = inject(AssetService);
  private readonly toastService = inject(ToastService);

  readonly form = this.fb.nonNullable.group({
    assetType: [AssetType.ResidentialProperty, [Validators.required]],
    assetName: ['', [Validators.required]],
    marketValue: [0, [Validators.required, Validators.min(0)]],
    replacementValue: [0, [Validators.required, Validators.min(0)]],
    propertyDetails: this.fb.nonNullable.group({
      propertyType: ['Residential Property'],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      country: [''],
      postalCode: [''],
      latitude: [0],
      longitude: [0],
      yearBuilt: [new Date().getFullYear()],
      buildingArea: [0],
      numberOfFloors: [1],
      constructionType: [ConstructionType.ReinforcedConcrete],
      occupancyType: [OccupancyType.OwnerOccupied]
    }),
    vehicleDetails: this.fb.nonNullable.group({
      registrationNumber: [''],
      make: [''],
      model: [''],
      manufactureYear: [new Date().getFullYear()],
      vehicleType: ['Passenger Car'],
      engineNumber: [''],
      chassisNumber: [''],
      insuredDeclaredValue: [0],
      seatingCapacity: [0],
      mileage: [0],
      financed: [false],
      financierName: ['']
    })
  });

  mode: 'create' | 'edit' = 'create';
  customerId: string | null = null;
  assetId: string | null = null;
  isSubmitting = false;
  loading = false;

  readonly assetTypeOptions = [
    { value: AssetType.ResidentialProperty, label: 'Residential Property' },
    { value: AssetType.CommercialProperty, label: 'Commercial Property' },
    { value: AssetType.Vehicle, label: 'Vehicle' }
  ];

  readonly constructionTypeOptions = [
    { value: ConstructionType.BrickMasonry, label: 'Brick Masonry' },
    { value: ConstructionType.ReinforcedConcrete, label: 'Reinforced Concrete' },
    { value: ConstructionType.SteelFrame, label: 'Steel Frame' },
    { value: ConstructionType.Wood, label: 'Wood' },
    { value: ConstructionType.Mixed, label: 'Mixed' }
  ];

  readonly occupancyTypeOptions = [
    { value: OccupancyType.OwnerOccupied, label: 'Owner Occupied' },
    { value: OccupancyType.TenantOccupied, label: 'Tenant Occupied' },
    { value: OccupancyType.Commercial, label: 'Commercial' },
    { value: OccupancyType.Industrial, label: 'Industrial' },
    { value: OccupancyType.Vacant, label: 'Vacant' }
  ];

  ngOnInit(): void {
    this.mode = (this.route.snapshot.data['mode'] as 'create' | 'edit') ?? 'create';
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    this.assetId = this.route.snapshot.paramMap.get('id');

    this.applyConditionalValidation();

    if (this.mode === 'edit' && this.assetId) {
      this.loadExistingAsset();
    }
  }

  get showPropertyFields(): boolean {
    return Number(this.form.get('assetType')?.value ?? AssetType.ResidentialProperty) !== AssetType.Vehicle;
  }

  get showVehicleFields(): boolean {
    return Number(this.form.get('assetType')?.value ?? AssetType.ResidentialProperty) === AssetType.Vehicle;
  }

  get hasFinancierName(): boolean {
    return Boolean(this.form.get('vehicleDetails.financed')?.value);
  }

  get title(): string {
    return this.mode === 'edit' ? 'Edit asset' : 'Add asset';
  }

  get cancelRoute(): string {
    if (this.mode === 'edit' && this.assetId) {
      return `/agent/assets/${this.assetId}`;
    }

    if (this.customerId) {
      return `/agent/customers/${this.customerId}/assets`;
    }

    return '/agent/customers';
  }

  onAssetTypeChange(): void {
    this.applyConditionalValidation();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.showError('Please complete all required fields before saving the asset.');
      return;
    }

    this.isSubmitting = true;
    const payload = this.buildPayload();
    const request = this.mode === 'edit' && this.assetId
      ? this.assetService.updateAsset(this.assetId, payload)
      : this.assetService.createAsset(payload);

    request.subscribe({
      next: (asset) => {
        this.isSubmitting = false;
        this.toastService.showSuccess(this.mode === 'edit' ? 'Asset updated successfully.' : 'Asset created successfully.');
        this.router.navigate(['/agent/assets', asset.assetId ?? this.assetId ?? this.customerId]);
      },
      error: () => {
        this.isSubmitting = false;
        this.toastService.showError(this.mode === 'edit' ? 'Unable to update the asset.' : 'Unable to create the asset.');
      }
    });
  }

  getAssetTypeLabel(value: number): string {
    switch (Number(value)) {
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

  getConstructionLabel(value: number | string): string {
    const numberValue = Number(value);
    switch (numberValue) {
      case ConstructionType.BrickMasonry:
        return 'Brick Masonry';
      case ConstructionType.ReinforcedConcrete:
        return 'Reinforced Concrete';
      case ConstructionType.SteelFrame:
        return 'Steel Frame';
      case ConstructionType.Wood:
        return 'Wood';
      case ConstructionType.Mixed:
        return 'Mixed';
      default:
        return 'Not specified';
    }
  }

  getOccupancyLabel(value: number | string): string {
    const numberValue = Number(value);
    switch (numberValue) {
      case OccupancyType.OwnerOccupied:
        return 'Owner Occupied';
      case OccupancyType.TenantOccupied:
        return 'Tenant Occupied';
      case OccupancyType.Commercial:
        return 'Commercial';
      case OccupancyType.Industrial:
        return 'Industrial';
      case OccupancyType.Vacant:
        return 'Vacant';
      default:
        return 'Not specified';
    }
  }

  private loadExistingAsset(): void {
    if (!this.assetId) {
      return;
    }

    this.loading = true;
    this.assetService.getAsset(this.assetId).subscribe({
      next: (asset) => {
        this.loading = false;
        this.populateForm(asset);
      },
      error: () => {
        this.loading = false;
        this.toastService.showError('Unable to load the existing asset.');
      }
    });
  }

  private populateForm(asset: Asset): void {
    const assetType = Number(asset.assetType ?? AssetType.ResidentialProperty);
    const propertyDetails = asset.propertyDetails ?? asset.propertyDetail ?? {};
    const vehicleDetails = asset.vehicleDetails ?? asset.vehicleDetail ?? {};

    this.form.patchValue({
      assetType,
      assetName: asset.assetName ?? asset.name ?? '',
      marketValue: asset.marketValue ?? 0,
      replacementValue: asset.replacementValue ?? 0,
      propertyDetails: {
        propertyType: propertyDetails.propertyType ?? 'Residential Property',
        addressLine1: propertyDetails.addressLine1 ?? '',
        addressLine2: propertyDetails.addressLine2 ?? '',
        city: propertyDetails.city ?? '',
        state: propertyDetails.state ?? '',
        country: propertyDetails.country ?? '',
        postalCode: propertyDetails.postalCode ?? propertyDetails.zipCode ?? '',
        latitude: propertyDetails.latitude ?? 0,
        longitude: propertyDetails.longitude ?? 0,
        yearBuilt: propertyDetails.yearBuilt ?? new Date().getFullYear(),
        buildingArea: propertyDetails.buildingArea ?? propertyDetails.squareFootage ?? 0,
        numberOfFloors: propertyDetails.numberOfFloors ?? 1,
        constructionType: Number(propertyDetails.constructionType ?? ConstructionType.ReinforcedConcrete),
        occupancyType: Number(propertyDetails.occupancyType ?? OccupancyType.OwnerOccupied)
      },
      vehicleDetails: {
        registrationNumber: vehicleDetails.registrationNumber ?? '',
        make: vehicleDetails.make ?? '',
        model: vehicleDetails.model ?? '',
        manufactureYear: vehicleDetails.manufactureYear ?? vehicleDetails.year ?? new Date().getFullYear(),
        vehicleType: vehicleDetails.vehicleType ?? 'Passenger Car',
        engineNumber: vehicleDetails.engineNumber ?? '',
        chassisNumber: vehicleDetails.chassisNumber ?? vehicleDetails.vin ?? '',
        insuredDeclaredValue: vehicleDetails.insuredDeclaredValue ?? vehicleDetails.vehicleValue ?? 0,
        seatingCapacity: vehicleDetails.seatingCapacity ?? 0,
        mileage: vehicleDetails.mileage ?? 0,
        financed: Boolean(vehicleDetails.financed),
        financierName: vehicleDetails.financierName ?? ''
      }
    });

    this.applyConditionalValidation();
  }

  private buildPayload(): CreateAssetRequest {
    const formValue = this.form.getRawValue();
    const assetType = Number(formValue.assetType ?? AssetType.ResidentialProperty);
    const assetName = String(formValue.assetName ?? '').trim();
    const marketValue = Number(formValue.marketValue ?? 0);
    const replacementValue = Number(formValue.replacementValue ?? 0);

    const basePayload: CreateAssetRequest = {
      customerId: this.mode === 'create' ? (this.customerId ?? 0) : (this.customerId ?? this.assetId ?? 0),
      assetType,
      assetName,
      name: assetName,
      marketValue,
      replacementValue
    };

    if (assetType === AssetType.Vehicle) {
      const vehicleDetails = formValue.vehicleDetails ?? {};
      return {
        ...basePayload,
        vehicleDetails: {
          registrationNumber: vehicleDetails.registrationNumber,
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          manufactureYear: Number(vehicleDetails.manufactureYear ?? new Date().getFullYear()),
          vehicleType: vehicleDetails.vehicleType,
          engineNumber: vehicleDetails.engineNumber,
          chassisNumber: vehicleDetails.chassisNumber,
          insuredDeclaredValue: Number(vehicleDetails.insuredDeclaredValue ?? 0),
          seatingCapacity: Number(vehicleDetails.seatingCapacity ?? 0),
          mileage: Number(vehicleDetails.mileage ?? 0),
          financed: Boolean(vehicleDetails.financed),
          financierName: vehicleDetails.financed ? vehicleDetails.financierName : ''
        }
      };
    }

    const propertyDetails = formValue.propertyDetails ?? {};
    return {
      ...basePayload,
      propertyDetails: {
        propertyType: propertyDetails.propertyType,
        addressLine1: propertyDetails.addressLine1,
        addressLine2: propertyDetails.addressLine2,
        city: propertyDetails.city,
        state: propertyDetails.state,
        country: propertyDetails.country,
        postalCode: propertyDetails.postalCode,
        latitude: Number(propertyDetails.latitude ?? 0),
        longitude: Number(propertyDetails.longitude ?? 0),
        constructionType: Number(propertyDetails.constructionType ?? ConstructionType.ReinforcedConcrete),
        occupancyType: Number(propertyDetails.occupancyType ?? OccupancyType.OwnerOccupied),
        yearBuilt: Number(propertyDetails.yearBuilt ?? new Date().getFullYear()),
        buildingArea: Number(propertyDetails.buildingArea ?? 0),
        numberOfFloors: Number(propertyDetails.numberOfFloors ?? 1),
        squareFootage: Number(propertyDetails.buildingArea ?? 0)
      }
    };
  }

  private applyConditionalValidation(): void {
    const selectedType = Number(this.form.get('assetType')?.value ?? AssetType.ResidentialProperty);
    const isProperty = selectedType !== AssetType.Vehicle;
    const isVehicle = selectedType === AssetType.Vehicle;

    const propertyFields = [
      'propertyDetails.propertyType',
      'propertyDetails.addressLine1',
      'propertyDetails.city',
      'propertyDetails.state',
      'propertyDetails.country',
      'propertyDetails.postalCode',
      'propertyDetails.yearBuilt',
      'propertyDetails.buildingArea',
      'propertyDetails.numberOfFloors',
      'propertyDetails.constructionType',
      'propertyDetails.occupancyType'
    ];

    propertyFields.forEach((path) => {
      const control = this.form.get(path) as AbstractControl | null;
      if (!control) {
        return;
      }

      if (isProperty) {
        control.setValidators([Validators.required]);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity();
    });

    const vehicleFields = [
      'vehicleDetails.registrationNumber',
      'vehicleDetails.make',
      'vehicleDetails.model',
      'vehicleDetails.manufactureYear',
      'vehicleDetails.vehicleType',
      'vehicleDetails.engineNumber',
      'vehicleDetails.chassisNumber',
      'vehicleDetails.insuredDeclaredValue',
      'vehicleDetails.seatingCapacity',
      'vehicleDetails.mileage'
    ];

    vehicleFields.forEach((path) => {
      const control = this.form.get(path) as AbstractControl | null;
      if (!control) {
        return;
      }

      if (isVehicle) {
        control.setValidators([Validators.required]);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity();
    });

    const financedControl = this.form.get('vehicleDetails.financed') as FormControl | null;
    const financierControl = this.form.get('vehicleDetails.financierName') as FormControl | null;
    if (financedControl && financierControl) {
      if (financedControl.value) {
        financierControl.setValidators([Validators.required]);
      } else {
        financierControl.clearValidators();
      }
      financierControl.updateValueAndValidity();
    }
  }
}

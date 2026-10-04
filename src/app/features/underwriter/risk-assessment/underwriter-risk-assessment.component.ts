import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ConstructionType } from '../../../core/enums/insurance.enums';
import { GeneratedQuoteResponseDto, QuoteRequest, RiskAssessmentRequestDto } from '../../../core/models/quote.model';
import { QuoteService } from '../../../core/services/quote.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-underwriter-risk-assessment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './underwriter-risk-assessment.component.html'
})
export class UnderwriterRiskAssessmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quoteService = inject(QuoteService);
  private readonly toastService = inject(ToastService);

  readonly form = this.fb.nonNullable.group({
    propertyValue: [0, [Validators.required, Validators.min(0.01)]],
    constructionType: [ConstructionType.ReinforcedConcrete, [Validators.required]],
    buildingAge: [0, [Validators.required, Validators.min(0)]],
    floors: [1, [Validators.required, Validators.min(1)]],
    usage: ['Residential', [Validators.required]],
    historicalEarthquakes: [0, [Validators.min(0)]],
    maxMagnitude: [0, [Validators.min(0)]],
    distanceFromFaultKm: [0, [Validators.min(0)]],
    seismicZone: ['Zone 2'],
    previousClaims: [0, [Validators.min(0)]],
    contentsCoverage: [false],
    temporaryAccommodation: [false],
    vehicleCoverage: [false]
  });

  request: QuoteRequest | null = null;
  result: GeneratedQuoteResponseDto | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  readonly constructionTypeOptions = [
    { value: ConstructionType.BrickMasonry, label: 'Brick Masonry' },
    { value: ConstructionType.ReinforcedConcrete, label: 'Reinforced Concrete' },
    { value: ConstructionType.SteelFrame, label: 'Steel Frame' },
    { value: ConstructionType.Wood, label: 'Wood' },
    { value: ConstructionType.Mixed, label: 'Mixed' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Request was not found for risk assessment.';
      return;
    }

    this.loadRequest(id);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.showError('Please complete the risk assessment form before submitting.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload: RiskAssessmentRequestDto = {
      propertyValue: Number(this.form.controls.propertyValue.value),
      constructionType: this.form.controls.constructionType.value,
      buildingAge: Number(this.form.controls.buildingAge.value),
      floors: Number(this.form.controls.floors.value),
      usage: this.form.controls.usage.value || 'Residential',
      historicalEarthquakes: Number(this.form.controls.historicalEarthquakes.value ?? 0),
      maxMagnitude: Number(this.form.controls.maxMagnitude.value ?? 0),
      distanceFromFaultKm: Number(this.form.controls.distanceFromFaultKm.value ?? 0),
      seismicZone: this.form.controls.seismicZone.value || 'Zone 2',
      previousClaims: Number(this.form.controls.previousClaims.value ?? 0),
      contentsCoverage: Boolean(this.form.controls.contentsCoverage.value),
      temporaryAccommodation: Boolean(this.form.controls.temporaryAccommodation.value),
      vehicleCoverage: Boolean(this.form.controls.vehicleCoverage.value)
    };

    this.quoteService.generateRiskAssessment(payload).subscribe({
      next: (response) => {
        this.result = response;
        this.isSubmitting = false;
        this.toastService.showSuccess('Risk assessment generated successfully.');
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Risk assessment failed. Please try again.';
        this.toastService.showError('Risk assessment failed. Please try again.');
      }
    });
  }

  viewRequest(): void {
    if (!this.request?.id && !this.request?.quoteRequestId) {
      return;
    }

    const id = this.request?.id ?? this.request?.quoteRequestId;
    this.router.navigate(['/underwriter/requests', id]);
  }

  viewQuotes(): void {
    if (!this.request?.id && !this.request?.quoteRequestId) {
      return;
    }

    const id = this.request?.id ?? this.request?.quoteRequestId;
    this.router.navigate(['/underwriter/requests', id, 'quotes']);
  }

  private loadRequest(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.quoteService.getQuoteRequest(id).subscribe({
      next: (request) => {
        this.request = request;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load the request.';
      }
    });
  }
}

export interface Policy {
  id?: number | string;
  customerId?: number | string;
  quoteId?: number | string;
  quoteReference?: string;
  propertyId?: number | string;
  productId?: number | string;
  policyNumber?: string;
  status?: number | string;
  startDate?: string;
  effectiveDate?: string;
  endDate?: string;
  expiryDate?: string;
  premium?: number;
  annualPremium?: number;
  sumInsured?: number;
  coverAmount?: number;
  deductiblePercentage?: number;
  renewalPeriodMonths?: number;
  createdAt?: string;
  updatedAt?: string;
  addOns?: Array<{ name?: string; description?: string; price?: number }>;
}

export interface PolicyCreateRequest {
  customerId: number | string;
  quoteId: number | string;
  premium?: number;
  coverAmount?: number;
}

export interface PolicyStatusUpdateRequest {
  status: number;
}

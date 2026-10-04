export interface QuoteAddon {
  id?: number | string;
  name: string;
  description?: string;
  price?: number;
  isSelected?: boolean;
}

export interface Quote {
  id?: number | string;
  quoteReference?: string;
  quoteRequestId?: number | string;
  requestId?: number | string;
  propertyId?: number | string;
  status?: number | string;
  premium?: number;
  basePremium?: number;
  annualPremium?: number;
  totalPremium?: number;
  premiumRate?: number;
  coverAmount?: number;
  sumInsured?: number;
  coverageType?: string;
  coveragePercentage?: number;
  coveragePeriodYears?: number;
  renewalPeriodMonths?: number;
  deductiblePercentage?: number;
  riskScore?: number;
  riskCategory?: string;
  selectedByCustomer?: boolean;
  addons?: QuoteAddon[];
  createdAt?: string;
  validUntil?: string;
  currency?: string;
  referenceNumber?: string;
}

export interface QuoteRequest {
  id?: number | string;
  quoteRequestId?: number | string;
  propertyId?: number | string;
  requestedBy?: string;
  customerId?: number | string;
  assetId?: number | string;
  status?: number | string;
  createdAt?: string;
  requestedAt?: string;
  requestedDate?: string;
  requestedCoverage?: number | string;
  requestedPremium?: number | string;
  requestedPeriodYears?: number | string;
  remarks?: string;
  assetName?: string;
  propertyName?: string;
  customerName?: string;
  quotes?: Quote[];
  propertyValue?: number;
  riskAssessment?: GeneratedQuoteResponseDto | null;
}

export interface QuoteCreateRequest {
  customerId?: number | string;
  assetId?: number | string;
  quoteRequestId?: number | string;
  premium?: number;
  coverAmount?: number;
  status?: number;
}

export interface CreateQuoteRequestDto {
  propertyId?: number | string;
  requestedCoverage: number;
  requestedPremium: number;
  requestedPeriodYears: number;
  remarks?: string;
}

export interface RiskAssessmentRequestDto {
  propertyValue: number;
  constructionType: number | string;
  buildingAge: number;
  floors: number;
  usage?: string;
  historicalEarthquakes?: number;
  maxMagnitude?: number;
  distanceFromFaultKm?: number;
  seismicZone?: string;
  previousClaims?: number;
  contentsCoverage?: boolean;
  temporaryAccommodation?: boolean;
  vehicleCoverage?: boolean;
}

export interface GeneratedQuoteResponseDto {
  hazardScore?: number;
  vulnerabilityScore?: number;
  exposureScore?: number;
  actuarialRiskIndex?: number;
  riskCategory?: string;
  coveragePercentage?: number;
  sumInsured?: number;
  premiumRate?: number;
  annualPremium?: number;
  deductiblePercentage?: number;
}

export interface QuoteGenerationRequestDto {
  coverageType?: string;
  coveragePercentage?: number;
  sumInsured?: number;
  annualPremium?: number;
  coveragePeriodYears?: number;
  renewalPeriodMonths?: number;
  deductiblePercentage?: number;
  addons?: string[];
}

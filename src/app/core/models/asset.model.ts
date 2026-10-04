import { AssetType, ConstructionType, OccupancyType } from '../enums/insurance.enums';

export interface PropertyDetail {
  propertyType?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  constructionType?: ConstructionType | number | string;
  occupancyType?: OccupancyType | number | string;
  yearBuilt?: number;
  squareFootage?: number;
  buildingArea?: number;
  numberOfFloors?: number;
  insuredValue?: number;
}

export interface VehicleDetail {
  make?: string;
  model?: string;
  year?: number;
  manufactureYear?: number;
  vehicleType?: string;
  registrationNumber?: string;
  engineNumber?: string;
  chassisNumber?: string;
  vin?: string;
  engineCapacity?: number;
  vehicleValue?: number;
  insuredDeclaredValue?: number;
  seatingCapacity?: number;
  mileage?: number;
  financed?: boolean;
  financierName?: string;
}

export interface Asset {
  assetId?: number | string;
  customerId?: number | string;
  assetType?: AssetType | number | string;
  name?: string;
  assetName?: string;
  marketValue?: number;
  replacementValue?: number;
  status?: string | number;
  createdAt?: string;
  updatedAt?: string;
  propertyDetails?: PropertyDetail;
  propertyDetail?: PropertyDetail;
  vehicleDetails?: VehicleDetail;
  vehicleDetail?: VehicleDetail;
  customer?: { id?: number | string; userId?: number | string; userName?: string; name?: string } | null;
}

export interface CreateAssetRequest {
  customerId: number | string;
  assetType: AssetType | number | string;
  assetName?: string;
  name?: string;
  marketValue?: number;
  replacementValue?: number;
  propertyDetails?: PropertyDetail;
  propertyDetail?: PropertyDetail;
  vehicleDetails?: VehicleDetail;
  vehicleDetail?: VehicleDetail;
}

export interface AssetStatusUpdateRequest {
  status: string;
}

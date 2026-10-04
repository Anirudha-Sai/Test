import { ProductType } from '../enums/insurance.enums';

export interface Product {
  id?: number | string;
  name: string;
  description?: string;
  type?: ProductType;
  status?: string;
  premium?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  type?: ProductType;
  premium?: number;
}

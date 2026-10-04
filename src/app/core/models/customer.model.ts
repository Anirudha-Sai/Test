import { User } from './user.model';

export interface Customer {
  customerId?: number | string;
  userId?: number | string;
  customerCode?: string;
  preferredContactMethod?: string;
  status?: string;
  active?: boolean;
  customerSince?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: Partial<User> | null;
  userName?: string;
  numberOfPolicies?: number;
  numberOfProperties?: number;
  policyCount?: number;
  propertyCount?: number;
}

export interface CustomerStatusUpdateRequest {
  status: string;
}

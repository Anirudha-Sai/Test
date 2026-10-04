import { Role } from '../enums/insurance.enums';

export interface User {
  userId?: number | string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: [roleId: number | string, name: string];
  status?: string;
  accountStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: Role;
}

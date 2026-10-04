import { Role } from '../enums/insurance.enums';

export interface AuthUser {
  id: number | string;
  email: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: number | string;
  email: string;
  fullName: string;
  role: Role | string;
}

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}

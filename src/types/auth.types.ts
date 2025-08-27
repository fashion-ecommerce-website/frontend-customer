/**
 * Auth API types and interfaces
 * Updated to match Spring Boot Security backend
 */

// User roles matching Spring Boot backend
export type UserRole = 'ADMIN' | 'USER';

// Base user interface
export interface BaseUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// JWT Token response
export interface AuthResponse {
  token: string;
  type: string; // Usually "Bearer"
}

// User response with additional fields
export interface UserResponse extends BaseUser {
  phone?: string;
  avatar?: string;
}

// Admin user management
export interface UserManagementRequest {
  userId: string;
}

// Public API responses
export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface AppInfoResponse {
  name: string;
  version: string;
  description: string;
}

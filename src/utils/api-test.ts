/**
 * API Test Utilities
 * Utilities to test Spring Boot backend endpoints
 */

import { authApiService } from '../services/api/authApi';

// Test data matching Spring Boot backend
export const TEST_DATA = {
  // Test credentials for existing users
  ADMIN_LOGIN: {
    username: 'admin',
    password: 'admin123'
  },
  USER_LOGIN: {
    username: 'user',
    password: 'user123'
  },
  
  // New user registration
  NEW_USER_REGISTER: {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  }
};

/**
 * Test API functions
 */
export class ApiTester {
  
  /**
   * Test public endpoints
   */
  static async testPublicEndpoints() {
    console.log('=== Testing Public Endpoints ===');
    
    try {
      const healthResponse = await authApiService.getHealth();
      console.log('Health check:', healthResponse);
    } catch (error) {
      console.error('Health check failed:', error);
    }
    
    try {
      const infoResponse = await authApiService.getInfo();
      console.log('App info:', infoResponse);
    } catch (error) {
      console.error('App info failed:', error);
    }
  }
  
  /**
   * Test authentication flow
   */
  static async testAuthFlow() {
    console.log('=== Testing Authentication Flow ===');
    
    // Test login
    try {
      const loginResponse = await authApiService.login(TEST_DATA.ADMIN_LOGIN);
      console.log('Login response:', loginResponse);
      
      if (loginResponse.success && loginResponse.data) {
        // Store token
        const { accessToken } = loginResponse.data;
        localStorage.setItem('token', accessToken);
        console.log('Token stored:', accessToken);
        
        // Test protected endpoint
        try {
          const userResponse = await authApiService.getCurrentUser();
          console.log('Current user:', userResponse);
        } catch (error) {
          console.error('Get current user failed:', error);
        }
        
        // Test admin endpoint
        try {
          const adminResponse = await authApiService.getAdminData();
          console.log('Admin data:', adminResponse);
        } catch (error) {
          console.error('Admin endpoint failed:', error);
        }
        
        // Test user management (admin only)
        try {
          const usersResponse = await authApiService.getAllUsers();
          console.log('All users:', usersResponse);
        } catch (error) {
          console.error('Get all users failed:', error);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
  
  /**
   * Test user registration
   */
  static async testRegistration() {
    console.log('=== Testing User Registration ===');
    
    try {
      const registerResponse = await authApiService.register(TEST_DATA.NEW_USER_REGISTER);
      console.log('Registration response:', registerResponse);
      
      if (registerResponse.success && registerResponse.data) {
        const { accessToken } = registerResponse.data;
        localStorage.setItem('token', accessToken);
        console.log('New user token stored:', accessToken);
        
        // Test with new user token
        try {
          const userResponse = await authApiService.getCurrentUser();
          console.log('New user info:', userResponse);
        } catch (error) {
          console.error('Get new user info failed:', error);
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }
  
  /**
   * Test user role access
   */
  static async testUserRoleAccess() {
    console.log('=== Testing User Role Access ===');
    
    // Login as regular user
    try {
      const loginResponse = await authApiService.login(TEST_DATA.USER_LOGIN);
      console.log('User login response:', loginResponse);
      
      if (loginResponse.success && loginResponse.data) {
        const { accessToken } = loginResponse.data;
        localStorage.setItem('token', accessToken);
        
        // Test user endpoint
        try {
          const userResponse = await authApiService.getUserData();
          console.log('User endpoint response:', userResponse);
        } catch (error) {
          console.error('User endpoint failed:', error);
        }
        
        // Test admin endpoint (should fail)
        try {
          const adminResponse = await authApiService.getAdminData();
          console.log('Admin endpoint response (should fail):', adminResponse);
        } catch (error) {
          console.error('Admin endpoint failed (expected):', error);
        }
      }
    } catch (error) {
      console.error('User login failed:', error);
    }
  }
  
  /**
   * Run all tests
   */
  static async runAllTests() {
    await this.testPublicEndpoints();
    await this.testAuthFlow();
    await this.testRegistration();
    await this.testUserRoleAccess();
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).apiTester = ApiTester;
  (window as unknown as Record<string, unknown>).testData = TEST_DATA;
}

'use client';

import React, { useState } from 'react';
import { authApiService } from '../services/api/authApi';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ApiActivityLog from './ApiActivityLog';

interface ApiResult {
  endpoint: string;
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp: Date;
}

export default function AuthenticationPage() {
  const [apiResults, setApiResults] = useState<ApiResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });

  const addApiResult = (result: ApiResult) => {
    setApiResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setApiResults([]);
  };

  const callApi = async (
    endpointName: string,
    apiCall: () => Promise<{ success: boolean; data?: unknown; message?: string }>
  ) => {
    try {
      const response = await apiCall();
      addApiResult({
        endpoint: endpointName,
        success: response.success,
        data: response.data,
        error: response.success ? undefined : response.message,
        timestamp: new Date()
      });
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addApiResult({
        endpoint: endpointName,
        success: false,
        error: errorMessage,
        timestamp: new Date()
      });
      throw error;
    }
  };

  const handleCheckPublicEndpoints = async () => {
    setIsLoading(true);
    try {
      await callApi('Public Health', () => authApiService.getHealth());
      await callApi('Public Info', () => authApiService.getInfo());
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      addApiResult({
        endpoint: 'Login',
        success: false,
        error: 'Please enter email and password',
        timestamp: new Date()
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await callApi('Login', () => 
        authApiService.login(loginForm)
      );
      
      if (response.success && response.data && typeof response.data === 'object' && 'accessToken' in response.data) {
        const data = response.data as { accessToken: string; refreshToken: string };
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Get user profile after successful login
        await callApi('Get Current User', () => authApiService.getCurrentUser());
        await callApi('Get User Data', () => authApiService.getUserData());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.phone) {
      addApiResult({
        endpoint: 'Register',
        success: false,
        error: 'Please fill all registration fields',
        timestamp: new Date()
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await callApi('Register New User', () => 
        authApiService.register(registerForm)
      );
      
      if (response.success && response.data && typeof response.data === 'object' && 'accessToken' in response.data) {
        const data = response.data as { accessToken: string; refreshToken: string };
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        await callApi('Get New User Info', () => authApiService.getCurrentUser());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        addApiResult({
          endpoint: 'Refresh Token',
          success: false,
          error: 'No refresh token found in localStorage',
          timestamp: new Date()
        });
        return;
      }

      const response = await callApi('Refresh Token', () => 
        authApiService.refreshToken({ refreshToken })
      );
      
      if (response.success && response.data && typeof response.data === 'object' && 'accessToken' in response.data) {
        const data = response.data as { accessToken: string; refreshToken: string };
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    addApiResult({
      endpoint: 'Logout',
      success: true,
      data: 'Tokens removed from localStorage',
      timestamp: new Date()
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Authentication & API</h1>
      
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Public Endpoints</h2>
          <button
            onClick={handleCheckPublicEndpoints}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Check Public APIs
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Authentication</h2>
          
          <LoginForm
            email={loginForm.email}
            password={loginForm.password}
            onEmailChange={(email) => setLoginForm({...loginForm, email})}
            onPasswordChange={(password) => setLoginForm({...loginForm, password})}
            onSubmit={handleLogin}
            isLoading={isLoading}
          />

          <RegisterForm
            username={registerForm.username}
            email={registerForm.email}
            password={registerForm.password}
            phone={registerForm.phone}
            onUsernameChange={(username) => setRegisterForm({...registerForm, username})}
            onEmailChange={(email) => setRegisterForm({...registerForm, email})}
            onPasswordChange={(password) => setRegisterForm({...registerForm, password})}
            onPhoneChange={(phone) => setRegisterForm({...registerForm, phone})}
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Actions</h2>
          <button
            onClick={handleRefreshToken}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Token'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <ApiActivityLog 
        results={apiResults}
        onClear={clearResults}
        apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}
      />
    </div>
  );
}

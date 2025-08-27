'use client';

import React, { useState } from 'react';
import { authApiService } from '../services/api/authApi';

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

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Authentication</h2>
          
          {/* Login Form */}
          <div className="space-y-2 p-3 border rounded">
            <h3 className="font-medium">Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              className="w-full px-2 py-1 border rounded text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-2 py-1 border rounded text-black"
            />
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Login
            </button>
          </div>

          {/* Register Form */}
          <div className="space-y-2 p-3 border rounded">
            <h3 className="font-medium">Register</h3>
            <input
              type="text"
              placeholder="Username"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
              className="w-full px-2 py-1 border rounded text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              className="w-full px-2 py-1 border rounded text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              className="w-full px-2 py-1 border rounded text-black"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
              className="w-full px-2 py-1 border rounded text-black"
            />
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Register
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Token Management</h2>
          <button
            onClick={handleRefreshToken}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            Refresh Token
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Actions</h2>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={clearResults}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Log
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">API Activity Log</h2>
        <div className="text-sm text-gray-600 mb-2">
          API Server: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {apiResults.map((result: ApiResult, index: number) => (
          <div
            key={index}
            className={`p-3 rounded border ${
              result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium">{result.endpoint}</span>
              <span className="text-xs text-gray-500">
                {result.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              Status: {result.success ? 'Success' : 'Failed'}
            </div>
            {result.error && (
              <div className="text-sm text-red-600 mt-1">
                Error: {result.error}
              </div>
            )}
            {result.data !== undefined && result.data !== null && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600">View Response</summary>
                <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {apiResults.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No activity yet. Try the actions above.
        </div>
      )}
    </div>
  );
}

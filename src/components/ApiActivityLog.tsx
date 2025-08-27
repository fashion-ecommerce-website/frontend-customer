'use client';

import React from 'react';

interface ApiResult {
  endpoint: string;
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp: Date;
}

interface ApiActivityLogProps {
  results: ApiResult[];
  onClear: () => void;
  apiUrl: string;
}

export default function ApiActivityLog({ results, onClear, apiUrl }: ApiActivityLogProps) {
  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">API Activity Log</h2>
          <button
            onClick={onClear}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
          >
            Clear Log
          </button>
        </div>
        <div className="text-sm text-gray-600">
          API Server: <code className="bg-gray-100 px-1 py-0.5 rounded">{apiUrl}</code>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto border rounded bg-gray-50 p-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-800">{result.endpoint}</span>
              <span className="text-xs text-gray-500">
                {result.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className={`text-sm mt-1 ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              Status: {result.success ? 'Success' : 'Failed'}
            </div>
            {result.error && (
              <div className="text-sm text-red-600 mt-1">
                Error: {result.error}
              </div>
            )}
            {result.data !== undefined && result.data !== null && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  View Response Data
                </summary>
                <pre className="text-xs bg-white p-2 mt-1 rounded overflow-x-auto border">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No activity yet. Try the actions above.
          </div>
        )}
      </div>
    </div>
  );
}

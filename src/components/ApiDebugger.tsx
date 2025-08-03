import React, { useState } from "react";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/apiEndpoints";

const ApiDebugger: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint: string, method: "GET" | "POST" = "GET") => {
    setLoading(true);
    const startTime = Date.now();

    try {
      console.log(`Testing ${method} ${endpoint}...`);
      const response = await api[method.toLowerCase() as "get"](endpoint);
      const endTime = Date.now();

      const result = {
        endpoint,
        method,
        status: response.status,
        success: true,
        data: response.data,
        time: endTime - startTime,
        timestamp: new Date().toISOString(),
      };

      setResults((prev) => [result, ...prev]);
      console.log("✅ Success:", result);
    } catch (error: any) {
      const endTime = Date.now();

      const result = {
        endpoint,
        method,
        status: error.response?.status || "N/A",
        success: false,
        error: error.message,
        details: error.response?.data || error,
        time: endTime - startTime,
        timestamp: new Date().toISOString(),
      };

      setResults((prev) => [result, ...prev]);
      console.error("❌ Error:", result);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Connection Debugger</h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Environment Info:</h3>
        <p>
          <strong>Mode:</strong> {import.meta.env.MODE}
        </p>
        <p>
          <strong>API Base URL:</strong>{" "}
          {import.meta.env.VITE_API_URL || "Using default"}
        </p>
        <p>
          <strong>Current URL:</strong> {window.location.href}
        </p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => testApi(API_ENDPOINTS.GET_PRODUCTS)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Products API
        </button>

        <button
          onClick={() => testApi(API_ENDPOINTS.HEALTH_CHECK)}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Health Check
        </button>

        <button
          onClick={() => testApi("/api/cors-test")}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test CORS
        </button>

        <button
          onClick={clearResults}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Clear Results
        </button>
      </div>

      {loading && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          Testing API connection...
        </div>
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">
                {result.method} {result.endpoint}
              </h4>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  result.success
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {result.success ? "SUCCESS" : "FAILED"}
              </span>
            </div>

            <div className="text-sm space-y-1">
              <p>
                <strong>Status:</strong> {result.status}
              </p>
              <p>
                <strong>Time:</strong> {result.time}ms
              </p>
              <p>
                <strong>Timestamp:</strong> {result.timestamp}
              </p>

              {result.success ? (
                <div>
                  <p>
                    <strong>Data:</strong>
                  </p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>Error:</strong> {result.error}
                  </p>
                  {result.details && (
                    <div>
                      <p>
                        <strong>Details:</strong>
                      </p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDebugger;

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";

const AuthTest = () => {
  const { user, token, login, register, logout } = useAuth();
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    setTestResult("Testing authentication...");

    try {
      // Test 1: Check if server is reachable
      const serverTest = await fetch(`${import.meta.env.VITE_URL}/api`);
      if (!serverTest.ok) {
        throw new Error("Server is not reachable");
      }
      setTestResult("✅ Server is reachable\n");

      // Test 2: Try to initialize admin
      const adminResult = await authAPI.initAdmin();
      if (adminResult.success) {
        setTestResult(prev => prev + "✅ Admin initialized successfully\n");
      } else {
        setTestResult(prev => prev + "ℹ️ Admin already exists or failed to initialize\n");
      }

      // Test 3: Try to register a test user
      const testUser = {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "testpassword123",
        phone: "+1234567890",
        location: "Test City, Test Country",
        organization: "Test Organization"
      };

      const registerResult = await authAPI.register(testUser);
      if (registerResult.success) {
        setTestResult(prev => prev + "✅ Test user registered successfully\n");
        
        // Test 4: Try to login with the test user
        const loginResult = await authAPI.login({
          email: testUser.email,
          password: testUser.password
        });
        
        if (loginResult.success) {
          setTestResult(prev => prev + "✅ Test user login successful\n");
          
          // Test 5: Try to get profile with the token
          const profileResult = await authAPI.getProfile(loginResult.data.token);
          if (profileResult.success) {
            setTestResult(prev => prev + "✅ Profile fetch successful\n");
          } else {
            setTestResult(prev => prev + "❌ Profile fetch failed\n");
          }
        } else {
          setTestResult(prev => prev + "❌ Test user login failed\n");
        }
      } else {
        setTestResult(prev => prev + "❌ Test user registration failed\n");
      }

    } catch (error) {
      setTestResult(`❌ Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Authentication Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Current User: {user ? user.name : "Not logged in"}</p>
        <p className="text-sm text-gray-600 mb-2">Token: {token ? "Present" : "Not present"}</p>
      </div>

      <button
        onClick={testAuth}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Testing..." : "Run Auth Tests"}
      </button>

      {testResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthTest;

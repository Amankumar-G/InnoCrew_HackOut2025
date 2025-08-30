import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));

      // TODO: Verify token with backend
      // const verifyToken = async () => {
      //   try {
      //     const response = await fetch('/api/auth/verify', {
      //       headers: { Authorization: `Bearer ${savedToken}` }
      //     });
      //     if (!response.ok) {
      //       logout();
      //     }
      //   } catch (error) {
      //     logout();
      //   }
      // };
      // verifyToken();
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);

      // Dummy authentication for now
      if (email === "demo@example.com" && password === "password") {
        const dummyUser = {
          id: "1",
          name: "Demo User",
          email: "demo@example.com",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          role: "user",
        };
        const dummyToken = "dummy-jwt-token-" + Date.now();

        setUser(dummyUser);
        setToken(dummyToken);
        localStorage.setItem("authToken", dummyToken);
        localStorage.setItem("user", JSON.stringify(dummyUser));

        return { success: true, user: dummyUser };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password })
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);

      // Dummy signup for now
      const dummyUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "user",
      };
      const dummyToken = "dummy-jwt-token-" + Date.now();

      setUser(dummyUser);
      setToken(dummyToken);
      localStorage.setItem("authToken", dummyToken);
      localStorage.setItem("user", JSON.stringify(dummyUser));

      return { success: true, user: dummyUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // TODO: Call logout endpoint
    // fetch('/api/auth/logout', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${token}` }
    // });
  };

  const updateProfile = async (userData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(userData)
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);

      // Dummy update for now
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

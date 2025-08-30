import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

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

      // Verify token with backend
      const verifyToken = async () => {
        try {
          const result = await authAPI.getProfile(savedToken);
          if (!result.success) {
            logout();
          } else {
            setUser(result.data);
            localStorage.setItem("user", JSON.stringify(result.data));
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      };
      verifyToken();
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password, phone, location, organization) => {
    setLoading(true);

    try {
      const result = await authAPI.register({
        name,
        email,
        password,
        phone,
        location,
        organization,
      });

      if (result.success) {
        setUser(result.data.user);
        setToken(result.data.token);
        localStorage.setItem("authToken", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        return { success: true, user: result.data.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);

    try {
      const result = await authAPI.login({ email, password });

      if (result.success) {
        setUser(result.data.user);
        setToken(result.data.token);
        
        console.log(result.data)
        localStorage.setItem("authToken", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        return { success: true, user: result.data.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Login error:", error);
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
  };

  const updateProfile = async (userData) => {
    try {
      const result = await authAPI.updateProfile(userData, token);

      if (result.success) {
        const updatedUser = { ...user, ...result.data };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: error.message };
    }
  };

  const getProfile = async () => {
    try {
      const result = await authAPI.getProfile(token);

      if (result.success) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
        
        return { success: true, user: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    getProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

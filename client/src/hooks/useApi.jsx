import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://xmttymakxz.us-west-2.awsapprunner.com",
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const ApiContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
      
      return { success: false, error: "No token received" };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const getDailyStats = async (date) => {
    try {
      const { data } = await api.get(`/api/foodentry/stats/daily?date=${date}`);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to fetch stats" 
      };
    }
  };

  const saveFoodEntries = async (entries) => {
    try {
      const { data } = await api.post("/api/foodentry", entries);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to save entries" 
      };
    }
  };

  const analyzeImage = async (imageFile) => {
    if (!imageFile) {
      return { success: false, error: "No image file provided" };
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const { data } = await api.post("/api/ml/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Image analysis failed" 
      };
    }
  };

  const getHealthAnalysis = async (days = 7) => {
    try {
      const { data } = await api.get(
        `/api/foodentry/analysis/health-suggestions?days=${days}`
      );

      if (data.success === false) {
        return { success: false, error: data.message || "Analysis failed" };
      }

      return { success: true, data: data.data || data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to fetch analysis" 
      };
    }
  };

  const getRecentFoods = async (days = 7) => {
    try {
      const { data } = await api.get(`/api/foodentry/recent?days=${days}`);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to fetch recent foods" 
      };
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    getDailyStats,
    saveFoodEntries,
    analyzeImage,
    getHealthAnalysis,
    getRecentFoods,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
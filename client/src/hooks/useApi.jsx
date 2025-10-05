import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/",
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

const handleApiError = (error, defaultMessage) => ({
  success: false,
  error:
    error.response?.data?.error ||
    error.response?.data?.message ||
    defaultMessage,
});

const handleApiSuccess = (data) => ({ success: true, data });

const ApiContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchCurrentUser();
    else setLoading(false);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", { email, password });
      const { token, user, message } = response.data;

      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user, message };
    } catch (error) {
      return handleApiError(error, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/register", {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        setUser(user);
        setIsAuthenticated(true);
      }

      return { success: true, user, message: response.data.message };
    } catch (error) {
      return handleApiError(error, "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const getDailyStats = async (date) => {
    try {
      const response = await api.get(`/api/foodentry/stats/daily?date=${date}`);
      return handleApiSuccess(response.data);
    } catch (error) {
      return handleApiError(error, "Failed to fetch daily stats");
    }
  };

  const saveFoodEntries = async (entries) => {
    try {
      const response = await api.post("/api/foodentry", entries);
      return handleApiSuccess(response.data);
    } catch (error) {
      return handleApiError(error, "Failed to save entries");
    }
  };

  const analyzeImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await api.post("/api/ml/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return handleApiSuccess(response.data);
    } catch (error) {
      return handleApiError(error, "Image analysis failed");
    }
  };

  const getHealthAnalysis = async (days = 7) => {
    try {
      const response = await api.get(
        `/api/foodentry/analysis/health-suggestions?days=${days}`
      );

      if (response.data.success === false) {
        return {
          success: false,
          error:
            response.data.message || response.data.error || "Analysis failed",
        };
      }

      return handleApiSuccess(response.data.data || response.data);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        return handleApiError(
          error,
          "Request timeout - analysis took too long"
        );
      }
      return handleApiError(error, "Failed to fetch health analysis");
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

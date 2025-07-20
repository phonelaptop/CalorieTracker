import { createContext, useContext, useState, useEffect } from 'react';
import { LoginPage } from "../components/LoginPage";
import { Box } from "@mui/material";
import { Dashboard } from "../components/Dashboard";
import { FormPage } from "../components/FormPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UploadFilePage } from "../components/UploadFilePage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main App Component
export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

// App Content Component
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <Box className="App">
      {isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/upload" element={<UploadFilePage />} />
          <Route path="*" element={<Dashboard />} /> {/* Fallback to dashboard */}
        </Routes>
      ) : (
        <LoginPage />
      )}
    </Box>
  );
};
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginPage } from "./LoginPage";
import { Dashboard } from "./Dashboard";
import { FormPage } from "./FormPage";
import { UploadFilePage } from "./UploadFilePage";
import { LoadingScreen } from "./LoadingScreen";
import { AnalyticsPage } from "./AnalyticsPage";

export const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/upload" element={<UploadFilePage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};

import { Routes, Route } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { LoginPage } from "../login/LoginPage";
import { Dashboard } from "../dashboard/Dashboard";
import { UploadFilePage } from "../upload/UploadFilePage";
import { LoadingScreen } from "../upload/LoadingScreen";
import { AnalyticsPage } from "../analytics/AnalyticsPage";
import { HealthSuggestions } from "../health/HealthSuggestions";

export const AppContent = () => {
  const { isAuthenticated, loading } = useApi();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<UploadFilePage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/health-suggestions" element={<HealthSuggestions />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};
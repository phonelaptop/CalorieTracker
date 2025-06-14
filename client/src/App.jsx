import { BrowserRouter as Router } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider } from "./hooks/useAuth";
import { AppContent } from "./components/AppContent";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Box className="App">
          <AppContent />
        </Box>
      </Router>
    </AuthProvider>
  );
};

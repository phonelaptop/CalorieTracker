import { BrowserRouter as Router } from "react-router-dom";
import { Box } from "@mui/material";
import { AppProvider } from "./hooks/useApi";
import { AppContent } from "./components/index/AppContent";
import { Navbar } from "./components/layout/Navbar"
import { Footer } from "./components/layout/Footer"

export const App = () => {
  return (
    <AppProvider>
      <Router>
        <Box className="App">
          <Navbar />
          <AppContent />
          <Footer />
        </Box>
      </Router>
    </AppProvider>
  );
};

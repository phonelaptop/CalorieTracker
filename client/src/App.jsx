import { LoginPage } from "./components/LoginPage";
import { Box } from "@mui/material";
import { Dashboard } from "./components/Dashboard";
import { FormPage } from "./components/FormPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const App = () => {
  return (
    <Router>
      <Box className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/form" element={<FormPage/> } />
        </Routes>
      </Box>
    </Router>
  );
};
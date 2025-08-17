import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

export const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (null);
  }

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#fff", boxShadow: "none" }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0, justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#000", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            CalorieTracker
          </Typography>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button onClick={() => navigate("/upload")} sx={{ color: "#000" }}>
              Start
            </Button>
            <Button onClick={logout} sx={{ color: "#000" }}>
              Sign Out
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

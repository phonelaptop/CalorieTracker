import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography, Button, Container } from "@mui/material";
import { useApi } from "../../hooks/useApi";
import SnacTrackLogo from "../../img/SnacTrackLogo.png";


export const Navbar = () => {
  const { logout } = useApi();
  const navigate = useNavigate();
  const { isAuthenticated } = useApi();
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
            SnacTrack
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

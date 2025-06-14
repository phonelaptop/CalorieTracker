import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import food from "../img/food.jpg";

export const Dashboard = () => {
  const { logout } = useAuth();
  const menuItems = ["Start", "Track"];

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
      }}>
        <Toolbar>
          {/* Left Side - Logo & Menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{
              fontFamily: "Montserrat",
              color: "#000000",
              fontWeight: "600",
              fontSize: "20px",
              mr: 4
            }}>
              CalorieTracker
            </Typography>
            
            <Box sx={{ 
              display: { xs: "none", md: "flex" },
              gap: 2
            }}>
              {menuItems.map((item) => (
                <Button key={item} sx={{
                  fontFamily: "Montserrat",
                  color: "#000000",
                }}>
                  {item}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right Side - User Info & Logout */}
          <Box sx={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 2
          }}>
            <Typography sx={{
              fontFamily: "Montserrat",
              color: "#000000",
              fontSize: "14px",
            }}>
              Hi, name
            </Typography>
            <Button 
              onClick={logout}
              sx={{
                fontFamily: "Montserrat",
                color: "#000000",
              }}
            >
              SIGN OUT
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{
        backgroundImage: `url(${food})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "750px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center"
        }}>
          <Typography variant="h1" sx={{
            fontFamily: "Montserrat",
            color: "#FFFFFF",
            fontSize: "64px",
            fontWeight: "700",
            WebkitTextStroke: "0.5px black",
            textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black",
            mb: 2
          }}>
            CalorieTracker
          </Typography>
          
          <Typography variant="h2" sx={{
            fontFamily: "Montserrat",
            color: "#FFFFFF",
            fontSize: "32px",
            fontWeight: "600",
            WebkitTextStroke: "0.5px black",
            textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black",
          }}>
            Receive fast data of your calorie intake
          </Typography>
        </Box>
      </Box>
    </>
  );
};
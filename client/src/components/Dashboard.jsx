import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import food from "../img/food.jpg";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate()

  return (
    <>
      <AppBar position="static" sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
      }}>
        <Toolbar>
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
              <Button sx={{
                fontFamily: "Montserrat",
                color: "#000000",
              }}
              onClick={() => {
                navigate('/upload')
              }}>
                Start
              </Button>
            </Box>
          </Box>

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
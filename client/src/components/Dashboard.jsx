import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import food from "../img/food.jpg";

export const Dashboard = () => {
  const menuItems = ["Start", "Track"];

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "unset",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
            }}
          >
            <Button
              variant="Button"
              sx={{
                flexGrow: 1,
                fontFamily: "Montserrat",
                color: "#000000",
                fontWeight: "600",
                margin: "20px",
                fontSize: "20px",
              }}
            >
              CalorieTracker
            </Button>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                display: "flex",
              }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item}
                  color="inherit"
                  sx={{
                    fontFamily: "Montserrat",
                    color: "#000000",
                    gap: "10px",
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Montserrat",
                color: "#000000",
                fontSize: "14px",
              }}
            >
              Hi, name
            </Typography>
            <Button
              variant="button"
              sx={{
                flexGrow: 1,
                fontFamily: "Montserrat",
                color: "#000000",
              }}
            >
              SIGN OUT
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          backgroundImage: `url(${food})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "750px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Montserrat",
              color: "#FFFFFF",
              fontSize: "64px",
              WebkitTextStroke: "0.5px black",
              textShadow:
                "-0.5px -0.5px 0 black, 0.5px -0.5px 0 black, -0.5px 0.5px 0 black, 0.5px 0.5px 0 black",
              fontWeight: "700",
              display: "flex",
              justifyContent: "center"
            }}
          >
            CalorieTracker
          </Typography>
          <Typography
            variant="p"
            sx={{
              fontFamily: "Montserrat",
              color: "#FFFFFF",
              fontSize: "32px",
              WebkitTextStroke: "0.5px black",
              textShadow:
                "-0.5px -0.5px 0 black, 0.5px -0.5px 0 black, -0.5px 0.5px 0 black, 0.5px 0.5px 0 black",
              fontWeight: "750",
              display: "flex",  
              justifyContent: "center"
            }}
          >
            Receive fast data of your calorie intake
          </Typography>
        </Box>
      </Box>
    </>
  );
};

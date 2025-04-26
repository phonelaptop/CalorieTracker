import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

export const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful! You can now sign in.");
          setIsSignup(false); // Switch to login mode after signup
        } else {
          alert(data.error || "Registration failed.");
        }
      } else {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          console.log("Logged in user:", data.user);
        } else {
          alert(data.error || "Login failed.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "1 1 70%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "80%", maxWidth: "500px" }}>
            <Typography
              component="h1"
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: "Montserrat",
                fontSize: "39px",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              {isSignup ? "Sign Up to your Account" : "Login to your Account"}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                mt: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                }}
              >
                {isSignup
                  ? [
                      <TextField
                        margin="normal"
                        fullWidth
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        sx={{
                          "& .MuiInputBase-input": {
                            fontFamily: "Montserrat",
                          },
                        }}
                      />,
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        sx={{
                          "& .MuiInputBase-input": {
                            fontFamily: "Montserrat",
                          },
                        }}
                      />,
                    ]
                  : null}
              </Box>
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Montserrat",
                  },
                }}
              />

              <TextField
                margin="normal"
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Montserrat",
                  },
                }}
              />
              {isSignup && (
                <TextField
                  margin="normal"
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiInputBase-input": {
                      fontFamily: "Montserrat",
                    },
                  }}
                />
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{
                  mt: 3,
                  borderRadius: 5,
                  fontFamily: "Montserrat",
                  background: "linear-gradient(to right, #3AA8AE, #38B98C)",
                }}
              >
                {isSignup ? "Sign Up" : "Sign In"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Right side - Toggle section */}
      <Box
        sx={{
          flex: { xs: "0", md: "1 1 30%" },
          display: { xs: "none", md: "flex" },
          background: "linear-gradient(to right, #3AA8AE, #38B98C)",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexDirection: "column",
          fontFamily: "Montserrat",
          p: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "Montserrat",
          }}
        >
          {isSignup ? "Already have an account?" : "New Here?"}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: "2",
            fontFamily: "Montserrat",
            fontSize: "20px",
          }}
        >
          {isSignup ? "Sign in and continue" : "Sign up and discover"}
        </Typography>
        <Button
          variant="outlined"
          onClick={toggleMode}
          sx={{
            bgcolor: "white",
            color: "#00bfa5",
            fontWeight: "bold",
            borderRadius: 5,
            fontFamily: "Montserrat",
          }}
        >
          {isSignup ? "Sign In" : "Sign Up"}
        </Button>
      </Box>
    </Box>
  );
};

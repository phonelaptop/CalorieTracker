import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

export const LoginPage = () => {
  const { login } = useAuth();
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
      const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
      const payload = isSignup
        ? {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isSignup) {
          alert("Registration successful! You can now sign in.");
          setIsSignup(false);
        } else {
          login(data.token);
        }
      } else {
        alert(data.error || `${isSignup ? "Registration" : "Login"} failed.`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  const toggleMode = () => setIsSignup((prev) => !prev);

  // Development test login
  const handleTestLogin = () => login("test-token-123");

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
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: "Montserrat",
                textAlign: "center",
                fontWeight: "700",
                mb: 4,
              }}
            >
              {isSignup ? "Sign Up to your Account" : "Login to your Account"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {isSignup && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiInputBase-input": { fontFamily: "Montserrat" },
                    }}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiInputBase-input": { fontFamily: "Montserrat" },
                    }}
                  />
                </Box>
              )}

              {/* Email & Password */}
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ "& .MuiInputBase-input": { fontFamily: "Montserrat" } }}
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
                sx={{ "& .MuiInputBase-input": { fontFamily: "Montserrat" } }}
              />

              {/* Confirm Password for Signup */}
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
                  sx={{ "& .MuiInputBase-input": { fontFamily: "Montserrat" } }}
                />
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: 5,
                  fontFamily: "Montserrat",
                  background: "linear-gradient(to right, #3AA8AE, #38B98C)",
                }}
              >
                {isSignup ? "Sign Up" : "Sign In"}
              </Button>

              {/* Test Login - Development Only
              {!isSignup && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleTestLogin}
                  sx={{
                    mt: 2,
                    borderRadius: 5,
                    fontFamily: "Montserrat",
                    borderColor: "#3AA8AE",
                    color: "#3AA8AE",
                  }}
                >
                  Test Login (Dev Only)
                </Button>
              )} */}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Right Panel - Toggle */}
      <Box
        sx={{
          flex: { xs: "0", md: "1 1 30%" },
          display: { xs: "none", md: "flex" },
          background: "linear-gradient(to right, #3AA8AE, #38B98C)",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexDirection: "column",
          p: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "Montserrat",
            mb: 2,
          }}
        >
          {isSignup ? "Already have an account?" : "New Here?"}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 3,
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

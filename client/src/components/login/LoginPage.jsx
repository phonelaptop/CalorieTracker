import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import { useApi } from "../../hooks/useApi";

export const LoginPage = () => {
  const { login, register } = useApi();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignup) {
        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }

        const result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          setSuccess(result.message || "Registration successful! You are now logged in.");
          // Clear form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          setError(result.error || "Registration failed");
        }
      } else {

        const result = await login(formData.email, formData.password);

        if (result.success) {
          // Login successful - the ApiContext will handle redirecting
          setSuccess("Login successful!");
        } else {
          setError(result.error || "Login failed");
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setError('');
    setSuccess('');
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
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

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

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
                    disabled={loading}
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
                    disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
                  sx={{ "& .MuiInputBase-input": { fontFamily: "Montserrat" } }}
                />
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  borderRadius: 5,
                  fontFamily: "Montserrat",
                  background: "linear-gradient(to right, #3AA8AE, #38B98C)",
                }}
              >
                {loading 
                  ? (isSignup ? "Signing Up..." : "Signing In...") 
                  : (isSignup ? "Sign Up" : "Sign In")
                }
              </Button>
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
          disabled={loading}
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
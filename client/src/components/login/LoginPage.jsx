import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import { useApi } from "../../hooks/useApi";

export const LoginPage = () => {
  const { login, register } = useApi();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Mobile Layout
  if (isMobile) {
    return (
      <Box 
        sx={{ 
          minHeight: "100vh",
          background: "linear-gradient(135deg, #2193b0 0%, #38ef7d 100%)", // aesthetic blue -> green gradient
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Blue/Green header area */}
        <Box
          sx={{
            height: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        />

        {/* Curved white form area */}
        <Box
          sx={{
            flex: 1,
            background: "white",
            borderTopLeftRadius: "30px",
            borderTopRightRadius: "30px",
            padding: "32px 28px 28px 28px",
            position: "relative"
          }}
        >
          {/* Form header */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "800",
              color: "#1a1a1a",
              fontSize: "28px",
              marginBottom: "32px",
              textAlign: "center"
            }}
          >
            {isSignup ? "Sign up" : "Sign in"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: "16px" }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ marginBottom: "16px" }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    marginBottom: "12px",
                    "& .MuiInputBase-input": { 
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      padding: "18px 16px"
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8f9fa",
                      "& fieldset": {
                        borderColor: "transparent"
                      },
                      "&:hover fieldset": {
                        borderColor: "#2193b0"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2193b0",
                        borderWidth: "2px"
                      }
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    marginBottom: "12px",
                    "& .MuiInputBase-input": { 
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      padding: "18px 16px"
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8f9fa",
                      "& fieldset": {
                        borderColor: "transparent"
                      },
                      "&:hover fieldset": {
                        borderColor: "#2193b0"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2193b0",
                        borderWidth: "2px"
                      }
                    }
                  }}
                />
              </>
            )}

            <TextField
              margin="normal"
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              variant="outlined"
              sx={{ 
                marginBottom: "12px",
                "& .MuiInputBase-input": { 
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  padding: "18px 16px"
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8f9fa",
                  "& fieldset": {
                    borderColor: "transparent"
                  },
                  "&:hover fieldset": {
                    borderColor: "#2193b0"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2193b0",
                    borderWidth: "2px"
                  }
                }
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              placeholder="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              variant="outlined"
              sx={{ 
                marginBottom: "12px",
                "& .MuiInputBase-input": { 
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  padding: "18px 16px"
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8f9fa",
                  "& fieldset": {
                    borderColor: "transparent"
                  },
                  "&:hover fieldset": {
                    borderColor: "#2193b0"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2193b0",
                    borderWidth: "2px"
                  }
                }
              }}
            />

            {isSignup && (
              <TextField
                margin="normal"
                fullWidth
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                variant="outlined"
                sx={{ 
                  marginBottom: "12px",
                  "& .MuiInputBase-input": { 
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    padding: "18px 16px"
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f8f9fa",
                    "& fieldset": {
                      borderColor: "transparent"
                    },
                    "&:hover fieldset": {
                      borderColor: "#2193b0"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2193b0",
                      borderWidth: "2px"
                    }
                  }
                }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                marginTop: "20px",
                borderRadius: "25px",
                fontFamily: "Montserrat",
                background: "linear-gradient(135deg, #2193b0 0%, #38ef7d 100%)",
                padding: "16px 0",
                fontSize: "16px",
                fontWeight: "600",
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(33, 147, 176, 0.3)",
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(33, 147, 176, 0.4)",
                  transform: "translateY(-1px)"
                }
              }}
            >
              {loading 
                ? (isSignup ? "Creating Account..." : "Signing In...") 
                : (isSignup ? "Create Account" : "Sign In")
              }
            </Button>

            {!isSignup && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "#2193b0",
                  fontFamily: "Montserrat",
                  marginTop: "16px",
                  marginBottom: "24px",
                  fontSize: "14px",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                Forgot your password?
              </Typography>
            )}

            {/* Social login buttons */}
            <Box
              sx={{
                display: "flex",
                gap: "16px",
                marginTop: "24px",
                marginBottom: "24px"
              }}
            >
              <Button
                variant="outlined"
                startIcon={
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      background: "linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    G
                  </Box>
                }
                sx={{
                  flex: 1,
                  borderRadius: "12px",
                  padding: "14px",
                  borderColor: "#e0e0e0",
                  color: "#666",
                  fontFamily: "Montserrat",
                  fontWeight: "500",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#2193b0",
                    backgroundColor: "rgba(33, 147, 176, 0.05)"
                  }
                }}
              >
                Google
              </Button>
              <Button
                variant="outlined"
                startIcon={
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#1877F2",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    f
                  </Box>
                }
                sx={{
                  flex: 1,
                  borderRadius: "12px",
                  padding: "14px",
                  borderColor: "#e0e0e0",
                  color: "#666",
                  fontFamily: "Montserrat",
                  fontWeight: "500",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#2193b0",
                    backgroundColor: "rgba(33, 147, 176, 0.05)"
                  }
                }}
              >
                Facebook
              </Button>
            </Box>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "#888",
                fontFamily: "Montserrat",
                fontSize: "14px",
                lineHeight: "1.5"
              }}
            >
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <Box
                component="span"
                onClick={toggleMode}
                sx={{
                  color: "#2193b0",
                  cursor: "pointer",
                  fontWeight: "600",
                  "&:hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </Box>
            </Typography>

          {/* Bottom indicator line */}
          <Box
            sx={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "134px",
              height: "5px",
              background: "#d0d0d0",
              borderRadius: "3px"
            }}
          />
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop Layout (Original) - UNCHANGED
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: "1 1 70%",
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
          flex: "1 1 30%",
          display: "flex",
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

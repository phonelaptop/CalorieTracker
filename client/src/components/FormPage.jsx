import { Box, Button, TextField, Typography } from "@mui/material";

export const FormPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Montserrat",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "700",
            textAlign: "center",
            color: "#333",
          }}
        >
          How Many Times a Week do you Exercise?
        </Typography>

        <TextField
          label="Your input"
          variant="outlined"
          fullWidth
          sx={{
            fontFamily: "Montserrat",
          }}
        />

        <Button
          variant="contained"
          sx={{
            fontFamily: "Montserrat",
            backgroundColor: "#797979",
            ":hover": {
              backgroundColor: "#797979",
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

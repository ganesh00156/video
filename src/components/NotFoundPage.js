// src/components/NotFoundPage.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom"; // Import Link for the button

/**
 * NotFoundPage component displayed for invalid routes (404).
 */
const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: { xs: 4, sm: 6, md: 8 }, // Responsive vertical padding
        px: 2, // Horizontal padding
        flexGrow: 1, // Ensure it takes available space if needed
        minHeight: "60vh", // Give it some minimum height
      }}
    >
      <Typography
        variant="h1"
        component="div"
        color="text.secondary"
        fontWeight="bold"
        sx={{ fontSize: { xs: "6rem", sm: "8rem" }, mb: 1 }} // Large 404 text
      >
        404
      </Typography>
      <Typography
        variant="h4" // Slightly smaller heading for the message
        component="h1"
        gutterBottom
        sx={{ mb: 2 }}
      >
        Page Not Found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: "450px" }}>
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </Typography>
      <Button
        component={RouterLink} // Use RouterLink for navigation
        to="/" // Link to the home page
        variant="contained" // Style as a contained button
        size="large"
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;

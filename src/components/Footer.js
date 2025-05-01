// src/Footer.js
import React from "react";
import { Box, Typography, Link, useTheme } from "@mui/material";

/**
 * Refined Footer component for the application.
 * Uses theme colors and ensures it stays at the bottom.
 */
const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 1.5, // Slightly reduced vertical padding
        px: { xs: 2, sm: 3 }, // Responsive horizontal padding
        // mt: 'auto', // This is NOT needed here if the parent uses flex-direction: column and the content area uses flex-grow: 1
        bgcolor: "background.paper", // Use paper background (or default for less emphasis)
        // bgcolor: 'background.default', // Alternative: blend with main background
        borderTop: `1px solid ${theme.palette.divider}`, // Subtle top border
        textAlign: "center",
        flexShrink: 0, // Prevent footer from shrinking
      }}
    >
      <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
        {" "}
        {/* Slightly smaller font */}
        {"Copyright © "}
        <Link
          color="inherit"
          href="#" // Replace # with your actual link later
          underline="hover" // Add underline on hover
        >
          Streamzilla
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      {/* Example of adding more links */}
      {/* <Box sx={{ mt: 0.5 }}>
                <Link variant="caption" color="text.secondary" href="#" sx={{ mx: 1 }}>About</Link>
                <Link variant="caption" color="text.secondary" href="#" sx={{ mx: 1 }}>Privacy</Link>
                <Link variant="caption" color="text.secondary" href="#" sx={{ mx: 1 }}>Terms</Link>
            </Box> */}
    </Box>
  );
};

export default Footer;

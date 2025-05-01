// src/components/Header.js
import React from "react";
import { Link as RouterLink } from "react-router-dom"; // Import Link from react-router-dom
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  alpha, // Utility for color transparency
  IconButton, // For menu button
  useTheme, // Hook to access theme
  // useMediaQuery, // Removed unused import
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Menu icon for mobile sidebar toggle
import SearchIcon from "@mui/icons-material/Search"; // Optional: Search icon

/**
 * Header component displaying the application title (linking to home), search bar,
 * and a menu toggle button for mobile view.
 *
 * @param {object} props - Component props.
 * @param {function} props.onSearch - Callback function triggered when search input changes.
 * @param {function} props.onMenuClick - Callback function to toggle the mobile sidebar.
 */
const Header = ({ onSearch, onMenuClick }) => {
  const theme = useTheme(); // Access the current theme

  return (
    <AppBar
      position="fixed" // Changed to fixed to stay on top always
      elevation={1} // Subtle shadow for depth
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 1, sm: 2 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Left Section: Menu Icon (Mobile) & Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {/* Menu Icon Button - Shown only on mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{
              display: { sm: "none" },
              color: theme.palette.text.primary,
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Application Title - Wrapped in RouterLink */}
          <RouterLink
            to="/" // Link to the home page route
            style={{
              textDecoration: "none", // Remove underline
              color: "inherit", // Inherit text color
            }}
          >
            <Typography
              variant="h6"
              component="div" // Use div as RouterLink is the anchor now
              noWrap
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary, // Use primary text color from theme
                ml: { xs: 1, sm: 0 },
                // Add hover effect if desired
                "&:hover": {
                  opacity: 0.8, // Example hover effect
                },
              }}
            >
              Streamzilla
            </Typography>
          </RouterLink>
        </Box>

        {/* Center Section: Search Bar */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            backgroundColor: alpha(theme.palette.common.black, 0.15),
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.25),
            },
            borderRadius: theme.shape.borderRadius / 2,
            width: "100%",
            maxWidth: { xs: "calc(100% - 150px)", sm: "400px", md: "500px" },
            mx: 2,
          }}
        >
          {/* Optional: Search Icon */}
          <Box
            sx={{
              pl: 1.5,
              height: "100%",
              position: "absolute",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.text.secondary,
            }}
          >
            <SearchIcon fontSize="small" />
          </Box>

          {/* Search Input Field */}
          <InputBase
            placeholder="Search…"
            onChange={(e) => onSearch(e.target.value)}
            fullWidth
            sx={{
              color: theme.palette.text.primary,
              pl: `calc(1em + ${theme.spacing(2.5)})`,
              py: 0.8,
              pr: 1.5,
              fontSize: "0.95rem",
              "& .MuiInputBase-input::placeholder": {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Right Section: Placeholder for Icons */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {/* Add User Profile / Settings Icons here */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

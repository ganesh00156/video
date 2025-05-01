// src/Header.js
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  alpha, // Utility for color transparency
  IconButton, // For menu button
  useTheme, // Hook to access theme
  useMediaQuery, // Hook for checking screen size
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Menu icon for mobile sidebar toggle
import SearchIcon from "@mui/icons-material/Search"; // Optional: Search icon

/**
 * Header component displaying the application title, search bar,
 * and a menu toggle button for mobile view.
 *
 * @param {object} props - Component props.
 * @param {function} props.onSearch - Callback function triggered when search input changes.
 * @param {function} props.onMenuClick - Callback function to toggle the mobile sidebar.
 */
const Header = ({ onSearch, onMenuClick }) => {
  const theme = useTheme(); // Access the current theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is small

  return (
    <AppBar
      position="fixed" // Changed to fixed to stay on top always
      elevation={1} // Subtle shadow for depth
      sx={{
        // Ensure AppBar is above the sidebar drawer
        zIndex: theme.zIndex.drawer + 1,
        // Apply a semi-transparent background with blur
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: "blur(8px)",
        // Use theme's divider color for the bottom border
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // Adjust padding for different screen sizes
          px: { xs: 1, sm: 2 }, // Horizontal padding
          minHeight: { xs: 56, sm: 64 }, // Standard toolbar heights
        }}
      >
        {/* Left Section: Menu Icon (Mobile) & Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {/* Menu Icon Button - Shown only on mobile */}
          <IconButton
            color="inherit" // Inherit color from AppBar (usually white/light in dark mode)
            aria-label="open drawer"
            edge="start" // Align to the start
            onClick={onMenuClick} // Trigger sidebar toggle
            sx={{
              // mr: { xs: 1, sm: 2 }, // Margin right
              display: { sm: "none" }, // Hide on 'sm' screens and up (desktop view)
              color: theme.palette.text.primary, // Ensure icon color contrasts
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Application Title */}
          <Typography
            variant="h6"
            component="div"
            noWrap // Prevent title from wrapping to the next line
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary, // Use primary text color from theme
              // Hide title on very small screens if search takes too much space? (Optional)
              // display: { xs: 'none', sm: 'block' }
              ml: { xs: 1, sm: 0 }, // Add left margin only on xs if menu icon is present
            }}
          >
            Streamzilla
          </Typography>
        </Box>

        {/* Center Section: Search Bar */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            backgroundColor: alpha(theme.palette.common.black, 0.15), // Darker search bg
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.25),
            },
            borderRadius: theme.shape.borderRadius / 2, // Slightly less rounded search bar
            // Control width and margins for responsiveness
            width: "100%", // Take available width
            maxWidth: { xs: "calc(100% - 150px)", sm: "400px", md: "500px" }, // Limit max width, adjust based on icons/title
            mx: 2, // Horizontal margin to space it from sides/title
          }}
        >
          {/* Optional: Search Icon inside the search bar */}
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
            // Call onSearch prop when input value changes
            onChange={(e) => onSearch(e.target.value)}
            fullWidth // Make input take the full width of its container
            sx={{
              color: theme.palette.text.primary,
              // Adjust padding to accommodate the icon
              pl: `calc(1em + ${theme.spacing(2.5)})`, // Left padding = icon width + spacing
              py: 0.8, // Vertical padding
              pr: 1.5, // Right padding
              fontSize: "0.95rem",
              "& .MuiInputBase-input::placeholder": {
                // Style placeholder text
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Right Section: Placeholder for Icons (Profile, Notifications, etc.) */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {/* Add User Profile / Settings Icons here */}
          {/* Example:
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                    */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

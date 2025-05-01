// src/Sidebar.js
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar, // To add space matching the AppBar height
  Box,
  Divider, // To separate sections
  ListSubheader, // For the "Categories" heading
  useTheme, // To access theme for styling
  alpha, // Properly import alpha function from MUI
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home"; // Icon for Home
import PeopleIcon from "@mui/icons-material/People"; // Icon for Authors
import CategoryIcon from "@mui/icons-material/Category"; // Icon for Categories

// Define the width of the drawer
const drawerWidth = 240;

/**
 * Sidebar component for navigation.
 * Displays as a temporary drawer on mobile and a permanent drawer on desktop.
 * Highlights the currently active page or category.
 * Includes a dynamic list of categories.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.mobileOpen - Controls the visibility of the temporary drawer on mobile.
 * @param {function} props.handleDrawerToggle - Function to toggle the mobile drawer.
 * @param {function} props.handleNavigate - Function to call when a navigation item is clicked.
 * @param {string} props.currentPage - The key of the currently active page ('home', 'authors', 'category').
 * @param {Array<string>} props.categories - List of unique category names.
 * @param {string|null} props.selectedCategory - The currently selected category name, if any.
 */
const Sidebar = ({
  mobileOpen,
  handleDrawerToggle,
  handleNavigate,
  currentPage,
  categories = [], // Default to empty array
  selectedCategory,
}) => {
  const theme = useTheme(); // Access theme for consistent styling

  // Helper function to create main navigation list items
  const createNavItem = (key, text, icon) => (
    <ListItem key={key} disablePadding sx={{ display: "flex" }}>
      <ListItemButton
        onClick={() => handleNavigate(key)}
        // Apply selected styles if the item's key matches the current page
        selected={currentPage === key}
        sx={{
          py: 1, // Reduced vertical padding slightly
          flexGrow: 1, // Allow button to fill ListItem
          borderRadius: 1, // Very slight border radius for rectangle look
          mx: 1, // Add horizontal margin (matches App.js theme)
          width: "calc(100% - 16px)", // Adjust width for margin (matches App.js theme)
          position: "relative", // Required for the border animation
          transition:
            "background-color 0.15s ease, box-shadow 0.2s ease-in-out",
          overflow: "hidden", // Hide border animation overflow
          // White animated border effect without shifting
          ...(currentPage === key && {
            boxShadow: `inset 0 0 0 2px rgba(255, 255, 255, 0.7)`,
            animation: "pulseBorder 1s",
          }),
          "@keyframes pulseBorder": {
            "0%": { boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.3)" },
            "50%": { boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.8)" },
            "100%": { boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.3)" },
          },
          "& .MuiListItemIcon-root": {
            minWidth: "40px", // Ensure consistent icon spacing
            color:
              currentPage === key // Check only against page key
                ? theme.palette.primary.main
                : theme.palette.text.secondary, // Highlight icon color when selected
            transition: "color 0.15s ease", // Faster color transition
          },
          "& .MuiListItemText-primary": {
            fontWeight: currentPage === key ? "medium" : "normal", // Make selected text bold
            fontSize: "0.9rem", // Slightly smaller text
            color: "inherit", // Ensure text inherits proper color
            transition: "color 0.15s ease", // Faster color transition
          },
          // Use focus-visible styling from App.js theme overrides
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            backgroundColor: alpha(theme.palette.action.focus, 0.7),
            zIndex: 1, // Ensure outline is visible
          },
          // Apply selected styles matching App.js theme overrides
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.05), // Very subtle background
            color: theme.palette.primary.main, // Ensure text is visible on selected item
          },
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.02), // Light background on hover
            color: theme.palette.primary.main, // Text color changes on hover
          },
          // Use hardware acceleration for better performance on mobile
          transform: "translateZ(0)",
          willChange: "color, background-color",
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );

  // Define the content/items to be displayed inside the drawer
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar adds vertical space at the top, aligning content below the AppBar */}
      <Toolbar />
      <Divider sx={{ mb: 1 }} /> {/* Add margin below divider */}
      {/* Main Navigation List */}
      <List sx={{ flexGrow: 0, py: 0 }}>
        {createNavItem("home", "Home", <HomeIcon />)}
        {createNavItem("authors", "Authors", <PeopleIcon />)}
      </List>
      <Divider sx={{ my: 1 }} /> {/* Add margin around divider */}
      {/* Categories Section */}
      {categories.length > 0 && ( // Only show if categories exist
        <List
          sx={{ flexGrow: 1, overflowY: "auto", py: 0 }} // Allow category list to grow and scroll if needed
          subheader={
            // Add a sticky subheader for the category section
            <ListSubheader
              sx={{
                // Use theme overrides from App.js for consistency
                bgcolor: "background.paper", // Match drawer background
                color: "text.primary",
                fontWeight: 500,
                lineHeight: "40px", // Adjust spacing
                position: "sticky", // Make subheader sticky
                top: 0, // Stick to the top
                zIndex: 1, // Ensure it's above list items
                mx: 1, // Match list item margin
                width: "calc(100% - 16px)", // Match list item width
              }}
            >
              Categories
            </ListSubheader>
          }
        >
          {categories.map((category) => (
            <ListItem key={category} disablePadding sx={{ display: "flex" }}>
              <ListItemButton
                // Navigate to category page, passing the category name
                onClick={() => handleNavigate("category", null, category)}
                // Highlight if current page is 'category' AND this category is selected
                selected={
                  currentPage === "category" && selectedCategory === category
                }
                sx={{
                  py: 1, // Match main nav item padding
                  pl: 2.5, // Indent category items slightly more
                  flexGrow: 1, // Allow button to fill ListItem
                  borderRadius: 1, // Very slight border radius for rectangle look
                  mx: 1, // Add horizontal margin (matches App.js theme)
                  width: "calc(100% - 16px)", // Adjust width for margin (matches App.js theme)
                  position: "relative", // Required for positioning
                  transition:
                    "background-color 0.15s ease, box-shadow 0.2s ease-in-out",
                  overflow: "hidden", // Hide animation overflow
                  // White animated border effect without shifting
                  ...(currentPage === "category" &&
                    selectedCategory === category && {
                      boxShadow: `inset 0 0 0 2px rgba(255, 255, 255, 0.7)`,
                      animation: "pulseBorder 1s",
                    }),
                  "@keyframes pulseBorder": {
                    "0%": {
                      boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.3)",
                    },
                    "50%": {
                      boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.8)",
                    },
                    "100%": {
                      boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.3)",
                    },
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: "32px", // Slightly smaller icon spacing if needed
                    color:
                      currentPage === "category" &&
                      selectedCategory === category
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    transition: "color 0.15s ease", // Faster color transition
                  },
                  "& .MuiListItemText-primary": {
                    fontWeight:
                      currentPage === "category" &&
                      selectedCategory === category
                        ? "medium"
                        : "normal",
                    textTransform: "capitalize", // Capitalize category names for display
                    fontSize: "0.9rem", // Match main nav item font size
                    color: "inherit", // Ensure text inherits proper color
                    transition: "color 0.15s ease", // Faster color transition
                  },
                  // Use focus-visible styling from App.js theme overrides
                  "&:focus-visible": {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    backgroundColor: alpha(theme.palette.action.focus, 0.7),
                    zIndex: 1, // Ensure outline is visible
                  },
                  // Apply selected styles matching App.js theme overrides
                  "&.Mui-selected": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05), // Very subtle background
                    color: theme.palette.primary.main, // Ensure text is visible on selected item
                  },
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02), // Light background on hover
                    color: theme.palette.primary.main, // Text color changes on hover
                  },
                  // Use hardware acceleration for better performance on mobile
                  transform: "translateZ(0)",
                  willChange: "color, background-color",
                }}
              >
                <ListItemIcon>
                  {/* Use small category icon */}
                  <CategoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={category} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      // Set width and prevent shrinking for the permanent drawer space
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="main navigation" // Accessibility label
    >
      {/* Temporary Drawer (Mobile View) */}
      <Drawer
        variant="temporary"
        open={mobileOpen} // Controlled by state in App.js
        onClose={handleDrawerToggle} // Function to close the drawer
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" }, // Show only on extra-small screens
          // Styling for the drawer paper itself
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.paper", // Use theme's paper background
            backgroundImage: "none", // Override potential theme gradients
            borderRight: `1px solid ${theme.palette.divider}`, // Add border for mobile drawer
          },
        }}
      >
        {drawerContent} {/* Render the drawer items */}
      </Drawer>

      {/* Permanent Drawer (Desktop View) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" }, // Show only on small screens and up
          // Styling for the drawer paper itself
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.paper", // Use theme's paper background
            // Keep border for consistency or remove if desired for permanent
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundImage: "none", // Override potential theme gradients
          },
        }}
        open // Permanent drawer is always open
      >
        {drawerContent} {/* Render the drawer items */}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

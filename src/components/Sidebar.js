// src/components/Sidebar.js
import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom"; // Import RouterLink and useLocation
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  ListSubheader,
  useTheme,
  alpha,
  Link, // Import MUI Link for consistent styling if needed, but RouterLink is primary
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
// Import slugify if needed for category links (though App.js passes slugs now)
// import { slugify } from "../utils/slugify";

const drawerWidth = 240;

/**
 * Sidebar component for navigation using React Router.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.mobileOpen - Controls mobile drawer visibility.
 * @param {function} props.handleDrawerToggle - Toggles mobile drawer.
 * @param {object} props.currentLocation - The location object from useLocation().
 * @param {Array<object>} props.categories - List of category objects { name, slug }.
 */
const Sidebar = ({
  mobileOpen,
  handleDrawerToggle,
  currentLocation, // Use location passed from App.js
  categories = [],
}) => {
  const theme = useTheme();
  const pathname = currentLocation.pathname; // Get the current path

  // Helper function to determine if a path is active
  // Considers base path for home and exact match or prefix match for others
  const isActive = (path, isExact = false, prefix = null) => {
    if (isExact) {
      return pathname === path;
    }
    if (prefix) {
      // Check if the current path starts with the given prefix
      // e.g., /category/food starts with /category/
      return pathname.startsWith(prefix);
    }
    return pathname === path; // Default check
  };

  // Helper function to determine if a specific category is active
  const isCategoryActive = (categorySlug) => {
    return pathname === `/category/${categorySlug}`;
  };

  // --- Styling for List Item Button (shared) ---
  const listItemButtonStyles = (selected) => ({
    py: 1,
    flexGrow: 1,
    borderRadius: 1,
    mx: 1,
    width: "calc(100% - 16px)",
    position: "relative",
    transition: "background-color 0.15s ease, box-shadow 0.2s ease-in-out",
    overflow: "hidden",
    ...(selected && {
      // Use subtle background instead of border for selected state
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      // boxShadow: `inset 0 0 0 2px rgba(255, 255, 255, 0.7)`, // Removed border
      // animation: "pulseBorder 1s", // Removed animation
    }),
    // "@keyframes pulseBorder": { // Removed animation keyframes
    //   "0%": { boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.3)" },
    //   "50%": { boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.8)" },
    //   "100%": { boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.3)" },
    // },
    "& .MuiListItemIcon-root": {
      minWidth: "40px",
      color: selected
        ? theme.palette.primary.main
        : theme.palette.text.secondary,
      transition: "color 0.15s ease",
    },
    "& .MuiListItemText-primary": {
      fontWeight: selected ? "medium" : "normal",
      fontSize: "0.9rem",
      color: selected ? theme.palette.primary.main : "inherit", // Highlight text color when selected
      transition: "color 0.15s ease",
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      backgroundColor: alpha(theme.palette.action.focus, 0.7),
      zIndex: 1,
    },
    "&.Mui-selected": {
      // Keep Mui-selected for potential future use or overrides
      backgroundColor: alpha(theme.palette.primary.main, 0.1), // Match selected style
      color: theme.palette.primary.main,
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05), // Lighter hover
      color: theme.palette.primary.main,
    },
    transform: "translateZ(0)",
    willChange: "color, background-color",
  });

  // --- Drawer Content ---
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <Divider sx={{ mb: 1 }} />
      {/* Main Navigation List */}
      <List sx={{ flexGrow: 0, py: 0 }}>
        {/* Home Link */}
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink} // Use RouterLink
            to="/" // Link to home route
            selected={isActive("/", true)} // Check if exactly '/' is active
            sx={listItemButtonStyles(isActive("/", true))} // Pass active state to styles
            onClick={handleDrawerToggle} // Close drawer on mobile after click
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        {/* Authors Link */}
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink} // Use RouterLink
            to="/authors" // Link to authors route
            // Check if '/authors' or '/authors/*' is active
            selected={isActive("/authors", false, "/authors")}
            sx={listItemButtonStyles(isActive("/authors", false, "/authors"))}
            onClick={handleDrawerToggle} // Close drawer on mobile after click
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Authors" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Categories Section */}
      {categories.length > 0 && (
        <List
          sx={{ flexGrow: 1, overflowY: "auto", py: 0 }}
          subheader={
            <ListSubheader
              sx={{
                bgcolor: "background.paper",
                color: "text.primary",
                fontWeight: 500,
                lineHeight: "40px",
                position: "sticky",
                top: 0,
                zIndex: 1,
                mx: 1,
                width: "calc(100% - 16px)",
              }}
            >
              Categories
            </ListSubheader>
          }
        >
          {categories.map((category) => (
            <ListItem key={category.slug} disablePadding>
              <ListItemButton
                component={RouterLink} // Use RouterLink
                to={`/category/${category.slug}`} // Link to specific category route using slug
                selected={isCategoryActive(category.slug)} // Check if this category is active
                sx={{
                  ...listItemButtonStyles(isCategoryActive(category.slug)), // Apply base styles
                  pl: 2.5, // Indent category items
                  "& .MuiListItemText-primary": {
                    // Override text style for categories
                    ...listItemButtonStyles(isCategoryActive(category.slug))[
                      "& .MuiListItemText-primary"
                    ], // Inherit base text style
                    textTransform: "capitalize", // Capitalize display name
                  },
                }}
                onClick={handleDrawerToggle} // Close drawer on mobile after click
              >
                <ListItemIcon>
                  <CategoryIcon fontSize="small" />
                </ListItemIcon>
                {/* Display the original category name */}
                <ListItemText primary={category.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  // --- Drawer Rendering (Mobile and Desktop) ---
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="main navigation"
    >
      {/* Temporary Drawer (Mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.paper",
            backgroundImage: "none",
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer (Desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.paper",
            borderRight: `1px solid ${theme.palette.divider}`, // Keep border for permanent drawer
            backgroundImage: "none",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

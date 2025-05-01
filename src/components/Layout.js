// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import videoData from "./video.json"; // Ensure video.json is in the src directory
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import HomePage from "./HomePage";
import VideoPlayerPage from "./VideoPlayerPage";
import AuthorsPage from "./AuthorsPage";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Toolbar, // To offset content below AppBar
} from "@mui/material";

// --- Theme Definition ---
// Define your theme here (or import from a separate file)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3ea6ff" }, // A slightly brighter blue
    secondary: { main: "#bb86fc" }, // A secondary accent color
    background: {
      default: "#0f0f0f", // Main background
      paper: "#212121", // Background for cards, drawers, etc.
    },
    text: {
      primary: "#f1f1f1", // Primary text
      secondary: "#aaa", // Secondary text (views, dates)
    },
    action: {
      active: "#fff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      disabled: "rgba(255, 255, 255, 0.3)",
      focus: "rgba(255, 255, 255, 0.12)",
    },
    divider: "rgba(255, 255, 255, 0.12)", // For dividers
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    // Define specific variants if needed, otherwise defaults are used
    body1: { fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.4 }, // For video titles on grid
    body2: { fontSize: "0.8rem", lineHeight: 1.5, color: "#aaa" }, // For secondary text like author, views
    h4: { fontSize: "1.8rem", fontWeight: 500 }, // Example: Authors page title
    h5: { fontSize: "1.4rem", fontWeight: 500, lineHeight: 1.3 }, // Example: Video player title
    h6: { fontSize: "1.1rem", fontWeight: 500 }, // Example: Section titles like "Recommended"
  },
  shape: {
    borderRadius: 12, // Consistent border radius
  },
  components: {
    // Override specific component styles globally if needed
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false, // Enable ripple effect
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // Ensure paper doesn't have default gradient/image
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent", // Keep cards transparent on home grid
          boxShadow: "none",
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          borderRadius: "inherit", // Inherit border radius from Card if needed, or set specific
          // Ensure focus style is visible
          "&:focus-visible": {
            outline: `2px solid ${darkTheme.palette.primary.main}`,
            outlineOffset: "2px",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none", // Remove border from permanent drawer
          backgroundColor: "#181818", // Slightly different shade for drawer? Or use paper default
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            // Style for selected item in sidebar
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
          // Ensure focus style is visible
          "&:focus-visible": {
            outline: `2px solid ${darkTheme.palette.primary.main}`,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
  },
});

// Width of the sidebar drawer
const drawerWidth = 240;

/**
 * Main Application Component
 * Handles theme, layout, routing state, and renders appropriate pages.
 */
function App() {
  // State Hooks
  const [allVideos] = useState(videoData || []); // Holds the original video data
  const [filteredVideos, setFilteredVideos] = useState(allVideos); // Videos filtered by search
  const [searchQuery, setSearchQuery] = useState(""); // Current search input value
  const [currentPage, setCurrentPage] = useState("home"); // Tracks the active page ('home', 'video', 'authors')
  const [selectedVideoId, setSelectedVideoId] = useState(null); // ID of the video being viewed
  const [mobileOpen, setMobileOpen] = useState(false); // Controls mobile sidebar visibility

  // Effect Hook: Filter videos when search query or current page changes
  useEffect(() => {
    // Only apply search filtering when on the home page
    if (currentPage === "home") {
      const query = searchQuery.toLowerCase().trim();
      if (query === "") {
        setFilteredVideos(allVideos); // Show all if search is empty
      } else {
        const results = allVideos.filter(
          (video) =>
            video?.title?.toLowerCase().includes(query) ||
            video?.author?.toLowerCase().includes(query) // Optional: Search by author too
        );
        setFilteredVideos(results);
      }
    }
    // No need to explicitly reset filteredVideos when leaving 'home',
    // as HomePage component will receive the filtered list only when active.
  }, [searchQuery, allVideos, currentPage]);

  // --- Event Handlers ---

  // Toggles the mobile sidebar drawer
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  // Handles navigation between pages/views
  const handleNavigate = useCallback((page, videoId = null) => {
    setCurrentPage(page); // Update the current page state
    setSelectedVideoId(videoId); // Set video ID if navigating to video page
    setMobileOpen(false); // Close mobile drawer after navigation
    window.scrollTo(0, 0); // Scroll to the top of the page

    // Clear search query when navigating away from home? (Optional)
    // if (page !== 'home' && searchQuery !== '') {
    //     setSearchQuery("");
    // }
  }, []); // Removed searchQuery from dependencies if clearing it here

  // --- Data Retrieval ---
  // Find the full video object based on the selectedVideoId
  const currentVideo = allVideos.find((v) => v.id === selectedVideoId);

  // --- Page Rendering Logic ---
  // Determines which page component to render based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case "video":
        return (
          <VideoPlayerPage
            video={currentVideo}
            allVideos={allVideos} // Pass all videos for recommendations
            // Navigate back to home page
            onBack={() => handleNavigate("home")}
            // Navigate to a different video (e.g., from recommendations)
            onVideoSelect={(id) => handleNavigate("video", id)}
          />
        );
      case "authors":
        return <AuthorsPage videos={allVideos} />;
      case "home":
      default: // Default to home page
        return (
          <HomePage
            videos={filteredVideos} // Pass the potentially filtered list
            // Navigate to video player page on selection
            onVideoSelect={(id) => handleNavigate("video", id)}
          />
        );
    }
  };

  // --- Render ---
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Apply baseline styles and dark mode */}
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {" "}
        {/* Main flex container for layout */}
        {/* Header Component */}
        <Header onSearch={setSearchQuery} onMenuClick={handleDrawerToggle} />
        {/* Sidebar Component */}
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          handleNavigate={handleNavigate}
          currentPage={currentPage} // Pass current page for active state highlighting
        />
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1, // Allow content to grow and fill available space
            // Add paddingLeft on larger screens to account for the permanent sidebar
            pl: { sm: `${drawerWidth}px` },
            // Ensure content width adjusts correctly
            width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default", // Use theme background
            display: "flex",
            flexDirection: "column", // Stack content and footer vertically
          }}
        >
          {/* Toolbar adds space equivalent to AppBar height, pushing content down */}
          <Toolbar />

          {/* Render the active page component */}
          <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
            {" "}
            {/* Add padding around page content */}
            {renderPage()}
          </Box>

          {/* Footer Component */}
          {/* Footer is placed here to be at the bottom of the main content flex container */}
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

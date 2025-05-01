// src/App.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Routes,
  Route,
  useLocation, // To help Sidebar determine active state
} from "react-router-dom"; // Import Router components
import videoData from "./components/video.json";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import VideoPlayerPage from "./components/VideoPlayerPage";
import AuthorsPage from "./components/AuthorsPage";
import CategoryPage from "./components/CategoryPage";
import AuthorVideosPage from "./components/AuthorVideosPage";
import NotFoundPage from "./components/NotFoundPage"; // Import the component from its file
import { slugify } from "./utils/slugify"; // Import the slugify utility
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Toolbar,
  CircularProgress,
  Typography,
  alpha,
} from "@mui/material";

// --- Theme Definition --- (Keep your existing theme with Inter font)
const primaryColor = "#3ea6ff";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: primaryColor },
    secondary: { main: "#bb86fc" },
    background: { default: "#0f0f0f", paper: "#181818" },
    text: { primary: "#f1f1f1", secondary: "#aaa" },
    action: {
      active: "#fff",
      hover: alpha("#ffffff", 0.08),
      selected: alpha("#ffffff", 0.16),
      disabledBackground: alpha("#ffffff", 0.12),
      disabled: alpha("#ffffff", 0.3),
      focus: alpha("#ffffff", 0.12),
      focusOpacity: 0.12,
    },
    divider: alpha("#ffffff", 0.12),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // Inter font
    body1: { fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.4 },
    body2: { fontSize: "0.8rem", lineHeight: 1.5, color: "#aaa" },
    h4: { fontSize: "1.8rem", fontWeight: 500 },
    h5: { fontSize: "1.4rem", fontWeight: 500, lineHeight: 1.3 },
    h6: { fontSize: "1.1rem", fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: false } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: {
      styleOverrides: {
        root: { backgroundColor: "transparent", boxShadow: "none" },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          borderRadius: "inherit",
          "&:focus-visible": {
            outline: `2px solid ${primaryColor}`,
            outlineOffset: "2px",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${alpha("#ffffff", 0.12)}`,
          backgroundColor: "#181818",
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: "#181818",
          color: "#f1f1f1",
          fontWeight: 500,
          lineHeight: "40px",
          paddingLeft: "24px",
          paddingRight: "16px",
        },
      },
    },
    // Add Link component default styling to remove underline
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: 'inherit', // Inherit color by default
          '&:hover': {
            // Optional: define a hover effect if needed
            // color: primaryColor,
          },
        },
      },
    },
  },
});

const drawerWidth = 240;

// --- Main App Component ---
function App() {
  // State Hooks
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation(); // Get current location for Sidebar highlighting

  // --- Data Loading Effect ---
  useEffect(() => {
    console.log("App.js: useEffect - Starting data load...");
    setIsLoading(true);
    setError(null);
    try {
      // Simulate loading time (remove in production)
      // setTimeout(() => {
        // Add slug to each video object for easier lookup/linking
        const videosWithSlugs = (videoData || []).map(video => ({
          ...video,
          slug: slugify(video.title || `video-${video.id}`), // Generate slug from title or use ID
        }));

        if (videosWithSlugs && Array.isArray(videosWithSlugs)) {
          console.log("App.js: useEffect - Data processed successfully.");
          setAllVideos(videosWithSlugs);
          setIsLoading(false);
        } else {
          throw new Error("Video data is missing or invalid.");
        }
      // }, 500); // Simulate 0.5 second load
    } catch (err) {
      console.error("App.js: useEffect - Failed to load video data:", err);
      setError(err.message || "Could not load video data.");
      setIsLoading(false);
    }
  }, []); // Runs only once on mount

  // --- Memoized Calculations ---
  // Calculate unique categories (with slugs)
  const uniqueCategories = useMemo(() => {
    if (!Array.isArray(allVideos)) return [];
    const categoriesMap = new Map();
    allVideos.forEach((video) => {
      const categoryName = video?.category?.trim();
      if (categoryName && !categoriesMap.has(categoryName.toLowerCase())) {
        categoriesMap.set(categoryName.toLowerCase(), {
            name: categoryName,
            slug: slugify(categoryName)
        });
      }
    });
    return Array.from(categoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allVideos]);

  // Filter videos based on search query (used in HomePage)
  const searchFilteredVideos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return allVideos; // Return all if no query
    }
    return allVideos.filter(
      (video) =>
        video?.title?.toLowerCase().includes(query) ||
        video?.author?.toLowerCase().includes(query) ||
        video?.description?.toLowerCase().includes(query)
    );
  }, [searchQuery, allVideos]);


  // --- Event Handlers ---
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  // --- Render Logic ---
  const renderContent = () => {
    // *** DEBUG LOG ***
    console.log(`App.js: renderContent - Current Location: ${location.pathname}, isLoading: ${isLoading}, error: ${error}`);

    if (isLoading) { // Main loading state from App.js
        console.log("App.js: renderContent - Showing main loading spinner.");
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) { // Main error state from App.js
        console.log("App.js: renderContent - Showing main error message.");
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1, p: 3, textAlign: "center" }}>
          <Typography color="error">Error loading data: {error}<br />Please check the console or try refreshing.</Typography>
        </Box>
      );
    }

    // --- Routing Setup ---
    console.log("App.js: renderContent - Rendering Routes...");
    return (
      <Routes>
        {/* Home Page Route */}
        <Route
          path="/"
          element={<HomePage videos={searchFilteredVideos} loading={isLoading} />}
        />

        {/* Video Player Route */}
        <Route
          path="/videos/:videoSlug"
          element={<VideoPlayerPage allVideos={allVideos} />}
        />

        {/* Authors List Route */}
        <Route
          path="/authors"
          element={<AuthorsPage videos={allVideos} />}
        />

        {/* Videos by Author Route */}
        <Route
            path="/authors/:authorSlug" // Use slug for author route
            element={<AuthorVideosPage allVideos={allVideos} />}
        />

        {/* Videos by Category Route */}
        <Route
          path="/category/:categorySlug" // Use slug for category route
          element={<CategoryPage allVideos={allVideos} categories={uniqueCategories} />}
        />

        {/* Catch-all 404 Route - Uses the imported component */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  };

  // --- Main Render ---
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Header remains fixed */}
        <Header onSearch={setSearchQuery} onMenuClick={handleDrawerToggle} />

        {/* Sidebar remains */}
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          // handleNavigate removed - use Links now
          // Pass location and categories for active state and links
          currentLocation={location}
          categories={uniqueCategories}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default",
          }}
        >
          {/* Toolbar Spacer */}
          <Toolbar />

          {/* Scrollable Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 1, sm: 2, md: 3 },
              overflowY: "auto", // Make ONLY this Box scrollable
            }}
          >
            {renderContent()} {/* Render the routed page content */}
          </Box>

          {/* Footer remains at the bottom */}
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

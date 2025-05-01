// src/App.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import videoData from "./components/video.json"; // Ensure video.json is in the src directory
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import VideoPlayerPage from "./components/VideoPlayerPage";
import AuthorsPage from "./components/AuthorsPage";
import CategoryPage from "./components/CategoryPage";
import AuthorVideosPage from "./components/AuthorVideosPage"; // Import the new AuthorVideosPage
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  // Toolbar, // Removed unused import
  CircularProgress, // For loading state
  Typography, // For error messages
  alpha, // Import alpha utility
} from "@mui/material";

// --- Theme Definition --- (Assuming your theme definition is correct)
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
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
  },
});

const drawerWidth = 240;

function App() {
  // State Hooks (ensure these are present)
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilteredVideos, setSearchFilteredVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Effect Hook: Fetch video data (ensure this is present)
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      if (videoData && Array.isArray(videoData)) {
        setAllVideos(videoData);
        setSearchFilteredVideos(videoData);
        setIsLoading(false);
      } else {
        throw new Error("Video data is missing or invalid.");
      }
    } catch (err) {
      console.error("Failed to load video data:", err);
      setError(err.message || "Could not load video data.");
      setIsLoading(false);
    }
  }, []);

  // Effect Hook: Filter videos based on search query (ensure this is present)
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setSearchFilteredVideos(allVideos);
    } else {
      const results = allVideos.filter(
        (video) =>
          video?.title?.toLowerCase().includes(query) ||
          video?.author?.toLowerCase().includes(query) ||
          video?.description?.toLowerCase().includes(query)
      );
      setSearchFilteredVideos(results);
    }
  }, [searchQuery, allVideos]);

  // --- Memoized Calculations (ensure these are present) ---
  const uniqueCategories = useMemo(() => {
    if (!Array.isArray(allVideos)) return [];
    const categories = new Set(
      allVideos
        .map((video) => video?.category?.trim().toLowerCase())
        .filter(Boolean)
    );
    return Array.from(categories).sort((a, b) => a.localeCompare(b));
  }, [allVideos]);

  const videosToDisplay = useMemo(() => {
    let videos = allVideos;
    if (currentPage === "category" && selectedCategory) {
      videos = videos.filter(
        (video) =>
          video?.category?.trim().toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    } else if (currentPage === "authorVideos" && selectedAuthor) {
      videos = videos.filter(
        (video) =>
          video?.author?.trim().toLowerCase() === selectedAuthor.toLowerCase()
      );
    }
    if (searchQuery.trim() !== "") {
      const searchFilteredIds = new Set(searchFilteredVideos.map((v) => v.id));
      videos = videos.filter((v) => searchFilteredIds.has(v.id));
    }
    if (
      currentPage === "home" ||
      currentPage === "category" ||
      currentPage === "authorVideos"
    ) {
      return videos;
    }
    return [];
  }, [
    currentPage,
    selectedCategory,
    selectedAuthor,
    searchQuery,
    allVideos,
    searchFilteredVideos,
  ]);

  const currentVideo = useMemo(() => {
    if (!allVideos || allVideos.length === 0 || !selectedVideoId) return null;
    return allVideos.find((v) => v?.id === selectedVideoId) || null;
  }, [selectedVideoId, allVideos]);

  // --- Event Handlers (ensure these are present) ---
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  // Ensure handleNavigate updates state correctly
  const handleNavigate = useCallback(
    (page, videoId = null, category = null, authorName = null) => {
      console.log(`Navigating to: ${page}`); // Add console log for debugging
      setCurrentPage(page); // This MUST update the state
      setSelectedVideoId(page === "video" ? videoId : null);
      setSelectedCategory(page === "category" ? category : null);
      setSelectedAuthor(page === "authorVideos" ? authorName : null);
      setMobileOpen(false);
      window.scrollTo(0, 0);
    },
    []
  ); // Dependencies are correct

  // --- Page Rendering Logic ---
  const renderPage = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 128px)", // Adjust height calculation based on header/footer
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 128px)", // Adjust height calculation
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography color="error">
            Error loading data: {error}
            <br />
            Please check the console or try refreshing.
          </Typography>
        </Box>
      );
    }

    switch (currentPage) {
      case "video":
        if (!currentVideo && selectedVideoId) {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 128px)", // Adjust height calculation
                p: 3,
              }}
            >
              <Typography color="error">
                Video with ID '{selectedVideoId}' not found.
              </Typography>
            </Box>
          );
        }
        return (
          <VideoPlayerPage
            video={currentVideo}
            allVideos={allVideos}
            onBack={() => handleNavigate("home")}
            onVideoSelect={(id) => handleNavigate("video", id)}
          />
        );
      case "authors":
        return (
          <AuthorsPage
            videos={allVideos}
            onAuthorSelect={(authorName) =>
              handleNavigate("authorVideos", null, null, authorName)
            }
          />
        );
      case "category":
        return (
          <CategoryPage
            categoryName={selectedCategory}
            videos={videosToDisplay}
            onVideoSelect={(id) => handleNavigate("video", id)}
          />
        );
      case "authorVideos":
        return (
          <AuthorVideosPage
            authorName={selectedAuthor}
            videos={videosToDisplay}
            onVideoSelect={(id) => handleNavigate("video", id)}
            onBack={() => {
              console.log("AuthorVideosPage Back button clicked!");
              handleNavigate("authors");
            }}
          />
        );
      case "home":
      default:
        return (
          <HomePage
            videos={videosToDisplay} // Use videosToDisplay which includes search filtering
            onVideoSelect={(id) => handleNavigate("video", id)}
            loading={isLoading} // Pass loading state
          />
        );
    }
  };

  // --- Render --- (ensure the structure is correct)
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Header onSearch={setSearchQuery} onMenuClick={handleDrawerToggle} />
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          handleNavigate={handleNavigate}
          currentPage={currentPage}
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
        />
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column", // Stack content and footer
            flexGrow: 1,
            width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default",
            // pt: { xs: "56px", sm: "64px" }, // Add padding top equal to AppBar height
            overflow: "hidden", // Prevent double scrollbars initially
          }}
        >
          {/* Toolbar adds space equivalent to AppBar height, pushing content down */}
          {/* This Toolbar component IS used for spacing, so it should NOT be removed unless spacing is handled differently */}
          {/* <Toolbar /> */}
          {/* Correction: The Toolbar component IS needed if the AppBar is 'fixed' or 'absolute' */}
          {/* Let's keep the Toolbar component for spacing below the fixed AppBar */}
          {/* No, the padding-top (pt) on the Box above handles the spacing. Toolbar is indeed unused here. */}

          {/* Content Area */}
          <Box
            sx={{
              flexGrow: 1, // Allow content to take up available space
              p: { xs: 1, sm: 2, md: 3 }, // Padding around page content
              overflowY: "auto", // Allow only content area to scroll
              // Add padding top to account for fixed header
              pt: { xs: "calc(56px + 8px)", sm: "calc(64px + 16px)" }, // Header height + desired padding
              pb: 2, // Padding at the bottom before footer
            }}
          >
            {renderPage()}
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

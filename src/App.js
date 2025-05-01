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
  Toolbar, // To offset content below AppBar
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
            minHeight: "calc(100vh - 128px)",
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
            minHeight: "calc(100vh - 128px)",
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
        // ... (video page rendering logic)
        if (!currentVideo && selectedVideoId) {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 128px)",
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
        // ... (authors page rendering logic)
        return (
          <AuthorsPage
            videos={allVideos}
            onAuthorSelect={(authorName) =>
              handleNavigate("authorVideos", null, null, authorName)
            }
          />
        );
      case "category":
        // ... (category page rendering logic)
        return (
          <CategoryPage
            categoryName={selectedCategory}
            videos={videosToDisplay}
            onVideoSelect={(id) => handleNavigate("video", id)}
          />
        );
      case "authorVideos": // *** THIS IS THE IMPORTANT PART FOR THE BACK BUTTON ***
        return (
          <AuthorVideosPage
            authorName={selectedAuthor}
            videos={videosToDisplay}
            onVideoSelect={(id) => handleNavigate("video", id)}
            // Make sure this line correctly calls handleNavigate to go to the 'authors' page
            onBack={() => {
              console.log("AuthorVideosPage Back button clicked!"); // Add log here
              handleNavigate("authors");
            }}
          />
        );
      case "home":
      default:
        // ... (home page rendering logic)
        return (
          <HomePage
            videos={videosToDisplay}
            onVideoSelect={(id) => handleNavigate("video", id)}
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
            flexDirection: "column",
            flexGrow: 1,
            width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default",
            overflow: "hidden",
            pt: { xs: "56px", sm: "64px" },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 1, sm: 2, md: 3 },
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>{renderPage()}</Box>
          </Box>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

// src/App.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import videoData from "./components/video.json";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import VideoPlayerPage from "./components/VideoPlayerPage";
import AuthorsPage from "./components/AuthorsPage";
import CategoryPage from "./components/CategoryPage";
import AuthorVideosPage from "./components/AuthorVideosPage";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Toolbar, // Re-added Toolbar import
  CircularProgress,
  Typography,
  alpha,
} from "@mui/material";

// --- Theme Definition --- (Keep your existing theme)
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
  // State Hooks... (keep existing state)
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

  // Effect Hooks... (keep existing effects)
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

  // Memoized Calculations... (keep existing memos)
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
    // Apply search filter only if on a page where search makes sense (home, category, author videos)
    if (
      searchQuery.trim() !== "" &&
      ["home", "category", "authorVideos"].includes(currentPage)
    ) {
      const searchFilteredIds = new Set(searchFilteredVideos.map((v) => v.id));
      videos = videos.filter((v) => searchFilteredIds.has(v.id));
    }
    // Return the filtered list only for relevant pages
    if (["home", "category", "authorVideos"].includes(currentPage)) {
      return videos;
    }
    // Return empty or potentially all videos for other pages if needed,
    // but typically rendering logic handles this.
    // For AuthorsPage, we pass allVideos directly.
    // For VideoPlayerPage, we use currentVideo.
    return videos; // Or adjust if needed for other page types
  }, [
    currentPage,
    selectedCategory,
    selectedAuthor,
    searchQuery,
    allVideos,
    searchFilteredVideos, // Include this dependency
  ]);

  const currentVideo = useMemo(() => {
    if (!allVideos || allVideos.length === 0 || !selectedVideoId) return null;
    return allVideos.find((v) => v?.id === selectedVideoId) || null;
  }, [selectedVideoId, allVideos]);

  // Event Handlers... (keep existing handlers)
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleNavigate = useCallback(
    (page, videoId = null, category = null, authorName = null) => {
      console.log(`Navigating to: ${page}`);
      setCurrentPage(page);
      setSelectedVideoId(page === "video" ? videoId : null);
      setSelectedCategory(page === "category" ? category : null);
      setSelectedAuthor(page === "authorVideos" ? authorName : null);
      setMobileOpen(false);
      window.scrollTo(0, 0);
    },
    []
  );

  // --- Page Rendering Logic --- (keep existing renderPage logic)
  const renderPage = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1, // Make loading indicator take space
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
            flexGrow: 1, // Make error message take space
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
            <Box sx={{ /* ... styling for not found */ flexGrow: 1 }}>
              <Typography color="error">Video not found.</Typography>
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
            videos={allVideos} // Pass all videos to calculate authors
            onAuthorSelect={(authorName) =>
              handleNavigate("authorVideos", null, null, authorName)
            }
          />
        );
      case "category":
        return (
          <CategoryPage
            categoryName={selectedCategory}
            videos={videosToDisplay} // Pass filtered videos for this category
            onVideoSelect={(id) => handleNavigate("video", id)}
          />
        );
      case "authorVideos":
        return (
          <AuthorVideosPage
            authorName={selectedAuthor}
            videos={videosToDisplay} // Pass filtered videos for this author
            onVideoSelect={(id) => handleNavigate("video", id)}
            onBack={() => handleNavigate("authors")}
          />
        );
      case "home":
      default:
        return (
          <HomePage
            videos={videosToDisplay} // Pass potentially search-filtered videos
            onVideoSelect={(id) => handleNavigate("video", id)}
            loading={isLoading}
          />
        );
    }
  };

  // --- Render ---
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
          handleNavigate={handleNavigate}
          currentPage={currentPage}
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column", // Stack Toolbar/Content/Footer
            flexGrow: 1,
            width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default",
            // Remove pt and overflow: hidden from here
          }}
        >
          {/* ****** Add the Toolbar back here ****** */}
          {/* This Toolbar acts as a spacer with the same height as the AppBar */}
          <Toolbar />

          {/* Scrollable Content Area */}
          <Box
            sx={{
              flexGrow: 1, // Allow this Box to grow and fill space
              p: { xs: 1, sm: 2, md: 3 }, // Padding around page content
              overflowY: "auto", // Make ONLY this Box scrollable
            }}
          >
            {renderPage()} {/* Render the actual page content */}
          </Box>

          {/* Footer remains at the bottom */}
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

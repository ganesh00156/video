// src/components/VideoPlayerPage.js
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import hooks
import RecommendedVideos from "./RecommendedVideos";

import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

/**
 * VideoPlayerPage component displays the selected video based on URL slug.
 */
const VideoPlayerPage = ({ allVideos = [] }) => {
  // Removed video, onBack, onVideoSelect props
  const theme = useTheme();
  const { videoSlug } = useParams(); // Get slug from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const [isExpanded, setIsExpanded] = useState(false);

  // Find the current video based on the slug
  const currentVideo = useMemo(() => {
    if (!videoSlug || !Array.isArray(allVideos)) return null;
    // Find video where its generated slug matches the URL slug
    return allVideos.find((v) => v.slug === videoSlug) || null; // Use pre-calculated slug
  }, [videoSlug, allVideos]);

  // --- Loading State (Might not be needed if App.js handles loading) ---
  // If allVideos is empty while loading, show spinner
  if (allVideos.length === 0) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 128px)",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  // --- Not Found State ---
  if (!currentVideo) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Back button using navigate */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          {" "}
          {/* navigate(-1) goes back */}
          Back
        </Button>
        <Alert severity="error">
          Video not found. It might have been removed or the link is incorrect.
          Slug: {videoSlug}
        </Alert>
      </Container>
    );
  }

  // Toggle description expansion state
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionLinesToShow = 3;

  // --- Render Video Player and Details ---
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 3, md: 4 },
        }}
      >
        {/* Left/Top Section: Video Player and Details */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)} // Go back in history
            sx={{
              mb: 2,
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Back
          </Button>

          {/* Video Player Area */}
          <Paper
            elevation={0}
            sx={{
              aspectRatio: "16/9",
              mb: 2.5,
              bgcolor: "black",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {currentVideo.isLive ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  bgcolor: "black",
                  position: "relative",
                }}
              >
                <Chip
                  label="LIVE"
                  color="error"
                  size="small"
                  sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
                />
                <Typography variant="h5" color="text.primary">
                  Live Stream Placeholder
                </Typography>
                <Typography color="text.secondary">
                  (Feature not implemented)
                </Typography>
              </Box>
            ) : (
              <video
                controls
                width="100%"
                height="auto"
                style={{ display: "block", aspectRatio: "16/9" }}
                src={currentVideo.videoUrl}
                poster={currentVideo.thumbnailUrl}
                onError={(e) => console.error("Error loading video:", e)}
                key={currentVideo.id} // Add key to force re-render on video change
              >
                Your browser does not support the video tag.
              </video>
            )}
          </Paper>

          {/* Video Details Section */}
          <Box sx={{ px: { xs: 0, sm: 1 } }}>
            <Typography
              variant="h5"
              component="h1"
              fontWeight="medium"
              gutterBottom
              color="text.primary"
            >
              {currentVideo.title || "Untitled Video"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  sx={{ width: 40, height: 40, bgcolor: "secondary.main" }}
                >
                  {currentVideo.author ? (
                    currentVideo.author.charAt(0).toUpperCase()
                  ) : (
                    <AccountCircleIcon />
                  )}
                </Avatar>
                <Box>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight="medium"
                  >
                    {currentVideo.author || "Unknown Author"}
                  </Typography>
                  {currentVideo.subscriber && (
                    <Typography variant="body2" color="text.secondary">
                      {currentVideo.subscriber}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: "10px", px: 3 }}
              >
                Subscribe
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {currentVideo.views ? `${currentVideo.views} views` : "No views"}
              {currentVideo.views &&
              (currentVideo.uploadTime || currentVideo.duration)
                ? " • "
                : ""}
              {currentVideo.uploadTime || currentVideo.duration || ""}
            </Typography>
            <Paper
              elevation={0}
              sx={{
                bgcolor: alpha(theme.palette.action.hover, 0.5),
                p: 2,
                mt: 1,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: isExpanded
                    ? "unset"
                    : descriptionLinesToShow,
                }}
              >
                {currentVideo.description || "No description available."}
              </Typography>
              {(currentVideo.description?.split("\n").length >
                descriptionLinesToShow ||
                currentVideo.description?.length > 150) && (
                <Button
                  onClick={toggleDescription}
                  size="small"
                  startIcon={
                    isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "text.primary",
                  }}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </Button>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Right/Bottom Section: Recommended Videos */}
        <Box
          sx={{
            width: { xs: "100%", lg: 360 },
            maxWidth: { lg: 360 },
            flexShrink: { lg: 0 },
          }}
        >
          {/* Pass all videos and current video ID */}
          <RecommendedVideos
            videos={allVideos}
            currentVideoId={currentVideo.id}
            // onVideoSelect is handled by RouterLink inside RecommendedVideos now
          />
        </Box>
      </Box>
    </Container>
  );
};

export default VideoPlayerPage;

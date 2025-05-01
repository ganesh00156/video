// src/VideoPlayerPage.js
import React, { useState } from "react"; // Import useState
import RecommendedVideos from "./RecommendedVideos"; // Import the RecommendedVideos component
import {
  Container,
  Typography,
  Box,
  Paper, // For video player background and details section
  Button, // For Back button and Expand/Collapse
  IconButton, // For Back Icon Button
  Avatar, // For Author avatar
  Divider, // To separate sections
  CircularProgress, // Loading indicator
  Alert, // To show errors
  Chip,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Back Icon
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Placeholder avatar icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Icon for expand
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // Icon for collapse

/**
 * VideoPlayerPage component displays the selected video, its details (title, author, description),
 * and a list of recommended videos.
 * Includes expand/collapse functionality for the description.
 *
 * @param {object} props - Component props.
 * @param {object|null|undefined} props.video - The video object to display. Null/undefined if not found or loading.
 * @param {Array} props.allVideos - Array of all video objects, used for recommendations.
 * @param {function} props.onBack - Callback function to navigate back to the previous page (e.g., home).
 * @param {function} props.onVideoSelect - Callback function when a recommended video is clicked.
 */
const VideoPlayerPage = ({ video, allVideos, onBack, onVideoSelect }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false); // State for description expand/collapse

  // --- Loading State ---
  if (video === undefined) {
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
  if (video === null) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="error">
          Video not found. It might have been removed or the link is incorrect.
        </Alert>
      </Container>
    );
  }

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionLinesToShow = 3; // Number of lines to show when collapsed

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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
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
              // borderRadius: theme.shape.borderRadius / 2, // Slightly less round corners for player
              overflow: "hidden",
              position: "relative",
            }}
          >
            {video.isLive ? (
              // Placeholder for Live Video
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
              // HTML5 Video Player
              <video
                controls
                width="100%"
                height="auto"
                style={{ display: "block", aspectRatio: "16/9" }}
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                onError={(e) => console.error("Error loading video:", e)}
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
              {video.title || "Untitled Video"}
            </Typography>

            {/* Author Info & Actions */}
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
                  {video.author ? (
                    video.author.charAt(0).toUpperCase()
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
                    {video.author || "Unknown Author"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {video.subscriber || ""}
                  </Typography>
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

            {/* Views and Upload Time */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {video.views ? `${video.views} views` : "No views"}
              {" • "}
              {video.uploadTime || video.duration || ""}
            </Typography>

            {/* Description Section - MODIFIED */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: "action.hover",
                p: 2,
                // Reduced border radius using theme value from App.js
                // borderRadius: theme.shape.borderRadius / 2,
                mt: 1,
                overflow: "hidden", // Keep overflow hidden
              }}
            >
              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  // Apply line clamp only when collapsed
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: isExpanded
                    ? "unset"
                    : descriptionLinesToShow,
                }}
              >
                {video.description || "No description available."}
              </Typography>
              {/* Add Show More/Less button if description likely exceeds limit */}
              {(video.description?.split("\n").length >
                descriptionLinesToShow ||
                video.description?.length > 150) && ( // Basic check if button is needed
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
          sx={{ width: "100%", maxWidth: { lg: 360 }, flexShrink: { lg: 0 } }}
        >
          <RecommendedVideos
            videos={allVideos}
            currentVideoId={video.id}
            onVideoSelect={onVideoSelect}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default VideoPlayerPage;

// src/VideoPlayerPage.js
import React, { useState } from "react"; // Import useState
import RecommendedVideos from "./RecommendedVideos"; // Import the RecommendedVideos component
import {
  Container,
  Typography,
  Box,
  Paper, // For video player background and details section
  Button, // For Back button and Expand/Collapse
  // IconButton, // Removed unused import
  Avatar, // For Author avatar
  // Divider, // Removed unused import
  CircularProgress, // Loading indicator
  Alert, // To show errors
  Chip,
  useTheme, // Keep useTheme if needed elsewhere, remove if not
  alpha, // Import alpha if needed for styling (e.g., placeholders)
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
  const theme = useTheme(); // Keep theme if used for styling below
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
          minHeight: "calc(100vh - 128px)", // Adjust based on header/footer
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

  // Toggle description expansion state
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionLinesToShow = 3; // Number of lines to show when collapsed

  // --- Render Video Player and Details ---
  return (
    <Container maxWidth="xl">
      {" "}
      {/* Use xl for wider layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" }, // Column on mobile, row on large screens
          gap: { xs: 3, md: 4 }, // Spacing between player/details and recommendations
        }}
      >
        {/* Left/Top Section: Video Player and Details */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {" "}
          {/* Allow this section to grow */}
          {/* Back Button */}
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
            elevation={0} // No shadow for the player container itself
            sx={{
              aspectRatio: "16/9", // Maintain 16:9 aspect ratio
              mb: 2.5, // Margin below player
              bgcolor: "black", // Black background for the video area
              borderRadius: theme.shape.borderRadius / 2, // Slightly less round corners
              overflow: "hidden", // Clip video content
              position: "relative", // For positioning elements like LIVE chip
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
                  bgcolor: "black", // Match parent background
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
                controls // Show default video controls
                width="100%" // Make video fill container width
                height="auto" // Adjust height automatically
                style={{ display: "block", aspectRatio: "16/9" }} // Ensure block display and maintain aspect ratio
                src={video.videoUrl}
                poster={video.thumbnailUrl} // Show thumbnail before loading
                onError={(e) => console.error("Error loading video:", e)} // Basic error handling
              >
                Your browser does not support the video tag.{" "}
                {/* Fallback message */}
              </video>
            )}
          </Paper>
          {/* Video Details Section */}
          <Box sx={{ px: { xs: 0, sm: 1 } }}>
            {" "}
            {/* Add slight horizontal padding on larger screens */}
            {/* Video Title */}
            <Typography
              variant="h5" // Use h5 for video title
              component="h1" // Semantically correct heading
              fontWeight="medium"
              gutterBottom // Adds margin below
              color="text.primary"
            >
              {video.title || "Untitled Video"}
            </Typography>
            {/* Author Info & Actions (Subscribe Button) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // Space out author info and button
                mb: 1,
                flexWrap: "wrap", // Allow wrapping on small screens
                gap: 2, // Gap between items if they wrap
              }}
            >
              {/* Author Avatar and Name */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  sx={{ width: 40, height: 40, bgcolor: "secondary.main" }} // Use theme color
                  // Add src={video.authorAvatarUrl} if you have author avatars
                >
                  {/* Fallback to first letter or icon */}
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
                  {/* Optional: Subscriber count */}
                  {video.subscriber && (
                    <Typography variant="body2" color="text.secondary">
                      {video.subscriber}
                    </Typography>
                  )}
                </Box>
              </Box>
              {/* Subscribe Button */}
              <Button
                variant="contained"
                color="primary" // Or style differently (e.g., red)
                sx={{ borderRadius: "20px", px: 3 }} // Pill shape button
                // Add onClick handler for subscription logic later
              >
                Subscribe
              </Button>
            </Box>
            {/* Views and Upload Time */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {video.views ? `${video.views} views` : "No views"}
              {video.views && (video.uploadTime || video.duration) ? " • " : ""}
              {video.uploadTime || video.duration || ""}
            </Typography>
            {/* Description Section */}
            <Paper
              elevation={0} // No shadow for description box
              sx={{
                bgcolor: alpha(theme.palette.action.hover, 0.5), // Use alpha for transparency
                p: 2,
                borderRadius: theme.shape.borderRadius / 2, // Match player radius
                mt: 1,
                overflow: "hidden", // Clip content
              }}
            >
              <Typography
                variant="body1" // Use body1 for description text
                color="text.primary"
                sx={{
                  whiteSpace: "pre-wrap", // Preserve line breaks from description data
                  lineHeight: 1.6,
                  // Apply line clamp only when collapsed
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: isExpanded
                    ? "unset" // Remove clamp when expanded
                    : descriptionLinesToShow, // Apply clamp when collapsed
                }}
              >
                {video.description || "No description available."}
              </Typography>
              {/* Show More/Less button only if description is likely long enough */}
              {(video.description?.split("\n").length >
                descriptionLinesToShow ||
                video.description?.length > 150) && ( // Basic check
                <Button
                  onClick={toggleDescription}
                  size="small"
                  startIcon={
                    isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                  sx={{
                    mt: 1,
                    textTransform: "none", // Prevent uppercase text
                    fontWeight: "bold",
                    color: "text.primary", // Make button text stand out
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
            width: { xs: "100%", lg: 360 }, // Full width on mobile, fixed width on large screens
            maxWidth: { lg: 360 }, // Ensure it doesn't exceed 360px on large screens
            flexShrink: { lg: 0 }, // Prevent shrinking on large screens
          }}
        >
          <RecommendedVideos
            videos={allVideos}
            currentVideoId={video.id}
            onVideoSelect={onVideoSelect} // Pass the handler
          />
        </Box>
      </Box>
    </Container>
  );
};

export default VideoPlayerPage;

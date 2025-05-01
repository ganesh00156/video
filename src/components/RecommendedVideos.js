// src/RecommendedVideos.js
import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  // ListItemAvatar, // Removed unused import
  ListItemText,
  Typography,
  Box,
  CardMedia,
  useTheme,
} from "@mui/material";

/**
 * RecommendedVideos component displays a list of recommended videos.
 */
const RecommendedVideos = ({ videos, currentVideoId, onVideoSelect }) => {
  const theme = useTheme();

  // Filter out the current video and limit the number of recommendations
  const recommended = videos
    .filter((video) => video && video.id !== currentVideoId) // Ensure video exists before checking id
    .slice(0, 15); // Limit to 15 recommendations

  // Return null if no recommended videos are available
  if (recommended.length === 0) return null;

  // Placeholder image generator using theme colors
  const placeholderImage = (width, height) =>
    `https://placehold.co/${width}x${height}/${theme.palette.background.paper.substring(
      1 // Remove '#' from hex
    )}/${theme.palette.text.secondary.substring(1)}?text=Video`; // Remove '#' from hex

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        gutterBottom
        color="text.primary"
        sx={{ mb: 2, fontWeight: 600, fontSize: "1.1rem" }}
      >
        Up next
      </Typography>

      <List sx={{ p: 0 }}>
        {recommended.map((video) => (
          <ListItem key={video.id} disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              onClick={() => onVideoSelect(video.id)}
              sx={{
                p: 0,
                display: "flex",
                gap: 1.5, // Space between thumbnail and text
                borderRadius: 1, // Use theme shape? theme.shape.borderRadius / 2
                alignItems: "flex-start", // Align items to the top
                "&:hover": { backgroundColor: theme.palette.action.hover },
                "&:focus-visible": {
                  // Accessibility focus style
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: "2px",
                },
              }}
            >
              {/* Thumbnail */}
              <CardMedia
                component="img"
                sx={{
                  width: 168, // Standard YouTube recommendation thumbnail width
                  height: 94, // Standard YouTube recommendation thumbnail height (16:9)
                  borderRadius: 1, // Match button border radius
                  backgroundColor: theme.palette.action.disabledBackground, // Placeholder bg
                  objectFit: "cover",
                  flexShrink: 0, // Prevent thumbnail from shrinking
                }}
                image={video.thumbnailUrl || placeholderImage(168, 94)}
                alt={video.title || "Video thumbnail"}
                // Fallback image if the provided one fails
                onError={(e) => {
                  e.target.src = placeholderImage(168, 94);
                }}
              />

              {/* Text Content */}
              <ListItemText
                disableTypography // Allows using custom Typography components
                sx={{ flexGrow: 1, m: 0 }} // Allow text to take remaining space, remove default margin
                primary={
                  <Typography
                    variant="subtitle2" // Slightly bolder/larger than body2
                    fontWeight="medium" // Explicitly medium weight
                    color="text.primary"
                    sx={{
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2, // Limit title to 2 lines
                      WebkitBoxOrient: "vertical",
                      mb: 0.25, // Small margin below title
                    }}
                  >
                    {video.title || "Untitled Video"}
                  </Typography>
                }
                secondary={
                  <Box>
                    {" "}
                    {/* Container for secondary text lines */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block", // Ensure it takes its own line
                      }}
                    >
                      {video.author || "Unknown Author"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block", // Ensure it takes its own line
                      }}
                    >
                      {/* Format views and upload time/duration */}
                      {video.views ? `${video.views} views` : "No views"}
                      {video.views && (video.uploadTime || video.duration)
                        ? " • "
                        : ""}
                      {video.uploadTime || video.duration || ""}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RecommendedVideos;

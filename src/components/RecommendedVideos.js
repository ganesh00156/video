// src/components/RecommendedVideos.js
import React from "react";
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  CardMedia,
  useTheme,
} from "@mui/material";

/**
 * RecommendedVideos component displays a list of recommended videos using RouterLinks.
 */
const RecommendedVideos = ({ videos, currentVideoId }) => {
  // Removed onVideoSelect
  const theme = useTheme();

  // Filter out the current video and limit recommendations
  const recommended = videos
    .filter((video) => video && video.id !== currentVideoId && video.slug) // Ensure video and slug exist
    .slice(0, 15);

  if (recommended.length === 0) return null;

  // Placeholder image generator
  const placeholderImage = (width, height) =>
    `https://placehold.co/${width}x${height}/${theme.palette.background.paper.substring(
      1
    )}/${theme.palette.text.secondary.substring(1)}?text=Video`;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        gutterBottom
        color="text.primary"
        sx={{ mb: 2, fontWeight: 600, fontSize: "1.1rem" }}
      >
        More videos..
      </Typography>

      <List sx={{ p: 0 }}>
        {recommended.map((video) => (
          <ListItem key={video.id} disablePadding sx={{ mb: 1.5 }}>
            {/* Wrap the ListItemButton with RouterLink */}
            <RouterLink
              to={`/videos/${video.slug}`} // Link to the video player route using slug
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }} // Style link
            >
              <ListItemButton
                // onClick removed
                sx={{
                  p: 0,
                  display: "flex",
                  gap: 1.5,
                  borderRadius: 1,
                  alignItems: "flex-start",
                  width: "100%", // Ensure button takes full width of link
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                  "&:focus-visible": {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: "2px",
                  },
                }}
              >
                {/* Thumbnail */}
                <CardMedia
                  component="img"
                  sx={{
                    width: 168,
                    height: 94,
                    borderRadius: 1,
                    backgroundColor: theme.palette.action.disabledBackground,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                  image={video.thumbnailUrl || placeholderImage(168, 94)}
                  alt={video.title || "Video thumbnail"}
                  onError={(e) => {
                    e.target.src = placeholderImage(168, 94);
                  }}
                />

                {/* Text Content */}
                <ListItemText
                  disableTypography
                  sx={{ flexGrow: 1, m: 0 }}
                  primary={
                    <Typography
                      variant="subtitle2"
                      fontWeight="medium"
                      color="text.primary"
                      sx={{
                        fontSize: "0.9rem",
                        lineHeight: 1.4,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 0.25,
                      }}
                    >
                      {video.title || "Untitled Video"}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
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
                          display: "block",
                        }}
                      >
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
            </RouterLink>{" "}
            {/* Close RouterLink */}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RecommendedVideos;

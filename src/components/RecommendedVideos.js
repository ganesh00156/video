// src/RecommendedVideos.js
import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
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

  const recommended = videos
    .filter((video) => video && video.id !== currentVideoId)
    .slice(0, 15);

  if (recommended.length === 0) return null;

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
                gap: 1.5,
                borderRadius: 1,
                alignItems: "flex-start",
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
                  backgroundColor: "action.disabledBackground",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
                image={video.thumbnailUrl || placeholderImage(168, 94)}
                alt={video.title || "Video thumbnail"}
                onError={(e) => {
                  e.target.src = placeholderImage(168, 94);
                }}
              />

              {/* Text */}
              <ListItemText
                disableTypography
                sx={{ flexGrow: 1 }}
                primary={
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {video.title || "Untitled Video"}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                      }}
                    >
                      {video.views ? `${video.views} views` : "No views"}
                      {video.views && video.uploadTime ? " • " : ""}
                      {video.uploadTime || ""}
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

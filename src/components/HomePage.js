// src/components/HomePage.js
import React from "react";
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Grid,
  Typography,
  useTheme,
  Skeleton,
  Paper,
  Link, // Keep MUI Link for potential non-router links
} from "@mui/material";
import AdComponent from "./AdComponent";

// Placeholder image function (assuming it exists or is defined elsewhere)
const placeholderImage = (w, h, theme) =>
  `https://placehold.co/${w}x${h}/${
    theme.palette.mode === "dark" ? "212121" : "cccccc"
  }/${theme.palette.mode === "dark" ? "aaaaaa" : "555555"}?text=No+Thumb`;

// VideoCardSkeleton remains the same
const VideoCardSkeleton = () => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        width: "100%",
        height: 280,
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: theme.shadows[1],
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height={160}
        sx={{ bgcolor: "grey.700" }}
      />
      <Box sx={{ p: 1, height: 120, display: "flex", flexDirection: "column" }}>
        <Skeleton
          variant="text"
          animation="wave"
          width="90%"
          height={20}
          sx={{ mb: 0.5, bgcolor: "grey.700" }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          width="60%"
          height={20}
          sx={{ mb: 1, bgcolor: "grey.700" }}
        />
        <Box sx={{ mt: "auto" }}>
          <Skeleton
            variant="text"
            animation="wave"
            width="70%"
            height={15}
            sx={{ bgcolor: "grey.700" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="50%"
            height={15}
            sx={{ bgcolor: "grey.700" }}
          />
        </Box>
      </Box>
    </Card>
  );
};

const HomePage = ({ videos = [], loading = false }) => {
  // Removed onVideoSelect prop
  const theme = useTheme();
  const adSlotId = process.env.REACT_APP_ADSENSE_AD_SLOT_ID;
  const adFrequency = 8;
  const itemsWithAds = [];

  // --- Ad Insertion Logic ---
  if (!loading && videos.length > 0) {
    videos.forEach((video, index) => {
      // Ensure video and video.slug exist before pushing
      if (video && video.slug) {
        itemsWithAds.push({ type: "video", data: video });
        // Insert ad after every 'adFrequency' videos
        if ((index + 1) % adFrequency === 0) {
          itemsWithAds.push({ type: "ad", id: `ad-${index}` });
        }
      } else {
        console.warn("Skipping video due to missing data or slug:", video);
      }
    });
  }

  // --- Skeleton Loading ---
  if (loading) {
    return (
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
        {[...Array(12)].map((_, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            key={`skeleton-${index}`}
          >
            <VideoCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  // --- Render Videos and Ads ---
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
      {itemsWithAds.map((item) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          key={item.type === "video" ? item.data.id : item.id} // Use video ID for key
        >
          {item.type === "video" ? (
            // --- Video Card ---
            // Wrap the CardActionArea's content with RouterLink
            <Card
              sx={{
                width: "100%",
                height: 280,
                display: "flex",
                flexDirection: "column",
                borderRadius: 1,
                overflow: "hidden",
                backgroundColor: theme.palette.background.paper,
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              {/* Link wrapping the clickable area */}
              <RouterLink
                to={`/videos/${item.data.slug}`} // Link to the video player route using slug
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }} // Style link to behave like block
              >
                <CardActionArea
                  // onClick removed, navigation handled by RouterLink
                  disabled={!item.data?.id} // Keep disabled state if needed
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    p: 0,
                    // Focus style might need adjustment if Link wraps ActionArea
                    "&:focus-visible": {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: "1px",
                      boxShadow: theme.shadows[6],
                      borderRadius: 1,
                    },
                  }}
                >
                  {/* Thumbnail */}
                  <Box
                    sx={{
                      width: "100%",
                      height: 160,
                      backgroundImage: item.data?.thumbnailUrl
                        ? `url(${item.data.thumbnailUrl})`
                        : `url(${placeholderImage(320, 180, theme)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: theme.palette.action.disabledBackground,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  />

                  {/* Content */}
                  <Box
                    sx={{
                      p: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      height: 120,
                      overflow: "hidden",
                    }}
                  >
                    {/* Title */}
                    <Box sx={{ mb: 0.5, height: 42, overflow: "hidden" }}>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="text.primary"
                        title={item.data?.title || "Untitled Video"}
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.data?.title || "Untitled Video"}
                      </Typography>
                    </Box>
                    {/* Metadata */}
                    <Box sx={{ mt: "auto" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.data?.author || "Unknown Author"}
                        {item.data?.isLive && (
                          <Chip
                            label="LIVE"
                            color="error"
                            size="small"
                            sx={{
                              ml: 0.5,
                              height: 16,
                              fontSize: "0.6rem",
                              borderRadius: "4px",
                              verticalAlign: "middle",
                            }}
                          />
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.data?.views ? `${item.data.views} views` : ""}
                        {item.data?.views &&
                          (item.data?.uploadTime || item.data?.duration) &&
                          " • "}
                        {item.data?.uploadTime || item.data?.duration || ""}
                      </Typography>
                    </Box>
                  </Box>
                </CardActionArea>
              </RouterLink>{" "}
              {/* Close RouterLink */}
            </Card>
          ) : (
            // --- Ad Component Rendering ---
            <Paper
              elevation={0}
              sx={{
                height: 280,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: 2,
                border: `1px dashed ${theme.palette.divider}`,
              }}
            >
              <AdComponent
                adSlotId={adSlotId}
                sx={{ height: "100%", width: "100%" }}
              />
            </Paper>
          )}
        </Grid>
      ))}
      {/* No videos messages */}
      {!loading && itemsWithAds.length === 0 && (
        <Grid item xs={12}>
          <Typography
            sx={{ p: 3, textAlign: "center", color: "text.secondary", mt: 4 }}
          >
            {videos.length > 0
              ? "No videos match your search criteria."
              : "No videos found."}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default HomePage;

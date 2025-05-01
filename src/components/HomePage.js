import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Grid,
  Typography,
  useTheme,
  Skeleton,
  Paper, // Import Paper for the ad container
} from "@mui/material";
import AdComponent from "./AdComponent"; // Import the AdComponent

const placeholderImage = (w, h) =>
  `https://via.placeholder.com/${w}x${h}?text=No+Thumbnail`;

// VideoCardSkeleton remains the same
const VideoCardSkeleton = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: "100%",
        height: 280, // Match video card height
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: theme.shadows[1],
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Thumbnail skeleton */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height={160} // Match video thumbnail height
        sx={{ bgcolor: "grey.700" }} // Darker skeleton for dark mode
      />

      {/* Content skeleton */}
      <Box sx={{ p: 1, height: 120, display: "flex", flexDirection: "column" }}>
        {" "}
        {/* Match video content height */}
        {/* Title skeleton - two lines */}
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
        {/* Push metadata to bottom */}
        <Box sx={{ mt: "auto" }}>
          {/* Author skeleton */}
          <Skeleton
            variant="text"
            animation="wave"
            width="70%"
            height={15}
            sx={{ bgcolor: "grey.700" }}
          />

          {/* Views/time skeleton */}
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

// Renamed HomePage to VideoGrid (as it primarily renders the grid)
// If HomePage had other elements, keep the name and integrate the grid logic
const VideoGrid = ({ videos = [], loading = false, onVideoSelect }) => {
  const theme = useTheme();
  const adSlotId = process.env.REACT_APP_ADSENSE_AD_SLOT_ID; // Get the specific slot ID for this page

  // --- Ad Insertion Logic ---
  // Determine where to insert ads. Example: after every 8 videos.
  const adFrequency = 8;
  const itemsWithAds = [];

  if (!loading && videos.length > 0) {
    videos.forEach((video, index) => {
      itemsWithAds.push({ type: "video", data: video });
      // Insert an ad after every 'adFrequency' videos
      if ((index + 1) % adFrequency === 0) {
        itemsWithAds.push({ type: "ad", id: `ad-${index}` });
      }
    });
  }
  // --- End Ad Insertion Logic ---

  // --- Skeleton Loading ---
  if (loading) {
    return (
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
        {" "}
        {/* Consistent spacing */}
        {[...Array(12)].map(
          (
            _,
            index // Show more skeletons initially
          ) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              key={`skeleton-${index}`}
            >
              {" "}
              {/* Consistent grid sizing */}
              <VideoCardSkeleton />
            </Grid>
          )
        )}
      </Grid>
    );
  }

  // --- Render Videos and Ads ---
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
      {" "}
      {/* Consistent spacing */}
      {itemsWithAds.map((item) => (
        <Grid
          item
          xs={12} // Ad takes full width on mobile
          sm={6} // Ad takes half width on small screens
          md={4} // Ad takes third width on medium
          lg={3} // Ad takes quarter width on large
          xl={2} // Ad takes sixth width on extra large
          key={item.type === "video" ? item.data?.id || Math.random() : item.id}
        >
          {item.type === "video" ? (
            // --- Video Card Rendering (Copied from original HomePage) ---
            <Card
              sx={{
                width: "100%",
                height: 280, // Fixed height for all cards
                display: "flex",
                flexDirection: "column",
                borderRadius: 1, // Use theme.shape.borderRadius for consistency? (Original used 2)
                overflow: "hidden",
                // boxShadow: theme.shadows[1], // Subtle shadow
                backgroundColor: theme.palette.background.paper, // Use paper background
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardActionArea
                onClick={() => item.data?.id && onVideoSelect(item.data.id)}
                disabled={!item.data?.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 0, // No padding on action area itself
                  // Remove hover effects from here, apply to Card sx
                  "&:focus-visible": {
                    // Keep focus style
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: "1px",
                    boxShadow: theme.shadows[6], // Add shadow on focus too
                    borderRadius: 1, // Match card border radius
                  },
                }}
              >
                {/* Thumbnail */}
                <Box
                  sx={{
                    width: "100%",
                    height: 160, // Fixed height for thumbnail
                    backgroundImage: item.data?.thumbnailUrl
                      ? `url(${item.data.thumbnailUrl})`
                      : `url(${placeholderImage(320, 180)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: theme.palette.action.disabledBackground, // Fallback color
                    borderBottom: `1px solid ${theme.palette.divider}`, // Separator
                  }}
                />

                {/* Content */}
                <Box
                  sx={{
                    p: 1.5, // Slightly more padding
                    display: "flex",
                    flexDirection: "column",
                    height: 120, // Fixed height for content area (280 total - 160 thumbnail)
                    overflow: "hidden", // Prevent content expansion
                  }}
                >
                  {/* Title */}
                  <Box sx={{ mb: 0.5, height: 42, overflow: "hidden" }}>
                    {" "}
                    {/* Fixed height for title area (approx 2 lines) */}
                    <Typography
                      variant="body1" // Use body1 as per theme definition
                      fontWeight="medium" // Make title slightly bolder
                      color="text.primary"
                      title={item.data?.title || "Untitled Video"}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.4, // Adjust line height if needed
                      }}
                    >
                      {item.data?.title || "Untitled Video"}
                    </Typography>
                  </Box>

                  {/* Metadata pushed to bottom */}
                  <Box sx={{ mt: "auto" }}>
                    {/* Author/channel info */}
                    <Typography
                      variant="body2" // Use body2 as per theme
                      color="text.secondary"
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.3, // Adjust line height
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

                    {/* Views and time info */}
                    <Typography
                      variant="body2" // Use body2 as per theme
                      color="text.secondary"
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.3, // Adjust line height
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
            </Card>
          ) : (
            // --- Ad Component Rendering ---
            <Paper
              elevation={0} // No shadow, blend with background
              sx={{
                height: 280, // Match the height of the video cards
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden", // Hide overflow
                borderRadius: 2, // Match card border radius
                // backgroundColor: theme.palette.action.hover, // Subtle background
                border: `1px dashed ${theme.palette.divider}`, // Dashed border for ad slot indication
              }}
            >
              <AdComponent
                adSlotId={adSlotId} // Pass the specific slot ID
                sx={{ height: "100%", width: "100%" }} // Ensure AdComponent tries to fill Paper
              />
            </Paper>
          )}
        </Grid>
      ))}
      {/* Message if no videos found (after filtering or initially) */}
      {!loading && itemsWithAds.length === 0 && videos.length === 0 && (
        <Grid item xs={12}>
          <Typography
            sx={{ p: 3, textAlign: "center", color: "text.secondary", mt: 4 }}
          >
            No videos found.
          </Typography>
        </Grid>
      )}
      {/* Message if videos exist but were filtered out by search */}
      {!loading && itemsWithAds.length === 0 && videos.length > 0 && (
        <Grid item xs={12}>
          <Typography
            sx={{ p: 3, textAlign: "center", color: "text.secondary", mt: 4 }}
          >
            No videos match your search criteria.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

// Export the component (ensure it's exported correctly)
// If your original file was named HomePage.js and exported HomePage, keep that.
// If it was VideoGrid.js, export VideoGrid.
export default VideoGrid; // Assuming the component should be named VideoGrid now
// or export default HomePage; if you kept the original name

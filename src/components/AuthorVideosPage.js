// src/AuthorVideosPage.js
import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  CardActionArea,
  Chip,
  useTheme,
  Container,
  Button,
} from "@mui/material"; // Import Button
import PersonIcon from "@mui/icons-material/Person"; // Icon for the author page title
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import Back Icon

// Helper function for placeholder image (ensure theme is passed)
const placeholderImage = (width, height, theme) =>
  `https://placehold.co/${width}x${height}/${
    theme.palette.mode === "dark" ? "212121" : "cccccc"
  }/${theme.palette.mode === "dark" ? "aaaaaa" : "555555"}?text=Video`;

/**
 * AuthorVideosPage component displays videos created by a specific author.
 * Includes a back button to return to the authors list.
 * Uses the exact video card styling from CategoryPage.
 *
 * @param {object} props - Component props.
 * @param {string} props.authorName - The name of the author whose videos are being displayed.
 * @param {Array} props.videos - Array of video objects filtered for this author.
 * @param {function} props.onVideoSelect - Callback function when a video card is clicked.
 * @param {function} props.onBack - Callback function to navigate back to the previous page (Authors list).
 */
const AuthorVideosPage = ({ authorName, videos, onVideoSelect, onBack }) => {
  // Add onBack prop
  const theme = useTheme(); // Still need theme for other parts like primary color and shadows

  return (
    // Using Container for consistent padding and max-width
    <Container maxWidth="xl" sx={{ pt: 2, pb: 4 }}>
      {" "}
      {/* Add some padding */}
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack} // Use the onBack prop here
        sx={{
          mb: 2, // Margin below the button
          color: "text.secondary",
          alignSelf: "flex-start", // Align button to the start
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        Back to Authors
      </Button>
      {/* Page Title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 3 } }}>
        <PersonIcon
          sx={{
            mr: 1.5,
            fontSize: { xs: "1.8rem", sm: "2rem" },
            color: "primary.main",
          }}
        />
        <Typography
          variant="h4"
          component="h1"
          color="text.primary"
          fontWeight="medium"
        >
          Videos by {authorName || "Author"}
        </Typography>
      </Box>
      {/* Video Grid */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          {videos.length > 0 ? (
            videos.map((video) => (
              // Grid item for each video card
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={video?.id || Math.random()}
              >
                {/* Apply the EXACT styling from CategoryPage.js example */}
                <CardActionArea
                  onClick={() => video?.id && onVideoSelect(video.id)}
                  disabled={!video?.id}
                  sx={{
                    display: "block",
                    borderRadius: 2, // Use explicit value 2 as per example
                    overflow: "hidden",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    height: "100%", // Ensure area fills the grid item height
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[6], // Use theme shadow value
                    },
                    "&:focus-visible": {
                      // Accessibility focus style
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: "2px",
                      boxShadow: theme.shadows[6], // Use theme shadow value
                    },
                  }}
                >
                  {/* Apply the EXACT styling from CategoryPage.js example */}
                  <Card
                    sx={{
                      height: "100%", // Make card fill the action area
                      display: "flex",
                      flexDirection: "column", // Stack media and content vertically
                      bgcolor: theme.palette.background.paper, // Use paper background
                      boxShadow: "none", // No shadow by default (action area handles hover shadow)
                      borderRadius: 2, // Use explicit value 2 as per example
                    }}
                  >
                    {/* Video Thumbnail */}
                    <CardMedia
                      component="div" // Use div for background image approach
                      sx={{
                        aspectRatio: "16/9", // Maintain video aspect ratio
                        backgroundImage: video?.thumbnailUrl
                          ? `url(${video.thumbnailUrl})`
                          : `url(${placeholderImage(320, 180, theme)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        // Fallback background color if image fails
                        backgroundColor:
                          theme.palette.action.disabledBackground,
                      }}
                    />
                    {/* Video Details */}
                    <Box sx={{ p: 1.5, flexGrow: 1 }}>
                      {" "}
                      {/* Add padding and allow growth */}
                      <Typography
                        variant="body1" // Slightly larger for title
                        fontWeight="medium" // Medium weight for title
                        color="text.primary"
                        title={video?.title || "Untitled Video"} // Tooltip for long titles
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitLineClamp: 2, // Limit to 2 lines
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.4,
                          minHeight: "2.8em", // Reserve space for 2 lines
                          mb: 0.5, // Margin below title
                        }}
                      >
                        {video?.title || "Untitled Video"}
                      </Typography>
                      {/* Author name is redundant here, show views/time */}
                      <Typography
                        variant="body2" // Standard body2 for views/time
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap", // Prevent wrapping
                        }}
                      >
                        {video?.views ? `${video.views} views` : "No views"}
                        {" • "}
                        {video?.uploadTime || video?.duration || ""}
                        {/* Display LIVE chip if applicable */}
                        {video?.isLive && (
                          <Chip
                            label="LIVE"
                            color="error"
                            size="small"
                            sx={{
                              ml: 0.5,
                              fontSize: "0.65rem",
                              height: "18px",
                              verticalAlign: "middle",
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                  </Card>
                </CardActionArea>
              </Grid>
            ))
          ) : (
            // Message shown if no videos are found for the author
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="text.secondary"
                align="center"
                sx={{ mt: 5, p: 3 }}
              >
                No videos found for {authorName || "this author"}.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default AuthorVideosPage;

// src/components/AuthorVideosPage.js
import React, { useMemo } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom"; // Import hooks
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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { slugify } from "../utils/slugify"; // Import slugify

// Helper function for placeholder image
const placeholderImage = (width, height, theme) =>
  `https://placehold.co/${width}x${height}/${
    theme.palette.mode === "dark" ? "212121" : "cccccc"
  }/${theme.palette.mode === "dark" ? "aaaaaa" : "555555"}?text=Video`;

/**
 * AuthorVideosPage component displays videos by a specific author, using slugs.
 */
const AuthorVideosPage = ({ allVideos = [] }) => {
  // Removed onVideoSelect, onBack. Receives allVideos.
  const theme = useTheme();
  const { authorSlug } = useParams(); // Get author slug from URL
  const navigate = useNavigate(); // Hook for navigation

  // Find author name and filter videos based on the slug
  // This requires comparing the URL slug with slugs generated from author names
  const { authorName, authorVideos } = useMemo(() => {
    if (!authorSlug || !Array.isArray(allVideos))
      return { authorName: null, authorVideos: [] };

    let foundName = null;
    const filtered = allVideos.filter((video) => {
      const currentAuthorSlug = slugify(video?.author || "");
      if (currentAuthorSlug === authorSlug) {
        if (!foundName) foundName = video.author; // Capture the author name from the first match
        return true;
      }
      return false;
    });
    return { authorName: foundName, authorVideos: filtered };
  }, [authorSlug, allVideos]);

  return (
    <Container maxWidth="xl" sx={{ pt: 2, pb: 4 }}>
      {/* Back Button using navigate */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/authors")} // Navigate back to the authors list
        sx={{
          mb: 2,
          color: "text.secondary",
          alignSelf: "flex-start",
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
          {authorVideos.length > 0 ? (
            authorVideos.map((video) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={video?.id || Math.random()}
              >
                {/* Wrap CardActionArea content with RouterLink */}
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: theme.palette.background.paper,
                    boxShadow: "none",
                    borderRadius: 1,
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <RouterLink
                    to={`/videos/${video.slug}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <CardActionArea
                      // onClick removed
                      disabled={!video?.id}
                      sx={{
                        display: "flex", // Changed from block
                        flexDirection: "column",
                        height: "100%", // Ensure it fills the Card
                        borderRadius: 0, // Reset radius if Card has it
                        "&:focus-visible": {
                          outline: `2px solid ${theme.palette.primary.main}`,
                          outlineOffset: "2px",
                          boxShadow: theme.shadows[6],
                        },
                      }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          aspectRatio: "16/9",
                          width: "100%",
                          backgroundImage: video?.thumbnailUrl
                            ? `url(${video.thumbnailUrl})`
                            : `url(${placeholderImage(320, 180, theme)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundColor:
                            theme.palette.action.disabledBackground,
                        }}
                      />
                      <Box
                        sx={{
                          p: 1.5,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color="text.primary"
                          title={video?.title || "Untitled Video"}
                          sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                            minHeight: "2.8em",
                            mb: 0.5,
                          }}
                        >
                          {video?.title || "Untitled Video"}
                        </Typography>
                        {/* Metadata pushed to bottom */}
                        <Box sx={{ mt: "auto" }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {video?.views ? `${video.views} views` : "No views"}
                            {" • "}
                            {video?.uploadTime || video?.duration || ""}
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
                      </Box>
                    </CardActionArea>
                  </RouterLink>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="text.secondary"
                align="center"
                sx={{ mt: 5, p: 3 }}
              >
                {authorName
                  ? `No videos found for ${authorName}.`
                  : "Author not found."}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default AuthorVideosPage;

// src/components/CategoryPage.js
import React, { useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom"; // Import useParams and RouterLink
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
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
// Assuming slugify is available if needed, but App.js provides category object now
// import { slugify } from '../utils/slugify';

// Helper function for placeholder image
const placeholderImage = (width, height, theme) =>
  `https://placehold.co/${width}x${height}/${
    theme.palette.mode === "dark" ? "212121" : "cccccc"
  }/${theme.palette.mode === "dark" ? "aaaaaa" : "555555"}?text=Video`;

// Component receives allVideos and categories list from App.js
const CategoryPage = ({ allVideos = [], categories = [] }) => {
  // Removed onVideoSelect
  const theme = useTheme();
  const { categorySlug } = useParams(); // Get category slug from URL

  // Find the category name from the slug (using the list passed from App)
  const currentCategory = useMemo(() => {
    return categories.find((cat) => cat.slug === categorySlug);
  }, [categorySlug, categories]);

  // Filter videos for the current category slug
  const categoryVideos = useMemo(() => {
    if (!categorySlug || !Array.isArray(allVideos)) return [];
    // Match based on category name (assuming category names are consistent)
    // Or better: Filter based on a slugified category name if available on video object
    // For now, let's assume we filter based on the found category name
    if (!currentCategory) return []; // No category found for this slug
    return allVideos.filter(
      (video) =>
        video?.category?.trim().toLowerCase() ===
        currentCategory.name.toLowerCase()
    );
  }, [categorySlug, allVideos, currentCategory]);

  const displayCategoryName = currentCategory
    ? currentCategory.name // Use the original name for display
    : "Category";

  return (
    <Container maxWidth="xl" sx={{ pt: 2, pb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 3 } }}>
        <CategoryIcon
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
          {displayCategoryName} Videos
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          {categoryVideos.length > 0 ? (
            categoryVideos.map((video) => (
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
                        // overflow: "hidden", // Handled by Card
                        // transition: "none", // Handled by Card
                        // '&:hover': { transform: 'none', boxShadow: 'none' }, // Handled by Card
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
                        {" "}
                        {/* Ensure content box grows */}
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
                            {video?.author || "Unknown Author"}
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
                {currentCategory
                  ? `No videos found in the "${displayCategoryName}" category.`
                  : "Category not found."}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default CategoryPage;

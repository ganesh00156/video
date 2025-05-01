// src/CategoryPage.js
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
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";

// Helper function for placeholder image
const placeholderImage = (width, height, theme) =>
  `https://placehold.co/${width}x${height}/${
    theme.palette.mode === "dark" ? "212121" : "cccccc"
  }/${theme.palette.mode === "dark" ? "aaaaaa" : "555555"}?text=Video`;

const CategoryPage = ({ categoryName, videos, onVideoSelect }) => {
  const theme = useTheme();

  const displayCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
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
          {videos.length > 0 ? (
            videos.map((video) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={video?.id || Math.random()}
              >
                <CardActionArea
                  onClick={() => video?.id && onVideoSelect(video.id)}
                  disabled={!video?.id}
                  sx={{
                    display: "block",
                    borderRadius: 0, // Less rounded corners
                    overflow: "hidden",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[6],
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: "2px",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: theme.palette.background.paper,
                      boxShadow: "none",
                      borderRadius: 1, // Match border radius
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        aspectRatio: "16/9",
                        backgroundImage: video?.thumbnailUrl
                          ? `url(${video.thumbnailUrl})`
                          : `url(${placeholderImage(320, 180, theme)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor:
                          theme.palette.action.disabledBackground,
                      }}
                    />
                    <Box sx={{ p: 1.5, flexGrow: 1 }}>
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
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
                  </Card>
                </CardActionArea>
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
                No videos found in the "{displayCategoryName}" category.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default CategoryPage;

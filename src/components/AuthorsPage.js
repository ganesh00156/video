// src/components/AuthorsPage.js
import React, { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  CircularProgress,
  useTheme,
  CardActionArea,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { slugify } from "../utils/slugify"; // Import slugify

/**
 * AuthorsPage component displays a grid of author cards linking to their videos.
 */
const AuthorsPage = ({ videos }) => {
  // Removed onAuthorSelect
  const theme = useTheme();

  // Calculate author counts and add slugs
  const authorsData = useMemo(() => {
    if (!Array.isArray(videos)) return null;
    if (videos.length === 0) return [];

    const counts = {};
    videos.forEach((video) => {
      if (video?.author) {
        const authorName = video.author.trim();
        if (authorName) {
          counts[authorName] = (counts[authorName] || 0) + 1;
        }
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        slug: slugify(name), // Generate slug for each author
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
  }, [videos]);

  // Loading State
  if (authorsData === null) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 128px)",
          py: 5,
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Loading authors...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
      {/* Page Title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 4 } }}>
        <PeopleIcon
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
          Authors
        </Typography>
      </Box>

      {authorsData.length > 0 ? (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {authorsData.map((author) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={author.slug}>
              {" "}
              {/* Use slug as key */}
              {/* Wrap CardActionArea content with RouterLink */}
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                  boxShadow: "none",
                  // borderRadius: theme.shape.borderRadius,
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  "&:hover": {
                    boxShadow: theme.shadows[6],
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <RouterLink
                  to={`/authors/${author.slug}`} // Link to author videos page using slug
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
                    sx={{
                      // borderRadius: theme.shape.borderRadius,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column", // Ensure content direction is column
                      // transition: "none", // Handled by Card
                      // '&:hover': { boxShadow: 'none', transform: 'none' }, // Handled by Card
                      "&:focus-visible": {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: "2px",
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: "center",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: { xs: 2, sm: 3 },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: { xs: 56, sm: 64 },
                          height: { xs: 56, sm: 64 },
                          bgcolor: "secondary.main",
                          color: theme.palette.getContrastText(
                            theme.palette.secondary.main
                          ),
                          fontSize: { xs: "1.6rem", sm: "1.8rem" },
                          mb: 2,
                        }}
                      >
                        {author.name ? (
                          author.name.charAt(0).toUpperCase()
                        ) : (
                          <AccountCircleIcon fontSize="inherit" />
                        )}
                      </Avatar>
                      <Typography
                        variant="h6"
                        component="div"
                        color="text.primary"
                        fontWeight="medium"
                        gutterBottom
                        sx={{ wordBreak: "break-word" }}
                      >
                        {author.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {author.count} {author.count === 1 ? "video" : "videos"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </RouterLink>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          sx={{ p: 3, textAlign: "center", color: "text.secondary", mt: 4 }}
        >
          No author information found.
        </Typography>
      )}
    </Container>
  );
};

export default AuthorsPage;

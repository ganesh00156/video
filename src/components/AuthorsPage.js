// src/AuthorsPage.js
import React, { useMemo } from "react";
import {
  Container,
  Typography,
  Grid, // Use Grid for card layout
  Card, // Use Card for each author
  CardContent, // Structure content within the card
  Avatar,
  Box,
  CircularProgress,
  useTheme,
  CardActionArea, // Import CardActionArea to make cards clickable
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People"; // Icon for the page title
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Fallback avatar

/**
 * AuthorsPage component displays a grid of cards for unique authors
 * from the video data, showing their name and video count.
 * Cards are clickable to navigate to the author's video list.
 *
 * @param {object} props - Component props.
 * @param {Array} props.videos - The array of all video objects.
 * @param {function} props.onAuthorSelect - Callback function when an author card is clicked.
 */
const AuthorsPage = ({ videos, onAuthorSelect }) => {
  const theme = useTheme();

  // Calculate author counts (same logic as before)
  const authorCounts = useMemo(() => {
    if (!Array.isArray(videos)) {
      return null;
    }
    if (videos.length === 0) {
      return [];
    }
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
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
  }, [videos]);

  // Loading State
  if (authorCounts === null) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 128px)", // Ensure it takes height
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
      {" "}
      {/* Add padding */}
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
      {authorCounts.length > 0 ? (
        // Grid container for the author cards
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {authorCounts.map((author) => (
            // Grid item for each card (responsive sizing)
            <Grid item xs={12} sm={6} md={4} lg={3} key={author.name}>
              {/* Wrap Card in CardActionArea to make it clickable */}
              <CardActionArea
                onClick={() => onAuthorSelect(author.name)} // Call onAuthorSelect with the author's name
                sx={{
                  borderRadius: theme.shape.borderRadius, // Apply border radius to the action area
                  height: "100%", // Ensure action area fills the grid item height
                  display: "flex", // Ensure card inside fills the area
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  "&:hover": {
                    boxShadow: theme.shadows[6], // Enhance shadow on hover
                    transform: "translateY(-3px)", // Slight lift effect
                  },
                  "&:focus-visible": {
                    // Accessibility focus style
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: "2px",
                    boxShadow: theme.shadows[6], // Add shadow on focus as well
                  },
                }}
              >
                <Card
                  sx={{
                    width: "100%", // Make card fill the action area width
                    height: "100%", // Ensure cards in the same row have equal height
                    display: "flex",
                    flexDirection: "column", // Stack content vertically
                    bgcolor: "background.paper", // Use paper background
                    boxShadow: "none", // Remove default card shadow, handled by CardActionArea hover/focus
                  }}
                  elevation={0} // Set elevation to 0 as CardActionArea handles hover effect
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      flexGrow: 1, // Allow content to grow
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center", // Center content vertically
                      p: { xs: 2, sm: 3 }, // Responsive padding
                    }}
                  >
                    {/* Avatar Placeholder */}
                    <Avatar
                      sx={{
                        width: { xs: 56, sm: 64 }, // Responsive avatar size
                        height: { xs: 56, sm: 64 },
                        bgcolor: "secondary.main", // Use theme color
                        color: theme.palette.getContrastText(
                          theme.palette.secondary.main
                        ), // Ensure text contrasts
                        fontSize: { xs: "1.6rem", sm: "1.8rem" }, // Responsive font size
                        mb: 2, // Margin below avatar
                      }}
                    >
                      {/* Display first letter of author name */}
                      {author.name ? (
                        author.name.charAt(0).toUpperCase()
                      ) : (
                        <AccountCircleIcon fontSize="inherit" /> // Inherit size
                      )}
                    </Avatar>
                    {/* Author Name */}
                    <Typography
                      variant="h6" // Use h6 for author name
                      component="div" // Use div as it's within CardContent
                      color="text.primary"
                      fontWeight="medium"
                      gutterBottom // Adds margin below
                      sx={{ wordBreak: "break-word" }} // Prevent long names overflowing
                    >
                      {author.name}
                    </Typography>
                    {/* Video Count */}
                    <Typography variant="body2" color="text.secondary">
                      {author.count} {author.count === 1 ? "video" : "videos"}
                    </Typography>
                  </CardContent>
                  {/* Removed CardActions as the whole card is clickable */}
                </Card>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Message if no authors are found
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

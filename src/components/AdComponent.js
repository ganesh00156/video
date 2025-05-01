// src/components/AdComponent.js
import React, { useEffect } from "react";
import { Box, Typography, Paper, useTheme, alpha } from "@mui/material";

/**
 * AdComponent renders a Google AdSense ad unit.
 * It fetches the client ID and ad slot ID from environment variables.
 *
 * @param {object} props - Component props.
 * @param {string} props.adSlotId - The specific ad slot ID for this unit (overrides default if provided).
 * @param {object} props.sx - Custom styles to apply to the ad container.
 * @param {string} [props.adFormat="auto"] - Ad format (e.g., "auto", "rectangle", "vertical"). Defaults to "auto".
 * @param {boolean} [props.responsive=true] - Whether the ad unit is responsive. Defaults to true.
 */
const AdComponent = ({
  adSlotId,
  sx,
  adFormat = "auto",
  responsive = true,
}) => {
  const theme = useTheme();
  // Retrieve AdSense details from environment variables
  const clientId = process.env.REACT_APP_ADSENSE_CLIENT_ID;
  // Use the provided adSlotId prop or fall back to the general one from .env
  const slotId = adSlotId || process.env.REACT_APP_ADSENSE_AD_SLOT_ID;

  useEffect(() => {
    // Check if the AdSense script has loaded (window.adsbygoogle)
    // and if we have the necessary IDs
    if (clientId && slotId) {
      try {
        // Push the ad request to Google
        // Ensure adsbygoogle array exists before pushing
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log(`AdSense: Pushing ad for slot ${slotId}`);
      } catch (e) {
        console.error("AdSense Error: Failed to push ad request.", e);
      }
    } else {
      if (!clientId)
        console.warn(
          "AdSense Warning: REACT_APP_ADSENSE_CLIENT_ID is not set in .env"
        );
      if (!slotId)
        console.warn(
          "AdSense Warning: Ad Slot ID is missing (check REACT_APP_ADSENSE_AD_SLOT_ID in .env or adSlotId prop)."
        );
    }
    // Dependency array includes slotId to re-run if the slot changes
  }, [clientId, slotId]);

  // If client ID or slot ID is missing, render a placeholder/message
  if (!clientId || !slotId) {
    return (
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100px", // Give it some minimum size
          height: "100%",
          width: "100%",
          textAlign: "center",
          p: 2,
          borderColor: "warning.main",
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          ...sx, // Apply custom styles
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Ad Placeholder
          <br />
          {!clientId && "Client ID missing "}
          {!slotId && "Slot ID missing"}
        </Typography>
      </Paper>
    );
  }

  // Render the AdSense ad unit tag
  return (
    <Box
      component="ins"
      className="adsbygoogle" // Required class for AdSense
      sx={{
        display: "block", // Ads need to be block elements
        textAlign: "center", // Center ad content if needed
        minHeight: "100px", // Minimum height to prevent collapse before ad loads
        backgroundColor: theme.palette.action.hover, // Placeholder background
        width: "100%", // Take full width of the container
        height: "100%", // Take full height if container allows
        ...sx, // Apply any custom styles passed via props
      }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format={adFormat}
      data-full-width-responsive={responsive ? "true" : "false"} // Use string 'true'/'false'
    ></Box>
  );
};

export default AdComponent;

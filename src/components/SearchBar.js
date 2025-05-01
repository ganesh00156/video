import React, { useState } from "react";
import { TextField, List, ListItem, Paper } from "@mui/material";

const SearchBar = ({ videoTitles, onSearch }) => {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputText(value);

    if (value.trim() !== "") {
      const filtered = videoTitles.filter((title) =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (title) => {
    setInputText(title);
    setSuggestions([]);
    onSearch(title);
  };

  // CSS animation for the pulsing white border
  const pulsingBorder = `
    @keyframes pulseBorder {
      0% { box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.7); }
      50% { box-shadow: 0 0 0 2px rgba(255, 255, 255, 1); }
      100% { box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.7); }
    }
  `;

  return (
    <div style={{ position: "relative" }}>
      <style>{pulsingBorder}</style>
      <TextField
        fullWidth
        label="Search videos..."
        variant="outlined"
        value={inputText}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        InputProps={{
          sx: {
            borderRadius: 1,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            animation: isFocused ? "pulseBorder 1.5s infinite" : "none",
            "&:hover": {
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.5)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.5) !important",
            },
          },
        }}
        style={{
          margin: "10px 0 0",
        }}
      />
      {suggestions.length > 0 && (
        <Paper
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <List>
            {suggestions.map((title, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSuggestionClick(title)}
                sx={{
                  "&:hover": {
                    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.7)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                  borderBottom:
                    index < suggestions.length - 1
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "none",
                }}
              >
                {title}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default SearchBar;

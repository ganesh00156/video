// src/utils/slugify.js

/**
 * Converts a string into a URL-friendly slug.
 * - Converts to lowercase
 * - Removes special characters
 * - Replaces spaces with hyphens
 * - Trims leading/trailing hyphens
 *
 * @param {string} text The string to slugify.
 * @returns {string} The generated slug.
 */
export const slugify = (text) => {
  if (!text) return ""; // Handle null or empty input

  return text
    .toString() // Ensure input is a string
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove non-word characters (excluding spaces and hyphens)
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // Trim leading hyphens
    .replace(/-+$/, ""); // Trim trailing hyphens
};

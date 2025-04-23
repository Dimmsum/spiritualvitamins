/**
 * Converts a string to a URL-friendly slug
 * @param {string} text The text to convert to a slug
 * @returns {string} URL-friendly slug
 */
export function generateSlug(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/&/g, '-and-')      // Replace & with 'and'
      .replace(/[^\w-]+/g, '')     // Remove all non-word characters
      .replace(/--+/g, '-')        // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
  }
  
  /**
   * Gets the post ID from the URL parameters
   * This handles both new-style URLs with slugs and old-style URLs with just IDs
   * @param {object} params URL parameters from useParams()
   * @returns {string} The post ID
   */
  export function getPostIdFromParams(params) {
    // Just return the id parameter
    return params.id;
  }
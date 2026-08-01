// src/theme.js
export const getThemeStyles = (isDarkMode) => ({
  background: isDarkMode ? '#1a1a2e' : '#ffffff',
  text: isDarkMode ? '#e0e0e0' : '#2c3e50',
  cardBg: isDarkMode ? '#16213e' : '#f4f4f4',
  border: isDarkMode ? '#444' : '#ddd',
  shadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)',
  // ... extend as needed
});
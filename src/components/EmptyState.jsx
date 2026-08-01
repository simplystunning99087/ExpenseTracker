// src/components/EmptyState.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const EmptyState = () => {
  const { isDarkMode } = useTheme();

  const containerStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    borderRadius: '10px',
    background: isDarkMode ? '#1a1a2e' : '#f8f9fa',
    border: `1px dashed ${isDarkMode ? '#444' : '#ddd'}`,
    marginTop: '20px'
  };

  const iconStyle = {
    fontSize: '48px',
    marginBottom: '15px'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: isDarkMode ? '#e0e0e0' : '#2c3e50',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: isDarkMode ? '#aaa' : '#888',
    marginBottom: '20px'
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>💰</div>
      <h3 style={titleStyle}>No transactions yet</h3>
      <p style={subtitleStyle}>
        Start tracking your expenses by adding your first transaction above!
      </p>
      <p style={{ fontSize: '14px', color: isDarkMode ? '#777' : '#aaa' }}>
        💡 Tip: Use negative amounts for expenses, positive for income.
      </p>
    </div>
  );
};
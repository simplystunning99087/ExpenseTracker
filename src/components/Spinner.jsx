// src/components/Spinner.jsx
import React from 'react';

export const Spinner = ({ size = 40, color = '#3498db' }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: size,
        height: size,
        border: `4px solid ${color}20`,
        borderTop: `4px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export const FullPageSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
      gap: '20px'
    }}>
      <Spinner size={60} color="#3498db" />
      <p style={{ color: '#888', fontSize: '16px' }}>Loading your transactions...</p>
    </div>
  );
};
// src/App.js
import React, { useState, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GlobalProvider, useGlobalContext } from './context/GlobalState';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Auth } from './components/Auth';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './App.module.css';
import { FullPageSpinner } from './components/Spinner';
import { BudgetProvider } from './context/BudgetContext';
import { BudgetManager } from './components/BudgetManager';


// Helper: Filter transactions by month
const filterTransactions = (transactions, filterType, customMonth) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let startDate, endDate;

  switch (filterType) {
    case 'thisMonth':
      startDate = new Date(currentYear, currentMonth, 1);
      endDate = new Date(currentYear, currentMonth + 1, 0);
      break;
    case 'lastMonth':
      startDate = new Date(currentYear, currentMonth - 1, 1);
      endDate = new Date(currentYear, currentMonth, 0);
      break;
    case 'custom':
      if (customMonth) {
        const [year, month] = customMonth.split('-').map(Number);
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
      } else {
        return transactions;
      }
      break;
    default:
      return transactions;
  }

  return transactions.filter(t => {
    const txDate = new Date(t.date);
    return txDate >= startDate && txDate <= endDate;
  });
};

const AppContent = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { transactions, loading: transactionsLoading } = useGlobalContext();
  const { isDarkMode, toggleTheme } = useTheme();
  const [filterType, setFilterType] = useState('all');
  const [customMonth, setCustomMonth] = useState('');

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filterType, customMonth);
  }, [transactions, filterType, customMonth]);

  // Show spinner while auth is loading
  if (authLoading) {
    return <FullPageSpinner />;
  }

  // Show auth screen if not logged in
  if (!user) {
    return <Auth />;
  }

  // Show spinner while transactions are loading
  if (transactionsLoading) {
    return (
      <div className={`${styles.container} ${isDarkMode ? styles.dark : styles.light}`}>
        <FullPageSpinner />
      </div>
    );
  }

  const exportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export! 📭');
      return;
    }
    let csv = 'Date,Description,Category,Amount\n';
    filteredTransactions.forEach(t => {
      csv += `${t.date},${t.text},${t.category},${t.amount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV downloaded! ✅');
  };

  // Dynamic classes for dark mode
  const containerClass = `${styles.container} ${isDarkMode ? styles.dark : styles.light}`;
  const filterBarClass = `${styles.filterBar} ${isDarkMode ? styles.dark : ''}`;
  const exportBtnClass = `${styles.exportBtn} ${isDarkMode ? styles.dark : ''}`;

  return (
    <div className={containerClass}>
      <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: isDarkMode ? '#1e1e2f' : '#ffffff',
          color: isDarkMode ? '#e0e0e0' : '#2c3e50',
          borderRadius: '8px',
          padding: '12px 20px',
          boxShadow: isDarkMode 
          ? '0 8px 30px rgba(0,0,0,0.5)' 
          : '0 8px 30px rgba(0,0,0,0.1)',
          border: `1px solid ${isDarkMode ? '#444' : '#e0e0e0'}`,
        },
        success: {
          style: {
            background: isDarkMode ? '#1a3a2a' : '#d4edda',
            color: isDarkMode ? '#8fdf8f' : '#155724',
            border: `1px solid ${isDarkMode ? '#2e7d32' : '#c3e6cb'}`,
          },
          icon: '✅',
        },
        error: {
          style: {
            background: isDarkMode ? '#3a1a1a' : '#f8d7da',
            color: isDarkMode ? '#f8a0a0' : '#721c24',
            border: `1px solid ${isDarkMode ? '#7d2e2e' : '#f5c6cb'}`,
          },
          icon: '❌',
        },
        }}
        />

      <div className={styles.header}>
        <h1>💰 Expense Tracker</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px' }}>👤 {user.email}</span>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            style={{
              color: isDarkMode ? '#f1c40f' : '#2c3e50',
              transition: 'transform 0.2s',
              background: 'transparent',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'rotate(20deg)'}
            onMouseLeave={(e) => e.target.style.transform = 'rotate(0deg)'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Logout Button */}
          <button
            onClick={signOut}
            style={{
              padding: '8px 16px',
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#c0392b';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#e74c3c';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className={filterBarClass}>
        <label className={styles.filterLabel}>Filter:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`${styles.filterSelect} ${isDarkMode ? styles.dark : ''}`}
        >
          <option value="all">All Time</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="custom">Custom Month</option>
        </select>
        {filterType === 'custom' && (
          <input
            type="month"
            value={customMonth}
            onChange={(e) => setCustomMonth(e.target.value)}
            className={`${styles.filterInput} ${isDarkMode ? styles.dark : ''}`}
          />
        )}
        <span className={styles.transactionCount}>
          ({filteredTransactions.length} transactions)
        </span>
      </div>

      <Dashboard transactions={filteredTransactions} />
      <TransactionForm />
      <TransactionList transactions={filteredTransactions} />

      <div className={styles.exportWrapper}>
        <button
          onClick={exportCSV}
          className={exportBtnClass}
          style={{
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          📥 Export Filtered CSV
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BudgetProvider> {/* 👈 Add this */}
          <GlobalProvider>
            <AppContent />
          </GlobalProvider>
          <BudgetManager />
        </BudgetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
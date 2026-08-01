// src/components/BudgetManager.jsx
import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Salary', 'Other'];

export const BudgetManager = () => {
  const { budgets, addBudget, deleteBudget } = useBudget();
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [amount, setAmount] = useState('');

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    await addBudget(selectedCategory, parseFloat(amount));
    setAmount('');
  };

  const handleDelete = async (id) => {
    await deleteBudget(id);
  };

  const containerStyle = {
    background: isDarkMode ? '#1a1a2e' : '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: isDarkMode 
      ? '0 2px 10px rgba(0,0,0,0.3)' 
      : '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const inputStyle = {
    padding: '10px',
    border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
    borderRadius: '5px',
    background: isDarkMode ? '#2d2d44' : '#fff',
    color: isDarkMode ? '#e0e0e0' : '#2c3e50',
    marginRight: '10px'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ color: isDarkMode ? '#e0e0e0' : '#2c3e50', marginTop: 0 }}>
        📊 Monthly Budgets
      </h3>

      <form onSubmit={handleSetBudget} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={inputStyle}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: '120px' }}
        />

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Set Budget
        </button>
      </form>

      {budgets.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h4 style={{ color: isDarkMode ? '#e0e0e0' : '#2c3e50' }}>Active Budgets</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {budgets.map(budget => (
              <li
                key={budget.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  marginBottom: '5px',
                  background: isDarkMode ? '#2d2d44' : '#f8f9fa',
                  borderRadius: '5px',
                  borderLeft: `3px solid #3498db`
                }}
              >
                <span style={{ color: isDarkMode ? '#e0e0e0' : '#2c3e50' }}>
                  {budget.category}: <strong>${budget.amount}</strong>
                </span>
                <button
                  onClick={() => handleDelete(budget.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e74c3c',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
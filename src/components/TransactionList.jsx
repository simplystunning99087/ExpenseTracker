// src/components/TransactionList.jsx
import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalState';
import { useTheme } from '../context/ThemeContext'; // 👈 add this
import { EmptyState } from './EmptyState';
import { EditModal } from './EditModal';

export const TransactionList = ({ transactions: propTransactions }) => {
  const { 
    transactions: contextTransactions, 
    deleteTransaction, 
    updateTransaction 
  } = useGlobalContext();
  const { isDarkMode } = useTheme(); // 👈 for theming
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Use the filtered prop if provided, otherwise fallback to the global list
  const transactions = propTransactions || contextTransactions;

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = async (updatedData) => {
    const { id, ...fields } = updatedData;
    await updateTransaction(id, fields);
  };

  // Theme-aware styles
  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const cardBg = isDarkMode ? '#1a1a2e' : '#ffffff';
  const shadow = isDarkMode 
    ? '0 1px 5px rgba(0,0,0,0.3)' 
    : '0 1px 5px rgba(0,0,0,0.1)';

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: textColor }}>Transaction History</h3>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {transactions.map((transaction) => {
          const sign = transaction.amount < 0 ? '-' : '+';
          const color = transaction.amount < 0 ? '#e74c3c' : '#2ecc71';

          return (
            <li
              key={transaction.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                marginBottom: '10px',
                background: cardBg,
                borderRadius: '5px',
                boxShadow: shadow,
                borderRight: `5px solid ${color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                color: textColor,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = isDarkMode
                  ? '0 4px 15px rgba(0,0,0,0.5)'
                  : '0 4px 15px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = shadow;
              }}
            >
              <div>
                <span style={{ marginRight: '10px', fontWeight: '500' }}>
                  {transaction.category}
                </span>
                <span style={{ fontWeight: 'bold' }}>{transaction.text}</span>
                <span style={{ fontSize: '12px', marginLeft: '10px', opacity: 0.6 }}>
                  {transaction.date || 'No date'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: 'bold', color: color }}>
                  {sign}${Math.abs(transaction.amount).toFixed(2)}
                </span>

                {/* Edit Button */}
                <button
                  onClick={() => handleEditClick(transaction)}
                  aria-label={`Edit transaction: ${transaction.text}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    color: textColor,
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ✏️
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  aria-label={`Delete transaction: ${transaction.text}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e74c3c',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.3)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ❌
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Edit Modal */}
      {editingTransaction && (
        <EditModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};
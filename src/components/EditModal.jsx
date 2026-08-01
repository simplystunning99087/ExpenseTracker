// src/components/EditModal.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export const EditModal = ({ transaction, onClose, onSave }) => {
  const { isDarkMode } = useTheme();
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ text: '', amount: '' });

  // Populate form when transaction changes
  useEffect(() => {
    if (transaction) {
      setText(transaction.text || '');
      setAmount(transaction.amount?.toString() || '');
      setCategory(transaction.category || 'Food');
      setDate(transaction.date || '');
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { text: '', amount: '' };
    if (!text.trim()) newErrors.text = 'Description is required';
    if (!amount || isNaN(amount) || parseFloat(amount) === 0) {
      newErrors.amount = 'Enter a valid non-zero amount';
    }

    if (newErrors.text || newErrors.amount) {
      setErrors(newErrors);
      toast.error('Please fix the errors');
      return;
    }

    setErrors({ text: '', amount: '' });
    setIsSubmitting(true);

    try {
      await onSave({
        id: transaction.id,
        text: text.trim(),
        amount: parseFloat(amount),
        category,
        date
      });
      onClose();
    } catch (error) {
      toast.error('Failed to update transaction');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  };

  const modalContentStyle = {
    backgroundColor: isDarkMode ? '#1a1a2e' : '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: isDarkMode 
      ? '0 10px 40px rgba(0,0,0,0.6)' 
      : '0 10px 40px rgba(0,0,0,0.2)',
    position: 'relative',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
    borderRadius: '5px',
    background: isDarkMode ? '#2d2d44' : '#fff',
    color: isDarkMode ? '#e0e0e0' : '#2c3e50',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: isDarkMode ? '#e0e0e0' : '#2c3e50',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: isDarkMode ? '#e0e0e0' : '#2c3e50', marginTop: 0 }}>
          ✏️ Edit Transaction
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Description */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Description</label>
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errors.text) setErrors({ ...errors, text: '' });
              }}
              placeholder="Enter description..."
              style={{
                ...inputStyle,
                borderColor: errors.text ? '#e74c3c' : (isDarkMode ? '#444' : '#ddd'),
              }}
            />
            {errors.text && (
              <p style={{ color: '#e74c3c', margin: '5px 0 0 0', fontSize: '14px' }}>
                {errors.text}
              </p>
            )}
          </div>

          {/* Category */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">📄 Bills</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Salary">💰 Salary</option>
              <option value="Other">📌 Other</option>
            </select>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: '' });
              }}
              placeholder="Enter amount..."
              style={{
                ...inputStyle,
                borderColor: errors.amount ? '#e74c3c' : (isDarkMode ? '#444' : '#ddd'),
              }}
            />
            {errors.amount && (
              <p style={{ color: '#e74c3c', margin: '5px 0 0 0', fontSize: '14px' }}>
                {errors.amount}
              </p>
            )}
          </div>

          {/* Date */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...buttonStyle,
                background: isDarkMode ? '#444' : '#e0e0e0',
                color: isDarkMode ? '#e0e0e0' : '#2c3e50',
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...buttonStyle,
                background: '#3498db',
                color: '#fff',
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.target.style.background = '#2980b9';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.target.style.background = '#3498db';
              }}
            >
              {isSubmitting ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
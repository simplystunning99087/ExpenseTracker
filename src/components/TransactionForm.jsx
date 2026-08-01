// src/components/TransactionForm.jsx
import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalState';
import toast from 'react-hot-toast';
import { VoiceInput } from './VoiceInput';

export const TransactionForm = () => {
  const { addTransaction } = useGlobalContext();
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({ text: '', amount: '' });
  const [transcript, setTranscript] = useState('');

  const onSubmit = (e) => {
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
    addTransaction({
      text: text.trim(),
      amount: parseFloat(amount),
      category,
      date
    });

    setText('');
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleVoiceTranscript = (text) => {
    setText(text);
    setTranscript(text);

    // Auto-detect amount
    const amountMatch = text.match(/\$?(\d+\.?\d*)/);
    if (amountMatch) {
      const num = parseFloat(amountMatch[1]);
      if (!isNaN(num)) {
        setAmount(num.toString());
      }
    }

    // Auto-detect category
    const categoryKeywords = {
      Food: ['food', 'restaurant', 'lunch', 'dinner', 'groceries', 'pizza'],
      Transport: ['uber', 'taxi', 'bus', 'train', 'gas', 'petrol', 'diesel'],
      Shopping: ['shopping', 'clothes', 'mall', 'amazon', 'flipkart'],
      Bills: ['bill', 'electricity', 'water', 'rent', 'phone', 'internet'],
      Entertainment: ['movie', 'netflix', 'spotify', 'game', 'play'],
      Salary: ['salary', 'income', 'payment', 'wage', 'bonus'],
    };
    const lowerText = text.toLowerCase();
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        setCategory(cat);
        break;
      }
    }
  };

  return (
    <div style={{ margin: '20px 0', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h3>Add New Transaction</h3>
      <form onSubmit={onSubmit}>
        {/* Description with Voice Input */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={text}
              onChange={(e) => { setText(e.target.value); if (errors.text) setErrors({ ...errors, text: '' }); }}
              placeholder="Enter description or speak..."
              style={{
                flex: 1,
                padding: '10px',
                border: errors.text ? '2px solid #e74c3c' : '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box',
                background: 'inherit',
                color: 'inherit'
              }}
            />
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              onError={(err) => toast.error('Voice error: ' + err)}
            />
          </div>
          {errors.text && <p style={{ color: '#e74c3c', margin: '5px 0 0 0', fontSize: '14px' }}>{errors.text}</p>}
        </div>

        {/* Category */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
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
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amount (Negative for Expense, Positive for Income)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); if (errors.amount) setErrors({ ...errors, amount: '' }); }}
            placeholder="Enter amount..."
            style={{
              width: '100%',
              padding: '10px',
              border: errors.amount ? '2px solid #e74c3c' : '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
          {errors.amount && <p style={{ color: '#e74c3c', margin: '5px 0 0 0', fontSize: '14px' }}>{errors.amount}</p>}
        </div>

        {/* Date Picker */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.1s'
          }}
          onMouseEnter={(e) => { e.target.style.background = '#27ae60'; e.target.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.target.style.background = '#2ecc71'; e.target.style.transform = 'scale(1)'; }}
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};
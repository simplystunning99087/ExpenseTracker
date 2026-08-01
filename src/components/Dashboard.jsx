// src/components/Dashboard.jsx
import React, { useMemo } from 'react';
import { useGlobalContext } from '../context/GlobalState';
import { useBudget } from '../context/BudgetContext';
import { useTheme } from '../context/ThemeContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2ecc71', '#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];

export const Dashboard = () => {
  const { transactions } = useGlobalContext();
  const { budgets } = useBudget();
  const { isDarkMode } = useTheme();

  // 🚀 Performance Optimization: useMemo prevents recalculating on every render
  const { total, income, expense, categoryData } = useMemo(() => {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
    const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

    // 📊 Pie Chart Data: Group expenses by category
    const expenseTransactions = transactions.filter(t => t.amount < 0);
    const categoryData = expenseTransactions.reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += Math.abs(curr.amount);
      } else {
        acc.push({ name: curr.category, value: Math.abs(curr.amount) });
      }
      return acc;
    }, []);

    return {
      total: total.toFixed(2),
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      categoryData
    };
  }, [transactions]);

  // 💰 Calculate spending per category for budgets
  const categorySpending = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  // 📊 Budget progress bars
  const budgetProgress = budgets.map(budget => ({
    ...budget,
    spent: categorySpending[budget.category] || 0,
    percent: Math.min((categorySpending[budget.category] || 0) / budget.amount * 100, 100)
  }));

  // 🎨 Theme-aware styles
  const cardStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px',
    background: isDarkMode ? '#1a1a2e' : '#f4f4f4',
    borderRadius: '10px',
    marginBottom: '20px',
    transition: 'all 0.3s ease'
  };

  const chartContainerStyle = {
    background: isDarkMode ? '#1a1a2e' : '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: isDarkMode
      ? '0 2px 10px rgba(0,0,0,0.3)'
      : '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  };

  const budgetContainerStyle = {
    marginTop: '20px',
    padding: '15px',
    background: isDarkMode ? '#1a1a2e' : '#fff',
    borderRadius: '10px',
    boxShadow: isDarkMode
      ? '0 2px 10px rgba(0,0,0,0.3)'
      : '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  };

  const textColor = isDarkMode ? '#e0e0e0' : '#2c3e50';
  const labelColor = isDarkMode ? '#aaa' : '#666';

  return (
    <div>
      {/* 💳 Dashboard Cards */}
      <div style={cardStyle}>
        <div>
          <h4 style={{ color: labelColor }}>Total Balance</h4>
          <h2 style={{ color: textColor }}>${total}</h2>
        </div>
        <div style={{ color: '#2ecc71' }}>
          <h4 style={{ color: labelColor }}>Income</h4>
          <h2>${income}</h2>
        </div>
        <div style={{ color: '#e74c3c' }}>
          <h4 style={{ color: labelColor }}>Expenses</h4>
          <h2>${expense}</h2>
        </div>
      </div>

      {/* 📊 Pie Chart Section */}
      {categoryData.length > 0 ? (
        <div style={chartContainerStyle}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px', color: textColor }}>
            Spending by Category
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{
                  background: isDarkMode ? '#1a1a2e' : '#fff',
                  color: isDarkMode ? '#e0e0e0' : '#2c3e50',
                  border: isDarkMode ? '1px solid #444' : '1px solid #ddd'
                }}
              />
              <Legend
                wrapperStyle={{
                  color: isDarkMode ? '#e0e0e0' : '#2c3e50'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{
          textAlign: 'center',
          color: '#888',
          padding: '20px',
          background: isDarkMode ? '#1a1a2e' : '#fff',
          borderRadius: '10px',
          boxShadow: isDarkMode
            ? '0 2px 10px rgba(0,0,0,0.3)'
            : '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          No expenses yet. Add some to see your spending breakdown! 📊
        </p>
      )}

      {/* 💰 Budget Progress Section */}
      {budgetProgress.length > 0 && (
        <div style={budgetContainerStyle}>
          <h4 style={{ color: textColor, marginTop: 0 }}>💰 Budget Progress</h4>
          {budgetProgress.map((bp, idx) => {
            const isOver = bp.percent >= 100;
            const isWarning = bp.percent >= 80 && bp.percent < 100;
            const progressColor = isOver ? '#e74c3c' : (isWarning ? '#f39c12' : '#2ecc71');

            return (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: textColor,
                  marginBottom: '4px'
                }}>
                  <span style={{ fontWeight: '500' }}>{bp.category}</span>
                  <span>
                    ${bp.spent.toFixed(2)} / ${bp.amount.toFixed(2)}
                    {isOver && ' 🔴 Over budget!'}
                    {isWarning && !isOver && ' ⚠️ Near limit'}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: isDarkMode ? '#333' : '#eee',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(bp.percent, 100)}%`,
                    height: '100%',
                    background: progressColor,
                    borderRadius: '5px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
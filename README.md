# 💰 Expense Tracker – React + Supabase

A full-stack, multi-user expense tracking application built with **React** and **Supabase**. Features real-time synchronization, dark mode, voice input, budget management, and user-specific data isolation—all deployed on **Vercel**.

> 🚀 **Live Demo**: [expensetracker-seven-lemon.vercel.app](https://expensetracker-seven-lemon.vercel.app)

---

## ✨ Key Features

- 🔐 **Authentication** – Fully functional Sign Up / Sign In with Supabase Auth.
- 🔒 **User Data Isolation** – Every user sees *only* their own transactions and budgets.
- 💰 **Income & Expense Tracking** – Add transactions with categories, descriptions, and amounts.
- 📊 **Dashboard Analytics** – Automatically calculates totals, income, and expenses.
- 🍩 **Visual Spending Breakdown** – Interactive Pie Chart powered by Recharts.
- 🎯 **Budget Management** – Set monthly budgets per category with real-time progress bars.
- 🎤 **Voice Input** – Speak your transactions! The app auto-detects amounts and categories.
- 🌙 **Dark Mode** – Seamless light/dark theme toggling with local storage persistence.
- 📆 **Filtering** – View transactions for "All Time", "This Month", "Last Month", or "Custom Month".
- 📥 **CSV Export** – Download your filtered transaction history as a `.csv` file.

---

## 🛠️ Tech Stack

- **Frontend**: React (Hooks, Context API, useReducer)
- **Backend & Auth**: Supabase (PostgreSQL, Realtime subscriptions, Row Level Security)
- **Styling**: Inline styles + CSS Modules (Dark/light mode support)
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Deployment**: Vercel

---

## 📂 Project Structure

```text
mm/
├── public/               # Static assets, manifest.json
├── src/
│   ├── components/       # Auth, Dashboard, BudgetManager, TransactionForm, etc.
│   ├── context/          # AuthContext, GlobalState, BudgetContext, ThemeContext
│   ├── supabaseClient.js # Supabase connection config
│   └── App.js            # Main app wrapper with routing logic
├── package.json          # Dependencies and scripts
└── README.md             # You are here!

// src/context/GlobalState.jsx
import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext'; 


const initialState = {
  transactions: [],
  loading: true
};

const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false };
    case 'ADD_TRANSACTION':
      if (state.transactions.some(t => t.id === action.payload.id)) return state;
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // ----- Fetch Transactions (filtered by user) -----
  const fetchTransactions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)          // 👈 Using 'user_id'
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load transactions');
      console.error(error);
      dispatch({ type: 'SET_LOADING', payload: false });
    } else {
      dispatch({ type: 'SET_TRANSACTIONS', payload: data });
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [authUser?.id, fetchTransactions]); 

  // ----- Real-time subscription (only for the user) -----
  useEffect(() => {
    const subscription = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === 'INSERT' && newRecord?.user_id === user.id) {
            dispatch({ type: 'ADD_TRANSACTION', payload: newRecord });
          } else if (eventType === 'UPDATE' && newRecord?.user_id === user.id) {
            dispatch({ type: 'UPDATE_TRANSACTION', payload: newRecord });
          } else if (eventType === 'DELETE' && oldRecord?.user_id === user.id) {
            dispatch({ type: 'DELETE_TRANSACTION', payload: oldRecord.id });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // ----- Add Transaction (with user_id) -----
  // In GlobalState.jsx
const addTransaction = useCallback(async (transaction) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error('You must be logged in');
    return;
  }

  const newTransaction = {
    ...transaction,
    user_id: user.id,
    date: new Date().toISOString().split('T')[0]
  };

  const { error } = await supabase
    .from('transactions')
    .insert([newTransaction]);

  if (error) {
    // If it fails, roll back the optimistic update
    toast.error('Failed to add transaction');
    console.error(error);
  } else {
    toast.success('Transaction added!');
  }
}, []);
  // ----- Delete Transaction (only if user owns it) -----
  const deleteTransaction = useCallback(async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);               // 👈 Using 'user_id'

    if (error) {
      toast.error('Failed to delete transaction');
      console.error(error);
    } else {
      toast.success('Transaction deleted!');
    }
  }, []);

  // ----- Update Transaction (only if user owns it) -----
  const updateTransaction = useCallback(async (id, updatedFields) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updatedFields)
      .match({ id })
      .eq('user_id', user.id)               // 👈 Using 'user_id'
      .select();

    if (error) {
      toast.error('Failed to update transaction');
      console.error(error);
    } else {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: data[0] });
      toast.success('Transaction updated!');
    }
  }, []);

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      loading: state.loading,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      fetchTransactions
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
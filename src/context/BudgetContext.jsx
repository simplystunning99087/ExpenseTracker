// src/context/BudgetContext.jsx
import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const initialState = {
  budgets: [],
  loading: true
};

const BudgetReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload, loading: false };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? action.payload : b
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const BudgetContext = createContext(initialState);

export const BudgetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BudgetReducer, initialState);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Fetch budgets for the current month
  const fetchBudgets = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      dispatch({ type: 'SET_BUDGETS', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth);

    if (error) {
      toast.error('Failed to load budgets');
      console.error(error);
      dispatch({ type: 'SET_LOADING', payload: false });
    } else {
      dispatch({ type: 'SET_BUDGETS', payload: data });
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Real-time subscription for budgets
  useEffect(() => {
    const subscription = supabase
      .channel('budgets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets',
        },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === 'INSERT' && newRecord?.user_id === user.id) {
            dispatch({ type: 'ADD_BUDGET', payload: newRecord });
          } else if (eventType === 'UPDATE' && newRecord?.user_id === user.id) {
            dispatch({ type: 'UPDATE_BUDGET', payload: newRecord });
          } else if (eventType === 'DELETE' && oldRecord?.user_id === user.id) {
            dispatch({ type: 'DELETE_BUDGET', payload: oldRecord.id });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Add a budget
  const addBudget = useCallback(async (category, amount) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        user_id: user.id,
        category,
        amount,
        month: currentMonth
      }])
      .select();

    if (error) {
      toast.error('Failed to add budget');
      console.error(error);
    } else {
      toast.success(`Budget set for ${category}`);
    }
  }, [currentMonth]);

  // Update a budget
  const updateBudget = useCallback(async (id, amount) => {
    const { data, error } = await supabase
      .from('budgets')
      .update({ amount, updated_at: new Date() })
      .match({ id })
      .select();

    if (error) {
      toast.error('Failed to update budget');
      console.error(error);
    } else {
      dispatch({ type: 'UPDATE_BUDGET', payload: data[0] });
      toast.success('Budget updated!');
    }
  }, []);

  // Delete a budget
  const deleteBudget = useCallback(async (id) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .match({ id });

    if (error) {
      toast.error('Failed to delete budget');
      console.error(error);
    } else {
      dispatch({ type: 'DELETE_BUDGET', payload: id });
      toast.success('Budget removed');
    }
  }, []);

  return (
    <BudgetContext.Provider value={{
      budgets: state.budgets,
      loading: state.loading,
      addBudget,
      updateBudget,
      deleteBudget,
      fetchBudgets,
      currentMonth
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};
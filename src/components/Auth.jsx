// src/components/Auth.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      // on success, user state updates and AppContent will render
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
};
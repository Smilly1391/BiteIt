import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // success or error message
  const [error, setError] = useState('');
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setMessage('');

  if (!isValidEmail(email)) {
    setError('Enter a valid email (must include @ and end with .com)');
    return;
  }

  try {
    const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email,
    });

    // Regardless of whether email exists, show generic message
    setMessage('If this email is registered, a reset link has been sent.');
    setEmail('');
  } catch (err) {
    const errorMsg = err?.response?.data?.message || 'Failed to send reset link';
    setError(errorMsg);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 dark:bg-gray-900 transition-colors duration-300 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
        </div>

        {error && <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>}
        {message && <div className="mb-4 text-green-600 font-semibold text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

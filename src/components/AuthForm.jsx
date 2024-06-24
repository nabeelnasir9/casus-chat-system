import React, { useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';

const AuthForm = ({ title, onSubmit, buttonLabel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ email, password, firstName, lastName });
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <div className="w-1/2 bg-gray-200 flex justify-center items-center">
        <img src="/vite.svg" alt="Auth" />
      </div>
      <div className="w-1/2 p-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {title === 'Sign Up' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">First Name</label>
                <input
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">Last Name</label>
                <input
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
            {loading ? <HashLoader size={24} color="#fff" /> : buttonLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;

import React, { useContext, useState } from 'react';
import AuthForm from './AuthForm';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      await login(credentials.email, credentials.password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <AuthForm title="Login" onSubmit={handleLogin} buttonLabel="Login" />
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Login;

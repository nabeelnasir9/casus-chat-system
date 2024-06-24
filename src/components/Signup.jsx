import React, { useContext } from 'react';
import AuthForm from './AuthForm';
import { AuthContext } from '../contexts/AuthContext';

const Signup = () => {
  const { signup } = useContext(AuthContext);

  const handleSignup = (credentials) => {
    return signup(credentials.email, credentials.password, credentials.firstName, credentials.lastName);
  };

  return <AuthForm title="Sign Up" onSubmit={handleSignup} buttonLabel="Sign Up" />;
};

export default Signup;

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authTokens) {
      fetchUserInfo();
    }
  }, [authTokens]);

  const fetchUserInfo = async () => {
    if (!authTokens) return;

    try {
      const response = await fetch(`${BASE_URL}/user-info`, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        }
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          setUser(data);
        } else {
          console.error("Failed to fetch user info:", data.detail || response.statusText);
          logout();
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", responseText);
        logout();
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const responseText = await response.text();
      console.log("Login response:", responseText);

      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          setAuthTokens(data);
          localStorage.setItem('authTokens', JSON.stringify(data));
          navigate('/dashboard/home');
        } else {
          console.error("Login failed:", data.detail);
          throw new Error(data.detail);
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Failed to login:", err);
      throw err;
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      const response = await fetch(`${BASE_URL}/sign-up/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName })
      });
      const responseText = await response.text();
      console.log("Signup response:", responseText);

      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          await login(email, password);
        } else {
          console.error("Signup failed:", data.detail);
          throw new Error(data.detail);
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Failed to sign up:", err);
      throw err;
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens, user, setUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL } from '../constants';
import HashLoader from 'react-spinners/HashLoader';

const UserProfile = () => {
  const { authTokens, setUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/user-info`, {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setEmail(data.email || '');
          setUser(data);
        } else {
          setError(data.detail || 'Error fetching user info');
        }
      } catch (err) {
        setError('Error fetching user info');
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [authTokens, setUser]);

  const updateUserInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/user-info`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setEditMode(false);
      } else {
        setError(data.detail || 'Error updating user info');
      }
    } catch (err) {
      setError('Error updating user info');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updateUserInfo();
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
          {getInitials(firstName, lastName)}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
          <p className="text-gray-500">{email}</p>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <HashLoader size={50} color="#000" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">First Name</label>
            <input
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!editMode}
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
              disabled={!editMode}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {editMode ? (
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
              {loading ? <HashLoader size={24} color="#fff" /> : 'Update Information'}
            </button>
          ) : (
            <button type="button" className="w-full bg-green-500 text-white p-2 rounded-md" onClick={() => setEditMode(true)}>
              Edit Information
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default UserProfile;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL } from '../constants';
import HashLoader from 'react-spinners/HashLoader';

const NewChat = () => {
  const { authTokens } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createChat = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/chat/new/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/dashboard/chat/${data.uuid}`);
      } else {
        setError(data.detail || 'Error creating chat');
      }
    } catch (err) {
      setError('Error creating chat');
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createChat();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">New Chat</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        className="mt-1 p-2 w-full border border-gray-300 rounded-md mb-4"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Chat title..."
      />
      <button onClick={createChat} className="w-full bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
        {loading ? <HashLoader size={24} color="#fff" /> : 'Create Chat'}
      </button>
    </div>
  );
};

export default NewChat;

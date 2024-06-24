import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import HashLoader from 'react-spinners/HashLoader';
import { BASE_URL } from '../constants';

const ChatHistory = () => {
  const { authTokens } = useContext(AuthContext);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/chat-history/`, {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setChatHistory(data);
        } else {
          setError(data.detail || 'Error fetching chat history');
        }
      } catch (err) {
        setError('Error fetching chat history');
      }
      setLoading(false);
    };

    fetchChatHistory();
  }, [authTokens]);

  const openChat = (uuid) => {
    navigate(`/dashboard/chat/${uuid}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Chat History</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <HashLoader size={50} color="#000" />
        </div>
      ) : (
        <>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="chat-history mb-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className="mb-2 p-2 bg-gray-100 rounded-md cursor-pointer"
                onClick={() => openChat(chat.uuid)}
              >
                <p className="font-bold">{chat.title}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHistory;

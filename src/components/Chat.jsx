import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL } from '../constants';
import HashLoader from 'react-spinners/HashLoader';

const Chat = () => {
  const { authTokens } = useContext(AuthContext);
  const { uuid } = useParams();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchChat = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/chat/?id=${uuid}`, {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setChat(data);
        } else {
          setError(data.detail || 'Error fetching chat messages');
        }
      } catch (err) {
        setError('Error fetching chat messages');
      }
      setLoading(false);
    };

    fetchChat();
  }, [uuid, authTokens]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    setError(null);

    const tempMessage = { sender: 'human', content: message, timestamp: new Date().toISOString() };
    setChat((prevChat) => ({
      ...prevChat,
      messages: [...prevChat.messages, tempMessage]
    }));
    setMessage('');

    try {
      const response = await fetch(`${BASE_URL}/chat/?id=${uuid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({ content: tempMessage.content })
      });
      const data = await response.json();
      if (response.ok) {
        setChat((prevChat) => ({
          ...prevChat,
          messages: prevChat.messages.map((msg) =>
            msg.timestamp === tempMessage.timestamp ? data : msg
          )
        }));
      } else {
        setError(data.detail || 'Error sending message');
      }
    } catch (err) {
      setError('Error sending message');
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderParagraph = (paragraph, index) => {
    return <p key={index} className="mt-2 mb-2">{paragraph}</p>;
  };

  const renderHeading = (paragraph, index, level) => {
    const HeadingTag = `h${level}`;
    return <HeadingTag key={index} className={`font-semibold text-md mt-4 mb-2`}>{paragraph.replace(new RegExp(`^#{${level}} `), '')}</HeadingTag>;
  };

  const renderList = (paragraph, index, type) => {
    const items = paragraph.split('\n').map((item, i) => <li key={i} className={`ml-4 list-${type}`}>{item.replace(/^[\d\.\- ]+/, '')}</li>);
    const ListTag = type === 'decimal' ? 'ol' : 'ul';
    return <ListTag key={index} className={`ml-4 list-${type} mb-2`}>{items}</ListTag>;
  };

  const renderLink = (paragraph, index) => {
    const parts = paragraph.split(/(\[.*?\]\(.*?\))/).map((part, i) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return <a key={i} href={match[2]} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{match[1]}</a>;
      }
      return part;
    });
    return <p key={index} className="mt-2 mb-2">{parts}</p>;
  };

  const renderBoldText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i}>{part}</strong>;
      }
      return part;
    });
  };

  const renderMessageContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) return renderHeading(paragraph, index, 3);
      if (paragraph.startsWith('## ')) return renderHeading(paragraph, index, 2);
      if (paragraph.startsWith('# ')) return renderHeading(paragraph, index, 1);
      if (paragraph.startsWith('- ')) return renderList(paragraph, index, 'disc');
      if (/^\d+\./.test(paragraph)) return renderList(paragraph, index, 'decimal');
      if (/\[.*?\]\(.*?\)/.test(paragraph)) return renderLink(paragraph, index);
      return <p key={index} className="mt-2 mb-2">{renderBoldText(paragraph)}</p>;
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-full mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex-shrink-0 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Chat</h2>
        </div>
      </div>
      {loading ? (
        <div className="flex-grow flex justify-center items-center">
          <HashLoader size={50} color="#000" />
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto p-6">
            <div className="chat-messages">
              {chat && chat.messages.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded-md ${msg.sender === 'human' ? 'bg-white text-left' : 'bg-white text-left border'}`}>
                  <p className="text-sm text-gray-600">{msg.sender}</p>
                  <div>{renderMessageContent(msg.content)}</div>
                </div>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 p-4">{error}</p>}
          <div className="flex-shrink-0 p-4 bg-gray-100">
            <div className="flex items-center">
              <input
                className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-md" disabled={sending}>
                {sending ? <HashLoader size={24} color="#fff" /> : 'Send'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;


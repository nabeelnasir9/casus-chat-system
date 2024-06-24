import React, { useContext } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import UserProfile from './UserProfile';
import Chat from './Chat';
import NewChat from './NewChat';
import ChatHistory from './ChatHistory';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li className="mb-4">
              <NavLink to="/dashboard/home" className={({ isActive }) => isActive ? "text-blue-500" : ""}>Home</NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? "text-blue-500" : ""}>Profile</NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="/dashboard/chat/new" className={({ isActive }) => isActive ? "text-blue-500" : ""}>New Chat</NavLink>
            </li>
            <li className="mb-4">
              <NavLink to="/dashboard/chat/history" className={({ isActive }) => isActive ? "text-blue-500" : ""}>Chat History</NavLink>
            </li>
            <li className="mb-4">
              <button onClick={handleLogout} className="w-full bg-red-500 text-white p-2 rounded-md">Logout</button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="w-3/4 p-4">
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="chat/new" element={<NewChat />} />
          <Route path="chat/history" element={<ChatHistory />} />
          <Route path="chat/:uuid" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

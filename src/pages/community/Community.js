import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n';
import { ChatBubbleLeftRightIcon, UserGroupIcon, UserPlusIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function Community() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('chats');
  const [connections, setConnections] = useState([
    { id: 'user_123', name: 'Rahul Sharma', lastMessage: 'Hi there!', unread: 2, timestamp: '10:30 AM' },
    { id: 'user_456', name: 'Priya Patel', lastMessage: 'How are the crops?', unread: 0, timestamp: 'Yesterday' },
    { id: 'user_789', name: 'Amit Kumar', lastMessage: 'Let me know when you need help', unread: 1, timestamp: 'Monday' },
  ]);
  const [chatMessages, setChatMessages] = useState({});
  const [newConnectionId, setNewConnectionId] = useState('');
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const navigate = useNavigate();
  const { t } = useI18n();

  // Mark messages as read when a chat is opened
  const handleChatOpen = (connectionId) => {
    setActiveChat(connectionId);
    setConnections(prevConnections => 
      prevConnections.map(conn => 
        conn.id === connectionId ? { ...conn, unread: 0 } : conn
      )
    );
  };

  // Handle authentication and initial data loading
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/community' } });
      return;
    }

    // Mock chat messages
    const mockChats = {
      'user_123': [
        { id: 1, sender: 'user_123', text: 'Hi there!', timestamp: '10:30 AM' },
        { id: 2, sender: 'user_123', text: 'How are your crops doing?', timestamp: '10:31 AM' },
      ],
      'user_456': [
        { id: 1, sender: 'user_456', text: 'Hi! How are the crops?', timestamp: '9:15 AM' },
      ],
      'user_789': [
        { id: 1, sender: 'user_789', text: 'Let me know when you need help with the fields', timestamp: 'Yesterday' },
      ]
    };
    setChatMessages(mockChats);
  }, [isAuthenticated, navigate]);

  const handleAddConnection = (e) => {
    e.preventDefault();
    if (!newConnectionId.trim()) return;
    
    // In a real app, this would be an API call to add a connection
    alert(`Connection request sent to ${newConnectionId}`);
    setNewConnectionId('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    // In a real app, this would be an API call to send a message
    const newMessage = {
      id: Date.now(),
      sender: user.id,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));
    
    setMessage('');
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    alert('User ID copied to clipboard! Share this with others to connect.');
  };

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('community.community')}</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{t('community.your_id')}:</span>
              <div className="flex items-center">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{user.id}</span>
                <button 
                  onClick={copyUserId}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  title={t('community.copy_id')}
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddConnection} className="mt-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newConnectionId}
                  onChange={(e) => setNewConnectionId(e.target.value)}
                  placeholder={t('community.enter_user_id')}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <UserPlusIcon className="h-4 w-4 mr-1" />
                  {t('community.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'chats'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  {t('community.chats')}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'groups'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {t('community.groups')}
                </div>
              </button>
            </nav>
          </div>
          
          <div className="divide-y divide-gray-200">
            {connections.map((connection) => (
              <div 
                key={connection.id}
                onClick={() => {
                  // Mark messages as read when opening a chat
                  if (connection.unread > 0) {
                    setConnections(prev => 
                      prev.map(conn => 
                        conn.id === connection.id 
                          ? { ...conn, unread: 0 } 
                          : conn
                      )
                    );
                  }
                  setActiveChat(connection.id);
                }}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  activeChat === connection.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{connection.name}</p>
                    <p className="text-sm text-gray-500 truncate">{connection.lastMessage}</p>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <p className="text-xs text-gray-500">{connection.timestamp}</p>
                    {connection.unread > 0 && activeChat !== connection.id && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {connection.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="border-b border-gray-200 bg-white p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                  {connections.find(c => c.id === activeChat)?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {connections.find(c => c.id === activeChat)?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(chatMessages[activeChat] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === user.id
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === user.id ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 bg-white p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('community.type_message')}
                  className="flex-1 min-w-0 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('community.send')}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {t('community.no_chat_selected')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('community.select_chat_to_start')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

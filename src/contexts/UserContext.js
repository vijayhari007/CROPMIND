import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (user) {
      const storedConnections = localStorage.getItem(`connections_${user.id}`);
      const storedRequests = localStorage.getItem(`connection_requests_${user.id}`);
      const storedActivities = localStorage.getItem(`activities_${user.id}`);

      if (storedConnections) setConnections(JSON.parse(storedConnections));
      if (storedRequests) setConnectionRequests(JSON.parse(storedRequests));
      if (storedActivities) setActivities(JSON.parse(storedActivities));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`connections_${user.id}`, JSON.stringify(connections));
    }
  }, [connections, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`connection_requests_${user.id}`, JSON.stringify(connectionRequests));
    }
  }, [connectionRequests, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`activities_${user.id}`, JSON.stringify(activities));
    }
  }, [activities, user]);

  const sendConnectionRequest = (toUserId) => {
    const newRequest = {
      id: `req_${Date.now()}`,
      fromUserId: user.id,
      fromUserName: user.name || 'Anonymous',
      toUserId,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    setConnectionRequests(prev => [...prev, newRequest]);
    toast.success('Connection request sent!');
  };

  const respondToRequest = (requestId, accept) => {
    setConnectionRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: accept ? 'accepted' : 'rejected' } 
          : req
      )
    );

    if (accept) {
      const request = connectionRequests.find(req => req.id === requestId);
      if (request) {
        const newConnection = {
          id: `conn_${Date.now()}`,
          userId: request.fromUserId,
          userName: request.fromUserName,
          connectedAt: new Date().toISOString()
        };
        setConnections(prev => [...prev, newConnection]);
        addActivity('connection', { userId: request.fromUserId, userName: request.fromUserName });
        toast.success('Connection added!');
      }
    } else {
      toast('Request declined', { icon: '❌' });
    }
  };

  // Track profile visits (only once per day per profile)
  const trackProfileVisit = (profileId, profileName) => {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    
    // Check if we already tracked a visit to this profile today
    const alreadyVisitedToday = activities.some(activity => {
      if (activity.type === 'profile_view' && activity.data?.profileId === profileId) {
        const activityDate = new Date(activity.timestamp).toISOString().split('T')[0];
        return activityDate === today;
      }
      return false;
    });
    
    if (!alreadyVisitedToday) {
      addActivity('profile_view', {
        profileId,
        profileName,
        timestamp: new Date().toISOString()
      });
    }
  };

  const addActivity = (type, data) => {
    const activityTypes = {
      'page_view': (data) => `Visited ${data.path}`,
      'search': (data) => `Searched for "${data.query}"`,
      'connection': (data) => `Connected with ${data.userName}`,
      'login': () => 'Logged in',
      'logout': () => 'Logged out',
      'register': () => 'Created an account',
      'navigation': (data) => `Navigated to ${data.to}`,
      'button_click': (data) => `Clicked on ${data.label}`,
      'form_submit': (data) => `Submitted form: ${data.formName}`,
      'link_click': (data) => `Clicked on ${data.text} (${data.href})`
    };

    const newActivity = {
      id: `act_${Date.now()}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      message: activityTypes[type] ? activityTypes[type](data) : 'Performed an action'
    };

    setActivities(prev => {
      // Keep only the last 100 activities
      const updatedActivities = [newActivity, ...prev].slice(0, 100);
      
      // Clean up old activities (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return updatedActivities.filter(activity => {
        return new Date(activity.timestamp) > thirtyDaysAgo;
      });
    });
  };

  // Clear activities for the current user
  const clearActivities = () => {
    setActivities([]);
    if (user) {
      localStorage.removeItem(`activities_${user.id}`);
    }
  };

  return (
    <UserContext.Provider
      value={{
        connections,
        connectionRequests: connectionRequests.filter(req => req.status === 'pending'),
        activities,
        sendConnectionRequest,
        respondToRequest,
        addActivity,
        clearActivities,
        trackProfileVisit
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

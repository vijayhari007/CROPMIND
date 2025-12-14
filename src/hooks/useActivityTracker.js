import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export const useActivityTracker = () => {
  const location = useLocation();
  const { addActivity } = useUser();

  useEffect(() => {
    // Track page view
    addActivity('page_view', {
      path: location.pathname,
      search: location.search,
      fullPath: location.pathname + location.search
    });
  }, [location, addActivity]);
};

export const useTrackInteraction = () => {
  const { addActivity } = useUser();

  const trackClick = (label, element = 'button') => {
    addActivity('button_click', { 
      label,
      element,
      timestamp: new Date().toISOString()
    });
  };

  const trackFormSubmit = (formName, formData = {}) => {
    addActivity('form_submit', { 
      formName,
      fields: Object.keys(formData),
      timestamp: new Date().toISOString()
    });
  };

  const trackLinkClick = (text, href) => {
    addActivity('link_click', { 
      text, 
      href,
      timestamp: new Date().toISOString()
    });
  };

  const trackSearch = (query) => {
    addActivity('search', {
      query,
      timestamp: new Date().toISOString()
    });
  };

  return { 
    trackClick, 
    trackFormSubmit, 
    trackLinkClick, 
    trackSearch 
  };
};

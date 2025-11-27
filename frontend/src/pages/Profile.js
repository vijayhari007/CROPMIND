import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile = ({ userId: profileUserId }) => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const { trackProfileVisit } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState(() => {
    // Initialize with current user data if available
    const initialUser = currentUser || profileUser;
    return {
      name: initialUser?.name || '',
      email: initialUser?.email || '',
      phone: initialUser?.phone || '',
      location: initialUser?.location || ''
    };
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      return newData;
    });
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log('Saving profile with data:', formData);
      
      // Create updated user object
      const updatedUser = {
        ...(profileUser || {}),
        ...formData,
        // Ensure we don't override the ID
        id: profileUser?.id || currentUser?.id
      };
      
      console.log('Updated user object:', updatedUser);
      
      // If it's the current user's profile, update the auth context
      if (isCurrentUser && currentUser) {
        console.log('Updating current user profile');
        
        // Update the main user data in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const updatedUserData = { 
            ...userData, 
            ...formData,
            // Preserve the ID and other important fields
            id: userData.id,
            token: userData.token
          };
          console.log('Updating user in localStorage:', updatedUserData);
          localStorage.setItem('user', JSON.stringify(updatedUserData));
        }
        
        // Also update in the user-specific storage
        if (currentUser.id) {
          console.log(`Updating user_${currentUser.id} in localStorage`);
          localStorage.setItem(`user_${currentUser.id}`, JSON.stringify(updatedUser));
        }
      } else if (profileUser?.id) {
        console.log(`Updating other user_${profileUser.id} in localStorage`);
        localStorage.setItem(`user_${profileUser.id}`, JSON.stringify(updatedUser));
      }
      
      // Update the profile user state
      setProfileUser(updatedUser);
      setIsEditing(false);
      
      console.log('Profile updated successfully');
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to current user data
    if (profileUser) {
      setFormData({
        name: profileUser.name || '',
        email: profileUser.email || '',
        phone: profileUser.phone || '',
        location: profileUser.location || ''
      });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      // If auth is still loading, wait for it to complete
      if (authLoading) return;
      
      // If no user is logged in and no profile ID is provided, show error
      if (!currentUser && !profileUserId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let userData = null;
        
        // Check if this is the current user's profile
        const isOwnProfile = !profileUserId || (currentUser && profileUserId === currentUser.id);
        setIsCurrentUser(isOwnProfile);
        
        if (isOwnProfile && currentUser) {
          // Use current user's data
          userData = {
            ...currentUser,
            name: currentUser.name || 'User',
            email: currentUser.email || '',
            phone: currentUser.phone || 'Not provided',
            location: currentUser.location || 'Not provided',
            joinDate: currentUser.createdAt || new Date().toISOString(),
            bio: currentUser.bio || 'No bio available.'
          };
        } else if (profileUserId) {
          // Try to find user in localStorage (simulating a database)
          const storedUser = localStorage.getItem(`user_${profileUserId}`);
          if (storedUser) {
            userData = JSON.parse(storedUser);
          } else {
            // Fallback mock data if user not found
            userData = {
              id: profileUserId,
              name: 'User ' + profileUserId.substring(0, 6),
              email: `user${profileUserId.substring(0, 4)}@example.com`,
              phone: '+1 (555) 123-4567',
              location: 'New York, USA',
              joinDate: new Date().toISOString(),
              bio: 'Farm enthusiast and agriculture expert with 5+ years of experience.'
            };
          }
          
          // Track the profile view if it's not the current user
          if (currentUser && profileUserId !== currentUser.id) {
            trackProfileVisit(profileUserId, userData.name || 'User');
          }
        }
        
        setProfileUser(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileUserId, currentUser, trackProfileVisit, authLoading]);

  // Update form data when profileUser changes
  useEffect(() => {
    if (profileUser) {
      console.log('Profile user updated, updating form data:', profileUser);
      setFormData({
        name: profileUser.name || '',
        email: profileUser.email || '',
        phone: profileUser.phone || '',
        location: profileUser.location || ''
      });
    } else if (currentUser) {
      console.log('No profileUser, using currentUser for form data:', currentUser);
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        location: currentUser.location || ''
      });
    } else if (currentUser) {
      // Initialize with current user data if available
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        location: currentUser.location || ''
      });
    }
  }, [profileUser, currentUser]);

  // Show loading state while auth is being checked or profile is loading
  if (authLoading || (isLoading && !profileUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Checking authentication...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-sm mx-auto">
          <UserCircleIcon className="mx-auto h-20 w-20 text-gray-300" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">Profile Not Available</h3>
          <p className="mt-2 text-gray-600">
            {!currentUser ? 'Please log in to view profiles.' : 'The requested profile could not be found.'}
          </p>
          {!currentUser && (
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6 transition-all duration-200">
          <div className="px-6 py-8 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <UserCircleIcon className="h-20 w-20 text-gray-400" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-900">{profileUser.name || 'User'}</h2>
                <p className="text-gray-600">{profileUser.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(profileUser.joinDate || new Date()).toLocaleDateString()}
                </p>
              </div>
            </div>
            {isCurrentUser && !isEditing && (
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isEditing ? 'Edit Profile' : 'User Information'}
            </h3>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!isCurrentUser}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <dl className="space-y-6">
                <div className="border-t border-gray-200 pt-4">
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profileUser.name || 'Not provided'}</dd>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profileUser.email || 'Not provided'}</dd>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profileUser.phone || 'Not provided'}</dd>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profileUser.location || 'Not provided'}</dd>
                </div>
                
                {profileUser.bio && (
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="text-sm font-medium text-gray-500">About</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profileUser.bio}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import { useUser } from '../contexts/UserContext';
import { UserCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ConnectionRequests = ({ onClose }) => {
  const { connectionRequests, respondToRequest } = useUser();

  if (connectionRequests.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
        <h3 className="font-medium">Connection Requests</h3>
        <button onClick={onClose} className="text-white hover:text-indigo-200">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {connectionRequests.map(request => (
          <div key={request.id} className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{request.fromUserName}</p>
                <p className="text-sm text-gray-500">Wants to connect</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => respondToRequest(request.id, true)}
                className="p-1.5 rounded-full text-white bg-green-500 hover:bg-green-600"
              >
                <CheckIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => respondToRequest(request.id, false)}
                className="p-1.5 rounded-full text-white bg-red-500 hover:bg-red-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionRequests;

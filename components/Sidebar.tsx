import React from 'react';
import type { User } from '../types';
import XIcon from './icons/XIcon';

interface SidebarProps {
  users: User[];
  currentUser: { name: string; role: string; avatarColor: string; initials: string };
  selectedUserId: string;
  onSelectUser: (id: string) => void;
  isSidebarOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, currentUser, selectedUserId, onSelectUser, isSidebarOpen, onClose, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute z-50 bg-white flex flex-col transform transition-transform duration-300 ease-in-out 
                 top-4 left-0 h-[calc(100vh-2rem)] w-72 rounded-r-xl shadow-2xl border-t border-r border-b
                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between h-16 flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-gray-100 rounded-md flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7L12 12L22 7" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold whitespace-nowrap">Bots Planet</h1>
        </div>
        <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-gray-800" aria-label="Close sidebar">
          <XIcon />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-2">
        <ul className="space-y-1">
          {users.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => onSelectUser(user.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedUserId === user.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'hover:bg-gray-100'
                }`}
                aria-label={user.name}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${user.avatarColor}`}>
                  {user.initials}
                </div>
                <div className="overflow-hidden">
                    <p className="font-medium whitespace-nowrap">{user.name}</p>
                    <p className="text-sm text-gray-500 whitespace-nowrap">{user.role}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className={`flex items-center gap-3`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${currentUser.avatarColor}`}>
            {currentUser.initials}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold whitespace-nowrap">{currentUser.name}</p>
            <p className="text-sm text-gray-500 whitespace-nowrap">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
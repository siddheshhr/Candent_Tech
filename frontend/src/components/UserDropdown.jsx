import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Sun, HelpCircle, LogOut, User } from 'lucide-react';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="rounded-full border-2 border-white p-1.5 hover:bg-white hover:text-candentBlue transition-colors"
      >
        <User size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50">
          <div className="flex flex-col items-center pb-2 border-b">
            <User size={40} className="text-gray-500" />
            <p className="text-gray-700 text-sm font-semibold mt-1">Profile Name</p>
          </div>
          <ul className="mt-2 text-gray-700">
            <li>
              <Link to="/profile" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded">
                <Pencil size={16} /> Edit Profile
              </Link>
            </li>
            <li>
              <Link to="/appearance" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded">
                <Sun size={16} /> Appearance
              </Link>
            </li>
            <li>
              <Link to="/help-support" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded">
                <HelpCircle size={16} /> Help & Support
              </Link>
            </li>
            <li>
              <Link to="/logout" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded text-red-500">
                <LogOut size={16} /> Sign Out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

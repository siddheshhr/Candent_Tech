import React, { useState } from 'react';
import { Home, Users, Briefcase, Clock, Bell, FileText, Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You would implement actual dark mode functionality here
    // document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Leads', icon: <Users size={20} /> },
    { name: 'Companies', icon: <Briefcase size={20} /> },
    { name: 'Opportunity', icon: <Clock size={20} /> },
    { name: 'Notification', icon: <Bell size={20} /> },
    { name: 'Reports', icon: <FileText size={20} /> },
  ];
  
  return (
    <div className={`bg-white text-gray-700 h-full min-h-screen transition-all duration-300 shadow-lg flex flex-col ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4 flex items-center border-b">
        {isOpen ? (
          <div className="flex items-center gap-2 w-full">
            <div className="bg-[#3B9EC1] p-1 rounded text-white">
              <Menu size={18} />
            </div>
            <span className="font-bold text-lg">Candent</span>
            <span className="text-xs text-gray-500 ml-1">Bright Minds</span>
            <button 
              onClick={toggleSidebar} 
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={toggleSidebar} 
            className="mx-auto text-black"
          >
            <Menu size={20} />
          </button>
        )}
      </div>
      
      <div className="py-2 flex-grow">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center py-3 px-4 hover:bg-gray-100 ${isOpen ? 'justify-start' : 'justify-center'}`}
          >
            <span className="text-gray-600">{item.icon}</span>
            {isOpen && <span className="ml-4">{item.name}</span>}
          </a>
        ))}
      </div>
      
      {/* Bottom section with dark mode toggle and logout */}
      <div className="border-t py-2">
        {/* Dark Mode Toggle */}
        <a
          href="#"
          className={`flex items-center py-3 px-4 hover:bg-gray-100 ${isOpen ? 'justify-start' : 'justify-center'}`}
          onClick={toggleDarkMode}
        >
          <span className="text-gray-600">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </span>
          {isOpen && <span className="ml-4">Dark Mode</span>}
        </a>
        
        {/* Logout Button */}
        <a
          href="#"
          className={`flex items-center py-3 px-4 hover:bg-gray-100 ${isOpen ? 'justify-start' : 'justify-center'}`}
        >
          <span className="text-gray-600">
            <LogOut size={20} />
          </span>
          {isOpen && <span className="ml-4">Logout</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
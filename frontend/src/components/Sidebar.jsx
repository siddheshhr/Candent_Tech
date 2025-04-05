import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Home,
  Users,
  Briefcase,
  Clock,
  Bell,
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // Adjust sidebar width based on state
  const sidebarWidth = isOpen ? 'w-64' : 'w-16';

  // Handle logout process with Toastify notification
//   import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

const handleLogout = () => {
  // Clear cookies
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  });

  // Clear storage
  localStorage.clear();
  sessionStorage.clear();

  // Show a sign-out notification
  toast.success("Signed out!", { autoClose: 1000 }); // close after 1 second
  window.location.href = "/signin";
  // Navigate to sign-in after toast
  // setTimeout(() => {
  //   navigate("/signin");
  // }, 1000);
};


  return (
    <>
      {/* Placeholder div to reserve space in the layout */}
      <div className={`${sidebarWidth} hidden md:block`}></div>
      
      <aside
        className={`
          fixed top-0 left-0 z-50 bg-white text-gray-700 border-r border-gray-200
          flex flex-col pt-4 h-screen transition-all duration-300
          ${sidebarWidth} hidden md:flex
        `}
      >
        {/* Desktop Toggle Button */}
        <div className="px-4 mb-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-2">
          <Link to="/dashboard">
            <SidebarItem icon={<Home size={20} />} label="Home" isOpen={isOpen} />
          </Link>
          <Link to="/leads">
            <SidebarItem icon={<Users size={20} />} label="Leads" isOpen={isOpen} />
          </Link>
          <Link to="/">
            <SidebarItem icon={<Briefcase size={20} />} label="Dashboard" isOpen={isOpen} />
          </Link>
          <SidebarItem icon={<Clock size={20} />} label="Opportunity" isOpen={isOpen} />
          <SidebarItem icon={<Bell size={20} />} label="Notifications" isOpen={isOpen} />
          <SidebarItem icon={<FileText size={20} />} label="Reports" isOpen={isOpen} />
        </nav>

        {/* Logout at the bottom */}
        <div className="mt-auto mb-4">
          <button onClick={handleLogout} className="w-full">
            <SidebarItem icon={<LogOut size={20} />} label="Logout" isOpen={isOpen} />
          </button>
        </div>
      </aside>
    </>
  );
};

// Single sidebar item component
const SidebarItem = ({ icon, label, isOpen }) => (
  <div
    className={`
      flex items-center px-4 py-2 hover:bg-gray-100
      ${isOpen ? 'justify-start' : 'justify-center'}
    `}
  >
    <span className="text-gray-600">{icon}</span>
    {isOpen && <span className="ml-3">{label}</span>}
  </div>
);

export default Sidebar;

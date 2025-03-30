import React from 'react';
import {Link} from 'react-router-dom';

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
  // Adjust sidebar width based on state
  const sidebarWidth = isOpen ? 'w-64' : 'w-16';

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
          <Link to="/"><SidebarItem icon={<Home size={20} />} label="Home" isOpen={isOpen} /></Link>
          <Link to="/leads"><SidebarItem icon={<Users size={20} />} label="Leads" isOpen={isOpen} /></Link>
          <Link to="/dashboard"><SidebarItem icon={<Briefcase size={20} />} label="Dashboard" isOpen={isOpen} /></Link>
          <SidebarItem icon={<Clock size={20} />} label="Opportunity" isOpen={isOpen} />
          <SidebarItem icon={<Bell size={20} />} label="Notifications" isOpen={isOpen} />
          <SidebarItem icon={<FileText size={20} />} label="Reports" isOpen={isOpen} />
        </nav>

        {/* Logout at the bottom */}
        <div className="mt-auto mb-4">
          <SidebarItem icon={<LogOut size={20} />} label="Logout" isOpen={isOpen} />
        </div>
      </aside>
    </>
  );
};

// Single sidebar item
const SidebarItem = ({ icon, label, isOpen }) => (
  <a
    href="#"
    className={`
      flex items-center px-4 py-2 hover:bg-gray-100
      ${isOpen ? 'justify-start' : 'justify-center'}
    `}
  >
    <span className="text-gray-600">{icon}</span>
    {isOpen && <span className="ml-3">{label}</span>}
  </a>
);

export default Sidebar;


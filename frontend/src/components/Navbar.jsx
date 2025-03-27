import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import ima from '../assets/logo.png';

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="bg-candentBlue text-white h-16 flex items-center px-4 justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="block md:hidden focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <img src={ima} alt="Candent Logo" className="h-10 object-contain" />
      </div>

      <nav className="hidden md:flex space-x-8">
        <Link to="/dashboard" className="font-medium hover:underline">Home</Link>
        <Link to="/leads" className="font-medium hover:underline">Leads</Link>
        <Link to="/" className="font-medium hover:underline">Opportunities</Link>
      </nav>

      <div className="flex items-center">
        <button className="rounded-full border-2 border-white p-1.5 hover:bg-white hover:text-candentBlue transition-colors">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
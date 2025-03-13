import React from 'react';
import { Menu, User } from 'lucide-react';
import ima from '../assets/logo.png';

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="bg-candentBlue text-white h-16 flex items-center px-4 justify-between shadow-md">
      {/* LEFT: Brand + Hamburger for mobile */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="block md:hidden focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <img src={ima} alt="Candent Logo" className="h-10 object-contain" />
        {/* <div className="hidden sm:flex flex-col leading-tight">
          <span className="font-bold text-base">Candent</span>
          <span className="text-sm -mt-1">Bright Minds</span>
        </div> */}
      </div>

      {/* MIDDLE: Nav links (desktop only) */}
      <nav className="hidden md:flex space-x-8">
        <a href="#" className="font-medium hover:underline">Home</a>
        <a href="#" className="font-medium hover:underline">Leads</a>
        <a href="#" className="font-medium hover:underline">Opportunities</a>
      </nav>

      {/* RIGHT: User Icon */}
      <div className="flex items-center">
        <button className="rounded-full border-2 border-white p-1.5 hover:bg-white hover:text-candentBlue transition-colors">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}

import React from 'react';
import ima from '../assets/logo.png';
import { User } from 'lucide-react';
import { NavLink } from 'react-router';

export default function Navbar() {
  return (
    <header className='bg-[#3B9EC1] text-white py-2 px-4 flex justify items-end w-full'>
        {/*Logo div*/}
        <div className='flex items-center'>
            <img src = {ima} alt='Candet-Logo' className='h-10 max-w-[14rem] object-contain pl-12'/>
        </div>

        {/*navlinks*/}
        <nav className='hidden md:flex items-center flex-1 justify-end space-x-1 pl-2 pr-2'>
            <div className='flex justify-items-center space-x-6 lg:space-x-10'>
            <a href="#" className="font-medium text-lg lg:text-xl">Home</a>
          <div className="ml-500 lg:ml-12"> {/* Adjust this margin to control right shift */}
            <a href="#" className="font-medium text-lg lg:text-xl mr-6 lg:mr-10">Leads</a>
            <a href="#" className="font-medium text-lg lg:text-xl pr-10">Opportunities</a>
          </div>
            </div>
        </nav>

         {/* Mobile Menu Button */}
      <button className="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* User Icon */}
      <div>
        <button className="rounded-full bg-[#3B9EC1] border-2 border-white p-1.5">
          <User size={24} className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
      </div>

    </header>
  );
}
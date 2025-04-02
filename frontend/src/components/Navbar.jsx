import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Avatar, Dropdown } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { HiOutlinePencilAlt, HiOutlineLogout, HiOutlineLogin } from 'react-icons/hi';
import ima from '../assets/logo.png';

export default function Navbar({ toggleSidebar }) {
  const path = useLocation().pathname;
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSignOut = () => {
    // Implement sign-out functionality here
  };

  return (
    <header className="bg-candentBlue text-white h-16 flex items-center px-4 justify-between shadow-md">
      {/* Left section: Sidebar toggle button and logo */}
      <div className="flex items-center space-x-3">
        <button onClick={toggleSidebar} className="block md:hidden focus:outline-none">
          <Menu size={24} />
        </button>
        <img src={ima} alt="Candent Logo" className="h-10 object-contain" />
      </div>

      {/* Center section: Navigation links */}
      <nav className="hidden md:flex space-x-8">
        <Link to="/dashboard" className="font-medium hover:underline">Home</Link>
        <Link to="/leads" className="font-medium hover:underline">Leads</Link>
        <Link to="/" className="font-medium hover:underline">Opportunities</Link>
      </nav>

      {/* Right section: User avatar or sign-in button */}
      <div className="flex items-center">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture || 'https://flowbite.com/docs/images/people/profile-picture-5.jpg'}
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium">{`${currentUser.firstName} ${currentUser.lastName}`}</span>
              <span className="block truncate text-sm">{currentUser.email}</span>
            </Dropdown.Header>
            <Dropdown.Item icon={HiOutlinePencilAlt}>
              <Link to="/profile" className="w-full text-left">Edit Profile</Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              icon={HiOutlineLogout}
              className="text-red-600 hover:bg-red-100"
              onClick={handleSignOut}
            >
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signin" className="flex items-center">
            <button className="bg-white text-candentBlue font-medium py-2 px-4 rounded hover:bg-opacity-90 transition-colors duration-200 flex items-center">
              <HiOutlineLogin className="mr-2" size={18} />
              Sign In
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Avatar, Dropdown } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { HiOutlinePencilAlt, HiOutlineLogout, HiOutlineLogin } from 'react-icons/hi';
import ima from '../assets/logo.png';

/**
 * Navbar Component
 * Displays the top navigation bar with logo, navigation links, and user profile menu.
 *
 * Features:
 * - Shows logo and sidebar toggle button.
 * - Displays navigation links (Home, Leads, Opportunities).
 * - Shows user avatar and dropdown menu if logged in, or Sign In button if not.
 * - Handles sign out by clearing cookies, localStorage, and sessionStorage.
 */
export default function Navbar({ toggleSidebar }) {
  const path = useLocation().pathname;
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSignOut = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
  
    // Optionally clear localStorage/sessionStorage if used
    localStorage.clear();
    sessionStorage.clear();
  
    // Redirect to sign-in page
    window.location.href = "/signin"; // adjust path as per your routing setup
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
        {/* Home link */}
        {currentUser?.role !== 'client' && (
          <Link to="/" className="font-medium hover:underline">Home</Link>
        )}
        {/* Leads link (always visible) */}
        <Link to="/leads" className="font-medium hover:underline">Leads</Link>
        {/* Opportunities link */}
        {currentUser?.role !== 'client' && (
          <Link to="/opportunities" className="font-medium hover:underline">Opportunities</Link>
        )}
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
import React from 'react';
import ima from '../assets/logo.png';
import { Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
//footer component 
const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo and Social Media */}
          <div className="flex flex-col">
            <div className="mb-2">
              <img src={ima} alt="Candet-Logo" className="h-10 max-w-[14rem] object-contain" />
            </div>
            <div className="flex space-x-2 pl-2">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={16} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={16} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube size={16} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Section */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Section</h4>
            <ul className="text-sm text-gray-400">
              <li className="mb-1"><a href="#" className="hover:text-white">Home</a></li>
              <li className="mb-1"><a href="#" className="hover:text-white">About Us</a></li>
              <li className="mb-1"><a href="#" className="hover:text-white">Team collaboration</a></li>
            </ul>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Security</h4>
            <ul className="text-sm text-gray-400">
              <li className="mb-1"><a href="#" className="hover:text-white">Terms & Privacy</a></li>
              <li className="mb-1"><a href="#" className="hover:text-white">Manage Cookies</a></li>
              <li className="mb-1"><a href="#" className="hover:text-white">Settings</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Contact Us</h4>
            <ul className="text-sm text-gray-400">
              <li className="mb-1"><a href="#" className="hover:text-white">Email</a></li>
              <li className="mb-1"><a href="#" className="hover:text-white">Contact Number</a></li>
              <li className="mb-1"><a href="#" className="hover:text-white">Help & Support Guide</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

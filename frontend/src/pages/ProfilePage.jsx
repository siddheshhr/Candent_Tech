import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Alice Smith",
    role: "HR",
    company: "Details",
    email: "alicesmth@gmail.com",
    gender: "Select",
    dob: "",
  });
  const [profileImage, setProfileImage] = useState(
    "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col w-full">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <label className={`relative ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  )}
                </label>
                <div className="text-center sm:text-left w-full">
                  <h2 className="text-xl font-semibold">{formData.fullName}</h2>
                  <p className="text-gray-500 text-sm">{formData.role}</p>
                  <p className="text-gray-500 text-sm">{formData.email}</p>
                </div>
              </div>
              <button
                onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                className="bg-[#4C8EA6] text-white px-4 py-2 rounded-md text-sm font-medium mt-4 sm:mt-0"
              >
                {isEditing ? "Save" : "Edit Profile"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", name: "fullName", type: "text" },
                { label: "Company", name: "company", type: "text" },
                { label: "Role", name: "role", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Gender", name: "gender", type: "select", options: ["Select", "Male", "Female"] },
                { label: "DOB", name: "dob", type: "date" }
              ].map(({ label, name, type, options }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-gray-600 text-sm font-medium">{label}</label>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      placeholder={label}
                      value={formData[name]}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

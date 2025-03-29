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
    // Here you would typically save the form data to a backend
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Profile Content */}
        <main className="flex-1 p-4 bg-gray-70 overflow-x-hidden overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
            {/* Header with Profile Image and Edit Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <label className={`relative ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
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
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2 m-0">
                    {formData.fullName}
                    <span className="text-sm font-normal text-gray-500">
                      {formData.role}
                    </span>
                  </h2>
                  <p className="text-gray-500 text-sm m-0">{formData.email}</p>
                </div>
              </div>
              <button
                onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                className="bg-[#4C8EA6] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#3d7286]"
              >
                {isEditing ? "Save" : "Edit Profile"}
              </button>
            </div>

            {/* Profile Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Details"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="HR"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none appearance-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                >
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              {/* DOB */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">DOB</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  // Local state for profile form
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    role: currentUser?.role || "",
    company: currentUser?.company || "",
    email: currentUser?.email || "",
    gender: currentUser?.gender || "Select",
    contactNumber: currentUser?.phoneNumber || "",
    profilePicture: currentUser?.profilePicture || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch latest profile from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:3000/user/profile', {
        method: 'GET',
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          role: data.role || "",
          company: data.company || "",
          email: data.email || "",
          gender: data.gender || "Select",
          contactNumber: data.phoneNumber || "",
          profilePicture: data.profilePicture || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile picture change
  const handleProfilePicture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData((f) => ({ ...f, profilePicture: reader.result }));
    reader.readAsDataURL(file);
  };

  // Toggle edit mode and save if needed
  const handleEditToggle = async () => {
    if (isEditing) {
      await handleUpdateProfile();
      await fetchProfile();
    }
    setIsEditing((prev) => !prev);
  };

  // Update profile
  const handleUpdateProfile = async () => {
    setUpdateMessage(null);
    setUpdateError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setUpdateError(data.message || "Failed to update profile");
      }
    } catch (error) {
      setUpdateError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar isOpen={false} toggleSidebar={() => {}} />
      <div className="flex-1 flex flex-col w-full">
        <Navbar toggleSidebar={() => {}} />
        <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                {/* Profile image with upload */}
                <div className="relative">
                  <img
                    src={
                      formData.profilePicture ||
                      "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        id="profilePic"
                        onChange={handleProfilePicture}
                        className="hidden"
                      />
                      <label
                        htmlFor="profilePic"
                        className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer"
                      >
                        Edit
                      </label>
                    </>
                  )}
                </div>
                <div className="text-center sm:text-left w-full">
                  <h2 className="text-xl font-semibold">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-gray-500 text-sm">{formData.role}</p>
                  <p className="text-gray-500 text-sm">{formData.email}</p>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className="bg-[#4C8EA6] text-white px-4 py-2 rounded-md text-sm font-medium mt-4 sm:mt-0"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Edit Profile'}
              </button>
            </div>
            {updateMessage && (
              <div className="text-center text-sm text-green-600 mb-4">
                {updateMessage}
              </div>
            )}
            {updateError && (
              <div className="text-center text-sm text-red-600 mb-4">
                {updateError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full p-3 border rounded-md text-sm outline-none bg-gray-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                >
                  <option value="Select">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-sm font-medium">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                />
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
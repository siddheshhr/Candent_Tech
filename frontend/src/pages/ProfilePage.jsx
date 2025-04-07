import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfilePage = () => {
  // Retrieve current user from Redux state
  const currentUser = useSelector((state) => state.user.currentUser);

  // Local state for profile form
  const [formData, setFormData] = useState({
    fullName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "",
    role: currentUser ? currentUser.role : "",
    company: currentUser ? currentUser.company || "" : "",
    email: currentUser ? currentUser.email : "",
    gender: currentUser ? currentUser.gender || "Select" : "Select",
    contactNumber: currentUser ? currentUser.phoneNumber || "" : ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch the latest user profile from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:3000/user/profile', {
        method: 'GET',
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          fullName: `${data.firstName} ${data.lastName}`,
          role: data.role,
          company: data.company || "",
          email: data.email,
          gender: data.gender || "Select",
          contactNumber: data.phoneNumber || ""
        });
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Toggle edit mode and, if saving, update the profile then refresh
  const handleEditToggle = async () => {
    if (isEditing) {
      await handleUpdateProfile();
      await fetchProfile();
    } else {
      setIsEditing(true);
    }
  };

  // Update form data when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update the profile by calling the backend API using the userId from Redux
  const handleUpdateProfile = async () => {
    setUpdateMessage(null);
    setUpdateError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent with the request
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
      console.error("Error updating profile:", error);
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
                {/* Static profile image, no upload functionality */}
                <img
                  src={
                    currentUser && currentUser.profilePicture
                      ? currentUser.profilePicture
                      : "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="text-center sm:text-left w-full">
                  <h2 className="text-xl font-semibold">{formData.fullName}</h2>
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
              {[
                { label: "First Name", name: "firstName", type: "text" },
                { label: "Last Name", name: "lastName", type: "text" },
                { label: "Company", name: "company", type: "text" },
                { label: "Role", name: "role", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Gender", name: "gender", type: "select", options: ["Select", "Male", "Female"] },
                { label: "Contact Number", name: "contactNumber", type: "text" }
              ].map(({ label, name, type, options }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-gray-600 text-sm font-medium">{label}</label>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={formData[name] || ''}
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
                      value={formData[name] || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-3 border rounded-md text-sm outline-none ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                    />
                  )}
                </div>
              ))}
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

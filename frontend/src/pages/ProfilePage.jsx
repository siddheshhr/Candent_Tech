import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Alert } from 'flowbite-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  // Retrieve current user from Redux state
  const { currentUser, loading } = useSelector((state) => state.user);

  // Initialize form data using Redux values
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || '',
    role: currentUser?.role || '',
    gender: 'Select',
    company: 'Details Inc.' // This could be retrieved from Redux if available
  });

  // Update formData if currentUser changes
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/user/profile', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          dispatch({ type: 'UPDATE_SUCCESS', payload: data });
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, [dispatch]);
  

  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle editing mode
  const handleEditToggle = () => {
    if (isEditing) {
      // When switching from edit mode to view mode, save the changes
      handleUpdateProfile();
    } else {
      setIsEditing(true);
    }
  };

  // Update the form data when the user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to update the profile
  const handleUpdateProfile = async () => {
    setUpdateMessage(null);
    setUpdateError(null);
    
    if (Object.keys(formData).length === 0) {
      setUpdateError('No changes made');
      return;
    }

    try {
      // Use updateStart dispatch similar to reference code
      dispatch({ type: 'UPDATE_START' });
      setIsLoading(true);
      
      // Use the absolute URL with the correct backend port
      const res = await fetch(`http://localhost:3000/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      
        
      if (!res.ok) {
        const errorData = await res.text();
        let errorMessage;
        try {
          // Try to parse as JSON if possible
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.message || 'Failed to update profile';
        } catch (e) {
          // If not JSON, use text response
          errorMessage = errorData || `Error: ${res.status} ${res.statusText}`;
        }
        
        dispatch({ type: 'UPDATE_FAILURE', payload: errorMessage });
        setUpdateError(errorMessage);
      } else {
        const data = await res.json();
        dispatch({ type: 'UPDATE_SUCCESS', payload: data });
        setUpdateMessage('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch({ type: 'UPDATE_FAILURE', payload: error.message });
      setUpdateError(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fullName = `${formData.firstName} ${formData.lastName}`;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar isOpen={false} toggleSidebar={() => {}} />
      <div className="flex-1 flex flex-col w-full">
        <Navbar toggleSidebar={() => {}} />
        <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                {/* Profile image */}
                <img
                  src={currentUser?.profilePicture || "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="text-center sm:text-left w-full">
                  <h2 className="text-xl font-semibold">{fullName}</h2>
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
            
            {/* Display update message if any */}
            {updateMessage && (
              <Alert color="success" className="mb-4">
                {updateMessage}
              </Alert>
            )}
            
            {/* Display update error if any */}
            {updateError && (
              <Alert color="failure" className="mb-4">
                {updateError}
              </Alert>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "First Name", name: "firstName", type: "text" },
                { label: "Last Name", name: "lastName", type: "text" },
                { label: "Company", name: "company", type: "text" },
                { label: "Role", name: "role", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Contact Number", name: "phoneNumber", type: "text" },
                { label: "Gender", name: "gender", type: "select", options: ["Select", "Male", "Female"] }
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
        </main>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
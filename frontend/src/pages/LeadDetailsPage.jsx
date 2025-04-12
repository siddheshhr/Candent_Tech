import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';

function LeadDetailPage() {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching lead with ID:", id);
        
        // Make sure to use the correct backend API endpoint
        const response = await axios.get(`http://localhost:3000/api/leads/${id}`, {
          withCredentials: true,
        });
        
        console.log("API Response:", response.data);
        
        if (response.data.success) {
          setLead(response.data.data);
        } else {
          toast.error("Failed to fetch lead details");
        }
      } catch (error) {
        console.error("Error fetching lead details:", error);
        toast.error(error.response?.data?.message || "An error occurred while fetching lead details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLeadDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate('/leads');
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-xl text-gray-600">Lead not found</p>
          <button 
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lead Details</h1>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Leads
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            {lead.profilePicture ? (
              <img 
                src={lead.profilePicture} 
                alt={lead.name}
                className="w-20 h-20 rounded-full object-cover mr-4" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                <span className="text-2xl text-gray-600">{lead.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{lead.name}</h2>
              <p className="text-gray-600">{lead.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Personal Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {lead.email}</p>
                <p><span className="font-medium">Personal Email:</span> {lead.personalEmail}</p>
                <p><span className="font-medium">Contact:</span> {lead.contact}</p>
                <p><span className="font-medium">Birthdate:</span> {new Date(lead.birthdate).toLocaleDateString()}</p>
                <p><span className="font-medium">Lead Added:</span> {new Date(lead.leadAddedDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Description</h3>
              <p className="text-gray-700">{lead.description}</p>
            </div>
          </div>

          {lead.company && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {lead.company.name}</p>
                  <p><span className="font-medium">Domain:</span> {lead.company.domain}</p>
                  <p><span className="font-medium">Contact:</span> {lead.company.contact}</p>
                  <p><span className="font-medium">Address:</span> {lead.company.address}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">City:</span> {lead.company.city}</p>
                  <p><span className="font-medium">State:</span> {lead.company.state}</p>
                  <p><span className="font-medium">Country:</span> {lead.company.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Using contacts from the lead object instead of company.members */}
          {lead.contacts && lead.contacts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Company Members</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Role</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.contacts.map((member, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4">{member.name}</td>
                        <td className="py-2 px-4">{member.designation}</td>
                        <td className="py-2 px-4">{member.email}</td>
                        <td className="py-2 px-4">{member.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Using phases from the lead object instead of company.phases */}
          {lead.phases && lead.phases.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Phases</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left">Phase Name</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.phases.map((phase, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4">{phase.name}</td>
                        <td className="py-2 px-4">{new Date(phase.date).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{phase.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadDetailPage;
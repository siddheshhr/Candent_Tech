import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LeadCard from '../components/LeadCard';
import LeadDescription from '../components/LeadDescription';
import ContactsTable from '../components/ContactsTable';
import CustomizePhases from '../components/CustomizePhases';
import CommentSection from '../components/CommentSection';

function LeadDetailPage() {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchLeadDetails() {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/leads/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setLead(res.data.data);
        } else {
          toast.error('Failed to fetch lead details');
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Error fetching lead details');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchLeadDetails();
  }, [id]);

  const handleGoBack = () => navigate('/leads');

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex h-screen bg-white-100">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
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
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-2 bg-gray-70 mt-[30px] overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto mb-[50px] bg-white rounded-lg shadow-md p-4">
            <div className="flex space-x-4 mb-4">
              <LeadCard
                name={lead.name || 'Soham Shriram'}
                designation={lead.role || 'HR'}
                company={lead.company?.name || 'Tilekar Groups'}
                dateAdded={
                  new Date(lead.leadAddedDate || '2025-01-27T17:00:00').toLocaleString()
                }
                imageUrl="https://placehold.co/64x64"
              />
              <LeadDescription
                description={
                  lead.description ||
                  'A comprehensive CRM management system to streamline customer interactions, track leads, and enhance relationship management and building a best platform for customers and...'
                }
              />
            </div>

            <ContactsTable leadId={id} contacts={lead.contacts || []} setLead={setLead} />
            <CustomizePhases leadId={id} phases={lead.phases || []} setLead={setLead} />

            <div className="bg-white rounded-lg shadow-md mb-4 p-6">
              <CommentSection leadId={id} />
            </div>
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

export default LeadDetailPage;

// src/pages/PersonalLeadPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams }        from 'react-router-dom';
import axios                from 'axios';
import Sidebar              from '../components/Sidebar';
import Navbar               from '../components/Navbar';
import Footer               from '../components/Footer';
import LeadCard             from '../components/LeadCard';
import LeadDescription      from '../components/LeadDescription';
import ContactsTable        from '../components/ContactsTable';
import CustomizePhases      from '../components/CustomizePhases';
import CommentSection       from '../components/CommentSection';

export default function PersonalLeadPage() {
  const { id } = useParams();
  const [lead, setLead]         = useState(null);
  const [phases, setPhases]     = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:3000/api/leads/${id}`,
          { withCredentials: true }
        );
        if (!data.success) throw new Error(data.message);

        const L = data.data;
        // pull out your phases & contacts from the lead document
        setLead({
          id:          L._id,
          name:        L.name,
          designation: L.role,
          company:     L.company?.name,
          dateAdded:   new Date(L.leadAddedDate).toLocaleString(),
          imageUrl:    L.profilePicture || 'https://via.placeholder.com/64',
          description: L.description,
          contacts:    L.contacts,      // use the embedded contacts array
        });
        // build the phases array for CustomizePhases
        setPhases(
          (L.phases || []).map(p => ({
            id:     p._id,
            name:   p.name,
            date:   p.date ? new Date(p.date).toLocaleDateString() : '',
            status: p.date && new Date(p.date) <= new Date() ? 'completed' : 'pending'
          }))
        );
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to fetch lead');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)   return <div className="p-6 text-red-600">{error}</div>;
  if (!lead)  return <div className="p-6">No lead found.</div>;

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(o => !o)} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <LeadCard
              name={lead.name}
              designation={lead.designation}
              company={lead.company}
              dateAdded={lead.dateAdded}
              imageUrl={lead.imageUrl}
            />

            <LeadDescription description={lead.description} />

            <ContactsTable contacts={lead.contacts} />

            <CustomizePhases phases={phases} setPhases={setPhases} />

            {/* now the discussion will always render */}
            <CommentSection leadId={id} />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

// import React from 'react';
// import { useState } from 'react';
// import Navbar from '../components/Navbar';
// import Sidebar from '../components/Sidebar';
// import LeadCard from '../components/LeadCard';
// import LeadDescription from '../components/LeadDescription';
// import ContactsTable from '../components/ContactsTable';
// import CustomizePhases from '../components/CustomizePhases';
// import Discussion from '../components/Discussion';
// import Footer from '../components/Footer';
// import Soham from '../assets/Soham.png';

// function PersonalLeadPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   return (
//     <div className="flex w-full min-h-screen">
//       <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1">
//         <Navbar toggleSidebar={toggleSidebar} />
//         <main className="pt-16 px-6 pb-12 max-w-screen-xl mx-auto">
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <LeadCard
//                 name="Soham Shriram"
//                 designation="HR"
//                 company="Tilikor Groups"
//                 dateAdded="27/01/2024 at 5:00 PM"
//                 imageUrl={Soham}
//               />
//               <LeadDescription
//                 description="A comprehensive CRM management system to streamline customer 
//                 interactions, track leads, and enhance relationship management and creating a 
//                 best platform for Customers."
//               />
//             </div>
//             <ContactsTable />
//             <CustomizePhases />
//             <Discussion />
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default PersonalLeadPage;


// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';
// import Sidebar from '../components/Sidebar';
// import LeadCard from '../components/LeadCard';
// import LeadDescription from '../components/LeadDescription';
// import ContactsTable from '../components/ContactsTable';
// import CustomizePhases from '../components/CustomizePhases';
// import Discussion from '../components/Discussion';
// import Footer from '../components/Footer';
// import Soham from '../assets/Soham.png';

// function PersonalLeadPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   return (
//     <div className="flex w-full min-h-screen">
//       <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1">
//         <Navbar toggleSidebar={toggleSidebar} />
//         <main className="pt-16 px-4 md:px-6 pb-12 max-w-screen-xl mx-auto">
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//               <LeadCard
//                 name="Soham Shriram"
//                 designation="HR"
//                 company="Tilikor Groups"
//                 dateAdded="27/01/2024 at 5:00 PM"
//                 imageUrl={Soham}
//               />
//               <LeadDescription
//                 description="A comprehensive CRM management system to streamline customer 
//                 interactions, track leads, and enhance relationship management."
//               />
//             </div>
//             <ContactsTable />
//             <CustomizePhases />
//             <Discussion />
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default PersonalLeadPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LeadCard from '../components/LeadCard';
import LeadDescription from '../components/LeadDescription';
import ContactsTable from '../components/ContactsTable';
import CustomizePhases from '../components/CustomizePhases';
import Discussion from '../components/Discussion';

const PersonalLeadPage = () => {
  const { id } = useParams(); // Get lead ID from URL
  const [lead, setLead] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/leads/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          const leadData = response.data.data;
          setLead({
            name: leadData.name,
            designation: leadData.role || 'N/A', // Adjust based on backend schema
            company: leadData.company?.name || 'N/A',
            dateAdded: new Date(leadData.leadAddedDate).toLocaleString(),
            imageUrl: leadData.profilePicture || 'https://via.placeholder.com/64',
            description: leadData.description || 'No description available.',
            contacts: leadData.companyMembers || [],
            phases: leadData.company.phases.map((p) => ({
              id: p._id || Math.random(), // Use backend ID if available, otherwise temp
              name: p.name,
              date: p.date,
              status: p.date && new Date(p.date) <= new Date() ? 'completed' : 'pending',
            })),
          });
        }
      } catch (error) {
        console.error('Error fetching lead:', error);
        alert('Failed to fetch lead details.');
      }
    };
    fetchLead();
  }, [id]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!lead) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
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
            <CustomizePhases phases={lead.phases} setPhases={() => {}} /> {/* setPhases is a placeholder */}
            <Discussion />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PersonalLeadPage;
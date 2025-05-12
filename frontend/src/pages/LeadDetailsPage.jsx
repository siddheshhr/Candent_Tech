// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Sidebar from '../components/Sidebar';
// import CommentSection from '../components/CommentSection';
// import {
//   Trash2,
//   Plus,
//   ChevronDown,
//   ChevronUp,
//   Search,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';

// function LeadDetailPage() {
//   const [lead, setLead] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // Phase editing state
//   const [isEditingPhase, setIsEditingPhase] = useState(false);
//   const [editingPhase, setEditingPhase] = useState(null);
//   const [newPhase, setNewPhase] = useState({ name: '', date: '' });

//   // Contacts search & sort
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('asc');

//   useEffect(() => {
//     async function fetchLeadDetails() {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `http://localhost:3000/api/leads/${id}`,
//           { withCredentials: true }
//         );
//         if (res.data.success) {
//           setLead(res.data.data);
//         } else {
//           toast.error('Failed to fetch lead details');
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error(err.response?.data?.message || 'Error fetching lead details');
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) fetchLeadDetails();
//   }, [id]);

//   const handleGoBack = () => navigate('/leads');

//   // Phase handlers
//   const handleUpdatePhase = async (phase) => {
//     try {
//       const res = await axios.put(
//         `http://localhost:3000/api/leads/${id}/phases/${phase._id || phase.id}`,
//         { name: phase.name, date: phase.date },
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         setLead(prev => ({
//           ...prev,
//           phases: prev.phases.map(p =>
//             (p._id === phase._id || p.id === phase.id)
//               ? { ...p, name: phase.name, date: phase.date }
//               : p
//           ),
//         }));
//         setEditingPhase(null);
//         toast.success('Phase updated successfully');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to update phase');
//     }
//   };

//   const handleAddPhase = async () => {
//     if (!newPhase.name || !newPhase.date) {
//       toast.error('Name and date are required');
//       return;
//     }
//     try {
//       const res = await axios.post(
//         `http://localhost:3000/api/leads/${id}/phases`,
//         { name: newPhase.name, date: newPhase.date },
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         setLead(prev => ({
//           ...prev,
//           phases: [...prev.phases, { ...res.data.data, id: res.data.data._id }]
//         }));
//         setNewPhase({ name: '', date: '' });
//         setIsEditingPhase(false);
//         toast.success('Phase added successfully');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to add phase');
//     }
//   };

//   const handleDeletePhase = async (phaseId) => {
//     try {
//       const res = await axios.delete(
//         `http://localhost:3000/api/leads/${id}/phases/${phaseId}`,
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         setLead(prev => ({
//           ...prev,
//           phases: prev.phases.filter(p => p._id !== phaseId && p.id !== phaseId)
//         }));
//         toast.success('Phase deleted successfully');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to delete phase');
//     }
//   };

//   // Contacts handlers
//   const toggleSortOrder = () =>
//     setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));

//   // Fixed contacts access - use lead.contacts directly as in original code
//   const filteredContacts = lead?.contacts?.filter(c =>
//     c.name.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

//   const sortedContacts = [...filteredContacts].sort((a, b) =>
//     sortOrder === 'asc'
//       ? a.name.localeCompare(b.name)
//       : b.name.localeCompare(a.name)
//   );

//   if (loading) {
//     return (
//       <div className="flex h-screen">
//         <Sidebar />
//         <div className="flex-1 flex items-center justify-center">
//           <p className="text-xl text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!lead) {
//     return (
//       <div className="flex h-screen">
//         <Sidebar />
//         <div className="flex-1 flex flex-col items-center justify-center">
//           <p className="text-xl text-gray-600">Lead not found</p>
//           <button
//             onClick={handleGoBack}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Back to Leads
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 overflow-auto">
//         {/* Top Navigation Bar */}
//         <div className="bg-[#5CBBDB] text-white p-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Candent</h1>
//           <div className="flex items-center space-x-4">
//             <span>Home</span>
//             <span className="font-bold">Leads</span>
//             <span>Opportunities</span>
//             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-blue-500">
//               <span>👤</span>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-6xl mx-auto p-4">
//           {/* Lead Profile */}
//           <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
//             <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
//               <span className="text-xl text-gray-600">
//                 {lead.name?.charAt(0) || 'S'}
//               </span>
//             </div>
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold">{lead.name}</h2>
//               <p className="text-gray-600">{lead.role}</p>
//               <p className="text-gray-500 text-sm">{lead.company?.name}</p>
//               <div className="mt-1 text-sm text-gray-500">
//                 Added on{' '}
//                 {new Date(lead.leadAddedDate).toLocaleDateString()}{' '}
//                 at{' '}
//                 {new Date(lead.leadAddedDate).toLocaleTimeString([], {
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </div>
//             </div>
//             <div className="bg-blue-50 rounded-lg p-4 w-1/2">
//               <h3 className="font-semibold text-gray-700 mb-1">Description:</h3>
//               <p className="text-sm text-gray-600">
//                 {lead.description}{' '}
//                 <span className="text-blue-500 cursor-pointer">
//                   Read More
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Contacts Section */}
//           <div className="bg-white rounded-lg shadow-md mb-4">
//             <div className="bg-[#4B7889] text-white p-3 flex justify-between items-center rounded-t-lg">
//               <h2 className="text-lg font-semibold">Contacts</h2>
//               <button className="bg-white text-black px-3 py-1 rounded flex items-center text-sm">
//                 <Plus size={16} className="mr-1" /> Add Contact
//               </button>
//             </div>

//             <div className="p-3 flex justify-between items-center bg-gray-50">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search Name"
//                   value={searchTerm}
//                   onChange={e => setSearchTerm(e.target.value)}
//                   className="pl-9 pr-3 py-1 border rounded-full w-64 text-sm"
//                 />
//                 <Search
//                   size={16}
//                   className="absolute left-3 top-2 text-gray-400"
//                 />
//               </div>

//               <button
//                 onClick={toggleSortOrder}
//                 className="flex items-center text-sm font-medium hover:text-blue-600"
//               >
//                 Alphabet ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
//                 {sortOrder === 'asc' ? (
//                   <ChevronDown size={16} className="ml-1" />
//                 ) : (
//                   <ChevronUp size={16} className="ml-1" />
//                 )}
//               </button>
//             </div>

//             <div className="bg-blue-50 mx-3 my-2 rounded">
//               <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm font-semibold text-gray-700">
//                 <div>Name</div>
//                 <div>Email</div>
//                 <div>Contact</div>
//                 <div>Designation</div>
//               </div>
//               <div className="px-3 pb-3">
//                 {sortedContacts.length > 0 ? (
//                   sortedContacts.map((c, i) => (
//                     <div
//                       key={i}
//                       className="grid grid-cols-4 gap-4 p-3 bg-white rounded mb-2 text-sm"
//                     >
//                       <div>{c.name}</div>
//                       <div>{c.email}</div>
//                       <div>{c.contact}</div>
//                       <div>{c.designation}</div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="bg-white rounded p-3 text-center text-gray-500">
//                     No contacts found
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-center items-center gap-1 p-3 bg-gray-50 rounded-b-lg">
//               <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200">
//                 <ChevronLeft size={14} />
//               </button>
//               <button className="w-6 h-6 flex items-center justify-center text-sm bg-blue-500 text-white rounded">
//                 1
//               </button>
//               <button className="w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-200 rounded">
//                 2
//               </button>
//               <button className="w-6 h-6 flex items-center justify-center text-sm">
//                 ...
//               </button>
//               <button className="w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-200 rounded">
//                 9
//               </button>
//               <button className="w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-200 rounded">
//                 10
//               </button>
//               <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200">
//                 <ChevronRight size={14} />
//               </button>
//             </div>
//           </div>

//           {/* Customize Phases */}
//           <div className="bg-white rounded-lg shadow-md mb-4">
//             <div className="bg-[#4B7889] p-3 flex justify-between items-center rounded-t-lg">
//               <h2 className="text-white font-semibold">Customize Phases</h2>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => {
//                     setEditingPhase({ name: '', date: '' });
//                     setIsEditingPhase(true);
//                   }}
//                   className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#4B7889]"
//                 >
//                   <Plus size={16} />
//                 </button>
//                 <button
//                   onClick={() => setIsEditingPhase(prev => !prev)}
//                   className="bg-white text-black px-3 py-1 rounded text-sm"
//                 >
//                   Edit
//                 </button>
//               </div>
//             </div>
//             <div className="p-4 bg-gray-50">
//               <div className="relative pt-8">
//                 {/* Progress Bar */}
//                 <div className="absolute top-4 left-0 w-full">
//                   <div className="h-1 bg-gray-200 rounded-full">
//                     <div
//                       className="h-full bg-blue-500 rounded-full transition-all duration-300"
//                       style={{ width: `${(lead.phases || []).length > 0
//                         ? `${(lead.phases.filter((p, i) => i < 3).length /
//                           lead.phases.length) * 100}%`
//                         : '0%'}`
//                       }}
//                     />
//                   </div>
//                 </div>
//                 {/* Phase Circles */}
//                 <div className="flex justify-between relative">
//                   {(lead.phases || []).length > 0 ? (
//                     lead.phases.map((phase, idx) => (
//                       <div key={idx} className="flex flex-col items-center text-center">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
//                             idx < 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                           }`}
//                         >
//                           {idx + 1}
//                         </div>
//                         <span className="text-xs font-medium">{phase.name}</span>
//                         <span className="text-xs text-gray-500">
//                           {new Date(phase.date).toLocaleDateString()}
//                         </span>
//                         {isEditingPhase && (
//                           <button 
//                             onClick={() => handleDeletePhase(phase._id || phase.id)}
//                             className="mt-1 text-red-500 hover:text-red-700"
//                           >
//                             <Trash2 size={12} />
//                           </button>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-center text-gray-500 w-full">No phases yet.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Discussion Section */}
//           <div className="bg-white rounded-lg shadow-md mb-4 p-6">
//             <CommentSection leadId={id} />
//           </div>
//         </div>
//       </div>

//       {/* Edit / Add Phase Modal */}
//       {isEditingPhase && editingPhase && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-xl font-semibold mb-4">
//               {editingPhase._id ? 'Edit Phase' : 'Add Phase'}
//             </h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   value={editingPhase.name}
//                   onChange={e =>
//                     setEditingPhase(prev => ({ ...prev, name: e.target.value }))
//                   }
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
//                              focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Date</label>
//                 <input
//                   type="date"
//                   value={editingPhase.date?.split('T')[0] || ''}
//                   onChange={e =>
//                     setEditingPhase(prev => ({ ...prev, date: e.target.value }))
//                   }
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
//                              focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setEditingPhase(null);
//                   setIsEditingPhase(false);
//                 }}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   if (editingPhase._id) {
//                     handleUpdatePhase(editingPhase);
//                   } else {
//                     handleAddPhase(editingPhase);
//                   }
//                 }}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LeadDetailPage;

////////////////-----------new code------------------/////////////////////

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

// LeadDetailPage component to display detailed information about a lead
function LeadDetailPage() {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch lead details when the component mounts or the lead ID changes
  useEffect(() => {
    async function fetchLeadDetails() {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/leads/${id}`,
          { withCredentials: true }
        );
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

  // Navigate back to the leads list
  const handleGoBack = () => navigate('/leads');

  // Display loading state
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

  // Display message if lead is not found
  if (!lead) {
    return (
      <div className="flex h-screen bg-white-100">
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
    <div className="flex flex-col min-h-screen bg-white-100">
      {/* Navbar */}
      <div className="relative z-10">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="relative z-0">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <div className="min-w-[1000px] mx-auto p-4 flex-1">
            {/* Lead card and description */}
            <div className="flex space-x-4 mb-4">
              <LeadCard
                name={lead.name || 'Soham Shriram'}
                designation={lead.role || 'HR'}
                company={lead.company?.name || 'Tilekar Groups'}
                dateAdded={
                  new Date(lead.leadAddedDate || '2025-01-27T17:00:00').toLocaleString()
                }
                imageUrl="https://placehold.co/64x64" // Updated to fix placeholder image error
              />
              <LeadDescription
                description={
                  lead.description ||
                  'A comprehensive CRM management system to streamline customer interactions, track leads, and enhance relationship management and building a best platform for customers and...'
                }
              />
            </div>

            {/* Other components */}
            <ContactsTable leadId={id} contacts={lead.contacts || []} setLead={setLead} />
            <CustomizePhases leadId={id} phases={lead.phases || []} setLead={setLead} />
            <div className="bg-white rounded-lg shadow-md mb-4 p-6">
              <CommentSection leadId={id} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default LeadDetailPage;
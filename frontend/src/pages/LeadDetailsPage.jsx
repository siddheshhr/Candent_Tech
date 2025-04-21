// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Sidebar from '../components/Sidebar';

// function LeadDetailPage() {
//   const [lead, setLead] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLeadDetails = async () => {
//       try {
//         setLoading(true);
//         console.log("Fetching lead with ID:", id);
        
//         // Make sure to use the correct backend API endpoint
//         const response = await axios.get(`http://localhost:3000/api/leads/${id}`, {
//           withCredentials: true,
//         });
        
//         console.log("API Response:", response.data);
        
//         if (response.data.success) {
//           setLead(response.data.data);
//         } else {
//           toast.error("Failed to fetch lead details");
//         }
//       } catch (error) {
//         console.error("Error fetching lead details:", error);
//         toast.error(error.response?.data?.message || "An error occurred while fetching lead details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchLeadDetails();
//     }
//   }, [id]);

//   const handleGoBack = () => {
//     navigate('/leads');
//   };

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
//       <div className="flex-1 overflow-auto p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Lead Details</h1>
//           <button 
//             onClick={handleGoBack}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//           >
//             Back to Leads
//           </button>
//         </div>

//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex items-center mb-6">
//             {lead.profilePicture ? (
//               <img 
//                 src={lead.profilePicture} 
//                 alt={lead.name}
//                 className="w-20 h-20 rounded-full object-cover mr-4" 
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mr-4">
//                 <span className="text-2xl text-gray-600">{lead.name.charAt(0)}</span>
//               </div>
//             )}
//             <div>
//               <h2 className="text-xl font-bold">{lead.name}</h2>
//               <p className="text-gray-600">{lead.role}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-semibold mb-3 border-b pb-2">Personal Information</h3>
//               <div className="space-y-2">
//                 <p><span className="font-medium">Email:</span> {lead.email}</p>
//                 <p><span className="font-medium">Personal Email:</span> {lead.personalEmail}</p>
//                 <p><span className="font-medium">Contact:</span> {lead.contact}</p>
//                 <p><span className="font-medium">Birthdate:</span> {new Date(lead.birthdate).toLocaleDateString()}</p>
//                 <p><span className="font-medium">Lead Added:</span> {new Date(lead.leadAddedDate).toLocaleDateString()}</p>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-3 border-b pb-2">Description</h3>
//               <p className="text-gray-700">{lead.description}</p>
//             </div>
//           </div>

//           {lead.company && (
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold mb-3 border-b pb-2">Company Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <p><span className="font-medium">Name:</span> {lead.company.name}</p>
//                   <p><span className="font-medium">Domain:</span> {lead.company.domain}</p>
//                   <p><span className="font-medium">Contact:</span> {lead.company.contact}</p>
//                   <p><span className="font-medium">Address:</span> {lead.company.address}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p><span className="font-medium">City:</span> {lead.company.city}</p>
//                   <p><span className="font-medium">State:</span> {lead.company.state}</p>
//                   <p><span className="font-medium">Country:</span> {lead.company.country}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Using contacts from the lead object instead of company.members */}
//           {lead.contacts && lead.contacts.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold mb-3 border-b pb-2">Company Members</h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="py-2 px-4 text-left">Name</th>
//                       <th className="py-2 px-4 text-left">Role</th>
//                       <th className="py-2 px-4 text-left">Email</th>
//                       <th className="py-2 px-4 text-left">Contact</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {lead.contacts.map((member, index) => (
//                       <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                         <td className="py-2 px-4">{member.name}</td>
//                         <td className="py-2 px-4">{member.designation}</td>
//                         <td className="py-2 px-4">{member.email}</td>
//                         <td className="py-2 px-4">{member.contact}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Using phases from the lead object instead of company.phases */}
//           {lead.phases && lead.phases.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold mb-3 border-b pb-2">Phases</h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="py-2 px-4 text-left">Phase Name</th>
//                       <th className="py-2 px-4 text-left">Date</th>
//                       <th className="py-2 px-4 text-left">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {lead.phases.map((phase, index) => (
//                       <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                         <td className="py-2 px-4">{phase.name}</td>
//                         <td className="py-2 px-4">{new Date(phase.date).toLocaleDateString()}</td>
//                         <td className="py-2 px-4">{phase.status}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LeadDetailPage;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Sidebar from '../components/Sidebar';
// import { Trash2, Edit } from 'lucide-react'; // Import icons for delete and edit

// function LeadDetailPage() {
//   const [lead, setLead] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isEditingPhase, setIsEditingPhase] = useState(false);
//   const [editingPhase, setEditingPhase] = useState(null);
//   const [newPhase, setNewPhase] = useState({ name: '', date: '' });

//   useEffect(() => {
//     const fetchLeadDetails = async () => {
//       try {
//         setLoading(true);
//         console.log("Fetching lead with ID:", id);
        
//         const response = await axios.get(`http://localhost:3000/api/leads/${id}`, {
//           withCredentials: true,
//         });
        
//         console.log("API Response:", response.data);
        
//         if (response.data.success) {
//           setLead(response.data.data);
//         } else {
//           toast.error("Failed to fetch lead details");
//         }
//       } catch (error) {
//         console.error("Error fetching lead details:", error);
//         toast.error(error.response?.data?.message || "An error occurred while fetching lead details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchLeadDetails();
//     }
//   }, [id]);

//   const handleGoBack = () => {
//     navigate('/leads');
//   };

//   // Update phase in database and local state
//   const handleUpdatePhase = async (phase) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:3000/api/leads/${id}/phases/${phase._id || phase.id}`,
//         { name: phase.name, date: phase.date },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setLead((prev) => ({
//           ...prev,
//           phases: prev.phases.map((p) =>
//             p._id === phase._id || p.id === phase.id ? { ...p, name: phase.name, date: phase.date } : p
//           ),
//         }));
//         setEditingPhase(null);
//         toast.success("Phase updated successfully");
//       }
//     } catch (error) {
//       console.error("Error updating phase:", error);
//       toast.error("Failed to update phase");
//     }
//   };

//   // Add new phase to database and local state
//   const handleAddPhase = async () => {
//     if (!newPhase.name || !newPhase.date) {
//       toast.error("Name and date are required");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/leads/${id}/phases`,
//         { name: newPhase.name, date: newPhase.date },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setLead((prev) => ({
//           ...prev,
//           phases: [...prev.phases, { ...response.data.data, id: response.data.data._id || Date.now() }],
//         }));
//         setNewPhase({ name: '', date: '' });
//         setIsEditingPhase(false);
//         toast.success("Phase added successfully");
//       }
//     } catch (error) {
//       console.error("Error adding phase:", error);
//       toast.error("Failed to add phase");
//     }
//   };

//   // Delete phase from database and local state
//   const handleDeletePhase = async (phaseId) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:3000/api/leads/${id}/phases/${phaseId}`,
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setLead((prev) => ({
//           ...prev,
//           phases: prev.phases.filter((p) => p._id !== phaseId && p.id !== phaseId),
//         }));
//         toast.success("Phase deleted successfully");
//       }
//     } catch (error) {
//       console.error("Error deleting phase:", error);
//       toast.error("Failed to delete phase");
//     }
//   };

//   // Delete contact from database and local state
//   const handleDeleteContact = async (contactId) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:3000/api/leads/${id}/contacts/${contactId}`,
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setLead((prev) => ({
//           ...prev,
//           contacts: prev.contacts.filter((c) => c._id !== contactId && c.id !== contactId),
//         }));
//         toast.success("Contact deleted successfully");
//       }
//     } catch (error) {
//       console.error("Error deleting contact:", error);
//       toast.error("Failed to delete contact");
//     }
//   };

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
//       <div className="flex-1 overflow-auto p-6">
//         <div className="max-w-4xl mx-auto space-y-6">
//           {/* Lead Details and Description in Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Lead Card */}
//             <div className="bg-white rounded-lg shadow-md p-6 flex items-start space-x-4">
//               {lead.profilePicture ? (
//                 <img 
//                   src={lead.profilePicture} 
//                   alt={lead.name}
//                   className="w-16 h-16 rounded-full object-cover mr-4" 
//                 />
//               ) : (
//                 <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
//                   <span className="text-xl text-gray-600">{lead.name.charAt(0)}</span>
//                 </div>
//               )}
//               <div>
//                 <h2 className="text-xl font-semibold">{lead.name}</h2>
//                 <p className="text-gray-600">{lead.role}</p>
//                 <p className="text-gray-500 text-sm">{lead.company?.name || 'Tilekar Groups'}</p>
//                 <p className="text-gray-400 text-sm mt-1">Added on {new Date(lead.leadAddedDate).toLocaleString()}</p>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="bg-[#EBFAFF] rounded-lg shadow-md p-6 border border-blue-300">
//               <h2 className="text-lg font-semibold mb-4">Description</h2>
//               <p className="text-gray-700 line-clamp-2">
//                 {lead.description || 'No description available.'}
//               </p>
//               {lead.description && lead.description.length > 150 && (
//                 <button className="text-blue-500 hover:text-blue-600 text-sm mt-2">
//                   Read More
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Contacts */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="bg-[#4B7889] text-white p-4 flex justify-between items-center">
//               <h1 className="text-2xl font-semibold">Contacts</h1>
//               <button className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2">
//                 <span>Add Contact</span>
//               </button>
//             </div>
//             <div className="p-4 flex justify-between items-center border-b">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search Name"
//                   className="pl-10 pr-4 py-2 border rounded-full w-[300px]"
//                 />
//               </div>
//               <button className="flex items-center gap-1 font-medium hover:text-blue-600">
//                 Alphabet (A-Z) <span className="rotate-180"></span>
//               </button>
//             </div>
//             <div className="bg-[#EBFAFF] rounded-lg mx-4 my-2">
//               <div className="grid grid-cols-5 gap-4 px-6 py-4 font-semibold text-gray-700">
//                 <div>Name</div>
//                 <div>Email</div>
//                 <div>Contact</div>
//                 <div>Designation</div>
//                 <div>Actions</div> {/* Added for delete button */}
//               </div>
//               <div className="px-4 pb-4">
//                 {lead.contacts && lead.contacts.length > 0 ? (
//                   lead.contacts.map((contact, index) => (
//                     <div key={index} className="grid grid-cols-5 gap-4 p-4 bg-white rounded-lg shadow-md mb-3">
//                       <div>{contact.name}</div>
//                       <div>{contact.email}</div>
//                       <div>{contact.contact}</div>
//                       <div>{contact.designation}</div>
//                       <div>
//                         <button
//                           onClick={() => handleDeleteContact(contact._id || contact.id)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-500 p-4">No contacts available.</p>
//                 )}
//               </div>
//             </div>
//             <div className="flex justify-center items-center gap-2 p-4 border-t">
//               <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded">
                
//               </button>
//               <button className="w-8 h-8 flex items-center justify-center">1</button>
//               <button className="w-8 h-8 flex items-center justify-center">2</button>
//               <button className="w-8 h-8 flex items-center justify-center">...</button>
//               <button className="w-8 h-8 flex items-center justify-center">9</button>
//               <button className="w-8 h-8 flex items-center justify-center">10</button>
//               <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded">
//               </button>
//             </div>
//           </div>

//           {/* Customize Phases */}
//           <div className="bg-white rounded-lg shadow-md">
//             <div className="bg-[#4B7889] p-4 rounded-t-lg flex justify-between items-center">
//               <h2 className="text-white text-xl font-bold">Customize Phases</h2>
//               <button
//                 onClick={() => setIsEditingPhase(!isEditingPhase)}
//                 className="bg-gray-50 flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-400"
//               >
//                 <Edit size={16} />
//                 <span>{isEditingPhase ? 'Done' : 'Edit'}</span>
//               </button>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-b-lg">
//               <div className="relative">
//                 <div className="absolute top-4 left-0 w-full">
//                   <div className="h-1 bg-gray-200 rounded">
//                     <div
//                       className="h-full bg-green-500 rounded transition-all duration-300"
//                       style={{
//                         width: `${(lead.phases.filter(p => new Date(p.date) <= new Date()).length / lead.phases.length) * 100}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-between mb-2 relative mt-6">
//                   {lead.phases && lead.phases.length > 0 ? (
//                     lead.phases.map((phase, index) => (
//                       <div key={index} className="flex flex-col items-center text-center w-1/5">
//                         {isEditingPhase ? (
//                           <div className="relative">
//                             <div
//                               className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 relative z-10 cursor-pointer ${
//                                 new Date(phase.date) <= new Date() ? 'bg-green-500 text-white' : 'bg-gray-200'
//                               }`}
//                               onClick={() => setEditingPhase(phase)}
//                             >
//                               {index + 1}
//                             </div>
//                             <button
//                               onClick={() => handleDeletePhase(phase._id || phase.id)}
//                               className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                         ) : (
//                           <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 relative z-10 ${
//                               new Date(phase.date) <= new Date() ? 'bg-green-500 text-white' : 'bg-gray-200'
//                             }`}
//                           >
//                             {index + 1}
//                           </div>
//                         )}
//                         <span className="text-sm font-medium">{phase.name}</span>
//                         <span className="text-xs text-gray-500 mt-1">{new Date(phase.date).toLocaleDateString()}</span>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-center text-gray-500 p-4">No phases available.</p>
//                   )}
//                 </div>
//               </div>
//               {isEditingPhase && (
//                 <button
//                   onClick={() => setEditingPhase({ name: '', date: '', id: Date.now() })}
//                   className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                 >
//                   <span>Add Phase</span>
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Edit Phase Modal */}
//           {editingPhase && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//               <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                 <h3 className="text-xl font-semibold mb-4">Edit Phase</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Name</label>
//                     <input
//                       type="text"
//                       value={editingPhase.name}
//                       onChange={(e) => setEditingPhase({ ...editingPhase, name: e.target.value })}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Date</label>
//                     <input
//                       type="date"
//                       value={editingPhase.date ? editingPhase.date.split('T')[0] : ''}
//                       onChange={(e) => setEditingPhase({ ...editingPhase, date: e.target.value })}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     onClick={() => setEditingPhase(null)}
//                     className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       if (editingPhase.id.toString().startsWith('new')) handleAddPhase();
//                       else handleUpdatePhase(editingPhase);
//                     }}
//                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Discussion */}
//           <div className="bg-white rounded-lg shadow-md">
//             <div className="bg-[#4B7889] px-6 py-4 flex items-center justify-between rounded-t-lg">
//               <div className="flex items-center space-x-2">
//                 <span className="text-white font-bold">Discussion</span>
//               </div>
//               <button>
//                 <span className="text-white">▼</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LeadDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import { Trash2, Edit, Plus, ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight, MessageCircle, ThumbsUp, Clock, Filter } from 'lucide-react';
import Footer from '../components/Footer';
function LeadDetailPage() {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditingPhase, setIsEditingPhase] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [newPhase, setNewPhase] = useState({ name: '', date: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeTab, setActiveTab] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample discussion data
  const discussions = [
    {
      id: 1,
      author: "Alex Johnson",
      avatar: "/api/placeholder/32/32",
      title: "Approach for client onboarding",
      content: "I've been following a 3-step process for client onboarding that has improved retention rates by 40%. Would anyone be interested in learning more about this?",
      likes: 24,
      comments: 8,
      time: "3 days ago",
      tags: ["onboarding", "client retention"]
    },
    {
      id: 2,
      author: "Sarah Miller",
      avatar: "/api/placeholder/32/32",
      title: "Payment integration issues",
      content: "Has anyone else experienced delays with the payment processing system? We're seeing about 10% of transactions taking over 24 hours to complete.",
      likes: 12,
      comments: 15,
      time: "1 week ago",
      tags: ["payment", "technical"]
    },
    {
      id: 3,
      author: "David Park",
      avatar: "/api/placeholder/32/32",
      title: "New lead qualification checklist",
      content: "I've created a comprehensive checklist for qualifying leads that has helped us improve conversion rates by 25%. Happy to share with the team.",
      likes: 32,
      comments: 5,
      time: "2 days ago",
      tags: ["leads", "conversion"]
    }
  ];

  const filteredDiscussions = discussions.filter(discussion => 
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/leads/${id}`, {
          withCredentials: true,
        });
        
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

  const handleUpdatePhase = async (phase) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/leads/${id}/phases/${phase._id || phase.id}`,
        { name: phase.name, date: phase.date },
        { withCredentials: true }
      );
      if (response.data.success) {
        setLead((prev) => ({
          ...prev,
          phases: prev.phases.map((p) =>
            p._id === phase._id || p.id === phase.id ? { ...p, name: phase.name, date: phase.date } : p
          ),
        }));
        setEditingPhase(null);
        toast.success("Phase updated successfully");
      }
    } catch (error) {
      console.error("Error updating phase:", error);
      toast.error("Failed to update phase");
    }
  };

  const handleAddPhase = async () => {
    if (!newPhase.name || !newPhase.date) {
      toast.error("Name and date are required");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/leads/${id}/phases`,
        { name: newPhase.name, date: newPhase.date },
        { withCredentials: true }
      );
      if (response.data.success) {
        setLead((prev) => ({
          ...prev,
          phases: [...prev.phases, { ...response.data.data, id: response.data.data._id || Date.now() }],
        }));
        setNewPhase({ name: '', date: '' });
        setIsEditingPhase(false);
        toast.success("Phase added successfully");
      }
    } catch (error) {
      console.error("Error adding phase:", error);
      toast.error("Failed to add phase");
    }
  };

  const handleDeletePhase = async (phaseId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/leads/${id}/phases/${phaseId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setLead((prev) => ({
          ...prev,
          phases: prev.phases.filter((p) => p._id !== phaseId && p.id !== phaseId),
        }));
        toast.success("Phase deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting phase:", error);
      toast.error("Failed to delete phase");
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/leads/${id}/contacts/${contactId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setLead((prev) => ({
          ...prev,
          contacts: prev.contacts.filter((c) => c._id !== contactId && c.id !== contactId),
        }));
        toast.success("Contact deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredContacts = lead?.contacts?.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

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
      <div className="flex-1 overflow-auto">
        {/* Top Navigation Bar */}
        <div className="bg-[#5CBBDB] text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Candent</h1>
          <div className="flex items-center space-x-4">
            <span>Home</span>
            <span className="font-bold">Leads</span>
            <span>Opportunities</span>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-blue-500">
              <span>👤</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4">
          {/* Lead Profile */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
              <span className="text-xl text-gray-600">{lead.name?.charAt(0) || 'S'}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{lead.name || 'Soham Shriram'}</h2>
              <p className="text-gray-600">{lead.role || 'HR'}</p>
              <p className="text-gray-500 text-sm">{lead.company?.name || 'Tilekar Groups'}</p>
              <div className="mt-1 text-sm text-gray-500">
                Added on {new Date(lead.leadAddedDate || '2023-07-10').toLocaleDateString()} at {new Date(lead.leadAddedDate || '2023-07-10').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 w-1/2">
              <h3 className="font-semibold text-gray-700 mb-1">Description:</h3>
              <p className="text-sm text-gray-600">
                {lead.description || 'A comprehensive CRM management system to streamline customer interactions, track leads, and enhance relationship management and creating a best platform for Customers and...'}
                <span className="text-blue-500 cursor-pointer">Read More</span>
              </p>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="bg-white rounded-lg shadow-md mb-4">
            <div className="bg-[#4B7889] text-white p-3 flex justify-between items-center rounded-t-lg">
              <h2 className="text-lg font-semibold">Contacts</h2>
              <button className="bg-white text-black px-3 py-1 rounded flex items-center text-sm">
                <Plus size={16} className="mr-1" /> Add Contact
              </button>
            </div>
            
            <div className="p-3 flex justify-between items-center bg-gray-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1 border rounded-full w-64 text-sm"
                />
                <Search size={16} className="absolute left-3 top-2 text-gray-400" />
              </div>
              
              <button 
                onClick={toggleSortOrder}
                className="flex items-center text-sm font-medium hover:text-blue-600"
              >
                Alphabet ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                {sortOrder === 'asc' ? 
                  <ChevronDown size={16} className="ml-1" /> : 
                  <ChevronUp size={16} className="ml-1" />
                }
              </button>
            </div>
            
            <div className="bg-blue-50 mx-3 my-2 rounded">
              <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm font-semibold text-gray-700">
                <div>Name</div>
                <div>Email</div>
                <div>Contact</div>
                <div>Designation</div>
              </div>
              
              <div className="px-3 pb-3">
                {sortedContacts.length > 0 ? (
                  sortedContacts.map((contact, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-white rounded mb-2 text-sm">
                      <div>{contact.name || 'Soham Shriram'}</div>
                      <div>{contact.email || 'Enquiry@gmail.com'}</div>
                      <div>{contact.contact || '9851234567'}</div>
                      <div>{contact.designation || 'HR'}</div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded p-3 text-center text-gray-500">
                    No contacts found
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-1 p-3 bg-gray-50 rounded-b-lg">
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200">
                <ChevronLeft size={14} />
              </button>
              <button className="w-6 h-6 flex items-center justify-center text-sm bg-blue-500 text-white rounded">1</button>
              <button className="w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-200 rounded">2</button>
              <button className="w-6 h-6 flex items-center justify-center text-sm">...</button>
              <button className="w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-200 rounded">9</button>
              <button className="w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-200 rounded">10</button>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Customize Phases */}
          <div className="bg-white rounded-lg shadow-md mb-4">
            <div className="bg-[#4B7889] p-3 flex justify-between items-center rounded-t-lg">
              <h2 className="text-white font-semibold">Customize Phases</h2>
              <div className="flex space-x-2">
                <button className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#4B7889]">
                  <Plus size={16} />
                </button>
                <button 
                  onClick={() => setIsEditingPhase(!isEditingPhase)}
                  className="bg-white text-black px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50">
              <div className="relative pt-8">
                {/* Progress Bar */}
                <div className="absolute top-4 left-0 w-full">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
                
                {/* Phase Circles */}
                <div className="flex justify-between relative">
                  {lead.phases && lead.phases.length > 0 ? (
                    lead.phases.map((phase, index) => (
                      <div key={index} className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                            index < 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xs font-medium">{phase.name || `Phase ${index + 1}`}</span>
                        <span className="text-xs text-gray-500">{new Date(phase.date || '2023-07-10').toLocaleDateString()}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mb-2">1</div>
                        <span className="text-xs font-medium">Customer</span>
                        <span className="text-xs text-gray-500">27/01/2023</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mb-2">2</div>
                        <span className="text-xs font-medium">Shipping</span>
                        <span className="text-xs text-gray-500">28/01/2023</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mb-2">3</div>
                        <span className="text-xs font-medium">Payment</span>
                        <span className="text-xs text-gray-500">In Progress</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-2">4</div>
                        <span className="text-xs font-medium">Confirm</span>
                        <span className="text-xs text-gray-500">Pending</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-2">5</div>
                        <span className="text-xs font-medium">Success</span>
                        <span className="text-xs text-gray-500">Pending</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* New Discussion Section */}
          <div className="bg-white rounded-lg shadow-md mb-4">
            <div 
              className="bg-[#4B7889] p-3 flex justify-between items-center rounded-t-lg cursor-pointer"
              onClick={() => setIsDiscussionOpen(!isDiscussionOpen)}
            >
              <div className="flex items-center">
                <MessageCircle size={18} className="text-white mr-2" />
                <h2 className="text-white font-semibold">Discussion</h2>
              </div>
              <button>
                {isDiscussionOpen ? 
                  <ChevronUp size={18} className="text-white" /> : 
                  <ChevronDown size={18} className="text-white" />
                }
              </button>
            </div>
            
            {isDiscussionOpen && (
              <div className="border-t border-gray-200">
                {/* Search and Filter Bar */}
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full border rounded-lg"
                    />
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <Filter size={16} />
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 text-blue-500 hover:bg-blue-50 rounded-lg font-medium">
                      <MessageCircle size={16} />
                      <span>Start Discussion</span>
                    </button>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b px-4">
                  <button 
                    className={`px-4 py-3 font-medium ${activeTab === 'newest' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('newest')}
                  >
                    Newest
                  </button>
                  <button 
                    className={`px-4 py-3 font-medium ${activeTab === 'popular' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('popular')}
                  >
                    Most Popular
                  </button>
                  <button 
                    className={`px-4 py-3 font-medium ${activeTab === 'my' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('my')}
                  >
                    My Discussions
                  </button>
                </div>
                
                {/* Discussion List */}
                <div className="divide-y">
                  {filteredDiscussions.length > 0 ? (
                    filteredDiscussions.map(discussion => (
                      <div key={discussion.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start">
                          <img 
                            src={discussion.avatar} 
                            alt={discussion.author}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{discussion.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{discussion.content}</p>
                            
                            <div className="flex gap-2 mt-2">
                              {discussion.tags.map(tag => (
                                <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 mt-3 gap-4">
                              <span className="font-medium">{discussion.author}</span>
                              <div className="flex items-center">
                                <ThumbsUp size={14} className="mr-1" />
                                <span>{discussion.likes}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageCircle size={14} className="mr-1" />
                                <span>{discussion.comments}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                <span>{discussion.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
                      <p>No discussions found. Be the first to start one!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Phase Modal */}
      {editingPhase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Phase</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingPhase.name}
                  onChange={(e) => setEditingPhase({ ...editingPhase, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={editingPhase.date ? editingPhase.date.split('T')[0] : ''}
                  onChange={(e) => setEditingPhase({ ...editingPhase, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingPhase(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdatePhase(editingPhase)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadDetailPage;
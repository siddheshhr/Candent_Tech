// import React, { useState } from 'react';
// import { Camera, Pencil, Plus, Trash2 } from 'lucide-react';

// export default function LeadForm() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     profilePicture: '',
//     name: '',
//     role: '',
//     contact: '',
//     email: '',
//     personalEmail: '',
//     address: '',
//     birthdate: '',
//     companyName: '',
//     companyDomain: '',
//     companyAddress: '',
//     companyContact: '',
//     companyCity: '',
//     companyState: '',
//     companyCountry: '',
//     companyMembers: [
//       { role: 'CEO', name: '', email: '', contact: '' },
//       { role: 'HR', name: '', email: '', contact: '' }
//     ],
//     phases: [{ name: '', date: '' }],
//     leadAddedDate: new Date().toISOString().split('T')[0]
//   });

//   const validateForm = () => {
//     const newErrors = {};

//     // Validate personal details
//     if (!formData.name) newErrors.name = 'Name is required';
//     if (!formData.role) newErrors.role = 'Role is required';
//     if (!formData.contact) newErrors.contact = 'Contact is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     if (!formData.personalEmail) newErrors.personalEmail = 'Personal email is required';
//     if (!formData.address) newErrors.address = 'Address is required';
//     if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';

//     // Validate company details
//     if (!formData.companyName) newErrors.companyName = 'Company name is required';
//     if (!formData.companyDomain) newErrors.companyDomain = 'Company domain is required';
//     if (!formData.companyAddress) newErrors.companyAddress = 'Company address is required';
//     if (!formData.companyContact) newErrors.companyContact = 'Company contact is required';
//     if (!formData.companyCity) newErrors.companyCity = 'City is required';
//     if (!formData.companyState) newErrors.companyState = 'State is required';
//     if (!formData.companyCountry) newErrors.companyCountry = 'Country is required';

//     // Validate company members
//     formData.companyMembers.forEach((member, index) => {
//       if (!member.role) newErrors[`member${index}role`] = 'Role is required';
//       if (!member.name) newErrors[`member${index}name`] = 'Name is required';
//       if (!member.email) newErrors[`member${index}email`] = 'Email is required';
//       if (!member.contact) newErrors[`member${index}contact`] = 'Contact is required';
//     });

//     // Validate phases
//     formData.phases.forEach((phase, index) => {
//       if (!phase.name) newErrors[`phase${index}name`] = 'Phase name is required';
//       if (!phase.date) newErrors[`phase${index}date`] = 'Phase date is required';
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = () => {
//     if (validateForm()) {
//       setIsEditing(false);
//       // Handle form submission here
//     }
//   };

//   const handlePhaseChange = (index, field, value) => {
//     const newPhases = [...formData.phases];
//     newPhases[index] = { ...newPhases[index], [field]: value };
//     setFormData({ ...formData, phases: newPhases });
//   };

//   const addPhase = () => {
//     setFormData({
//       ...formData,
//       phases: [...formData.phases, { name: '', date: '' }]
//     });
//   };

//   const removePhase = (index) => {
//     const newPhases = formData.phases.filter((_, i) => i !== index);
//     setFormData({ ...formData, phases: newPhases });
//   };

//   const handleProfilePicture = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData({ ...formData, profilePicture: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCompanyMemberChange = (index, field, value) => {
//     const newMembers = [...formData.companyMembers];
//     newMembers[index] = { ...newMembers[index], [field]: value };
//     setFormData({ ...formData, companyMembers: newMembers });
//   };

//   const addCompanyMember = () => {
//     setFormData({
//       ...formData,
//       companyMembers: [...formData.companyMembers, { role: '', name: '', email: '', contact: '' }]
//     });
//   };

//   const removeCompanyMember = (index) => {
//     const newMembers = formData.companyMembers.filter((_, i) => i !== index);
//     setFormData({ ...formData, companyMembers: newMembers });
//   };

//   const inputClass = `w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none border-0`;
//   const errorInputClass = `w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none text-red-500`;
  
//   // New input classes for nested fields with borders
//   const nestedInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-gray-300`;
//   const nestedErrorInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-red-500 text-red-500`;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-semibold text-gray-800 font-poppins">Lead Information</h1>
//         <button
//           onClick={isEditing ? handleSave : () => setIsEditing(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Pencil size={18} />
//           {isEditing ? 'Save' : 'Edit'}
//         </button>
//       </div>

//       <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
//         {/* Profile Picture Section */}
//         <div className="flex items-center space-x-6">
//           <div className="relative">
//             <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
//               {formData.profilePicture ? (
//                 <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 <Camera size={40} className="text-gray-400" />
//               )}
//             </div>
//             <input
//               type="file"
//               id="profilePicture"
//               accept="image/*"
//               onChange={handleProfilePicture}
//               className="hidden"
//               disabled={!isEditing}
//             />
//             <label
//               htmlFor="profilePicture"
//               className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700"
//             >
//               <Camera size={16} />
//             </label>
//           </div>
//         </div>

//         {/* Personal Details Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <h2 className="text-xl font-semibold text-gray-800 col-span-full">Personal Details</h2>
          
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Name *</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               disabled={!isEditing}
//               className={errors.name ? errorInputClass : inputClass}
//               placeholder="Enter full name"
//             />
//             {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Role *</label>
//             <input
//               type="text"
//               value={formData.role}
//               onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//               disabled={!isEditing}
//               className={errors.role ? errorInputClass : inputClass}
//               placeholder="Enter role"
//             />
//             {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Contact *</label>
//             <input
//               type="tel"
//               value={formData.contact}
//               onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//               disabled={!isEditing}
//               className={errors.contact ? errorInputClass : inputClass}
//               placeholder="Enter contact number"
//             />
//             {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Email *</label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               disabled={!isEditing}
//               className={errors.email ? errorInputClass : inputClass}
//               placeholder="Enter email address"
//             />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Personal Email *</label>
//             <input
//               type="email"
//               value={formData.personalEmail}
//               onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
//               disabled={!isEditing}
//               className={errors.personalEmail ? errorInputClass : inputClass}
//               placeholder="Enter personal email"
//             />
//             {errors.personalEmail && <p className="text-red-500 text-sm">{errors.personalEmail}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Birthdate *</label>
//             <input
//               type="date"
//               value={formData.birthdate}
//               onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
//               disabled={!isEditing}
//               className={errors.birthdate ? errorInputClass : inputClass}
//             />
//             {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate}</p>}
//           </div>

//           <div className="space-y-2 col-span-full">
//             <label className="block text-sm font-medium text-gray-700">Address *</label>
//             <textarea
//               value={formData.address}
//               onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//               disabled={!isEditing}
//               className={errors.address ? errorInputClass : inputClass}
//               placeholder="Enter address"
//               rows={3}
//             />
//             {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
//           </div>
//         </div>

//         {/* Company Details Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <h2 className="text-xl font-semibold text-gray-800 col-span-full">Company Details</h2>
          
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Company Name *</label>
//             <input
//               type="text"
//               value={formData.companyName}
//               onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//               disabled={!isEditing}
//               className={errors.companyName ? errorInputClass : inputClass}
//               placeholder="Enter company name"
//             />
//             {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Company Domain *</label>
//             <input
//               type="text"
//               value={formData.companyDomain}
//               onChange={(e) => setFormData({ ...formData, companyDomain: e.target.value })}
//               disabled={!isEditing}
//               className={errors.companyDomain ? errorInputClass : inputClass}
//               placeholder="Enter company domain"
//             />
//             {errors.companyDomain && <p className="text-red-500 text-sm">{errors.companyDomain}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Company Contact *</label>
//             <input
//               type="tel"
//               value={formData.companyContact}
//               onChange={(e) => setFormData({ ...formData, companyContact: e.target.value })}
//               disabled={!isEditing}
//               className={errors.companyContact ? errorInputClass : inputClass}
//               placeholder="Enter company contact"
//             />
//             {errors.companyContact && <p className="text-red-500 text-sm">{errors.companyContact}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">City *</label>
//             <input
//               type="text"
//               value={formData.companyCity}
//               onChange={(e) => setFormData({ ...formData, companyCity: e.target.value })}
//               disabled={!isEditing}
//               className={errors.companyCity ? errorInputClass : inputClass}
//               placeholder="Enter city"
//             />
//             {errors.companyCity && <p className="text-red-500 text-sm">{errors.companyCity}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">State *</label>
//             <input
//               type="text"
//               value={formData.companyState}
//               onChange={(e) => setFormData({ ...formData, companyState: e.target.value })}
//               disabled={!isEditing}
//               className={errors.companyState ? errorInputClass : inputClass}
//               placeholder="Enter state"
//             />
//             {errors.companyState && <p className="text-red-500 text-sm">{errors.companyState}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Country *</label>
//             <input
//               type="text"
//               value={formData.companyCountry}
//               onChange={(e) => setFormData({ ...formData, companyCountry: e.target.value })}
//               disabled={!isEditing}
//               className={errors.companyCountry ? errorInputClass : inputClass}
//               placeholder="Enter country"
//             />
//             {errors.companyCountry && <p className="text-red-500 text-sm">{errors.companyCountry}</p>}
//           </div>

//           <div className="space-y-2 col-span-full">
//             <label className="block text-sm font-medium text-gray-700">Company Address *</label>
//             <textarea
//               value={formData.companyAddress}
//               onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
//               disabled={!isEditing}
//               className={errors.companyAddress ? errorInputClass : inputClass}
//               placeholder="Enter company address"
//               rows={3}
//             />
//             {errors.companyAddress && <p className="text-red-500 text-sm">{errors.companyAddress}</p>}
//           </div>

//           {/* Company Members */}
//           <div className="col-span-full space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium text-gray-800">Company Members *</h3>
//               {isEditing && (
//                 <button
//                   type="button"
//                   onClick={addCompanyMember}
//                   className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   <Plus size={18} />
//                   Add Member
//                 </button>
//               )}
//             </div>
            
//             {formData.companyMembers.map((member, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm">
//                 {isEditing && formData.companyMembers.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeCompanyMember(index)}
//                     className="absolute top-2 right-2 text-red-600 hover:text-red-700"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 )}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Role *</label>
//                   <input
//                     type="text"
//                     value={member.role}
//                     onChange={(e) => handleCompanyMemberChange(index, 'role', e.target.value)}
//                     disabled={!isEditing}
//                     className={errors[`member${index}role`] ? nestedErrorInputClass : nestedInputClass}
//                     placeholder="Enter role"
//                   />
//                   {errors[`member${index}role`] && (
//                     <p className="text-red-500 text-sm">{errors[`member${index}role`]}</p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Name *</label>
//                   <input
//                     type="text"
//                     value={member.name}
//                     onChange={(e) => handleCompanyMemberChange(index, 'name', e.target.value)}
//                     disabled={!isEditing}
//                     className={errors[`member${index}name`] ? nestedErrorInputClass : nestedInputClass}
//                     placeholder="Enter name"
//                   />
//                   {errors[`member${index}name`] && (
//                     <p className="text-red-500 text-sm">{errors[`member${index}name`]}</p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Email *</label>
//                   <input
//                     type="email"
//                     value={member.email}
//                     onChange={(e) => handleCompanyMemberChange(index, 'email', e.target.value)}
//                     disabled={!isEditing}
//                     className={errors[`member${index}email`] ? nestedErrorInputClass : nestedInputClass}
//                     placeholder="Enter email"
//                   />
//                   {errors[`member${index}email`] && (
//                     <p className="text-red-500 text-sm">{errors[`member${index}email`]}</p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Contact *</label>
//                   <input
//                     type="tel"
//                     value={member.contact}
//                     onChange={(e) => handleCompanyMemberChange(index, 'contact', e.target.value)}
//                     disabled={!isEditing}
//                     className={errors[`member${index}contact`] ? nestedErrorInputClass : nestedInputClass}
//                     placeholder="Enter contact"
//                   />
//                   {errors[`member${index}contact`] && (
//                     <p className="text-red-500 text-sm">{errors[`member${index}contact`]}</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Lead Tracking Section */}
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800">Lead Tracking</h2>
//             {isEditing && (
//               <button
//                 type="button"
//                 onClick={addPhase}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 <Plus size={18} />
//                 Add Phase
//               </button>
//             )}
//           </div>

//           <div className="space-y-4">
//             {formData.phases.map((phase, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm">
//                 {isEditing && formData.phases.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removePhase(index)}
//                     className="absolute top-2 right-2 text-red-600 hover:text-red-700"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 )}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Phase {index + 1} Name *</label>
//                   <input
//                     type="text"
//                     value={phase.name}
//                     onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
//                     disabled={!isEditing}
//                     className={errors[`phase${index}name`] ? nestedErrorInputClass : nestedInputClass}
//                     placeholder={`Enter phase ${index + 1} name`}
//                   />
//                   {errors[`phase${index}name`] && (
//                     <p className="text-red-500 text-sm">{errors[`phase${index}name`]}</p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Phase {index + 1} Date *</label>
//                   <input
//                     type="date"
//                     value={phase.date}
//                     onChange={(e) => handlePhaseChange(index, 'date', e.target.value)}
//                     disabled={!isEditing}
//                     className={errors[`phase${index}date`] ? nestedErrorInputClass : nestedInputClass}
//                   />
//                   {errors[`phase${index}date`] && (
//                     <p className="text-red-500 text-sm">{errors[`phase${index}date`]}</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Lead Added Date *</label>
//             <input
//               type="date"
//               value={formData.leadAddedDate}
//               onChange={(e) => setFormData({ ...formData, leadAddedDate: e.target.value })}
//               disabled={!isEditing}
//               className={errors.leadAddedDate ? errorInputClass : inputClass}
//             />
//             {errors.leadAddedDate && <p className="text-red-500 text-sm">{errors.leadAddedDate}</p>}
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Camera, Pencil, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LeadFormPage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true); // Start in editing mode for new lead
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profilePicture: '',
    name: '',
    role: '',
    contact: '',
    email: '',
    personalEmail: '',
    description: '', // Added description to match LeadInfo schema
    birthdate: '',
    companyName: '',
    companyDomain: '',
    companyAddress: '',
    companyContact: '',
    companyCity: '',
    companyState: '',
    companyCountry: '',
    companyMembers: [
      { role: 'CEO', name: '', email: '', contact: '' },
      { role: 'HR', name: '', email: '', contact: '' },
    ],
    phases: [
      { name: 'Customer', date: '' },
      { name: 'Shipping', date: '' },
      { name: 'Payment', date: '' },
      { name: 'Confirm', date: '' },
      { name: 'Success', date: '' },
    ],
    leadAddedDate: new Date().toISOString().split('T')[0],
  });

  const validateForm = () => {
    const newErrors = {};

    // Validate personal details
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.personalEmail) newErrors.personalEmail = 'Personal email is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';

    // Validate company details
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.companyDomain) newErrors.companyDomain = 'Company domain is required';
    if (!formData.companyAddress) newErrors.companyAddress = 'Company address is required';
    if (!formData.companyContact) newErrors.companyContact = 'Company contact is required';
    if (!formData.companyCity) newErrors.companyCity = 'City is required';
    if (!formData.companyState) newErrors.companyState = 'State is required';
    if (!formData.companyCountry) newErrors.companyCountry = 'Country is required';

    // Validate company members
    formData.companyMembers.forEach((member, index) => {
      if (!member.role) newErrors[`member${index}role`] = 'Role is required';
      if (!member.name) newErrors[`member${index}name`] = 'Name is required';
      if (!member.email) newErrors[`member${index}email`] = 'Email is required';
      if (!member.contact) newErrors[`member${index}contact`] = 'Contact is required';
    });

    // Validate phases
    formData.phases.forEach((phase, index) => {
      if (!phase.name) newErrors[`phase${index}name`] = 'Phase name is required';
      if (!phase.date) newErrors[`phase${index}date`] = 'Phase date is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/leads/add', formData);
      if (response.data.success) {
        setIsEditing(false);
        navigate('/leads', { state: { newLead: response.data.data } });
      }
    } catch (error) {
      console.error('[FRONTEND] Failed to submit lead:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to save lead' });
    }
  };

  const handlePhaseChange = (index, field, value) => {
    const newPhases = [...formData.phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setFormData({ ...formData, phases: newPhases });
  };

  const addPhase = () => {
    setFormData({
      ...formData,
      phases: [...formData.phases, { name: '', date: '' }],
    });
  };

  const removePhase = (index) => {
    const newPhases = formData.phases.filter((_, i) => i !== index);
    setFormData({ ...formData, phases: newPhases });
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyMemberChange = (index, field, value) => {
    const newMembers = [...formData.companyMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, companyMembers: newMembers });
  };

  const addCompanyMember = () => {
    setFormData({
      ...formData,
      companyMembers: [...formData.companyMembers, { role: '', name: '', email: '', contact: '' }],
    });
  };

  const removeCompanyMember = (index) => {
    const newMembers = formData.companyMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, companyMembers: newMembers });
  };

  const inputClass = `w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none border-0`;
  const errorInputClass = `w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none text-red-500`;
  const nestedInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-gray-300`;
  const nestedErrorInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-red-500 text-red-500`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 font-poppins">Add New Lead</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Pencil size={18} />
          Save Lead
        </button>
      </div>

      {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Profile Picture Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {formData.profilePicture ? (
                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera size={40} className="text-gray-400" />
              )}
            </div>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePicture}
              className="hidden"
            />
            <label
              htmlFor="profilePicture"
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700"
            >
              <Camera size={16} />
            </label>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="text-xl font-semibold text-gray-800 col-span-full">Personal Details</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? errorInputClass : inputClass}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={errors.role ? errorInputClass : inputClass}
              placeholder="Enter role"
            />
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Contact *</label>
            <input
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className={errors.contact ? errorInputClass : inputClass}
              placeholder="Enter contact number"
            />
            {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? errorInputClass : inputClass}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Personal Email *</label>
            <input
              type="email"
              value={formData.personalEmail}
              onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
              className={errors.personalEmail ? errorInputClass : inputClass}
              placeholder="Enter personal email"
            />
            {errors.personalEmail && <p className="text-red-500 text-sm">{errors.personalEmail}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Birthdate *</label>
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              className={errors.birthdate ? errorInputClass : inputClass}
            />
            {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate}</p>}
          </div>
          <div className="space-y-2 col-span-full">
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? errorInputClass : inputClass}
              placeholder="Enter description"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
        </div>

        {/* Company Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="text-xl font-semibold text-gray-800 col-span-full">Company Details</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className={errors.companyName ? errorInputClass : inputClass}
              placeholder="Enter company name"
            />
            {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Company Domain *</label>
            <input
              type="text"
              value={formData.companyDomain}
              onChange={(e) => setFormData({ ...formData, companyDomain: e.target.value })}
              className={errors.companyDomain ? errorInputClass : inputClass}
              placeholder="Enter company domain"
            />
            {errors.companyDomain && <p className="text-red-500 text-sm">{errors.companyDomain}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Company Contact *</label>
            <input
              type="tel"
              value={formData.companyContact}
              onChange={(e) => setFormData({ ...formData, companyContact: e.target.value })}
              className={errors.companyContact ? errorInputClass : inputClass}
              placeholder="Enter company contact"
            />
            {errors.companyContact && <p className="text-red-500 text-sm">{errors.companyContact}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">City *</label>
            <input
              type="text"
              value={formData.companyCity}
              onChange={(e) => setFormData({ ...formData, companyCity: e.target.value })}
              className={errors.companyCity ? errorInputClass : inputClass}
              placeholder="Enter city"
            />
            {errors.companyCity && <p className="text-red-500 text-sm">{errors.companyCity}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">State *</label>
            <input
              type="text"
              value={formData.companyState}
              onChange={(e) => setFormData({ ...formData, companyState: e.target.value })}
              className={errors.companyState ? errorInputClass : inputClass}
              placeholder="Enter state"
            />
            {errors.companyState && <p className="text-red-500 text-sm">{errors.companyState}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Country *</label>
            <input
              type="text"
              value={formData.companyCountry}
              onChange={(e) => setFormData({ ...formData, companyCountry: e.target.value })}
              className={errors.companyCountry ? errorInputClass : inputClass}
              placeholder="Enter country"
            />
            {errors.companyCountry && <p className="text-red-500 text-sm">{errors.companyCountry}</p>}
          </div>
          <div className="space-y-2 col-span-full">
            <label className="block text-sm font-medium text-gray-700">Company Address *</label>
            <textarea
              value={formData.companyAddress}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              className={errors.companyAddress ? errorInputClass : inputClass}
              placeholder="Enter company address"
              rows={3}
            />
            {errors.companyAddress && <p className="text-red-500 text-sm">{errors.companyAddress}</p>}
          </div>

          {/* Company Members */}
          <div className="col-span-full space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Company Members *</h3>
              <button
                type="button"
                onClick={addCompanyMember}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={18} />
                Add Member
              </button>
            </div>
            {formData.companyMembers.map((member, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm"
              >
                {formData.companyMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCompanyMember(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Role *</label>
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => handleCompanyMemberChange(index, 'role', e.target.value)}
                    className={errors[`member${index}role`] ? nestedErrorInputClass : nestedInputClass}
                    placeholder="Enter role"
                  />
                  {errors[`member${index}role`] && (
                    <p className="text-red-500 text-sm">{errors[`member${index}role`]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleCompanyMemberChange(index, 'name', e.target.value)}
                    className={errors[`member${index}name`] ? nestedErrorInputClass : nestedInputClass}
                    placeholder="Enter name"
                  />
                  {errors[`member${index}name`] && (
                    <p className="text-red-500 text-sm">{errors[`member${index}name`]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleCompanyMemberChange(index, 'email', e.target.value)}
                    className={errors[`member${index}email`] ? nestedErrorInputClass : nestedInputClass}
                    placeholder="Enter email"
                  />
                  {errors[`member${index}email`] && (
                    <p className="text-red-500 text-sm">{errors[`member${index}email`]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Contact *</label>
                  <input
                    type="tel"
                    value={member.contact}
                    onChange={(e) => handleCompanyMemberChange(index, 'contact', e.target.value)}
                    className={errors[`member${index}contact`] ? nestedErrorInputClass : nestedInputClass}
                    placeholder="Enter contact"
                  />
                  {errors[`member${index}contact`] && (
                    <p className="text-red-500 text-sm">{errors[`member${index}contact`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Tracking Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Lead Tracking</h2>
            <button
              type="button"
              onClick={addPhase}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={18} />
              Add Phase
            </button>
          </div>
          <div className="space-y-4">
            {formData.phases.map((phase, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm"
              >
                {formData.phases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhase(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phase {index + 1} Name *</label>
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                    className={errors[`phase${index}name`] ? nestedErrorInputClass : nestedInputClass}
                    placeholder={`Enter phase ${index + 1} name`}
                  />
                  {errors[`phase${index}name`] && (
                    <p className="text-red-500 text-sm">{errors[`phase${index}name`]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phase {index + 1} Date *</label>
                  <input
                    type="date"
                    value={phase.date}
                    onChange={(e) => handlePhaseChange(index, 'date', e.target.value)}
                    className={errors[`phase${index}date`] ? nestedErrorInputClass : nestedInputClass}
                  />
                  {errors[`phase${index}date`] && (
                    <p className="text-red-500 text-sm">{errors[`phase${index}date`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Lead Added Date *</label>
            <input
              type="date"
              value={formData.leadAddedDate}
              onChange={(e) => setFormData({ ...formData, leadAddedDate: e.target.value })}
              className={errors.leadAddedDate ? errorInputClass : inputClass}
            />
            {errors.leadAddedDate && <p className="text-red-500 text-sm">{errors.leadAddedDate}</p>}
          </div>
        </div>
      </form>
    </div>
  );
}
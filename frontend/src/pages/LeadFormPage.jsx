import React, { useState } from 'react';
import { Camera, Pencil, Plus, Trash2 } from 'lucide-react';

export default function LeadForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profilePicture: '',
    name: '',
    role: '',
    contact: '',
    email: '',
    personalEmail: '',
    address: '',
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
      { role: 'HR', name: '', email: '', contact: '' }
    ],
    phases: [{ name: '', date: '' }],
    leadAddedDate: new Date().toISOString().split('T')[0]
  });

  const validateForm = () => {
    const newErrors = {};

    // Validate personal details
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.personalEmail) newErrors.personalEmail = 'Personal email is required';
    if (!formData.address) newErrors.address = 'Address is required';
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

  const handleSave = () => {
    if (validateForm()) {
      setIsEditing(false);
      // Handle form submission here
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
      phases: [...formData.phases, { name: '', date: '' }]
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
      companyMembers: [...formData.companyMembers, { role: '', name: '', email: '', contact: '' }]
    });
  };

  const removeCompanyMember = (index) => {
    const newMembers = formData.companyMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, companyMembers: newMembers });
  };

  const inputClass = `w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none border-0`;
  const errorInputClass = `w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none text-red-500`;
  
  // New input classes for nested fields with borders
  const nestedInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-gray-300`;
  const nestedErrorInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-red-500 text-red-500`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 font-poppins">Lead Information</h1>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Pencil size={18} />
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
              className={errors.birthdate ? errorInputClass : inputClass}
            />
            {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate}</p>}
          </div>

          <div className="space-y-2 col-span-full">
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              className={errors.address ? errorInputClass : inputClass}
              placeholder="Enter address"
              rows={3}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              {isEditing && (
                <button
                  type="button"
                  onClick={addCompanyMember}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={18} />
                  Add Member
                </button>
              )}
            </div>
            
            {formData.companyMembers.map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm">
                {isEditing && formData.companyMembers.length > 1 && (
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
            {isEditing && (
              <button
                type="button"
                onClick={addPhase}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={18} />
                Add Phase
              </button>
            )}
          </div>

          <div className="space-y-4">
            {formData.phases.map((phase, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm">
                {isEditing && formData.phases.length > 1 && (
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
              disabled={!isEditing}
              className={errors.leadAddedDate ? errorInputClass : inputClass}
            />
            {errors.leadAddedDate && <p className="text-red-500 text-sm">{errors.leadAddedDate}</p>}
          </div>
        </div>
      </form>
    </div>
  );
}

// src/pages/LeadFormPage.jsx
// import React, { useState } from 'react';
// import { Camera, Pencil, Plus, Trash2 } from 'lucide-react';

// function LeadFormPage() {
//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     profilePicture: '',
//     name: '',
//     role: '',
//     contact: '',
//     email: '',
//     personalEmail: '',
//     description: '',
//     birthdate: '',
//     leadAddedDate: new Date().toISOString().split('T')[0],

//     // embedded arrays
//     companyMembers: [
//       { role: 'CEO', name: '', email: '', contact: '' },
//       { role: 'HR',  name: '', email: '', contact: '' },
//     ],
//     phases: [
//       { name: 'Customer', date: '' },
//       { name: 'Shipping', date: '' },
//       { name: 'Payment', date: '' },
//       { name: 'Confirm', date: '' },
//       { name: 'Success', date: '' },
//     ],

//     // company details
//     companyName: '',
//     companyDomain: '',
//     companyAddress: '',
//     companyContact: '',
//     companyCity: '',
//     companyState: '',
//     companyCountry: '',
//   });

//   const inputClass = `w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none`;
//   const errorInputClass = `${inputClass} border border-red-500 text-red-600`;
//   const nestedInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-gray-300`;
//   const nestedErrorInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-red-500 text-red-600`;

//   const validateForm = () => {
//     const errs = {};

//     // personal
//     if (!formData.name) errs.name = 'Required';
//     if (!formData.role) errs.role = 'Required';
//     if (!formData.contact) errs.contact = 'Required';
//     if (!formData.email) errs.email = 'Required';
//     if (!formData.personalEmail) errs.personalEmail = 'Required';
//     if (!formData.description) errs.description = 'Required';
//     if (!formData.birthdate) errs.birthdate = 'Required';

//     // company
//     if (!formData.companyName) errs.companyName = 'Required';
//     if (!formData.companyDomain) errs.companyDomain = 'Required';
//     if (!formData.companyContact) errs.companyContact = 'Required';
//     if (!formData.companyCity) errs.companyCity = 'Required';
//     if (!formData.companyState) errs.companyState = 'Required';
//     if (!formData.companyCountry) errs.companyCountry = 'Required';
//     if (!formData.companyAddress) errs.companyAddress = 'Required';

//     // members
//     formData.companyMembers.forEach((m, i) => {
//       if (!m.role)    errs[`member${i}role`]    = 'Required';
//       if (!m.name)    errs[`member${i}name`]    = 'Required';
//       if (!m.email)   errs[`member${i}email`]   = 'Required';
//       if (!m.contact) errs[`member${i}contact`] = 'Required';
//     });

//     // phases
//     formData.phases.forEach((p, i) => {
//       if (!p.name) errs[`phase${i}name`] = 'Required';
//       if (!p.date) errs[`phase${i}date`] = 'Required';
//     });

//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;
//     try {
//       const res = await axios.post(
//         'http://localhost:3000/api/leads/add',
//         formData,
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         navigate('/leads', { state: { newLead: res.data.data } });
//       }
//     } catch (err) {
//       console.error('[FRONTEND] Failed to submit lead:', err);
//       setErrors({ submit: err.response?.data?.message || 'Failed to save lead' });
//     }
//   };

//   const handleProfilePicture = e => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () =>
//       setFormData(f => ({ ...f, profilePicture: reader.result }));
//     reader.readAsDataURL(file);
//   };

//   const handleCompanyMemberChange = (i, field, val) => {
//     const cm = [...formData.companyMembers];
//     cm[i][field] = val;
//     setFormData(f => ({ ...f, companyMembers: cm }));
//   };
//   const addCompanyMember = () => {
//     setFormData(f => ({
//       ...f,
//       companyMembers: [...f.companyMembers, { role:'',name:'',email:'',contact:'' }]
//     }));
//   };
//   const removeCompanyMember = i => {
//     setFormData(f => ({
//       ...f,
//       companyMembers: f.companyMembers.filter((_,idx)=>idx!==i)
//     }));
//   };

//   const handlePhaseChange = (i, field, val) => {
//     const ph = [...formData.phases];
//     ph[i][field] = val;
//     setFormData(f => ({ ...f, phases: ph }));
//   };
//   const addPhase = () => {
//     setFormData(f => ({
//       ...f,
//       phases: [...f.phases, { name:'', date:'' }]
//     }));
//   };
//   const removePhase = i => {
//     setFormData(f => ({
//       ...f,
//       phases: f.phases.filter((_,idx)=>idx!==i)
//     }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-semibold">Add New Lead</h1>
//         <button
//           onClick={handleSave}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           <Pencil size={18}/> Save Lead
//         </button>
//       </div>

//       {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}

//       <form onSubmit={e => e.preventDefault()} className="space-y-8">
//         {/* Profile */}
//         <div className="flex items-center space-x-6">
//           <div className="relative">
//             <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
//               {formData.profilePicture
//                 ? <img src={formData.profilePicture} className="w-full h-full object-cover"/>
//                 : <Camera size={40} className="text-gray-400"/>}
//             </div>
//             <input
//               type="file"
//               accept="image/*"
//               id="profilePic"
//               onChange={handleProfilePicture}
//               className="hidden"
//               disabled={!isEditing}
//             />
//             <label
//               htmlFor="profilePic"
//               className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer"
//             >
//               <Camera size={16}/>
//             </label>
//           </div>
//         </div>

//         {/* Personal */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <h2 className="col-span-full text-xl font-semibold">Personal Details</h2>
//           {[
//             { label:'Name',         name:'name',        type:'text' },
//             { label:'Role',         name:'role',        type:'text' },
//             { label:'Contact',      name:'contact',     type:'tel' },
//             { label:'Email',        name:'email',       type:'email' },
//             { label:'Personal Email',name:'personalEmail',type:'email' },
//             { label:'Birthdate',    name:'birthdate',   type:'date' },
//           ].map(({label,name,type})=>(
//             <div key={name} className="space-y-1">
//               <label className="text-gray-700">{label} *</label>
//               <input
//                 type={type}
//                 value={formData[name]}
//                 onChange={e=>setFormData(f=>({...f,[name]:e.target.value}))}
//                 className={errors[name]?errorInputClass:inputClass}
//               />
//               {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
//             </div>
//           ))}
//           <div className="col-span-full space-y-1">
//             <label className="text-gray-700">Description *</label>
//             <textarea
//               rows={3}
//               value={formData.description}
//               onChange={e=>setFormData(f=>({...f,description:e.target.value}))}
//               className={errors.description?errorInputClass:inputClass}
//             />
//             {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
//           </div>
//         </div>

//         {/* Company */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <h2 className="col-span-full text-xl font-semibold">Company Details</h2>
//           {[
//             { label:'Company Name',   name:'companyName' },
//             { label:'Domain',         name:'companyDomain' },
//             { label:'Contact',        name:'companyContact', type:'tel' },
//             { label:'City',           name:'companyCity' },
//             { label:'State',          name:'companyState' },
//             { label:'Country',        name:'companyCountry' },
//           ].map(({label,name,type='text'})=>(
//             <div key={name} className="space-y-1">
//               <label className="text-gray-700">{label} *</label>
//               <input
//                 type={type}
//                 value={formData[name]}
//                 onChange={e=>setFormData(f=>({...f,[name]:e.target.value}))}
//                 className={errors[name]?errorInputClass:inputClass}
//               />
//               {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
//             </div>
//           ))}
//           <div className="col-span-full space-y-1">
//             <label className="text-gray-700">Address *</label>
//             <textarea
//               rows={2}
//               value={formData.companyAddress}
//               onChange={e=>setFormData(f=>({...f,companyAddress:e.target.value}))}
//               className={errors.companyAddress?errorInputClass:inputClass}
//             />
//             {errors.companyAddress && <p className="text-red-500 text-sm">{errors.companyAddress}</p>}
//           </div>
//         </div>

//         {/* Contacts */}
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Contacts</h2>
//           {formData.companyMembers.map((m,i)=>(
//             <div key={i} className="flex flex-wrap gap-2 mb-2 items-end">
//               {[
//                 { placeholder:'Role', field:'role' },
//                 { placeholder:'Name', field:'name' },
//                 { placeholder:'Email',field:'email', type:'email' },
//                 { placeholder:'Contact',field:'contact', type:'tel' },
//               ].map(({placeholder,field,type='text'})=>(
//                 <div key={field}>
//                   <input
//                     type={type}
//                     placeholder={placeholder}
//                     value={m[field]}
//                     onChange={e=>handleCompanyMemberChange(i,field,e.target.value)}
//                     className={errors[`member${i}${field}`]?nestedErrorInputClass:nestedInputClass}
//                   />
//                   {errors[`member${i}${field}`] && (
//                     <p className="text-red-500 text-sm">{errors[`member${i}${field}`]}</p>
//                   )}
//                 </div>
//               ))}
//               <button onClick={()=>removeCompanyMember(i)} className="text-red-600">
//                 <Trash2 size={18}/>
//               </button>
//             </div>
//           ))}
//           <button onClick={addCompanyMember} className="flex items-center text-green-600">
//             <Plus size={16}/> Add Contact
//           </button>
//         </div>

//         {/* Phases */}
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Phases</h2>
//           {formData.phases.map((p,i)=>(
//             <div key={i} className="flex flex-wrap gap-2 mb-2 items-end">
//               <input
//                 type="text"
//                 placeholder="Phase Name"
//                 value={p.name}
//                 onChange={e=>handlePhaseChange(i,'name',e.target.value)}
//                 className={errors[`phase${i}name`]?nestedErrorInputClass:nestedInputClass}
//               />
//               <input
//                 type="date"
//                 value={p.date}
//                 onChange={e=>handlePhaseChange(i,'date',e.target.value)}
//                 className={errors[`phase${i}date`]?nestedErrorInputClass:nestedInputClass}
//               />
//               <button onClick={()=>removePhase(i)} className="text-red-600">
//                 <Trash2 size={18}/>
//               </button>
//             </div>
//           ))}
//           <button onClick={addPhase} className="flex items-center text-green-600">
//             <Plus size={16}/> Add Phase
//           </button>
//         </div>

//         {/* Lead Added Date */}
//         <div className="space-y-1">
//           <label className="text-gray-700">Lead Added Date *</label>
//           <input
//             type="date"
//             value={formData.leadAddedDate}
//             onChange={e=>setFormData(f=>({...f,leadAddedDate:e.target.value}))}
//             className={errors.leadAddedDate?errorInputClass:inputClass}
//           />
//           {errors.leadAddedDate && <p className="text-red-500 text-sm">{errors.leadAddedDate}</p>}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default LeadFormPage;
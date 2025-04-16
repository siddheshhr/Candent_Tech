// src/pages/LeadFormPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, Plus, Trash2 } from 'lucide-react';

export default function LeadFormPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profilePicture: '',
    name: '',
    role: '',
    contact: '',
    email: '',
    personalEmail: '',
    description: '',
    birthdate: '',
    leadAddedDate: new Date().toISOString().split('T')[0],
    companyMembers: [
      { role: 'CEO', name: '', email: '', contact: '' },
      { role: 'HR', name: '', email: '', contact: '' },
    ],
    phases: [
      { name: 'Customer', date: '', status: 'Not Started' },
      { name: 'Shipping', date: '', status: 'Not Started' },
      { name: 'Payment', date: '', status: 'Not Started' },
      { name: 'Confirm', date: '', status: 'Not Started' },
      { name: 'Success', date: '', status: 'Not Started' },
    ],
    companyName: '',
    companyDomain: '',
    companyAddress: '',
    companyContact: '',
    companyCity: '',
    companyState: '',
    companyCountry: '',
  });

  const inputClass = `w-full px-4 py-2 bg-gray-50 rounded-lg focus:outline-none`;
  const errorInputClass = `${inputClass} border border-red-500 text-red-600`;
  const nestedInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-gray-300`;
  const nestedErrorInputClass = `w-full px-4 py-2 bg-white rounded-lg focus:outline-none border border-red-500 text-red-600`;

  const validateForm = () => {
    const errs = {};
    if (!formData.name) errs.name = 'Required';
    if (!formData.role) errs.role = 'Required';
    if (!formData.contact) errs.contact = 'Required';
    if (!formData.email) errs.email = 'Required';
    if (!formData.personalEmail) errs.personalEmail = 'Required';
    if (!formData.description) errs.description = 'Required';
    if (!formData.birthdate) errs.birthdate = 'Required';
    if (!formData.companyName) errs.companyName = 'Required';
    if (!formData.companyDomain) errs.companyDomain = 'Required';
    if (!formData.companyContact) errs.companyContact = 'Required';
    if (!formData.companyCity) errs.companyCity = 'Required';
    if (!formData.companyState) errs.companyState = 'Required';
    if (!formData.companyCountry) errs.companyCountry = 'Required';
    if (!formData.companyAddress) errs.companyAddress = 'Required';

    formData.companyMembers.forEach((m, i) => {
      if (!m.role) errs[`member${i}role`] = 'Required';
      if (!m.name) errs[`member${i}name`] = 'Required';
      if (!m.email) errs[`member${i}email`] = 'Required';
      if (!m.contact) errs[`member${i}contact`] = 'Required';
    });

    formData.phases.forEach((p, i) => {
      if (!p.name) errs[`phase${i}name`] = 'Required';
      if (!p.date) errs[`phase${i}date`] = 'Required';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        'http://localhost:3000/api/leads/add',
        formData,
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate('/leads');
      }
    } catch (err) {
      console.error('[FRONTEND] Failed to submit lead:', err);
      setErrors({ submit: err.response?.data?.message || 'Failed to save lead' });
    }
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((f) => ({ ...f, profilePicture: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleCompanyMemberChange = (i, field, val) => {
    const cm = [...formData.companyMembers];
    cm[i][field] = val;
    setFormData((f) => ({ ...f, companyMembers: cm }));
  };

  const addCompanyMember = () => {
    setFormData((f) => ({
      ...f,
      companyMembers: [...f.companyMembers, { role: '', name: '', email: '', contact: '' }],
    }));
  };

  const removeCompanyMember = (i) => {
    setFormData((f) => ({
      ...f,
      companyMembers: f.companyMembers.filter((_, idx) => idx !== i),
    }));
  };

  const handlePhaseChange = (i, field, val) => {
    const ph = [...formData.phases];
    ph[i][field] = val;
    setFormData((f) => ({ ...f, phases: ph }));
  };

  const addPhase = () => {
    setFormData((f) => ({
      ...f,
      phases: [...f.phases, { name: '', date: '', status: 'Not Started' }],
    }));
  };

  const removePhase = (i) => {
    setFormData((f) => ({
      ...f,
      phases: f.phases.filter((_, idx) => idx !== i),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Add New Lead</h1>
      </div>

      {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {formData.profilePicture ? (
                <img src={formData.profilePicture} className="w-full h-full object-cover" />
              ) : (
                <Camera size={40} className="text-gray-400" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              id="profilePic"
              onChange={handleProfilePicture}
              className="hidden"
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer"
            >
              <Camera size={16} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="col-span-full text-xl font-semibold">Personal Details</h2>
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Role', name: 'role', type: 'text' },
            { label: 'Contact', name: 'contact', type: 'tel' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Personal Email', name: 'personalEmail', type: 'email' },
            { label: 'Birthdate', name: 'birthdate', type: 'date' },
          ].map(({ label, name, type }) => (
            <div key={name} className="space-y-1">
              <label className="text-gray-700">{label} *</label>
              <input
                type={type}
                value={formData[name]}
                onChange={(e) => setFormData((f) => ({ ...f, [name]: e.target.value }))}
                className={errors[name] ? errorInputClass : inputClass}
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}
          <div className="col-span-full space-y-1">
            <label className="text-gray-700">Description *</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              className={errors.description ? errorInputClass : inputClass}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="col-span-full text-xl font-semibold">Company Details</h2>
          {[
            { label: 'Company Name', name: 'companyName' },
            { label: 'Domain', name: 'companyDomain' },
            { label: 'Contact', name: 'companyContact', type: 'tel' },
            { label: 'City', name: 'companyCity' },
            { label: 'State', name: 'companyState' },
            { label: 'Country', name: 'companyCountry' },
          ].map(({ label, name, type = 'text' }) => (
            <div key={name} className="space-y-1">
              <label className="text-gray-700">{label} *</label>
              <input
                type={type}
                value={formData[name]}
                onChange={(e) => setFormData((f) => ({ ...f, [name]: e.target.value }))}
                className={errors[name] ? errorInputClass : inputClass}
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}
          <div className="col-span-full space-y-1">
            <label className="text-gray-700">Address *</label>
            <textarea
              rows={2}
              value={formData.companyAddress}
              onChange={(e) => setFormData((f) => ({ ...f, companyAddress: e.target.value }))}
              className={errors.companyAddress ? errorInputClass : inputClass}
            />
            {errors.companyAddress && <p className="text-red-500 text-sm">{errors.companyAddress}</p>}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          {formData.companyMembers.map((m, i) => (
            <div key={i} className="flex flex-wrap gap-2 mb-2 items-end">
              {[
                { placeholder: 'Role', field: 'role' },
                { placeholder: 'Name', field: 'name' },
                { placeholder: 'Email', field: 'email', type: 'email' },
                { placeholder: 'Contact', field: 'contact', type: 'tel' },
              ].map(({ placeholder, field, type = 'text' }) => (
                <div key={field}>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={m[field]}
                    onChange={(e) => handleCompanyMemberChange(i, field, e.target.value)}
                    className={errors[`member${i}${field}`] ? nestedErrorInputClass : nestedInputClass}
                  />
                  {errors[`member${i}${field}`] && (
                    <p className="text-red-500 text-sm">{errors[`member${i}${field}`]}</p>
                  )}
                </div>
              ))}
              <button onClick={() => removeCompanyMember(i)} className="text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button onClick={addCompanyMember} className="flex items-center text-green-600">
            <Plus size={16} /> Add Contact
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Phases</h2>
          {formData.phases.map((p, i) => (
            <div key={i} className="flex flex-wrap gap-2 mb-2 items-end">
              <input
                type="text"
                placeholder="Phase Name"
                value={p.name}
                onChange={(e) => handlePhaseChange(i, 'name', e.target.value)}
                className={errors[`phase${i}name`] ? nestedErrorInputClass : nestedInputClass}
              />
              <input
                type="date"
                value={p.date}
                onChange={(e) => handlePhaseChange(i, 'date', e.target.value)}
                className={errors[`phase${i}date`] ? nestedErrorInputClass : nestedInputClass}
              />
              <select
                value={p.status}
                onChange={(e) => handlePhaseChange(i, 'status', e.target.value)}
                className={nestedInputClass}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Stopped">Stopped</option>
              </select>
              <button onClick={() => removePhase(i)} className="text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button onClick={addPhase} className="flex items-center text-green-600">
            <Plus size={16} /> Add Phase
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-gray-700">Lead Added Date *</label>
          <input
            type="date"
            value={formData.leadAddedDate}
            onChange={(e) => setFormData((f) => ({ ...f, leadAddedDate: e.target.value }))}
            className={errors.leadAddedDate ? errorInputClass : inputClass}
          />
          {errors.leadAddedDate && <p className="text-red-500 text-sm">{errors.leadAddedDate}</p>}
        </div>
        <button
          onClick={handleSave}
          className="flex text-center mt-10 gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Lead
        </button>
      </form>
    </div>
  );
}


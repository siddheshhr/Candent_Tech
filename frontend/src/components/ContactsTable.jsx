
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Plus, Trash2, Edit, ArrowUpDown } from 'lucide-react';

// ContactsTable component with search, sort, pagination, and total contacts display
const ContactsTable = ({ leadId, contacts: initialContacts, setLead }) => {
  // State for edit mode, currently edited contact, local contacts, pagination, search, and sorting
  const [isEditing, setIsEditing] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contacts, setContacts] = useState(initialContacts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const contactsPerPage = 5;

  // Fetch lead data on mount to ensure contacts are up-to-date with the backend
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/leads/${leadId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setLead(res.data.data);
          setContacts(res.data.data.contacts || []);
        } else {
          toast.error('Failed to fetch lead data');
        }
      } catch (err) {
        console.error('Error fetching lead data:', err);
        toast.error('Error fetching lead data');
      }
    };

    if (leadId) {
      fetchLeadData();
    }
  }, [leadId, setLead]);

  // Function to refetch lead data when needed (e.g., after a 404 error)
  const refetchLead = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/leads/${leadId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLead(res.data.data);
        setContacts(res.data.data.contacts || []);
        return res.data.data;
      } else {
        toast.error('Failed to refresh lead data');
        return null;
      }
    } catch (err) {
      console.error('Error refetching lead:', err);
      toast.error('Error refreshing lead data');
      return null;
    }
  };

  // Handle adding a new contact
  const handleSubmit = async () => {
    if (!editingContact?.name || !editingContact?.email || !editingContact?.contact || !editingContact?.designation) {
      toast.error('All fields are required');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:3000/api/leads/${leadId}/contacts`,
        editingContact,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLead((prev) => ({
          ...prev,
          contacts: [...prev.contacts, res.data.data],
        }));
        setContacts((prev) => [...prev, res.data.data]);
        setEditingContact(null);
        toast.success('Contact added successfully');
      }
    } catch (err) {
      console.error('Add Contact Error:', err);
      if (err.response?.status === 404) {
        toast.error('Lead not found. Refreshing data...');
        await refetchLead();
      } else {
        toast.error('Failed to add contact: ' + (err.response?.data?.message || 'Unknown error'));
      }
      setEditingContact(null);
    }
  };

  // Handle deleting a contact
  const handleDeleteContact = async (contactId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/leads/${leadId}/contacts/${contactId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLead((prev) => ({
          ...prev,
          contacts: prev.contacts.filter((c) => c._id !== contactId),
        }));
        setContacts((prev) => prev.filter((c) => c._id !== contactId));
        const totalPages = Math.ceil(contacts.length / contactsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        toast.success('Contact deleted successfully');
      }
    } catch (err) {
      console.error('Delete Contact Error:', err);
      if (err.response?.status === 404) {
        toast.error('Contact or lead not found. Refreshing data...');
        await refetchLead();
      } else {
        toast.error('Failed to delete contact: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  // Handle search: Filter contacts based on name or designation
  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.designation.toLowerCase().includes(query)
    );
  });

  // Handle sorting: Sort contacts based on the selected field and direction
  const sortedContacts = [...filteredContacts];
  if (sortConfig.key) {
    sortedContacts.sort((a, b) => {
      const aValue = a[sortConfig.key].toLowerCase();
      const bValue = b[sortConfig.key].toLowerCase();
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Handle sort toggle when a column header is clicked
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  // Pagination logic: Apply pagination to filtered and sorted contacts
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = sortedContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(sortedContacts.length / contactsPerPage);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      {/* Header with title, search bar on the left, and total contacts/edit button on the right */}
      <div className="bg-[#4B7889] p-3 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center space-x-3">
          <h2 className="text-white font-semibold">Contacts</h2>
          {/* Search input - moved to the left and increased width */}
          <input
            type="text"
            placeholder="Search by name or designation..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-64" // Increased width using w-64
          />
        </div>
        <div className="flex space-x-2 items-center">
          {/* Display total contacts */}
          <span className="text-white text-sm">
            Total Contacts: {filteredContacts.length}
          </span>
          {isEditing && (
            <button
              onClick={() => {
                setEditingContact({ name: '', email: '', contact: '', designation: '' });
              }}
              className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#4B7889]"
            >
              <Plus size={16} />
            </button>
          )}
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="bg-white text-black px-3 py-1 rounded text-sm"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>
      {/* Contacts table */}
      <div className="p-4">
        {sortedContacts.length > 0 ? (
          <>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 cursor-pointer" onClick={() => handleSort('name')}>
                    Name
                    {sortConfig.key === 'name' && (
                      <ArrowUpDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  <th className="p-2 cursor-pointer" onClick={() => handleSort('email')}>
                    Email
                    {sortConfig.key === 'email' && (
                      <ArrowUpDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  <th className="p-2 cursor-pointer" onClick={() => handleSort('contact')}>
                    Contact
                    {sortConfig.key === 'contact' && (
                      <ArrowUpDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  <th className="p-2 cursor-pointer" onClick={() => handleSort('designation')}>
                    Designation
                    {sortConfig.key === 'designation' && (
                      <ArrowUpDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  {isEditing && <th className="p-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentContacts.map((contact) => (
                  <tr key={contact._id} className="border-b">
                    <td className="p-2">{contact.name}</td>
                    <td className="p-2">{contact.email}</td>
                    <td className="p-2">{contact.contact}</td>
                    <td className="p-2">{contact.designation}</td>
                    {isEditing && (
                      <td className="p-2 flex space-x-2">
                        <button
                          onClick={() => setEditingContact({ ...contact })}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 p-4">
            {searchQuery ? 'No matching contacts found.' : 'No contacts yet.'}
          </p>
        )}
      </div>

      {/* Modal for adding a contact */}
      {editingContact && isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Contact</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingContact.name}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editingContact.email}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  value={editingContact.contact}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, contact: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  value={editingContact.designation}
                  onChange={(e) =>
                    setEditingContact({ ...editingContact, designation: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingContact(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTable;
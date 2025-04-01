// import React, { useState } from 'react';
// import { Search, ChevronDown, Plus, X } from 'lucide-react';

// const initialContacts = [
//   { name: "Soham Shriram", email: "Enquery@gmail.com", contact: "9851234674", designation: "HR" },
//   { name: "Siddhesh Raskar", email: "Enquery@gmail.com", contact: "9851234674", designation: "Manager" },
//   { name: "Aditya Wanve", email: "Enquery@gmail.com", contact: "9850315601", designation: "Blockchain Intern" },
//   { name: "Manish Sonawane", email: "Enquerygmail.com", contact: "9850315601", designation: "Manager" },
//   { name: "John Smith", email: "Enquery@gmail.com", contact: "9850315601", designation: "Blockchain Intern" },
//   { name: "Alice Smith", email: "Enquery@gmail.com", contact: "9850315601", designation: "Blockchain Intern" },
// ];

// function ContactsTable() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [contacts, setContacts] = useState(initialContacts);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newContact, setNewContact] = useState({ name: '', email: '', contact: '', designation: '' });
//   const contactsPerPage = 4;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewContact(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setContacts(prev => [...prev, newContact]);
//     setNewContact({ name: '', email: '', contact: '', designation: '' });
//     setIsModalOpen(false);
//   };

//   const filteredContacts = contacts.filter(contact =>
//     contact.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const sortedContacts = [...filteredContacts].sort((a, b) =>
//     sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
//   );

//   const indexOfLastContact = currentPage * contactsPerPage;
//   const indexOfFirstContact = indexOfLastContact - contactsPerPage;
//   const currentContacts = sortedContacts.slice(indexOfFirstContact, indexOfLastContact);
//   const totalPages = Math.ceil(sortedContacts.length / contactsPerPage);

//   const toggleSort = () => {
//     setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
//     setCurrentPage(1);
//   };

//   return (
//     <div className="bg-gray-100">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="bg-[#4B7889] text-white p-4 flex justify-between items-center">
//           <h1 className="text-2xl font-semibold">Contacts</h1>
//           <div className="flex items-center gap-4">
//             <button className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
//               <Plus size={20} />
//                 Add Contact
//             </button>
//             <span className="text-white">Total Contacts : {contacts.length}</span>
//           </div>
//         </div>

//         <div className="p-4 flex justify-between items-center border-b">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input type="text" placeholder="Search Name" className="pl-10 pr-4 py-2 border rounded-full w-[300px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//           </div>
//           <button className="flex items-center gap-1 font-medium hover:text-blue-600" onClick={toggleSort}>
//             Alphabet {sortOrder === 'asc' ? '(A-Z)' : '(Z-A)'} <ChevronDown size={20} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
//           </button>
//         </div>
//         <div className="bg-[#EBFAFF] rounded-lg mx-4 my-2">
//           <div className="grid grid-cols-4 gap-4 px-6 py-4 font-semibold text-black-700">
//             <div>Name</div>
//             <div>Email</div>
//             <div>Contact</div>
//             <div>Designation</div>
//           </div>
//           <div className="px-4 pb-4">
//             {currentContacts.map((contact, index) => (
//               <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-md mb-3">
//                 <div>{contact.name}</div>
//                 <div>{contact.email}</div>
//                 <div>{contact.contact}</div>
//                 <div>{contact.designation}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-center items-center gap-2 p-4 border-t">
//           <button className="w-8 h-8 flex items-center justify-center bg-gray-200" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>&lt;</button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button key={i + 1} className={`w-8 h-8 flex items-center justify-center ${currentPage === i + 1 ? 'bg-gray-500 text-white' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
//           ))}
//           <button className="w-8 h-8 flex items-center justify-center bg-gray-200" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>&gt;</button>
//         </div>

//       </div>
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg p-6 w-[400px]">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Add New Contact</h2>
//               <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               {['name', 'email', 'contact', 'designation'].map(field => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
//                   <input type="text" name={field} value={newContact[field]} onChange={handleInputChange} className="mt-1 block w-full rounded-md border px-3 py-2" required />
//                 </div>
//               ))}
//               <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Contact</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ContactsTable;


import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, X } from 'lucide-react';

const initialContacts = [
  { name: "Soham Shriram", email: "Enquery@gmail.com", contact: "9851234674", designation: "HR" },
  { name: "Siddhesh Raskar", email: "Enquery@gmail.com", contact: "9851234674", designation: "Manager" },
  { name: "Aditya Wanve", email: "Enquery@gmail.com", contact: "9850315601", designation: "Blockchain Intern" },
  { name: "Manish Sonawane", email: "Enquery@gmail.com", contact: "9850315601", designation: "Manager" },
  { name: "John Smith", email: "Enquery@gmail.com", contact: "9850315601", designation: "Blockchain Intern" },
  { name: "Alice Smith", email: "Enquery@gmail.com", contact: "9850315601", designation: "Blockchain Intern" },
];

function ContactsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState(initialContacts);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', contact: '', designation: '' });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const contactsPerPage = 4;

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!newContact.name || !newContact.email || !newContact.contact || !newContact.designation) {
      alert("Please fill in all fields before adding a contact.");
      return;
    }

    // Add the new contact to the list
    setContacts(prev => [...prev, newContact]);

    // Reset the form and close the modal
    setNewContact({ name: '', email: '', contact: '', designation: '' });
    setIsModalOpen(false);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedContacts = [...filteredContacts].sort((a, b) =>
    sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = sortedContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(sortedContacts.length / contactsPerPage);

  const toggleSort = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#4B7889] text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <button
            className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} /> Add Contact
          </button>
        </div>

        <div className="p-4 flex justify-between items-center border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Name"
              className="pl-10 pr-4 py-2 border rounded-full w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="flex items-center gap-1 font-medium hover:text-blue-600"
            onClick={toggleSort}
          >
            Alphabet {sortOrder === 'asc' ? '(A-Z)' : '(Z-A)'}{' '}
            <ChevronDown size={20} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
          </button>
        </div>

        {isMobileView ? (
          <div className="p-4">
            {currentContacts.map((contact, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3">
                <p><strong>Name:</strong> {contact.name}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Contact:</strong> {contact.contact}</p>
                <p><strong>Designation:</strong> {contact.designation}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#EBFAFF] rounded-lg mx-4 my-2">
            <div className="grid grid-cols-4 gap-4 px-6 py-4 font-semibold text-black-700">
              <div>Name</div>
              <div>Email</div>
              <div>Contact</div>
              <div>Designation</div>
            </div>
            <div className="px-4 pb-4">
              {currentContacts.map((contact, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-md mb-3">
                  <div>{contact.name}</div>
                  <div>{contact.email}</div>
                  <div>{contact.contact}</div>
                  <div>{contact.designation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center items-center gap-2 p-4 border-t">
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`w-8 h-8 flex items-center justify-center ${
                currentPage === i + 1 ? 'bg-gray-500 text-white' : ''
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Contact</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {['name', 'email', 'contact', 'designation'].map(field => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={newContact[field]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Contact
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsTable;
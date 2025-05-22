// src/pages/LeadsPage.jsx
/**
 * LeadsPage Component
 * Displays a paginated, searchable, and filterable list of leads with status tracking.
 *
 * Features:
 * - Fetches leads from the backend and processes their phases/status.
 * - Allows searching leads by name or company.
 * - Filters leads by status (All, Not Started, In Progress, Completed, Stopped).
 * - Supports pagination for large lead lists.
 * - Allows downloading the current (filtered) leads as a CSV report.
 * - Enables deleting leads with confirmation.
 * - Renders a visual status tracker for each lead's phases.
 * - Responsive layout with Sidebar, Navbar, and Footer.
 *
 * State:
 * - sidebarOpen: Controls sidebar visibility.
 * - filterOpen: Controls filter panel visibility.
 * - searchTerm: Search input value.
 * - statusFilter: Current status filter.
 * - leads: All fetched leads.
 * - filteredLeads: Leads after search/filter.
 * - currentPage: Current pagination page.
 * - leadsPerPage: Number of leads per page.
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Leadform from '../pages/LeadFormPage';
import { ArrowRight, Clock, Check, X, Trash2, Search, PlusCircle, Download, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(4);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/leads', {
        withCredentials: true // <-- This is required for cookies/JWT!
      });
      if (response.data.success) {
        const fetchedLeads = response.data.data.map((lead) => {
          const phases = lead.phases.map((phase) => ({
            name: phase.name,
            date: phase.date,
            status: phase.status,
          }));
          const currentStage = phases.findIndex((phase) => phase.status !== 'Completed');
          const isFullyCompleted = currentStage === -1;
          return {
            _id: lead._id, // Always use _id for MongoDB
            name: lead.name,
            company: lead.company?.name || '', // Defensive: company may be null
            phases,
            currentStage: isFullyCompleted ? phases.length - 1 : currentStage,
            isFullyCompleted,
          };
        });
        setLeads(fetchedLeads);
        setFilteredLeads(fetchedLeads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    let results = leads;

    if (searchTerm) {
      results = results.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      if (statusFilter === 'Completed') {
        results = results.filter((lead) => lead.isFullyCompleted);
      } else {
        results = results.filter(
          (lead) =>
            !lead.isFullyCompleted &&
            lead.phases.some((phase) => phase.status === statusFilter)
        );
      }
    }

    setFilteredLeads(results);
    setCurrentPage(1);
  }, [leads, searchTerm, statusFilter]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDownload = () => {
    const dataToExport = filteredLeads.length > 0 ? filteredLeads : leads;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Company,Current Stage,Completed\n";
    dataToExport.forEach((lead) => {
      const currentStatus = lead.isFullyCompleted
        ? 'Completed'
        : lead.phases[lead.currentStage]?.status || 'N/A';
      csvContent += `${lead.id},${lead.name},${lead.company},${currentStatus},${lead.isFullyCompleted}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleDelete = async (id) => {
    if (currentUser?.role === 'client') return; // Prevent client from deleting
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`http://localhost:3000/api/leads/${id}`, { withCredentials: true });
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        setFilteredLeads((prev) => prev.filter((lead) => lead.id !== id));
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Failed to delete lead');
      }
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/leads/${id}`);
  };

  const renderStatusDots = (phases) => {
    return (
      <div className="flex items-start justify-between w-full">
        {phases.map((phase, i) => {
          let circleClasses =
            'relative w-8 h-8 rounded-full border-2 flex items-center justify-center ' +
            'transition-transform duration-300 hover:scale-105 ';
          let lineClasses = 'flex-auto h-0.5 transition-colors duration-300 mt-4 ';
          let statusIcon = null;

          switch (phase.status) {
            case 'Completed':
              circleClasses += 'border-green-500 bg-green-500 text-white';
              lineClasses += 'bg-green-500';
              statusIcon = <Check className="w-4 h-4" />;
              break;
            case 'In Progress':
              circleClasses += 'border-[#E8CC03] bg-[#E8CC03] text-white';
              lineClasses += 'bg-[#E8CC03]';
              statusIcon = <Clock className="w-4 h-4" />;
              break;
            case 'Stopped':
              circleClasses += 'border-red-500 bg-red-500 text-white';
              lineClasses += 'bg-red-500';
              statusIcon = <X className="w-4 h-4" />;
              break;
            default: // 'Not Started' or undefined
              circleClasses += 'border-gray-300 bg-white text-gray-400';
              lineClasses += 'bg-gray-300';
              statusIcon = <X className="w-4 h-4" />;
          }

          return (
            <React.Fragment key={phase.name}>
              <div className="flex flex-col items-center">
                <div className={circleClasses} title={phase.status}>
                  {statusIcon}
                </div>
                <span className="mt-1 text-xs text-gray-600">{phase.name}</span>
              </div>
              {i < phases.length - 1 && (
                <div className="flex items-center w-1/6 mx-2">
                  <div className={lineClasses} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (filteredLeads.length === 0) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-6 mb-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`mx-1 px-4 py-2 rounded-md flex items-center justify-center ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          &lt;
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => goToPage(number)}
            className={`mx-1 w-8 h-8 rounded-md flex items-center justify-center ${
              currentPage === number
                ? 'bg-gray-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`mx-1 px-4 py-2 rounded-md flex items-center justify-center ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          &gt;
        </button>
      </div>
    );
  };

  const isClient = currentUser?.role === 'client';

  const clientWelcome = (
    <div className="mb-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">
        Welcome, {currentUser?.firstName || currentUser?.username || currentUser?.email}
      </h2>
      <p className="text-gray-600 text-center max-w-xl">
        Here you can view all the leads you are associated with. If you have any questions, please contact your company representative.
      </p>
    </div>
  );

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-2 bg-gray-70 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4">
            {/* Show welcome for client */}
            {isClient && clientWelcome}
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <div className="relative flex-1 mr-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-96 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#51A1E0] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <div className="flex space-x-2">
                {/* Only show Add Lead if not client */}
                {currentUser?.role !== 'client' && (
                  <Link to="/leadform">
                    <button
                      className="bg-[#51A1E0] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#4086ba] transition-colors hover:shadow-md"
                    >
                      <PlusCircle className="mr-2" size={20} /> Add Lead
                    </button>
                  </Link>
                )}
                {currentUser?.role !== 'client' && (
                  <button
                    className="border rounded-lg p-2 hover:bg-gray-100 transition-colors hover:shadow"
                    onClick={handleDownload}
                    title="Download Leads Report"
                  >
                    <Download size={20} />
                  </button>
                )}
                <button
                  className={`border rounded-lg p-2 hover:bg-gray-100 transition-colors hover:shadow ${filterOpen ? 'bg-gray-100' : ''}`}
                  onClick={toggleFilter}
                  title="Filter Leads"
                >
                  <Filter size={20} />
                </button>
              </div>
            </div>
            {filterOpen && (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={toggleFilter}
                >
                  <X size={18} />
                </button>
                <h3 className="font-medium mb-2">Filter Leads</h3>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <select
                      className="border rounded p-2 w-48"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Stopped">Stopped</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <table className="w-full table-auto border-separate border-spacing-y-3">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-left text-gray-600">Name</th>
                  <th className="p-3 text-left text-gray-600">Company</th>
                  <th className="p-3 text-center text-gray-600">Status</th>
                  <th className="p-3 text-right text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead) => (
                  <tr key={lead._id} className="shadow-md rounded-lg bg-white transition-colors duration-200 hover:shadow-lg hover:bg-gray-100">
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.company || '—'}</td>
                    <td className="p-3">{renderStatusDots(lead.phases)}</td>
                    <td className="p-3 text-right flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetail(lead._id)}
                        className="inline-flex items-center px-3 py-2 bg-[#51A1E0] text-white rounded-lg hover:bg-[#4086ba] hover:shadow-lg transition-transform transform hover:scale-105"
                      >
                        View Details
                      </button>
                      {currentUser?.role !== 'client' && (
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-transform transform hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {currentLeads.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      {isClient
                        ? "You are not associated with any leads yet. Please contact your company representative if you think this is a mistake."
                        : "No leads found matching your criteria"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {renderPagination()}
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadsPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Search, 
  PlusCircle, 
  Download, 
  Filter, 
  Check,
  X
} from 'lucide-react';

/**
 * Main page component for displaying and managing sales leads with a visual
 * multi-stage progress tracker system
 */
const LeadsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredLeads, setFilteredLeads] = useState([]);

  /**
   * Sample data representing leads with their progress through a 5-stage sales pipeline
   * Each lead tracks whether they've completed the entire process
   */
  const [leads] = useState([
    { 
      id: 1, 
      name: 'Soham Shriram', 
      company: 'Candent', 
      status: ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'],
      currentStage: 2, // 0-based index of current stage
      isFullyCompleted: false
    },
    { 
      id: 2, 
      name: 'Aditya Wanve', 
      company: 'Candent', 
      status: ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'],
      currentStage: 1,
      isFullyCompleted: false
    },
    { 
      id: 3, 
      name: 'Manish Sonawane', 
      company: 'Candent', 
      status: ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'],
      currentStage: 4,
      isFullyCompleted: true
    },
    { 
      id: 4, 
      name: 'Siddhesh Raskar', 
      company: 'Candent', 
      status: ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'],
      currentStage: 4,
      isFullyCompleted: true
    }
  ]);

  // Apply filters based on search term and status filter
  React.useEffect(() => {
    let results = leads;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Completed') {
        results = results.filter(lead => lead.isFullyCompleted);
      } else {
        // Filter by specific stage
        results = results.filter(lead => 
          lead.status[lead.currentStage] === statusFilter && !lead.isFullyCompleted
        );
      }
    }
    
    setFilteredLeads(results);
  }, [leads, searchTerm, statusFilter]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Handles the download action - Exports lead data to CSV
   */
  const handleDownload = () => {
    // Get the data to export (either filtered or all leads)
    const dataToExport = filteredLeads.length > 0 ? filteredLeads : leads;
    
    // Create CSV header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Company,Current Stage,Completed\n";
    
    // Add each lead as a row
    dataToExport.forEach(lead => {
      csvContent += `${lead.id},${lead.name},${lead.company},${lead.status[lead.currentStage]},${lead.isFullyCompleted}\n`;
    });
    
    // Create download link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_report_" + new Date().toISOString().split('T')[0] + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Toggles the filter panel visibility
   */
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  /**
   * Renders an interactive visual progress tracker with connected dots
   * Displays current stage in the sales pipeline with color-coding:
   * - Blue for completed stages
   * - Green for fully completed leads
   * - Gray for future stages
   */
  const renderStatusDots = (status, isFullyCompleted, currentStage) => {
    const statusStages = ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'];
    let lastCompletedIndex = currentStage;
    
    if (isFullyCompleted) {
      lastCompletedIndex = statusStages.length - 1;
    }

    return (
      <div className="flex items-start justify-between w-full">
        {statusStages.map((stage, i) => {
          const isCompleted = i < lastCompletedIndex;
          const isActive = i === lastCompletedIndex && !isFullyCompleted;
          const isSuccessStep = isFullyCompleted && i === statusStages.length - 1;

          // Base circle styles + transitions
          let circleClasses =
            'relative w-8 h-8 rounded-full border-2 flex items-center justify-center ' +
            'transition-transform duration-300 hover:scale-105 ';

          // Base line styles + transitions
          let lineClasses = 'flex-auto h-0.5 transition-colors duration-300 justiy-center mt-4 ';

          // Decide circle color
          if (isSuccessStep) {
            circleClasses += 'border-green-500 bg-green-500 text-white';
          } else if (isCompleted) {
            circleClasses += 'border-[#51A1E0] bg-[#51A1E0] text-white';
          } else if (isActive) {
            circleClasses += 'border-[#51A1E0] bg-white text-[#51A1E0]';
          } else {
            circleClasses += 'border-gray-300 bg-white text-gray-400';
          }

          // Decide line color
          if (i < lastCompletedIndex) {
            lineClasses += 'bg-[#51A1E0]';
          } else {
            lineClasses += 'bg-gray-300';
          }

          return (
            <React.Fragment key={stage}>
              <div className="flex flex-col items-center">
                <div className={circleClasses}>
                  {isCompleted || isSuccessStep ? (
                    <Check className="w-4 h-4" />
                  ) : isActive ? (
                    <Check className="w-4 h-4" />
                  ) : null}
                </div>
                <span className="mt-1 text-xs text-gray-600">{stage}</span>
              </div>
              {i < statusStages.length - 1 && (
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

  const getFilteredData = () => {
    return filteredLeads.length > 0 ? filteredLeads : leads;
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main dashboard area with search, filters and lead listing */}
        <main className="flex-1 p-2 bg-gray-70 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4">
            
            {/* Search bar and action buttons section */}
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
                <Link to='/leadform'>
                <button className="bg-[#51A1E0] text-white px-4 py-2 rounded-lg flex items-center 
                                   hover:bg-[#4086ba] transition-colors hover:shadow-md">
                  <PlusCircle className="mr-2" size={20} /> Add Lead
                </button>
                </Link>
                
                {/* Download button with working functionality */}
                <button 
                  className="border rounded-lg p-2 hover:bg-gray-100 transition-colors hover:shadow"
                  onClick={handleDownload}
                  title="Download Leads Report"
                >
                  <Download size={20} />
                </button>
                
                {/* Filter button that toggles filter panel */}
                <button 
                  className={`border rounded-lg p-2 hover:bg-gray-100 transition-colors hover:shadow ${filterOpen ? 'bg-gray-100' : ''}`}
                  onClick={toggleFilter}
                  title="Filter Leads"
                >
                  <Filter size={20} />
                </button>
              </div>
            </div>
            
            {/* Filter panel - visible when filter is toggled */}
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
                      <option value="Customer">Customer</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Payment">Payment</option>
                      <option value="Confirm">Confirm</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Leads table with status visualization */}
            <table className="w-full table-auto border-separate border-spacing-y-3">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-left text-gray-600">Name</th>
                  <th className="p-3 text-left text-gray-600">Company</th>
                  <th className="p-3 text-center text-gray-600">Status</th>
                  <th className="p-3 text-right text-gray-600">View Details</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredData().map((lead) => (
                <tr 
                  key={lead.id}
                  className="shadow-md rounded-lg bg-white transition-colors duration-200 hover:shadow-lg hover:bg-gray-100"
                >
                
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.company}</td>
                    <td className="p-3">
                      {renderStatusDots(lead.status, lead.isFullyCompleted, lead.currentStage)}
                    </td>
                    <td className="p-3 text-right">
                      {/* Navigation link to detailed lead view */}
                      <Link
                        to={`/leads/${lead.id}`}
                        className="inline-flex items-center px-3 py-2 
                                   bg-[#51A1E0] text-white rounded-lg 
                                   hover:bg-[#4086ba] hover:shadow-lg 
                                   transition-transform transform hover:scale-105"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {getFilteredData().length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No leads found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination indicator */}
            <div className="pt-4 text-center text-gray-500">
              {getFilteredData().length > 0 ? `Page 1 of 8` : 'No results'}
            </div>
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
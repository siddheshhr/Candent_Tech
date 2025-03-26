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
  Check 
} from 'lucide-react';

const LeadsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample leads data
  const [leads] = useState([
    { 
      id: 1, 
      name: 'Soham Shriram', 
      company: 'Candent', 
      status: ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'],
      isFullyCompleted: false
    },
    { 
      id: 2, 
      name: 'Aditya Wanve', 
      company: 'Candent', 
      status: ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'],
      isFullyCompleted: false
    },
    { 
      id: 3, 
      name: 'Manish Sonawane', 
      company: 'Candent', 
      status: ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'],
      isFullyCompleted: true
    },
    { 
      id: 4, 
      name: 'Siddhesh Raskar', 
      company: 'Candent', 
      status: ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'],
      isFullyCompleted: true
    }
  ]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Renders a multi-step progress indicator.
   */
  const renderStatusDots = (status, isFullyCompleted) => {
    const statusStages = ['Customer', 'Shipping', 'Payment', 'Confirm', 'Success'];
    let lastCompletedIndex = statusStages.indexOf(status[status.length - 1]);
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

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 p-2 bg-gray-70 overflow-x-hidden overflow-y-auto">
          {/* Container for the table and controls */}
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4">
            
            {/* Header with Search and Action Buttons */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <div className="relative flex-1 mr-4">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-96 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#51A1E0] transition-colors"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>

              <div className="flex space-x-2">
                <button className="bg-[#51A1E0] text-white px-4 py-2 rounded-lg flex items-center 
                                   hover:bg-[#4086ba] transition-colors hover:shadow-md">
                  <PlusCircle className="mr-2" size={20} /> Add Lead
                </button>
                <button className="border rounded-lg p-2 hover:bg-gray-100 transition-colors hover:shadow">
                  <Download size={20} />
                </button>
                <button className="border rounded-lg p-2 hover:bg-gray-100 transition-colors hover:shadow">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            {/* Table of Leads */}
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
                {leads.map((lead) => (
                <tr 
                  key={lead.id}
                  className="shadow-md rounded-lg bg-white transition-colors duration-200 hover:shadow-lg hover:bg-gray-100"
                >
                
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.company}</td>
                    <td className="p-3">
                      {renderStatusDots(lead.status, lead.isFullyCompleted)}
                    </td>
                    <td className="p-3 text-right">
                      {/* 
                        Only the "View Details" button remains.
                        The chevron toggle is removed.
                      */}
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
              </tbody>
            </table>

            {/* Pagination or Footer Note */}
            <div className="pt-4 text-center text-gray-500">
              Page 1 of 8
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

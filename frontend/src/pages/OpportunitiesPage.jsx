// src/pages/OpportunitiesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Filter, Check, X, Trash2, Clock, DollarSign, BarChart4, Edit2, Save } from 'lucide-react';

const OpportunitiesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [valueFilter, setValueFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const navigate = useNavigate();
  
  // State for editable stats
  const [editingStats, setEditingStats] = useState(false);
  const [targetValue, setTargetValue] = useState(0);
  const [targetConversion, setTargetConversion] = useState(0);
  const [targetHighPriority, setTargetHighPriority] = useState(0);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/leads');
      if (response.data.success) {
        // Filter only fully completed leads
        const completedLeads = response.data.data
          .filter(lead => {
            return lead.phases.every(phase => phase.status === 'Completed');
          })
          .map(lead => {
            const completionDate = lead.phases[lead.phases.length - 1]?.date || new Date();
            // Generate random values for demonstration
            const estimatedValue = Math.floor(Math.random() * 100000) + 10000;
            const priority = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
            const conversionRate = Math.floor(Math.random() * 41) + 60; // 60-100%
            
            return {
              id: lead._id,
              name: lead.name,
              company: lead.company.name,
              completionDate: new Date(completionDate),
              estimatedValue,
              priority,
              conversionRate,
              lastActivity: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
            };
          });
        
        setOpportunities(completedLeads);
        setFilteredOpportunities(completedLeads);
        
        // Initialize target stats
        if (completedLeads.length > 0) {
          const totalValue = completedLeads.reduce((sum, opp) => sum + opp.estimatedValue, 0);
          const avgConversionRate = completedLeads.reduce((sum, opp) => sum + opp.conversionRate, 0) / completedLeads.length;
          const highPriorityCount = completedLeads.filter(opp => opp.priority === 'High').length;
          
          setTargetValue(totalValue);
          setTargetConversion(Math.round(avgConversionRate));
          setTargetHighPriority(highPriorityCount);
        }
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  useEffect(() => {
    let results = opportunities;

    if (searchTerm) {
      results = results.filter(
        (opportunity) =>
          opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opportunity.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== 'All') {
      results = results.filter((opportunity) => opportunity.priority === priorityFilter);
    }

    if (valueFilter !== 'All') {
      switch (valueFilter) {
        case 'Low':
          results = results.filter((opportunity) => opportunity.estimatedValue < 25000);
          break;
        case 'Medium':
          results = results.filter((opportunity) => opportunity.estimatedValue >= 25000 && opportunity.estimatedValue < 75000);
          break;
        case 'High':
          results = results.filter((opportunity) => opportunity.estimatedValue >= 75000);
          break;
      }
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.completionDate - a.completionDate;
        case 'value':
          return b.estimatedValue - a.estimatedValue;
        case 'priority':
          const priorityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityValues[b.priority] - priorityValues[a.priority];
        case 'conversion':
          return b.conversionRate - a.conversionRate;
        default:
          return 0;
      }
    });

    setFilteredOpportunities(results);
    setCurrentPage(1);
  }, [opportunities, searchTerm, priorityFilter, valueFilter, sortBy]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDownload = () => {
    const dataToExport = filteredOpportunities.length > 0 ? filteredOpportunities : opportunities;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Company,Completion Date,Estimated Value,Priority,Conversion Rate\n";
    dataToExport.forEach((opportunity) => {
      csvContent += `${opportunity.id},${opportunity.name},${opportunity.company},${opportunity.completionDate.toLocaleDateString()},${opportunity.estimatedValue},${opportunity.priority},${opportunity.conversionRate}%\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `opportunities_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await axios.delete(`http://localhost:3000/api/leads/${id}`, { withCredentials: true });
        setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
        setFilteredOpportunities((prev) => prev.filter((opp) => opp.id !== id));
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        alert('Failed to delete opportunity');
      }
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/opportunities/${id}`);
  };

  const toggleEditStats = () => {
    if (editingStats) {
      // Save functionality would go here in a real app
      // For now, we just toggle the editing state
      setEditingStats(false);
    } else {
      setEditingStats(true);
    }
  };

  const handleEditValue = (id, field, newValue) => {
    const updatedOpportunities = opportunities.map(opp => {
      if (opp.id === id) {
        return { ...opp, [field]: field === 'estimatedValue' ? parseInt(newValue) : newValue };
      }
      return opp;
    });
    setOpportunities(updatedOpportunities);
  };

  const renderPriorityBadge = (priority) => {
    let badgeClass = "px-2 py-1 rounded text-xs font-medium text-white ";
    
    switch (priority) {
      case 'High':
        badgeClass += "bg-red-500";
        break;
      case 'Medium':
        badgeClass += "bg-yellow-500";
        break;
      case 'Low':
        badgeClass += "bg-blue-500";
        break;
      default:
        badgeClass += "bg-gray-500";
    }
    
    return <span className={badgeClass}>{priority}</span>;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderConversionIndicator = (rate) => {
    let indicatorClass = "inline-flex items-center px-2 py-1 rounded text-xs font-medium ";
    
    if (rate >= 80) {
      indicatorClass += "bg-green-100 text-green-800";
    } else if (rate >= 70) {
      indicatorClass += "bg-yellow-100 text-yellow-800";
    } else {
      indicatorClass += "bg-orange-100 text-orange-800";
    }
    
    return <span className={indicatorClass}>{rate}%</span>;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

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
    if (filteredOpportunities.length === 0) return null;

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

  // Stats summary for opportunities with edit functionality
  const renderOpportunitySummary = () => {
    if (opportunities.length === 0) return null;

    const totalValue = opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
    const avgConversionRate = opportunities.reduce((sum, opp) => sum + opp.conversionRate, 0) / opportunities.length;
    const highPriorityCount = opportunities.filter(opp => opp.priority === 'High').length;

    const progressValue = totalValue / targetValue * 100;
    const progressConversion = avgConversionRate / targetConversion * 100;
    const progressPriority = highPriorityCount / targetHighPriority * 100;

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Performance Metrics</h2>
          <button 
            onClick={toggleEditStats}
            className="flex items-center px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            {editingStats ? (
              <>
                <Save size={16} className="mr-1" /> Save Targets
              </>
            ) : (
              <>
                <Edit2 size={16} className="mr-1" /> Edit Targets
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="text-blue-500 mr-2" size={24} />
                <h3 className="text-lg font-medium text-blue-700">Total Value</h3>
              </div>
              {editingStats && (
                <div className="flex items-center">
                  <span className="text-xs mr-2">Target:</span>
                  <input 
                    type="number" 
                    value={targetValue}
                    onChange={(e) => setTargetValue(Math.max(0, Number(e.target.value)))}
                    className="w-20 p-1 border rounded text-sm"
                  />
                </div>
              )}
            </div>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totalValue)}</p>
            {!editingStats && (
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, progressValue)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{Math.round(progressValue)}% of target</span>
                  <span>{formatCurrency(targetValue)}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart4 className="text-green-500 mr-2" size={24} />
                <h3 className="text-lg font-medium text-green-700">Avg. Conversion</h3>
              </div>
              {editingStats && (
                <div className="flex items-center">
                  <span className="text-xs mr-2">Target %:</span>
                  <input 
                    type="number" 
                    value={targetConversion}
                    min="0" 
                    max="100"
                    onChange={(e) => setTargetConversion(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-16 p-1 border rounded text-sm"
                  />
                </div>
              )}
            </div>
            <p className="text-2xl font-bold mt-2">{avgConversionRate.toFixed(1)}%</p>
            {!editingStats && (
              <div className="mt-2">
                <div className="w-full bg-green-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, progressConversion)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{Math.round(progressConversion)}% of target</span>
                  <span>{targetConversion}%</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="text-red-500 mr-2" size={24} />
                <h3 className="text-lg font-medium text-red-700">High Priority</h3>
              </div>
              {editingStats && (
                <div className="flex items-center">
                  <span className="text-xs mr-2">Target:</span>
                  <input 
                    type="number" 
                    value={targetHighPriority}
                    min="0"
                    onChange={(e) => setTargetHighPriority(Math.max(0, Number(e.target.value)))}
                    className="w-16 p-1 border rounded text-sm"
                  />
                </div>
              )}
            </div>
            <p className="text-2xl font-bold mt-2">{highPriorityCount} opportunities</p>
            {!editingStats && (
              <div className="mt-2">
                <div className="w-full bg-red-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, progressPriority)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{Math.round(progressPriority)}% of target</span>
                  <span>{targetHighPriority}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-2 bg-gray-70 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <h1 className="text-2xl font-semibold text-gray-800">Opportunities</h1>
              <div className="relative flex-1 mx-4">
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-96 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#51A1E0] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <div className="flex space-x-2">
                <button
                  className="border rounded-lg p-2 hover:bg-gray-100 transition-colors hover:shadow"
                  onClick={handleDownload}
                  title="Download Opportunities Report"
                >
                  <Download size={20} />
                </button>
                <button
                  className={`border rounded-lg p-2 hover:bg-gray-100 transition-colors hover:shadow ${filterOpen ? 'bg-gray-100' : ''}`}
                  onClick={toggleFilter}
                  title="Filter Opportunities"
                >
                  <Filter size={20} />
                </button>
              </div>
            </div>

            {renderOpportunitySummary()}

            {filterOpen && (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={toggleFilter}
                >
                  <X size={18} />
                </button>
                <h3 className="font-medium mb-2">Filter Opportunities</h3>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Priority</label>
                    <select
                      className="border rounded p-2 w-48"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="All">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Value Range</label>
                    <select
                      className="border rounded p-2 w-48"
                      value={valueFilter}
                      onChange={(e) => setValueFilter(e.target.value)}
                    >
                      <option value="All">All Values</option>
                      <option value="Low">&lt; $25,000</option>
                      <option value="Medium">$25,000 - $75,000</option>
                      <option value="High">&gt; $75,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Sort By</label>
                    <select
                      className="border rounded p-2 w-48"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date">Completion Date</option>
                      <option value="value">Estimated Value</option>
                      <option value="priority">Priority</option>
                      <option value="conversion">Conversion Rate</option>
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
                  <th className="p-3 text-left text-gray-600">Completion Date</th>
                  <th className="p-3 text-left text-gray-600">Est. Value</th>
                  <th className="p-3 text-center text-gray-600">Priority</th>
                  <th className="p-3 text-center text-gray-600">Conv. Rate</th>
                  <th className="p-3 text-right text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((opportunity) => (
                  <tr
                    key={opportunity.id}
                    className="shadow-md rounded-lg bg-white transition-colors duration-200 hover:shadow-lg hover:bg-gray-100"
                  >
                    <td className="p-3">{opportunity.name}</td>
                    <td className="p-3">{opportunity.company}</td>
                    <td className="p-3">{opportunity.completionDate.toLocaleDateString()}</td>
                    <td className="p-3">
                      {opportunity.editingValue ? (
                        <input
                          type="number"
                          className="border rounded p-1 w-24"
                          value={opportunity.estimatedValue}
                          onChange={(e) => handleEditValue(opportunity.id, 'estimatedValue', e.target.value)}
                          onBlur={() => handleEditValue(opportunity.id, 'editingValue', false)}
                        />
                      ) : (
                        <div className="flex items-center">
                          {formatCurrency(opportunity.estimatedValue)}
                          <button 
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            onClick={() => handleEditValue(opportunity.id, 'editingValue', true)}
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {opportunity.editingPriority ? (
                        <select
                          className="border rounded p-1"
                          value={opportunity.priority}
                          onChange={(e) => handleEditValue(opportunity.id, 'priority', e.target.value)}
                          onBlur={() => handleEditValue(opportunity.id, 'editingPriority', false)}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      ) : (
                        <div className="flex items-center justify-center">
                          {renderPriorityBadge(opportunity.priority)}
                          <button 
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            onClick={() => handleEditValue(opportunity.id, 'editingPriority', true)}
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {opportunity.editingConversionRate ? (
                        <input
                          type="number"
                          className="border rounded p-1 w-16"
                          min="0"
                          max="100"
                          value={opportunity.conversionRate}
                          onChange={(e) => handleEditValue(opportunity.id, 'conversionRate', Math.min(100, Math.max(0, parseInt(e.target.value))))}
                          onBlur={() => handleEditValue(opportunity.id, 'editingConversionRate', false)}
                        />
                      ) : (
                        <div className="flex items-center justify-center">
                          {renderConversionIndicator(opportunity.conversionRate)}
                          <button 
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            onClick={() => handleEditValue(opportunity.id, 'editingConversionRate', true)}
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetail(opportunity.id)}
                        className="inline-flex items-center px-3 py-2 bg-[#51A1E0] text-white rounded-lg hover:bg-[#4086ba] hover:shadow-lg transition-transform transform hover:scale-105"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(opportunity.id)}
                        className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-transform transform hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No opportunities found matching your criteria
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

export default OpportunitiesPage;
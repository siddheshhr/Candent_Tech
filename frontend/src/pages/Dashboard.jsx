/**
 * Dashboard Component
 * Main dashboard page displaying key metrics, charts, recent leads, and tasks.
 * 
 * Features:
 * - Fetches and displays total leads, companies, opportunities, and conversion rate.
 * - Shows animated metric cards and charts for lead activity and stage distribution.
 * - Lists recent leads and upcoming tasks.
 * - Allows exporting dashboard data as PDF.
 * - Supports refreshing and changing date range for stats.
 * - Responsive layout with sidebar and navbar.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import OpportunityChart from '../components/OpportunityChart';
import ProgressItem from '../components/ProgressItem';
import { PieChart, Briefcase, Percent, Users, Download, RefreshCw, Bell, Calendar, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLeadStats from './../components/useLeadsState.js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';  

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
};

export default function Dashboard() {
// fetch lead stats
  // Custom hook to fetch lead stats
  const {
      opportunityCount,
      leadsCount,
      opportunityPercentage,
      leadsPercentage,
      isLoadings,
    } = useLeadStats();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // const [userName, setUserName] = useState('');
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'quarter', 'year'
  
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCompanies: 0,
    totalOpportunities: 0,
    leadsPerMonth: [],    // [{ month: '2025-04', count: 5 }, …]
    recentLeads: [],      // [{ name, company: {name}, leadAddedDate }, …]
    leadsByStage: [],     // [{ stage: 'Initial Contact', count: 10 }, ...]
    upcomingTasks: []     // [{ title, dueDate, priority }, ...]
  });

  // Get current user info
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:3000/api/user/current', { withCredentials: true });
  //       if (res.data.success) {
  //         setUserName(res.data.user.firstName || res.data.user.name || 'User');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user info:', error);
  //     }
  //   };
    
  //   fetchUserInfo();
  // }, []);

    // ─── PULL userName FROM REDUX ─────────────────────────────
  const currentUser = useSelector(state => state.user.currentUser);
  const userName = currentUser
    ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
    : 'User';
  // ───────────────────────────────────────────────────────────


  // Fetch dashboard data
  const fetchDashboardData = async (range = dateRange) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/leads/stats?range=${range}`, 
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setStats({
          totalLeads: res.data.totalLeads,
          totalCompanies: res.data.totalCompanies,
          totalOpportunities: res.data.totalOpportunities || 0,
          leadsPerMonth: res.data.leadsPerMonth,
          recentLeads: res.data.recentLeads,
          leadsByStage: res.data.leadsByStage || [],
          upcomingTasks: res.data.upcomingTasks || []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    fetchDashboardData(range);
  };

  // Conversion rate = opportunities ÷ leads
  const conversionRate = stats.totalLeads > 0
    ? Math.round((stats.totalOpportunities / stats.totalLeads) * 100)
    : 0;

  // Calculate growth metrics (compare with previous period)
  const leadGrowth = stats.previousPeriodLeads 
    ? Math.round(((stats.totalLeads - stats.previousPeriodLeads) / stats.previousPeriodLeads) * 100)
    : 0;

  // PDF export
  const handleExport = () => {
    const doc = new jsPDF();
    let y = 20;
    
    // Title and date
    doc.setFontSize(18);
    doc.text('Dashboard Report', 14, y); y += 8;
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y); y += 10;
    
    // Main metrics
    doc.setFontSize(14);
    doc.text('Key Metrics Summary', 14, y); y += 8;
    doc.setFontSize(12);
    doc.text(`Total Leads: ${stats.totalLeads}`, 14, y); y += 7;
    doc.text(`Total Companies: ${stats.totalCompanies}`, 14, y); y += 7;
    doc.text(`Total Opportunities: ${stats.totalOpportunities}`, 14, y); y += 7;
    doc.text(`Conversion Rate: ${conversionRate}%`, 14, y); y += 12;
    
    // Leads per period
    doc.setFontSize(14);
    
    // Lead stages
    if (stats.leadsByStage && stats.leadsByStage.length > 0) {
      doc.setFontSize(14);
      doc.text('Lead Stages Distribution', 14, y); y += 8;
      doc.setFontSize(12);
      stats.leadsByStage.forEach(item => {
        doc.text(` • ${item.stage}: ${item.count} leads`, 18, y);
        y += 7;
      });
      y += 8;
    }
    
    // Recent leads
    doc.setFontSize(14);
    doc.text('Recent Leads', 14, y); y += 8;
    doc.setFontSize(12);
    stats.recentLeads.forEach(l => {
      const date = new Date(l.leadAddedDate).toLocaleDateString();
      doc.text(` • ${l.name} (${l.company?.name || '—'}) on ${date}`, 18, y);
      y += 7;
    });
    
    doc.save(`dashboard_report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={toggleSidebar}/>

        <motion.div
          className="p-6 flex-grow"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header with controls */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome, {userName}
              </h1>
              <p className="text-gray-500 text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Date range selector */}
             

              {/* Refresh button */}
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 border"
              >
                <RefreshCw 
                  size={18} 
                  className={`${refreshing ? 'animate-spin' : ''}`} 
                /> 
                Refresh
              </motion.button>

              {/* Export button */}
              <motion.button
                onClick={handleExport}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#3B9EC1] text-white px-6 py-2 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Download size={18}/> Export
              </motion.button>
            </div>
          </motion.div>

          {/* Loading state */}
          {isLoading && (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B9EC1]"></div>
            </div>
          )}

          {!isLoading && (
            <>
              {/* Two large metric cards with animated counters */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                variants={containerVariants}
              >
                <motion.div
                  className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-xl">
                      <Users className="text-blue-600" size={28}/>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-lg">Total Leads</h3>
                      <p className="text-4xl font-bold text-gray-800 mt-2">
                        {stats.totalLeads}
                        {leadGrowth !== 0 && (
                          <span className={`text-sm ml-2 ${leadGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {leadGrowth > 0 ? '↑' : '↓'} {Math.abs(leadGrowth)}%
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => navigate('/leads')}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View all leads →
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-orange-100 rounded-xl">
                      <Briefcase className="text-orange-600" size={28}/>
                    </div>
                    <div>
                      <h3 className="text-gray-500 text-lg">Total Companies</h3>
                      <p className="text-4xl font-bold text-gray-800 mt-2">
                        {stats.totalLeads}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => navigate('/companies')}
                      className="text-orange-600 text-sm hover:underline"
                    >
                      View all companies →
                    </button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Four small stats cards */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                variants={containerVariants}
              >
                <StatsCard
                  icon={<PieChart size={24}/>}
                  value={leadsCount}
                  label="Recent Leads"
                  bgColor="bg-pink-100"
                  iconCircle="bg-pink-200"
                  iconColor="text-pink-600"
                />
                <StatsCard
                  icon={<Briefcase size={24}/>}
                  value={leadsCount}
                  label="Recent Companies"
                  bgColor="bg-amber-100"
                  iconCircle="bg-amber-200"
                  iconColor="text-amber-600"
                />  
                <StatsCard
                  icon={<Percent size={24}/>}
                  value={`${opportunityCount / ((leadsCount + opportunityCount))}%`}
                  label="Conversion Factor"
                  bgColor="bg-green-100"
                  iconCircle="bg-green-200"
                  iconColor="text-green-600"
                />
                <StatsCard
                  icon={<Layers size={24}/>}
                  value={opportunityCount}
                  label="Opportunities"
                  bgColor="bg-blue-100"
                  iconCircle="bg-blue-200"
                  iconColor="text-blue-600"
                />
              </motion.div>

              {/* Charts & Recent Leads */}
              <motion.div
                className="grid grid-cols-1 xl:grid-cols-2 gap-8"
                variants={containerVariants}
              >
                <motion.div className="space-y-8" variants={containerVariants}>
                  {/* Lead trend chart */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Lead Activity</h2>
                    <div className="h-80">
                      <OpportunityChart 
                        data={stats.leadsPerMonth} 
                        timeRange={dateRange}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Upcoming tasks card */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Recent Opportunity</h2>
                      <button 
                        onClick={() => navigate('/tasks')}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View all →
                      </button>
                    </div>
                    
                    {stats.upcomingTasks && stats.upcomingTasks.length > 0 ? (
                      <div className="space-y-4">
                        {stats.upcomingTasks.slice(0, 3).map((task, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className={`w-2 h-10 rounded-full mr-4 ${
                              task.priority === 'high' ? 'bg-red-500' :
                              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}/>
                            <div className="flex-1">
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Calendar size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {new Date(task.dueDate).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No upcoming tasks.</p>
                    )}
                  </motion.div>
                </motion.div>

                <motion.div className="space-y-8" variants={containerVariants}>
                  {/* Stage distribution chart */}
                 
                    <ProgressItem data={stats.totalLeads} />
                  {/* </motion.div> */}
                
                  {/* Recent leads */}
                  <motion.div
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                    variants={itemVariants}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Recent Leads</h2>
                      <button 
                        onClick={() => navigate('/leads')}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="grid grid-cols-12 border-b pb-3 mb-2 text-sm text-gray-500 uppercase">
                      <div className="col-span-5">Lead</div>
                      <div className="col-span-4">Company</div>
                      <div className="col-span-3">Date</div>
                    </div>
                    {stats.recentLeads.length > 0 ? (
                      stats.recentLeads.map((lead, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 py-3 items-center border-b last:border-0 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
                          onClick={() => navigate(`/leads/${lead.id}`)}
                        >
                          <div className="col-span-5 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-3 flex items-center justify-center text-white font-medium">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{lead.name}</span>
                          </div>
                          <div className="col-span-4 text-gray-800">
                            {lead.company?.name || '—'}
                          </div>
                          <div className="col-span-3 text-gray-600">
                            {new Date(lead.leadAddedDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No recent leads.</p>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Notifications panel */}
            </>
          )}
        </motion.div>

        <Footer />
      </div>
    </div>
  );
}

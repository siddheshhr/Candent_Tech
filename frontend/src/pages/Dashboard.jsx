// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import Sidebar from '../components/Sidebar';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';
import StatsCard        from '../components/StatsCard';
import OpportunityChart from '../components/OpportunityChart';
import ProgressItem     from '../components/ProgressItem';
import { PieChart, Briefcase, Percent, Users, Download } from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCompanies: 0,
    totalOpportunities: 0,
    leadsPerMonth: [],    // [{ month: '2025-04', count: 5 }, …]
    recentLeads: []       // [{ name, company: {name}, leadAddedDate }, …]
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/leads/stats')
      .then(res => {
        if (res.data.success) {
          setStats({
            totalLeads: res.data.totalLeads,
            totalCompanies: res.data.totalCompanies,
            totalOpportunities: res.data.totalOpportunities || 0,
            leadsPerMonth: res.data.leadsPerMonth,
            recentLeads: res.data.recentLeads
          });
        }
      })
      .catch(console.error);
  }, []);

  // Conversion rate = opportunities ÷ leads
  const conversionRate = stats.totalLeads > 0
    ? Math.round((stats.totalOpportunities / stats.totalLeads) * 100)
    : 0;

  // PDF export
  const handleExport = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text('Dashboard Report', 14, y); y += 10;
    doc.setFontSize(12);
    doc.text(`Total Leads: ${stats.totalLeads}`, 14, y); y += 8;
    doc.text(`Total Companies: ${stats.totalCompanies}`, 14, y); y += 8;
    doc.text(`Total Opportunities: ${stats.totalOpportunities}`, 14, y); y += 12;
    doc.text('Leads per Month:', 14, y); y += 8;
    stats.leadsPerMonth.forEach(item => {
      doc.text(` • ${item.month}: ${item.count}`, 18, y);
      y += 6;
    });
    y += 8;
    doc.text('Recent Leads:', 14, y); y += 8;
    stats.recentLeads.forEach(l => {
      const date = new Date(l.leadAddedDate).toLocaleDateString();
      doc.text(` • ${l.name} (${l.company?.name || '—'}) on ${date}`, 18, y);
      y += 6;
    });
    doc.save('dashboard_report.pdf');
  };

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
          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Alice</h1>
              <p className="text-gray-500 text-lg">Here's your dashboard overview</p>
            </div>
            <motion.button
              onClick={handleExport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3B9EC1] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Download size={20}/> Export Report
            </motion.button>
          </motion.div>

          {/* Two large metric cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            variants={containerVariants}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-xl"
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
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-xl"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-100 rounded-xl">
                  <Briefcase className="text-orange-600" size={28}/>
                </div>
                <div>
                  <h3 className="text-gray-500 text-lg">Total Companies</h3>
                  <p className="text-4xl font-bold text-gray-800 mt-2">
                    {stats.totalCompanies}
                  </p>
                </div>
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
              value={stats.totalLeads}
              label="Total Leads"
              bgColor="bg-pink-100"
              iconCircle="bg-pink-200"
              iconColor="text-pink-600"
            />
            <StatsCard
              icon={<Briefcase size={24}/>}
              value={stats.totalCompanies}
              label="Companies"
              bgColor="bg-amber-100"
              iconCircle="bg-amber-200"
              iconColor="text-amber-600"
            />
            <StatsCard
              icon={<Percent size={24}/>}
              value={`${conversionRate}%`}
              label="Conversion Rate"
              bgColor="bg-green-100"
              iconCircle="bg-green-200"
              iconColor="text-green-600"
            />
            <StatsCard
              icon={<Briefcase size={24}/>}
              value={stats.totalOpportunities}
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
              <motion.div variants={itemVariants}>
                <OpportunityChart data={stats.leadsPerMonth}/>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ProgressItem />
              </motion.div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recent Leads</h2>
                <span className="text-gray-500">{stats.recentLeads.length} added</span>
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
                    className="grid grid-cols-12 py-3 items-center border-b last:border-0"
                  >
                    <div className="col-span-5 flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3" />
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

        <Footer />
      </div>
    </div>
  );
}

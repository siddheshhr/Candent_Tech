import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import OpportunityChart from '../components/OpportunityChart';
import ProgressItem from '../components/ProgressItem';
import { PieChart, Briefcase, Percent, Users, Download } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 },
  },
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const recentProjects = [
    {
      icon: 'chakra',
      name: 'Chakra Soft UI Version',
      progress: 60,
      budget: '$14,000',
      color: 'purple',
    },
    {
      icon: 'progress',
      name: 'Add Progress Track',
      progress: 10,
      budget: '$3,000',
      color: 'blue',
    },
    {
      icon: 'platform',
      name: 'Fix Platform Errors',
      progress: 100,
      budget: 'Not set',
      color: 'green',
    },
    {
      icon: 'mobile',
      name: 'Launch our Mobile App',
      progress: 100,
      budget: '$32,000',
      color: 'green',
    },
    {
      icon: 'pricing',
      name: 'Add the New Pricing Page',
      progress: 25,
      budget: '$400',
      color: 'blue',
    },
    {
      icon: 'shop',
      name: 'Redesign New Online Shop',
      progress: 40,
      budget: '$7,600',
      color: 'red',
    },
  ];

  // Render the icon based on the project type
  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'chakra':
        return (
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white">
            Ch
          </div>
        );
      case 'progress':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">
            ▲
          </div>
        );
      case 'platform':
        return (
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
            +
          </div>
        );
      case 'mobile':
        return (
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
            ◯
          </div>
        );
      case 'pricing':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">
            ◆
          </div>
        );
      case 'shop':
        return (
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white">
            In
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white">
            ?
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <motion.div
          className="p-6 flex-grow"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome, Alice
              </h1>
              <p className="text-gray-500 text-lg">
                Here's your dashboard overview
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3B9EC1] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Download size={20} />
              <span>Export Report</span>
            </motion.button>
          </motion.div>

          {/* Main Metrics Grid (two big cards) */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            variants={containerVariants}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-xl"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-xl">
                  <Users className="text-blue-600" size={28} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-lg">Total Leads</h3>
                  <p className="text-4xl font-bold text-gray-800 mt-2">
                    5
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-500 gap-2">
                <span className="bg-green-100 px-2 py-1 rounded-md text-sm">
                  ↑ 12%
                </span>
                <span className="text-sm">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-2xl shadow-xl"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-100 rounded-xl">
                  <Briefcase className="text-orange-600" size={28} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-lg">Total Opportunities</h3>
                  <p className="text-4xl font-bold text-gray-800 mt-2">0</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-500 gap-2">
                <span className="bg-green-100 px-2 py-1 rounded-md text-sm">
                  ↑ 8%
                </span>
                <span className="text-sm">vs last month</span>
              </div>
            </motion.div>
          </motion.div>

          {/* 4 PASTEL STAT CARDS (like the screenshot) */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            variants={containerVariants}
          >
            {/* Pink card */}
            <StatsCard
              icon={<PieChart size={24} />}
              value="5"
              label="Total Leads"
              bgColor="bg-pink-100"
              iconCircle="bg-pink-200"
              iconColor="text-pink-600"
            />

            {/* Cream card */}
            <StatsCard
              icon={<Briefcase size={24} />}
              value="0"
              label="Total Opportunity"
              bgColor="bg-amber-100"
              iconCircle="bg-amber-200"
              iconColor="text-amber-600"
            />

            {/* Green card */}
            <StatsCard
              icon={<Percent size={24} />}
              value="0%"
              label="Conversion Rate"
              bgColor="bg-green-100"
              iconCircle="bg-green-200"
              iconColor="text-green-600"
            />

            {/* Purple card */}
            <StatsCard
              icon={<Users size={24} />}
              value="4  "
              label="Total Users"
              bgColor="bg-purple-100"
              iconCircle="bg-purple-200"
              iconColor="text-purple-600"
            />
          </motion.div>

          {/* Charts & Recent Projects */}
          <motion.div
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {/* Left Column: Charts */}
            <motion.div className="space-y-8" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <OpportunityChart />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ProgressItem />
              </motion.div>
            </motion.div>

            {/* Right Column: Project Tracking */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Recent Projects
                  </h2>
                  <div className="flex items-center mt-1">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      30 done this month
                    </span>
                  </div>
                </div>
                <button className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 
                         1 1 0 010 2zm0 7a1 1 0 110-2 
                         1 1 0 010 2zm0 7a1 1 0 110-2 
                         1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 border-b pb-3 mb-2">
                <div className="col-span-5 text-sm text-gray-500 font-medium uppercase">
                  Companies
                </div>
                <div className="col-span-3 text-sm text-gray-500 font-medium uppercase">
                  Budget
                </div>
                <div className="col-span-4 text-sm text-gray-500 font-medium uppercase">
                  Completion
                </div>
              </div>

              {/* Table Rows */}
              {recentProjects.map((project, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-4 items-center border-b last:border-0"
                >
                  <div className="col-span-5 flex items-center">
                    {renderIcon(project.icon)}
                    <span className="ml-3 font-medium">{project.name}</span>
                  </div>
                  <div className="col-span-3 text-gray-800">{project.budget}</div>
                  <div className="col-span-4">
                    <div className="flex items-center">
                      <span
                        className={`text-${project.color}-500 mr-2 text-sm font-medium`}
                      >
                        {project.progress}%
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`bg-${project.color}-500 h-1.5 rounded-full`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <Footer />
      </div>
    </div>
  );
}
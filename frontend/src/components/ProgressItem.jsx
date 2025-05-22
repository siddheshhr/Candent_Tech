// src/components/ProgressItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import useLeadStats from './useLeadsState.js';

export default function ProgressItem() {
  const {
    opportunityCount,
    leadsCount,
    opportunityPercentage,
    leadsPercentage,
    isLoading,
  } = useLeadStats();

  // Chart dimensions (unchanged)
  const size = 240;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const opportunityArc = (opportunityPercentage / 100) * circumference;
  const leadsArc = (leadsPercentage / 100) * circumference;

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Leads and Opportunities
      </h2>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#0077B6"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${leadsArc} ${circumference - leadsArc}`}
                  strokeDashoffset={-opportunityArc}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: -opportunityArc }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${opportunityArc} ${circumference - opportunityArc}`}
                  strokeDashoffset={0}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <span className="text-4xl font-bold">{opportunityPercentage}%</span>
                <span className="text-sm text-gray-600">Opportunities</span>
              </motion.div>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-6">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#0077B6' }}
                  />
                  <span className="text-lg font-medium">Leads</span>
                </div>
                <span className="text-sm text-gray-600 mt-1">
                  {leadsCount} leads
                </span>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#00B4D8' }}
                  />
                  <span className="text-lg font-medium">Opportunities</span>
                </div>
                <span className="text-sm text-gray-600 mt-1">
                  {opportunityCount} opportunities
                </span>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

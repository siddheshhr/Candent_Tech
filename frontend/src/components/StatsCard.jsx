// src/components/StatsCard.js
import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ icon, value, label, bgColor, accentColor }) {
  return (
    <motion.div
      className={`relative flex flex-col items-center rounded-2xl p-6 shadow-lg border border-gray-100 ${bgColor} cursor-pointer overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        scale: 1.03,
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.4,
        hover: { duration: 0.2 },
        tap: { duration: 0.1 }
      }}
    >
      {/* Animated background accent */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 ${accentColor}`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Icon container */}
      <div className={`mb-4 p-3 rounded-xl bg-opacity-20`} style={{ backgroundColor: `rgba(${accentColor === 'text-purple-500' ? '147, 51, 234' : accentColor === 'text-blue-500' ? '59, 130, 246' : accentColor === 'text-green-500' ? '16, 185, 129' : '239, 68, 68'}, 0.2)` }}>
        <div className={`text-2xl ${accentColor}`}>
          {React.cloneElement(icon, { size: 28 })}
        </div>
      </div>

      {/* Value display */}
      <h4 className="text-4xl font-bold text-gray-800 mb-2">{value}</h4>
      
      {/* Label */}
      <p className="text-gray-600 text-base font-medium">{label}</p>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
    </motion.div>
  );
}
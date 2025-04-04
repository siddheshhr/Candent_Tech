import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressItem() {
  // Chart data and dimensions
  const opportunityPercentage = 71;
  const leadsPercentage = 100 - opportunityPercentage; // 29%
  
  const size = 240;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the arc length for each segment
  const opportunityArc = (opportunityPercentage / 100) * circumference;
  const leadsArc = (leadsPercentage / 100) * circumference;
  
  // Calculate the starting point of each segment
  const opportunityStart = 0;
  const leadsStart = opportunityArc;
  
  // Create SVG paths for each segment
  const createArc = (startAngle, arcLength) => {
    const endAngle = startAngle + arcLength;
    const startRadians = (startAngle / circumference) * (2 * Math.PI) - Math.PI/2;
    const endRadians = (endAngle / circumference) * (2 * Math.PI) - Math.PI/2;
    
    const startX = center + radius * Math.cos(startRadians);
    const startY = center + radius * Math.sin(startRadians);
    const endX = center + radius * Math.cos(endRadians);
    const endY = center + radius * Math.sin(endRadians);
    
    const largeArcFlag = arcLength > circumference / 2 ? 1 : 0;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Leads and Opportunities %
      </h2>
      
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Using SVG with simple circles */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Leads segment - Dark blue */}
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
            
            {/* Opportunity segment - Light blue */}
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
          
          {/* Center percentage */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center text-4xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {opportunityPercentage}%
          </motion.div>
        </div>
        
        {/* Custom legend */}
        <div className="flex items-center justify-center space-x-8 mt-6">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#0077B6" }}></div>
            <span className="text-lg font-medium">Leads</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#00B4D8" }}></div>
            <span className="text-lg font-medium">Opportunity</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
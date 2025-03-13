import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function OpportunityChart() {
  const [hoveredBar, setHoveredBar] = useState(null);
  
  const data = [
    { month: 'JAN', value: 92, color: '#60A5FA' },  // Blue
    { month: 'FEB', value: 98, color: '#A7F3D0' },  // Green
    { month: 'MARCH', value: 68, color: '#FDA4AF' }, // Pink
    { month: 'APRIL', value: 105, color: '#FDBA74' }, // Orange
    { month: 'MAY', value: 59, color: '#C4B5FD' }    // Purple
  ];
  
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Opportunities to Leads Ratio per Month
      </h2>
      
      <div className="h-80 relative flex flex-col">
        {/* Chart grid and y-axis */}
        <div className="flex-1 flex flex-col justify-between">
          {[120, 100, 80, 60, 40, 20, 0].map((tick) => (
            <div key={tick} className="flex items-center relative">
              <span className="text-xs text-gray-500 w-8 text-right mr-2">{tick}%</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
          ))}
        </div>
        
        {/* Bars container - positioned absolutely */}
        <div className="absolute inset-y-0 right-0 left-10 flex items-end justify-around pt-5 pb-6">
          {data.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-end h-full"
              style={{ width: '18%' }}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Bar */}
              <motion.div
                className="w-full rounded-t-md relative"
                style={{ 
                  backgroundColor: item.color,
                  height: `${(item.value / 120) * 100}%`
                }}
                initial={{ height: 0 }}
                animate={{ 
                  height: `${(item.value / 120) * 100}%`,
                  scale: hoveredBar === index ? 1.05 : 1
                }}
                transition={{ 
                  height: { duration: 0.8, delay: index * 0.1 },
                  scale: { duration: 0.2 }
                }}
              >
                {/* Value label */}
                <div className="absolute -top-6 left-0 right-0 text-center font-medium text-sm">
                  {item.value}%
                </div>
                
                {/* Tooltip on hover */}
                {hoveredBar === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs"
                  >
                    {item.value}%
                  </motion.div>
                )}
              </motion.div>
              
              {/* Month label */}
              <div className="mt-2 text-sm font-medium" style={{ color: hoveredBar === index ? item.color : '#6B7280' }}>
                {item.month}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
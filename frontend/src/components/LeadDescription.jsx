
import React, { useState } from 'react';
/**
 * LeadDescription Component
 * Displays the lead's description with "Read More"/"Show Less" toggle for long text.
 *
 * Props:
 * - description: The description text for the lead.
 */
const LeadDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-[450px] ml-[40px] bg-[#ffffff] rounded-lg shadow-md p-6 border">
      <h2 className="text-lg font-semibold mb-4">Description</h2>
      <div>
        <p className={`text-gray-700 ${!isExpanded && 'line-clamp-2'}`}>
          {description || 'No description available.'}
        </p>
        {description && description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-600 text-sm mt-2"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default LeadDescription;
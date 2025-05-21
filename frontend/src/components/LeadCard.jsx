
import React from 'react';
/**
 * LeadCard Component
 * Displays a card with lead information including name, designation, company, date added, and profile image.
 *
 * Props:
 * - name: Name of the lead.
 * - designation: Designation or role of the lead.
 * - company: Company name.
 * - dateAdded: Date when the lead was added.
 * - imageUrl: URL of the lead's profile image (shows a placeholder if not provided).
 */
const LeadCard = ({ name, designation, company, dateAdded, imageUrl }) => {
  return (
    <div className="w-[450px] mr-[40px] bg-white rounded-lg shadow-md p-6 flex items-start space-x-4">
      <img
        src={imageUrl || 'https://via.placeholder.com/64'} // Fallback image
        alt={name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-600">{designation || 'N/A'}</p>
        <p className="text-gray-500 text-sm">{company || 'N/A'}</p>
        <p className="text-gray-400 text-sm mt-1">Added on {dateAdded || 'N/A'}</p>
      </div>
    </div>
  );
};

export default LeadCard;
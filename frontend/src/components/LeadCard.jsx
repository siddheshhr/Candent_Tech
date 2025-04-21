// import React from 'react';

// const LeadCard = ({ name, designation, company, dateAdded, imageUrl }) => {
//   return (
//     <div className="w-25 bg-white rounded-lg shadow-md p-6">
//       <div className="flex items-start space-x-4">
//         <img
//           src={imageUrl}
//           alt={name}
//           className="w-16 h-16 rounded-full object-cover"
//         />
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold">{name}</h2>
//           <p className="text-gray-600">{designation}</p>
//           <p className="text-gray-500 text-sm">{company}</p>
//           <p className="text-gray-400 text-sm mt-1">Added on {dateAdded}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadCard;

import React from 'react';

const LeadCard = ({ name, designation, company, dateAdded, imageUrl }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 flex items-start space-x-4">
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
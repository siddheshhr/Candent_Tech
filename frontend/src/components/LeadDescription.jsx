// import React, { useState } from 'react';

// const LeadDescription = ({ description }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div className="bg-[#EBFAFF] rounded-lg shadow-md p-6">
//       <h2 className="text-lg font-semibold mb-4">Description</h2>
//       <div>
//         <p className={`text-gray-700 ${!isExpanded && 'line-clamp-2'}`}>
//           {description}
//         </p>
//         {description.length > 150 && (
//           <button
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="text-blue-500 hover:text-blue-600 text-sm mt-2"
//           >
//             {isExpanded ? 'Show Less' : 'Read More'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeadDescription;

/////////////---------new code------------------//////////

import React, { useState } from 'react';

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
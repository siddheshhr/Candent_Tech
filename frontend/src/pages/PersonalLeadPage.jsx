// import React from 'react';
// import { useState } from 'react';
// import Navbar from '../components/Navbar';
// import Sidebar from '../components/Sidebar';
// import LeadCard from '../components/LeadCard';
// import LeadDescription from '../components/LeadDescription';
// import ContactsTable from '../components/ContactsTable';
// import CustomizePhases from '../components/CustomizePhases';
// import Discussion from '../components/Discussion';
// import Footer from '../components/Footer';
// import Soham from '../assets/Soham.png';

// function PersonalLeadPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   return (
//     <div className="flex w-full min-h-screen">
//       <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1">
//         <Navbar toggleSidebar={toggleSidebar} />
//         <main className="pt-16 px-6 pb-12 max-w-screen-xl mx-auto">
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <LeadCard
//                 name="Soham Shriram"
//                 designation="HR"
//                 company="Tilikor Groups"
//                 dateAdded="27/01/2024 at 5:00 PM"
//                 imageUrl={Soham}
//               />
//               <LeadDescription
//                 description="A comprehensive CRM management system to streamline customer 
//                 interactions, track leads, and enhance relationship management and creating a 
//                 best platform for Customers."
//               />
//             </div>
//             <ContactsTable />
//             <CustomizePhases />
//             <Discussion />
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default PersonalLeadPage;


import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LeadCard from '../components/LeadCard';
import LeadDescription from '../components/LeadDescription';
import ContactsTable from '../components/ContactsTable';
import CustomizePhases from '../components/CustomizePhases';
import Discussion from '../components/Discussion';
import Footer from '../components/Footer';
import Soham from '../assets/Soham.png';

function PersonalLeadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="pt-16 px-4 md:px-6 pb-12 max-w-screen-xl mx-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <LeadCard
                name="Soham Shriram"
                designation="HR"
                company="Tilikor Groups"
                dateAdded="27/01/2024 at 5:00 PM"
                imageUrl={Soham}
              />
              <LeadDescription
                description="A comprehensive CRM management system to streamline customer 
                interactions, track leads, and enhance relationship management."
              />
            </div>
            <ContactsTable />
            <CustomizePhases />
            <Discussion />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default PersonalLeadPage;
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const HomePage = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
      
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    return(
        <div className="flex flex-col min-h-screen">
            <div className="w-full fixed top-0 z-20">
                <Navbar toggleSidebar={toggleSidebar} />
            </div>
            
            <div className="flex pt-16 flex-grow">
                <div className="flex-shrink-0">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                </div>
                
                <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                <div className="p-4">
                    {/* Your main content will go here */}
                    <div className="p-4 border rounded-lg">
                    <h1 className="text-xl font-bold mb-4">Welcome to Candent</h1>
                    <p>This is the main content area of your application.</p>
                    </div>
                </div>
                </main>
            </div>
                <Footer />
            </div>
    )
}


export default HomePage;



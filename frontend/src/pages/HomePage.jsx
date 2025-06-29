import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

/**
 * HomePage Component
 * Main landing page layout for the application.
 *
 * Features:
 * - Displays a fixed Navbar at the top.
 * - Shows a collapsible Sidebar for navigation.
 * - Contains a main content area with a welcome message.
 * - Includes a Footer at the bottom.
 * - Responsive layout with sidebar toggle functionality.
 */
const HomePage = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
      
    // Toggles the sidebar open/close state
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    return(
        <div className="flex flex-col min-h-screen">
            {/* Fixed Navbar at the top */}
            <div className="w-full fixed top-0 z-20">
                <Navbar toggleSidebar={toggleSidebar} />
            </div>
            
            {/* Main layout with Sidebar and content */}
            <div className="flex pt-16 flex-grow">
                <div className="flex-shrink-0">
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                </div>
                
                <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                    <div className="p-4">
                        {/* Main content area */}
                        <div className="p-4 border rounded-lg">
                            <h1 className="text-xl font-bold mb-4">Welcome to Candent</h1>
                            <p>This is the main content area of your application.</p>
                        </div>
                    </div>
                </main>
            </div>
            {/* Footer at the bottom */}
            <Footer />
        </div>
    )
}

export default HomePage;
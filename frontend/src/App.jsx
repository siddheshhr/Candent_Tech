import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Signin from './pages/Signin';
import SignupPage from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import PersonalLeadPage from './pages/PersonalLeadPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/personalinfo" element={<PersonalLeadPage />} />
          </Routes>
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </>
    );
}

export default App;

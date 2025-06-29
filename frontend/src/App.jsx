import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import Signin from './pages/Signin';
import SignupPage from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import LeadDetailPage from './pages/LeadDetailsPage.jsx';
import PersonalLeadPage from './pages/PersonalLeadPage';
import ProfilePage from './pages/ProfilePage';
import LeadForm from './pages/LeadFormPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './pages/ForgotPassword';
/**
 * App Component
 * Main entry point for the React application.
 * 
 * Features:
 * - Defines all application routes using React Router.
 * - Uses PrivateRoute to protect authenticated routes.
 * - Integrates ToastContainer for global notifications.
 */
function App() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<PrivateRoute />}>
          {/* Home route: show LeadsPage for client, Dashboard for others */}
          <Route
            path="/"
            element={
              currentUser?.role === 'client'
                ? <LeadsPage />
                : <Dashboard />
            }
          />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
          <Route path="/personalinfo" element={<PersonalLeadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leadform" element={<LeadForm />} />
          <Route
            path="/opportunities"
            element={
              currentUser?.role === 'client'
                ? <Navigate to="/" />
                : <OpportunitiesPage />
            }
          />
        </Route>
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
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
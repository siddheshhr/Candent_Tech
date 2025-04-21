import React from 'react';
import { Route, Routes } from 'react-router-dom';
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

function App() {
    return (
        <>
          <Routes>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/leads">
                      <Route index element={<LeadsPage />} />
                      <Route path=":id" element={<LeadDetailPage />} />
                  </Route>
                  <Route path="/opportunities">
                      <Route index element={<OpportunitiesPage />} />
                      <Route path=":id" element={<LeadDetailPage />} />
                  </Route>
                  <Route path="/personalinfo" element={<PersonalLeadPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/leadform" element={<LeadForm />} />
              </Route>
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
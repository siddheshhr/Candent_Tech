import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
// <<<<<<< main
// import Dashboard   from './pages/Dashboard';

// =======
// >>>>>>> main

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
// <<<<<<< main
//             <Route path="/dashboard" element={<Dashboard />} />
// =======
// >>>>>>> main
        </Routes>
    );
}

export default App;
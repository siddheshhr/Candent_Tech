// src/components/PrivateRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

//Protects routes that require authentication.
export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser
    ? <Outlet />
    : <Navigate to="/signin" replace />;
}

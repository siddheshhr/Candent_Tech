import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router'

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user)
    return currentUser ? <Outlet /> : <Navigate to="/signin" /> // Redirect to sign-in if not authenticated
}

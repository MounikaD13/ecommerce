import React, { useContext } from 'react'
import { Navigate } from "react-router-dom"
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoutes({ children, allowedRole }) {
    const { user } = useContext(AuthContext)
    if (!user) {
        <Navigate to="/login" replace />
    }
    if (allowedRole && !user.role === allowedRole) {
        <Navigate to="/unauthorized" replace />
    }
    return (
        <div>
            {children}
        </div>
    )
}
export const Unauthorized = () => {
    return (
       <h2>you are unauthorized </h2>
    )
}

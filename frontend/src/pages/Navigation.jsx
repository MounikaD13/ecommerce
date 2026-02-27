import React, { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from "../services/axiosInstance"

export default function Navigation() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    async function handleLogout() {
        await API.post("/seller/logout")
            .then(res => {
                logout()
                navigate("/login")
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div>
            {
                !user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )
            }
            {
                user.role == 'seller' && (
                    <>
                        <Link to='/seller/dashboard'>Dashboard</Link>
                        <Link to="/add-product">Add Product</Link>

                    </>
                )
            }
            {
                user.role == "buyer" && (
                    <>
                        <Link to="/buyer/dashboard">Dashboard</Link>
                        <Link to="/cart">Cart</Link>
                        <Link to='/order'>Orders</Link>
                    </>
                )
            }
            {
                user&&(
                    <>
                    <Link onChange={handleLogout}>logout</Link>
                    </>
                )
            }
        </div>

    )
}

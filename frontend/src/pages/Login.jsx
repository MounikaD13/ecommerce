import React, { useState, useContext } from 'react'
import API from '../services/axiosInstance'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from "react-router-dom"


export default function Login() {
  const {login} = useContext(AuthContext)
  const navigate = useNavigate()
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: ""
  })
  function handleChange(e) {
    setLoginFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  function handleLogin(e) {
    e.preventDefault()
    API.post("/seller/login", loginFormData)
      .then((res) => {
        login(res.data)
        // console.log(res.data.message)
        alert(res.data.message)
        navigate("/")
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <form onSubmit={handleLogin}>
      <input
        type='text'
        name='email'
        placeholder='Enter email'
        onChange={handleChange} /><br />
      <input
        type='password'
        name="password"
        placeholder='Enter password'
        onChange={handleChange} /><br />
      <button>Login</button>
    </form>
  )
}

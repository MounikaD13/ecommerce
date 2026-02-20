import React from 'react'
import axios from 'axios'

const instance = axios.create({
    baseURL: "http://localhost:2000/api",
    withCredentials: true
})
instance.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")
    if (!token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})
export default instance


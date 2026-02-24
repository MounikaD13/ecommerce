import React from 'react'
import axios from 'axios'

const instance = axios.create({
    baseURL: "http://localhost:2000/api",
    withCredentials: true
})
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (!token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
//after logined only this comes tom act
//after token is expired after 15m adi fail ayinna with new accessToken malli avali ga so
instance.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config
        //the retry -is of when req is send then error came need not resend the request again that is retry
        if (error.response.status == 400 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                axios.post("http://localhost:2000/api/seller/refresh-token", {}, {
                    withCredentials: true
                })
                    .then((res) => {
                        localStorage.setItem("token", res.data.accessToken)
                        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
                        return instance(originalRequest)
                    })
            }
            catch (err) {
                localStorage.removeItem("token")
                window.location.href = '/login'
            }
        }
        return Promise(error)

    }
)
export default instance


import React, { useState } from 'react'
import API from '../services/axiosInstance'
import {useNavigate} from 'react-router-dom'

export default function Register() {
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [otp, setOtp] = useState(null)
    const [otpSent, setOtpSent] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    function handleSendOtp(e) {
        e.preventDefault()
        try {
            API.post("/seller/send-otp", { email: formData.email })
                .then(res => {
                    if (res.data.message)
                        setOtpSent(true)
                    setLoading(true)
                })
        }
        catch (error) {
            console.log(error.response)
        }

    }
    function handleVerifyOtp(e) {
        e.preventDefault()
        try {
            API.post("/seller/verify-otp", { email: formData.email, otp })
                .then(res => {
                    if (res.data.message) {
                        alert(res.data.message)
                        setEmailVerified(true)
                        setOtpSent(false)
                    }
                })
        }
        catch (error) {
            console.log(error.response.message)
            setLoading(false)
        }
    }
    function handleRegister(e) {
        e.preventDefault()
        try{
            API.post("/seller/register",formData)
            .then(res=>{
                if(res.data.message){
                    alert(res.data.message)
                    navigate("/login")
                }
            })
        }
        catch(err){
            console.log(err.response.message)
        }

    }
    return (
        <div>
            <form>
                <input
                    type='text'
                    name='name'
                    placeholder='Enter name'
                    onChange={handleChange} />
                <br />
                <input
                    type='email'
                    name='email'
                    placeholder='Enter email'
                    onChange={handleChange} />
                <button disabled={loading} onClick={handleSendOtp}>Send OTP</button>
                <br />

                {
                    otpSent &&
                    <div>
                        <input
                            type="text"
                            placeholder="Enter OTP to verify email"
                            onChange={(e)=>setOtp(e.target.value)}
                        />
                        <button onClick={handleVerifyOtp}>Verify OTP</button>
                    </div>
                }
                <input
                    type='password'
                    name="password"
                    placeholder='Enter password'
                    onChange={handleChange} /><br />
                <button disabled={!emailVerified} onClick={handleRegister}>Register</button>
            </form>
        </div>
    )
}
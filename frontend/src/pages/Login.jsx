import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { validateEmail } from '../utils/helper'
import axiosInstance from '../utils/axiosInstance'

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setError("");


    // Login API Call

    try {
      const responce = await axiosInstance.post("/api/user/login", {
        email: email,
        password: password,
      });
      //handle successfull login responce

      // console.log("Login Response:", responce);
      
      if (responce.data && responce.data.token) {
        localStorage.setItem("token", responce.data.token);
        navigate("/");
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
    } else {
        setError("An unexpected error occurred. Please try again.");
    }
    }
}


  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-28' >
        <div className='w-96 drop-shadow rounded bg-white px-7 py-10' >
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input type="text" placeholder='email' className="input-box "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button className='btn-primary' type='submit'>LogIn</button>

            <p className="text-sm text-center mt-4">Not Registered yet? {" "}
              <Link to={"/signup"} className='text-primary font-medium underline'>Create an account.</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
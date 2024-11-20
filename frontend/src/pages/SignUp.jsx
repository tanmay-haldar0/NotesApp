import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import PasswordInput from '../components/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';


const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name){
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if(!password){
      setError("Password is required.");
      return;
    }

    setError("");

    // SignUP API Call

    try {
      const responce = await axiosInstance.post("/api/user/create-account", {
        name: name,
        email: email,
        password: password,
      });
      //handle successfull login responce

      // console.log("Login Response:", responce);

      if (responce.data && responce.data.error) {
        setError(responce.data.message);
        return;
      }

      
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


  };

  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-28' >
        <div className='w-96 drop-shadow rounded bg-white px-7 py-10' >
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Sign Up</h4>

            <input type="text" placeholder='Name' className="input-box "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input type="text" placeholder='Email' className="input-box "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button className='btn-primary' type='submit'>Create Account</button>

            <p className="text-sm text-center mt-4">Already have an account? {" "}
              <Link to={"/login"} className='text-primary font-medium underline'>Login</Link>
            </p>

          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp
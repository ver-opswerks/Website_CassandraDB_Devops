import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import Banner from '../assets/Banner.png';
import Header from './Header';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import config from '../components/Config'; 

export default function RegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleRegister = async () => {
    setErrorMessage('');

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check if email already exists in the database
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/data/users`);
      
      // Check if any user exists with the entered email
      const existingUser = response.data.find(user => user.email === email);

      if (existingUser) {
        setErrorMessage('Email is already registered.');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No users found. Continuing with registration...');
      } else {
        console.error('Error checking email:', error);
        setErrorMessage('Error checking email. Please try again.');
        return;
      }
    }

    // Password validation
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // If all validations passed, proceed with registration
    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/data/users`, {
        email,
        password,
        loggedIn: false,
      });

      console.log(email,password);

      if (response.status === 200) {
        setIsRegistered(true); 
        setTimeout(() => setIsRegistered(false), 3000); 
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('Error during registration. Please try again.');
    }
  };

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex pt-8 overflow-hidden">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-300">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-center mb-4">Register</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister(); 
                }}
              >
                <div className="space-y-4">
                  {/* Email input */}
                  <div className="flex items-center border rounded-md bg-gray-200">
                    <div className="p-3 text-gray-500">
                      <FaUser />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="p-3 w-full bg-transparent focus:outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password input */}
                  <div className="flex items-center border rounded-md bg-gray-200">
                    <div className="p-3 text-gray-500">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      className="p-3 w-full bg-transparent focus:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* Confirm Password input */}
                  <div className="flex items-center border rounded-md bg-gray-200">
                    <div className="p-3 text-gray-500">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="p-3 w-full bg-transparent focus:outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  {/* Error message */}
                  {errorMessage && (
                    <div className="flex justify-center items-center text-red-500 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  {/* Register button */}
                  <button
                    type="submit"
                    className="w-full bg-[#009368] text-white hover:bg-[#007a56] py-2 px-6 rounded-md transition-transform transform"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Banner section */}
        <div className="hidden lg:flex w-1/2 bg-[#EBF5F0] p-12 flex-col justify-center items-center">
          <div className="mb-8">
            <img
              src={Banner}
              alt="Team collaboration"
              className="w-3/4 mx-auto"
            />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Already have an account?</h2>
            <p className="text-gray-600 mb-4">Login to access your dashboard.</p>
            <Link to="/">
              <button className="bg-[#009368] text-white hover:bg-[#007a56] py-2 px-6 rounded-md transition-transform transform hover:scale-110">
                Login
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Success Overlay */}
      {isRegistered && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Success!</h2>
            <p className="text-gray-600 mb-8">Your account has been successfully registered!</p>
            <Link to="/">
              <button className="bg-[#009368] text-white hover:bg-[#007a56] py-2 px-6 rounded-md transition-transform transform">
                Go to Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

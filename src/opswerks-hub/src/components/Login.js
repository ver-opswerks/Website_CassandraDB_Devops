import React, { useState, useEffect } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import Banner from '../assets/Banner.png';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Fetch users from the database
  const getUsersFromDB = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Update user's login status in the database
  const updateUserLogin = async (userEmail, loggedInStatus) => {
    try {
      await axios.put('http://localhost:5000/api/data/users', {
        email: userEmail,   
        loggedIn: loggedInStatus,  
      });
    } catch (err) {
      console.error('Error updating user login status:', err);
    }
  };

  useEffect(() => {
    // Optionally check if the user is already logged in (session/cookie mechanism)
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if email is valid
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    // Check password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const users = await getUsersFromDB(); 

      // Find a user with matching email and password
      const foundUser = users.find(user => user.email === email && user.password === password);

      if (foundUser) {
        setError('');

        // Check if a user exists in localStorage
        if (foundUser) {
          foundUser.loggedin = true;

          localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
        } else {
          console.warn('No logged-in user found in localStorage');
        }

        await updateUserLogin(foundUser.email, true); 

        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Error fetching users. Please try again later.');
    }
  };

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex pt-8 overflow-hidden">
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Register</h2>
            <p className="text-gray-600 mb-4">
              Start your journey with us today! Join and be part of an exciting
              new community where you can collaborate and grow.
            </p>
            <Link to="/register">
              <button className="bg-[#009368] text-white hover:bg-[#007a56] py-2 px-6 rounded-md transition-transform transform hover:scale-110">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Login form section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-300">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="flex items-center border rounded-md bg-gray-200">
                    <div className="p-3 text-gray-500">
                      <FaUser />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-200 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#009368] focus:border-transparent"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="flex items-center border rounded-md bg-gray-200">
                    <div className="p-3 text-gray-500">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-200 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#009368] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Display error message if any */}
                {error && <p className="flex justify-center items-center text-red-500 text-sm mt-4">{error}</p>}
              </form>
            </div>

            <div className="p-6 bg-gray-100">
              <button
                type="submit"
                className="w-full bg-[#009368] text-white hover:bg-[#007a56] py-2 px-6 rounded-md transition-transform transform"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

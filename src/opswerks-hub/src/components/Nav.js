import React, { useState, useEffect } from 'react';
import { User, PenSquare, LogOut } from 'lucide-react';
import axios from 'axios'; 

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

export default function Sidebar({ onPostCreateClick }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/users'); // Adjust the URL as needed
        
        setUsers(response.data);

        const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (storedUser) {
          const dbUser = response.data.find((user) => user.email === storedUser.email && user.loggedin === true);
          
          if (dbUser) {
            setLoggedInUser(dbUser);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); 

  // Handle logout
  const handleLogout = async () => {
    if (!loggedInUser) {
      return;
    }

    try {
      // Update loggedIn status to false for the current user in the database
      await updateUserLogin(loggedInUser.email, false);

      setUsers(users.map(user =>
        user.email === loggedInUser.email ? { ...user, loggedin: false } : user
      ));

      setLoggedInUser(null);

      localStorage.removeItem('loggedInUser');

      window.location.href = '/login';  
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const userName = loggedInUser ? loggedInUser.email.split('@')[0] : 'Guest';

  return (
    <aside className="group fixed top-0 left-0 w-20 hover:w-3/12 bg-[#009368] flex flex-col items-center py-8 h-screen transition-all duration-300 pt-24">
      <div className="flex flex-col items-center space-y-8 mt-4 group-hover:items-start">
        {/* User Info Section */}
        <button className="flex items-center transition-all duration-300 group-hover:pb-5 group-hover:mt-2">
          <div className="text-[#00805c] p-2 rounded-full bg-white flex items-center transition-all duration-300 group-hover:scale-150">
            <User size={24} />
          </div>
          <span className="ml-5 hidden group-hover:inline text-white text-lg font-bold transition-all duration-300">
            {userName}  
          </span>
        </button>

        {/* Post Creation Button */}
        <button
          className="text-white p-1 flex items-center transition-all duration-300 hover:scale-110"
          onClick={onPostCreateClick} 
        >
          <PenSquare size={24} />
          <span className="ml-5 hidden group-hover:inline text-md transition-all duration-300">Create a Post</span>
        </button>
      </div>

      {/* Logout Section */}
      <div className="flex-grow"></div>
      <button 
        onClick={handleLogout} 
        className="text-white p-2 flex items-center transition-all duration-300 hover:scale-110"
      >
        <LogOut size={24} />
        <span className="ml-5 hidden group-hover:inline text-md transition-all duration-300">Logout</span>
      </button>
    </aside>
  );
}

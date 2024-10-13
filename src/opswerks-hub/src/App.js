import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import config from '../src/components/Config'; 

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking connection...');

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response2 = await axios.get(`${config.apiBaseUrl}/api/try`);
        console.log('Connected to backend2. ', config.apiBaseUrl , response2.data);
      } catch (error) {
        console.error('Error connecting to the backend:', error);
        setBackendStatus('Failed to connect to the backend.');
      }
    };

    checkBackendConnection();
  }, []);

  return (
    <div>
      <p>Backend Status: {backendStatus}</p>

      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';


function App() {
  return (
    <Router>
      <Routes>
        {/* Login and Register Routes */}
        <Route path="/login" element={<Home />} />
        <Route path="/register" element={<Register />} />
        
        {/* Conditionally render the Home page based on isLoggedIn */}
        <Route
          path="/"
          element={<Login/>}
        />
      </Routes>
    </Router>
  );
}

export default App;

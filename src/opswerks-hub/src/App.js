import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

      if (loggedInUser && loggedInUser.loggedin === true) {
        setIsLoggedIn(true); 
      } else {
        setIsLoggedIn(false); 
      }
    };

    checkLoginStatus(); 
  }, []); 

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Conditionally render the Home page based on isLoggedIn */}
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

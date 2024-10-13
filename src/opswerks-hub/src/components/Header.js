import React from 'react';
import LogoMain from '../assets/LogoMain.png'; 

function Header() {
  return ( 
    <nav className="bg-white py-4 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1 text-center">
          <img
            src={LogoMain}
            alt="Logo"
            className="mx-auto w-56"
          />
        </div>
      </div>
    </nav>
  );
}

export default Header;
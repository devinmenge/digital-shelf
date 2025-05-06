import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    // Placeholder: Replace with real auth logic (e.g., API call to server)
  };

  return (
    <header className="header">
      <Link to="/" className="header-title">
        Game Search App
      </Link>
      <div className="header-nav">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <button onClick={handleLoginToggle} className="login-button">
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
};

export default Header;
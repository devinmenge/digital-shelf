import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import './Header.css';

const ME = gql`
  query me {
    me {
      username
    }
  }
`;

const Header = () => {
  const token = localStorage.getItem('id_token');
  const { data, error } = useQuery(ME);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('id_token');
    navigate('/');
  };

  const isLoggedIn = !!token && !error;
  const username = data?.me?.username;

  return (
    <header className="header">
      <h1 className="header-title">Digital Shelf</h1>
      <nav className="header-nav">
        <Link to="/" className="nav-link">Search Games</Link>
        <Link to="/my-shelf" className="nav-link">My Shelf{isLoggedIn && username ? ` (${username})` : ''}</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="login-button">Log Out</button>
        ) : (
          <Link to="/auth" className="nav-link">Log In / Sign Up</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
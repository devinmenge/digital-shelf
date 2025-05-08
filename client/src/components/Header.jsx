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
  const { data, error } = useQuery(ME); // Skip query if not logged in
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('id_token');
    navigate('/');
  };

  const isLoggedIn = !!token && !error; // Consider logged in if token exists and no auth error
  const username = data?.me?.username;

  return (
    <header>
      <h1>Digital Shelf</h1>
      <nav>
        <Link to="/">Search Games</Link>
        <Link to="/my-shelf">My Shelf{isLoggedIn && username ? ` (${username})` : ''}</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <Link to="/auth">Log In / Sign Up</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
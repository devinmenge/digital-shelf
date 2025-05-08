import React from "react";
import { Link } from 'react-router-dom';
import { useQuery, gql } from "@apollo/client";
import "../App.css";

const GET_MY_COLLECTION = gql`
  query MyCollection {
    myCollection {
      _id
      gameId
      name
    }
  }
`;

const MyShelf = () => {
  const token = localStorage.getItem('id_token');
  const { loading, error, data } = useQuery(GET_MY_COLLECTION);

  if (!token) {
    return (
      <div className="my-shelf">
        <h2>My Shelf</h2>
        <p>
          Log in or sign up to add games to your shelf!{' '}
          <Link to="/auth">Log In / Sign Up</Link>
        </p>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="my-shelf">
      <h2>My Shelf</h2>
      {data.myCollection.length === 0 ? (
        <p>No games in your collection yet.</p>
      ) : (
        <ul>
          {data.myCollection.map((game) => (
            <li key={game._id}>
              {game.name} (ID: {game.gameId})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyShelf;
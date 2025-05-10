import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import axios from 'axios';
import './SearchGames.css';

const ADD_TO_COLLECTION = gql`
  mutation AddGameToCollection($gameId: String!, $name: String!, $imageUrl: String) {
    addGameToCollection(gameId: $gameId, name: $name, imageUrl: $imageUrl) {
      _id
      gameId
      name
      imageUrl
    }
  }
`;

const GET_MY_COLLECTION = gql`
  query MyCollection {
    myCollection {
      gameId
    }
  }
`;

const SearchGames = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('id_token');
  const { data: collectionData } = useQuery(GET_MY_COLLECTION, {
    skip: !token,
  });

  const [addedGames, setAddedGames] = useState(() => {
    if (collectionData?.myCollection) {
      return new Set(collectionData.myCollection.map(game => parseInt(game.gameId)));
    }
    return new Set();
  });

  const [addToCollection] = useMutation(ADD_TO_COLLECTION, {
    refetchQueries: [{ query: GET_MY_COLLECTION }],
  });

  const searchGames = async () => {
    try {
      const response = await axios.get(
        `https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&search=${query}`
      );
      setResults(response.data.results);
      setError(null);
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to fetch games');
    }
  };

  const handleAddToCollection = async (game) => {
    try {
      const response = await addToCollection({
        variables: {
          gameId: game.id.toString(),
          name: game.name,
          imageUrl: game.background_image,
        },
      });
      setAddedGames(prev => new Set(prev).add(parseInt(response.data.addGameToCollection.gameId)));
      setError(null);
    } catch (error) {
      console.error('Error adding game to collection:', error);
      setError('Failed to add game to collection');
    }
  };

  return (
    <div className="search-games">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games..."
          className="search-input"
        />
        <button onClick={searchGames} className="search-button">
          Search
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <ul className="game-list">
        {results.map((game) => (
          <li key={game.id} className="game-item">
            <Link to={`/game/${game.id}`} className="game-link">
              <h2 className="game-title">{game.name}</h2>
            </Link>
            {game.background_image && (
              <img
                src={game.background_image}
                alt={game.name}
                className="game-image"
              />
            )}
            {token ? (
              <button
                onClick={() => handleAddToCollection(game)}
                disabled={addedGames.has(game.id)}
                className={addedGames.has(game.id) ? "added" : "add-button"}
              >
                {addedGames.has(game.id) ? "✓" : "+"}
              </button>
            ) : (
              <p>
                <Link to="/auth">Log in</Link> to add to your shelf
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchGames;